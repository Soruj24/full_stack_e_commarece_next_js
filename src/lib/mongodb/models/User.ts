// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "vendor";
  status: "active" | "banned";
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  image?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  verificationOTP?: string;
  verificationOTPExpires?: Date;
  addresses: {
    type: "billing" | "shipping";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }[];
  paymentMethods: {
    provider: "stripe" | "paypal";
    last4?: string;
    brand?: string;
    isDefault: boolean;
  }[];
  wishlist: Schema.Types.ObjectId[];
  preferences: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    smsNotifications: boolean;
    inAppNotifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastLoginIP?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
  designation?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
  };
  loginAttempts: number;
  lockUntil?: Date;
  invitedBy?: Schema.Types.ObjectId;
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: Schema.Types.ObjectId;
  membershipTier: "bronze" | "silver" | "gold" | "platinum";
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: false,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    image: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
      select: true,
    },
    resetPasswordExpires: {
      type: Date,
      select: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    verificationOTP: String,
    verificationOTPExpires: Date,
    lastLogin: Date,
    lastLoginIP: String,
    bio: {
      type: String,
      maxlength: [200, "Bio cannot exceed 200 characters"],
    },
    location: String,
    phoneNumber: String,
    addresses: [
      {
        type: {
          type: String,
          enum: ["billing", "shipping"],
          default: "shipping",
        },
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    paymentMethods: [
      {
        provider: { type: String, enum: ["stripe", "paypal"] },
        last4: String,
        brand: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    website: String,
    designation: String,
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
      facebook: String,
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: Date,
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    membershipTier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
      smsNotifications: {
        type: Boolean,
        default: true,
      },
      inAppNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { resetPasswordToken: 1 },
  {
    expireAfterSeconds: 3600,
    partialFilterExpression: { resetPasswordExpires: { $exists: true } },
  }
);

// Performance Indexes
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ loyaltyPoints: -1 });
userSchema.index({ membershipTier: 1 });

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
