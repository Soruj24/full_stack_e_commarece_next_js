export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  twoFactorEnabled?: boolean;
  lastLogin?: Date;
  createdAt: Date | string;
  updatedAt: Date | string;
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
}

export interface IAddress {
  _id?: string;
  type: "billing" | "shipping";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IPaymentMethod {
  _id?: string;
  provider: "stripe" | "paypal";
  last4?: string;
  brand?: string;
  isDefault: boolean;
}
