// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { dbConnect } from "@/config/db";
import crypto from "crypto";
import mongoose from "mongoose";
import { logAction } from "@/lib/audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await dbConnect();

          const user = await User.findOne({ email: credentials.email })
            .select("+password +twoFactorSecret")
            .lean();

          if (!user) throw new Error("User not found");

          if (user.status === "banned") {
            throw new Error(
              "Your account has been banned. Please contact support."
            );
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
          }

          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isMatch) {
            // Log failed login attempt
            await logAction({
              action: "LOGIN_FAILED",
              userId: user._id.toString(),
              userEmail: user.email,
              entityType: "USER",
              entityId: user._id.toString(),
              changes: { reason: "Invalid password" }
            });
            throw new Error("Invalid password");
          }

          // Check for 2FA
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
                changes: { reason: "Invalid OTP" }
              });
              throw new Error("Invalid 2FA code");
            }
          }

          // Generate or update refresh token for credentials user
          const refreshToken = crypto.randomBytes(40).toString("hex");
          await User.findByIdAndUpdate(user._id, { refreshToken });

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            image: user.image,
            refreshToken, // Pass to JWT callback
          };
        } catch (error: unknown) {
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
      if (user.id && user.email) {
        await logAction({
          action: "LOGIN",
          userId: user.id,
          userEmail: user.email,
          entityType: "USER",
          entityId: user.id,
          changes: { provider: account?.provider }
        });
      }
    },
    async signOut(data) {
      const session = "session" in data ? (data.session as { user?: { id?: string; email?: string } }) : null;
      if (session?.user?.id && session.user.email) {
        await logAction({
          action: "LOGOUT",
          userId: session.user.id,
          userEmail: session.user.email,
          entityType: "USER",
          entityId: session.user.id
        });
      }
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
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

          if (!existingUser) {
            // Check if it's the first user
            const userCount = await User.countDocuments();
            const role = userCount === 0 ? "admin" : "user";

            console.log(`Creating new social user: ${user.email} with role: ${role}`);
            const newUser = await User.create({
              name: user.name || user.email.split("@")[0],
              email: user.email,
              image: user.image,
              role: role,
              isVerified: true, // Social accounts are auto-verified
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
              changes: { provider: account.provider }
            });

            user.id = newUser._id.toString();
            (user as { role: string }).role = newUser.role;
            (user as { status: string }).status = newUser.status;
          } else {
            // If user exists, update their image if it changed
            if (user.image && existingUser.image !== user.image) {
              existingUser.image = user.image;
              await existingUser.save();
            }

            user.id = existingUser._id.toString();
            (user as { role: string }).role = existingUser.role;
            (user as { status: string }).status = existingUser.status;

            // Check if banned
            if (existingUser.status === "banned") {
              console.warn(`Sign-in attempt from banned user: ${user.email}`);
              return false;
            }
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
        // Handle session update (e.g., name or image update)
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.role) token.role = session.role;
        return token;
      }

      if (user) {
        // This part runs only on initial sign-in
        if (account?.provider !== "credentials") {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.status = dbUser.status;
          }
        } else {
          token.id = user.id;
          token.role = (user as { role: string }).role;
          token.status = (user as unknown as { status: string }).status;
          token.refreshToken = (user as { refreshToken?: string }).refreshToken;
        }
      } else if (token.id && !mongoose.Types.ObjectId.isValid(token.id as string)) {
        // AUTO-REPAIR: If session exists but ID is not a valid MongoDB ObjectId (e.g., old UUID)
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            console.log(`Auto-repairing session ID for: ${token.email}`);
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.status = dbUser.status;
          }
        } catch (err) {
          console.error("Session auto-repair failed:", err);
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
        (session.user as unknown as { status: string }).status =
          token.status as string;
        (session.user as unknown as { accessToken?: string }).accessToken =
          token.accessToken as string;
        (session.user as unknown as { refreshToken?: string }).refreshToken =
          token.refreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
