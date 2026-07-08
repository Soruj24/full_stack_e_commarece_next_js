export interface LoginFormData {
  email: string;
  password: string;
  otp?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  image?: string;
  referralCode?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "vendor";
  status: "active" | "banned";
  image?: string;
}
