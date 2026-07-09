import nodemailer from "nodemailer";
import {
  verificationOTPTemplate,
  verificationEmailTemplate,
  passwordResetTemplate,
  invitationTemplate,
  orderStatusTemplate,
  promotionTemplate,
  abandonedCartTemplate,
} from "./email-templates";

const isProduction = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  host: (process.env.SMTP_HOST || "smtp.gmail.com").trim(),
  port: parseInt((process.env.SMTP_PORT || "587").trim()),
  secure: (process.env.SMTP_PORT || "587").trim() === "465",
  auth: {
    user: (process.env.SMTP_USER || "").trim(),
    pass: (process.env.SMTP_PASS || "").trim(),
  },
  ...(isProduction
    ? {} // In production, use default TLS settings (rejectUnauthorized: true)
    : {
        tls: {
          rejectUnauthorized: false, // Allow self-signed certs in development only
        },
      }),
});

transporter.verify(function (error) {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    // TODO: Remove console.log or replace with proper logging
    console.log("SMTP Server is ready to take our messages");
  }
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  let lastError: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "User Management System"}" <${
          process.env.EMAIL_FROM_ADDRESS
        }>`,
        to,
        subject,
        html,
      });
      // TODO: Remove console.log or replace with proper logging
      console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
      return info;
    } catch (error: unknown) {
      lastError = error;
      console.warn(`Email attempt ${i + 1} failed: ${(error as Error).message}`);
      if (i < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  throw new Error(
    `Failed to send email after 3 attempts: ${(lastError as Error).message}`,
  );
}

export async function sendVerificationOTP(email: string, otp: string) {
  return sendEmail({ to: email, subject: "Verify Your Email Address", html: verificationOTPTemplate(otp) });
}

export async function sendVerificationEmail(email: string, verificationLink: string) {
  return sendEmail({ to: email, subject: "Verify Your Email Address", html: verificationEmailTemplate(verificationLink) });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  return sendEmail({ to: email, subject: "Reset Your Password", html: passwordResetTemplate(resetLink) });
}

export async function sendInvitationEmail(email: string, inviteLink: string, inviterName: string) {
  return sendEmail({
    to: email,
    subject: `Invitation to join ${process.env.NEXT_PUBLIC_SITE_NAME || "User Management System"}`,
    html: invitationTemplate(inviteLink, inviterName),
  });
}

export async function sendOrderStatusEmail(email: string, orderNumber: string, status: string, trackingLink?: string) {
  return sendEmail({ to: email, subject: `Order Update: ${orderNumber}`, html: orderStatusTemplate(orderNumber, status, trackingLink) });
}

export async function sendPromotionEmail(email: string, title: string, message: string, link: string) {
  return sendEmail({ to: email, subject: title, html: promotionTemplate(title, message, link) });
}

export async function sendAbandonedCartEmail(email: string, name: string, cartItems: { name: string; quantity: number; price: number }[]) {
  return sendEmail({ to: email, subject: "You left something in your cart!", html: abandonedCartTemplate(name, cartItems) });
}
