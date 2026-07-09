import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./config";
import bcrypt from "bcryptjs";
import { User } from "@/core/database/models/User";
import Session from "@/core/database/models/Session";
import LoginHistory from "@/core/database/models/LoginHistory";
import { dbConnect } from "@/core/config/database";
import crypto from "crypto";
import mongoose from "mongoose";
import { logAction } from "@/lib/audit";

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("MSIE") || ua.includes("Trident")) browser = "IE";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  if (ua.includes("Mobile") || ua.includes("Android")) device = "Mobile";
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

  return { browser, os, device };
}

async function recordLoginHistory(params: {
  userId: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  reason?: string;
  sessionId?: mongoose.Types.ObjectId;
}) {
  try {
    const parsed = parseUserAgent(params.userAgent);
    await LoginHistory.create({
      userId: new mongoose.Types.ObjectId(params.userId),
      email: params.email,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      device: parsed.device,
      browser: parsed.browser,
      os: parsed.os,
      success: params.success,
      reason: params.reason,
      sessionId: params.sessionId,
    });
  } catch (error) {
    console.error("Failed to record login history:", error);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await dbConnect();

          const ipAddress =
            request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request?.headers?.get("x-real-ip") ||
            "unknown";

          const userAgent = request?.headers?.get("user-agent") || "unknown";

          const user = await User.findOne({ email: credentials.email })
            .select("+password +twoFactorSecret +refreshToken")
            .lean();

          if (!user) {
            throw new Error("Invalid email or password");
          }

          if (user.status === "banned") {
            throw new Error(
              "Your account has been banned. Please contact support."
            );
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
          }

          if (user.lockUntil && user.lockUntil > new Date()) {
            const remainingMinutes = Math.ceil(
              (user.lockUntil.getTime() - Date.now()) / 60000
            );
            throw new Error(
              `Account temporarily locked. Try again in ${remainingMinutes} minute(s).`
            );
          }

          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isMatch) {
            const attempts = (user.loginAttempts || 0) + 1;
            const updates: Record<string, unknown> = {
              loginAttempts: attempts,
            };

            if (attempts >= 5) {
              updates.lockUntil = new Date(
                Date.now() + 15 * 60 * 1000
              );
            }

            await User.findByIdAndUpdate(user._id, updates);

            await logAction({
              action: "LOGIN_FAILED",
              userId: user._id.toString(),
              userEmail: user.email,
              entityType: "USER",
              entityId: user._id.toString(),
              changes: { reason: "Invalid password", attempts },
            });

            await recordLoginHistory({
              userId: user._id.toString(),
              email: user.email,
              ipAddress,
              userAgent,
              success: false,
              reason: "Invalid password",
            });

            throw new Error("Invalid email or password");
          }

          if (user.twoFactorEnabled) {
            if (!credentials.otp) {
              throw new Error("2FA_REQUIRED");
            }

            const { authenticator } = await import("otplib");
            const isValid = authenticator.verify({
              token: credentials.otp as string,
              secret: user.twoFactorSecret!,
            });

            if (!isValid) {
              await logAction({
                action: "2FA_FAILED",
                userId: user._id.toString(),
                userEmail: user.email,
                entityType: "USER",
                entityId: user._id.toString(),
                changes: { reason: "Invalid OTP" },
              });

              await recordLoginHistory({
                userId: user._id.toString(),
                email: user.email,
                ipAddress,
                userAgent,
                success: false,
                reason: "Invalid 2FA code",
              });

              throw new Error("Invalid 2FA code");
            }
          }

          await User.findByIdAndUpdate(user._id, {
            loginAttempts: 0,
            lockUntil: null,
            lastLogin: new Date(),
            lastLoginIP: ipAddress,
          });

          const refreshToken = crypto.randomBytes(40).toString("hex");

          const session = await Session.create({
            userId: user._id,
            sessionToken: refreshToken,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            ipAddress,
            userAgent,
          });

          await User.findByIdAndUpdate(user._id, { refreshToken });

          await logAction({
            action: "LOGIN",
            userId: user._id.toString(),
            userEmail: user.email,
            entityType: "USER",
            entityId: user._id.toString(),
            changes: { provider: "credentials" },
          });

          await recordLoginHistory({
            userId: user._id.toString(),
            email: user.email,
            ipAddress,
            userAgent,
            success: true,
            sessionId: session._id as mongoose.Types.ObjectId,
          });

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            image: user.image,
            refreshToken,
            sessionId: session._id.toString(),
          };
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            (error.message === "2FA_REQUIRED" ||
              error.message.includes("Account temporarily locked"))
          ) {
            throw error;
          }
          console.error("Auth error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  events: {
    async signIn({ user, account }) {
      if (user.id && user.email && account?.provider !== "credentials") {
        try {
          await dbConnect();
          const ipAddress = "unknown";
          const userAgent = "unknown";

          await recordLoginHistory({
            userId: user.id,
            email: user.email,
            ipAddress,
            userAgent,
            success: true,
          });

          await User.findByIdAndUpdate(user.id, {
            lastLogin: new Date(),
            lastLoginIP: ipAddress,
          });

          await logAction({
            action: "LOGIN",
            userId: user.id,
            userEmail: user.email,
            entityType: "USER",
            entityId: user.id,
            changes: { provider: account?.provider },
          });
        } catch (err) {
          console.error("Social sign-in audit error:", err);
        }
      }
    },
    async signOut(data) {
      const session = "session" in data ? (data.session as { user?: { id?: string; email?: string; sessionId?: string } }) : null;
      if (session?.user?.id) {
        try {
          await dbConnect();

          if (session.user.sessionId) {
            await Session.findByIdAndUpdate(session.user.sessionId, {
              revoked: true,
            });
          }

          await logAction({
            action: "LOGOUT",
            userId: session.user.id,
            userEmail: session.user.email || "unknown",
            entityType: "USER",
            entityId: session.user.id,
          });
        } catch (err) {
          console.error("Sign-out audit error:", err);
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "google" || account?.provider === "github") {
        try {
          if (!user.email) {
            console.error("Social sign-in error: Email is missing from profile", { provider: account.provider, user });
            return false;
          }

          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            if (existingUser.status === "banned") {
              console.warn(`Sign-in attempt from banned user: ${user.email}`);
              return false;
            }

            if (existingUser.twoFactorEnabled) {
              return false;
            }

            if (user.image && existingUser.image !== user.image) {
              existingUser.image = user.image;
              await existingUser.save();
            }

            user.id = existingUser._id.toString();
            (user as { role: string }).role = existingUser.role;
            (user as { status: string }).status = existingUser.status;
          } else {
            const userCount = await User.countDocuments();
            const role = userCount === 0 ? "admin" : "user";

            const newUser = await User.create({
              name: user.name || user.email.split("@")[0],
              email: user.email,
              image: user.image,
              role: role,
              isVerified: true,
              status: "active",
              referralCode: `UM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
              loyaltyPoints: 0,
              membershipTier: "bronze",
            });

            await logAction({
              action: "SIGNUP_SUCCESS",
              userId: newUser._id.toString(),
              userEmail: newUser.email,
              entityType: "USER",
              entityId: newUser._id.toString(),
              changes: { provider: account.provider },
            });

            user.id = newUser._id.toString();
            (user as { role: string }).role = newUser.role;
            (user as { status: string }).status = newUser.status;
          }
          return true;
        } catch (error) {
          console.error("Error in social sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.role) token.role = session.role;
        return token;
      }

      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.status = (user as { status: string }).status;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
        token.sessionId = (user as { sessionId?: string }).sessionId;

        if (account) {
          token.accessToken = account.access_token;
        }

        return token;
      }

      if (token.id && token.email) {
        try {
          await dbConnect();

          const dbUser = await User.findById(token.id).select("status loginAttempts lockUntil").lean();

          if (!dbUser) {
            return { ...token, expired: true };
          }

          if (dbUser.status === "banned") {
            return { ...token, expired: true };
          }

          if (dbUser.lockUntil && dbUser.lockUntil > new Date()) {
            return { ...token, expired: true };
          }

          if (token.sessionId && mongoose.Types.ObjectId.isValid(token.sessionId as string)) {
            const dbSession = await Session.findById(token.sessionId).lean();
            if (!dbSession || dbSession.revoked || dbSession.expires < new Date()) {
              await User.findByIdAndUpdate(token.id, {
                $unset: { refreshToken: "" },
              });
              return { ...token, expired: true };
            }
          }

          token.status = dbUser.status;

          if (!mongoose.Types.ObjectId.isValid(token.id as string)) {
            const dbUserByEmail = await User.findOne({ email: token.email }).select("_id role status").lean();
            if (dbUserByEmail) {
              token.id = dbUserByEmail._id.toString();
              token.role = dbUserByEmail.role;
              token.status = dbUserByEmail.status;
            }
          }
        } catch (err) {
          console.error("JWT callback error:", err);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = (token.name || session.user.name) as string;
        session.user.image = (token.picture || session.user.image) as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.sessionId = token.sessionId as string;

        if ((token as { expired?: boolean }).expired) {
          session.expires = new Date(0) as unknown as Date & string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
