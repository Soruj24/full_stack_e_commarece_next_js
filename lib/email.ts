import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: (process.env.SMTP_HOST || "smtp.gmail.com").trim(),
  port: parseInt((process.env.SMTP_PORT || "587").trim()),
  secure: (process.env.SMTP_PORT || "587").trim() === "465",
  auth: {
    user: (process.env.SMTP_USER || "").trim(),
    pass: (process.env.SMTP_PASS || "").trim(),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
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
      console.log(
        `Email sent successfully to ${to}. Message ID: ${info.messageId}`,
      );
      return info;
    } catch (error: unknown) {
      lastError = error;
      console.warn(
        `Email attempt ${i + 1} failed: ${(error as Error).message}`,
      );
      if (i < 2) {
        // Wait before retrying (1s, 2s)
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  throw new Error(
    `Failed to send email after 3 attempts: ${(lastError as Error).message}`,
  );
}

export async function sendVerificationOTP(email: string, otp: string) {
  return sendEmail({
    to: email,
    subject: "Verify Your Email Address",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(to right, #3b82f6, #8b5cf6); width: 64px; height: 64px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0;">Verify Your Email</h2>
            <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Please use the following code to verify your account</p>
          </div>
          
          <div style="background-color: #f9fafb; border: 2px dashed #e5e7eb; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111827;">${otp}</span>
          </div>
          
          <div style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            <p style="margin-bottom: 12px;"><strong>Important:</strong></p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>This code will expire in 10 minutes.</li>
              <li>For security reasons, do not share this code with anyone.</li>
              <li>If you didn't request this code, please ignore this email.</li>
            </ul>
          </div>
          
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_NAME || "User Management System"}. All rights reserved.
            </p>
          </div>
        </div>
      `,
  });
}

export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
) {
  return sendEmail({
    to: email,
    subject: "Verify Your Email Address",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #1f2937; margin-bottom: 16px;">Welcome! Verify Your Email</h2>
          <p style="color: #4b5563; line-height: 1.5;">Thanks for signing up. Please verify your email address to complete your registration and secure your account.</p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${verificationLink}" 
               style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              Verify Email Address
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
          <p style="color: #3b82f6; font-size: 13px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px;">${verificationLink}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
  });
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  return sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetLink}</p>
          <p style="color: #999; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
  });
}

export async function sendInvitationEmail(
  email: string,
  inviteLink: string,
  inviterName: string,
) {
  return sendEmail({
    to: email,
    subject: `Invitation to join ${process.env.NEXT_PUBLIC_SITE_NAME || "User Management System"}`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #1f2937; margin-bottom: 16px;">You've Been Invited!</h2>
          <p style="color: #4b5563; line-height: 1.5;">${inviterName} has invited you to join ${process.env.NEXT_PUBLIC_SITE_NAME || "User Management System"}.</p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${inviteLink}" 
               style="background: linear-gradient(to right, #10b981, #3b82f6); color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              Accept Invitation
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
          <p style="color: #3b82f6; font-size: 13px; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px;">${inviteLink}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            This invitation link will expire in 7 days.
          </p>
        </div>
      `,
  });
}

export async function sendOrderStatusEmail(
  email: string,
  orderNumber: string,
  status: string,
  trackingLink?: string,
) {
  return sendEmail({
    to: email,
    subject: `Order Update: ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1f2937; margin-bottom: 16px;">Order Update</h2>
        <p style="color: #4b5563; line-height: 1.5;">Your order <strong>#${orderNumber}</strong> status has been updated to: <strong>${status}</strong>.</p>
        ${
          trackingLink
            ? `
        <div style="margin: 32px 0; text-align: center;">
          <a href="${trackingLink}" 
             style="background: #3b82f6; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Track Your Order
          </a>
        </div>
        `
            : ""
        }
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Thank you for shopping with us!</p>
      </div>
    `,
  });
}

export async function sendPromotionEmail(
  email: string,
  title: string,
  message: string,
  link: string,
) {
  return sendEmail({
    to: email,
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1f2937; margin-bottom: 16px;">${title}</h2>
        <p style="color: #4b5563; line-height: 1.5;">${message}</p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${link}" 
             style="background: linear-gradient(to right, #f59e0b, #ef4444); color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Check It Out
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendAbandonedCartEmail(
  email: string,
  name: string,
  cartItems: { name: string; quantity: number; price: number }[],
) {
  const itemsHtml = (cartItems || [])
    .map(
      (item) => `
    <div style="display: flex; align-items: center; margin-bottom: 12px; padding: 12px; border: 1px solid #f3f4f6; border-radius: 8px;">
      <div style="flex: 1;">
        <p style="margin: 0; font-weight: bold; color: #111827;">${item.name}</p>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">Qty: ${item.quantity} • $${item.price.toFixed(2)}</p>
      </div>
    </div>
  `,
    )
    .join("");

  return sendEmail({
    to: email,
    subject: "You left something in your cart!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 24px; background-color: #ffffff;">
        <h2 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Hi ${name},</h2>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 32px;">We noticed you left some items in your cart. They're waiting for you!</p>
        
        <div style="margin-bottom: 32px;">
          ${itemsHtml}
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/cart" 
             style="background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
            Complete Your Purchase
          </a>
        </div>
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 40px;">
          If you didn't mean to leave these items, you can ignore this email.
        </p>
      </div>
    `,
  });
}
