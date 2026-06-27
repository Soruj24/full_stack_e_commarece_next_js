import LoginForm from "@/components/auth/LoginForm";
import React from "react";
import { ShoppingBag, Truck, Shield } from "lucide-react";
import { AuthBanner } from "@/components/auth/AuthBanner";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { MobileLogo } from "@/components/auth/MobileLogo";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      <AuthBanner
        title={
          <>
            Welcome <br />
            <span className="text-primary italic">Back</span>
          </>
        }
        description="Sign in to your account to track orders, manage your wishlist, and enjoy a faster checkout experience."
        features={[
          {
            icon: ShoppingBag,
            title: "Track Orders",
            desc: "Monitor your deliveries in real-time.",
          },
          {
            icon: Truck,
            title: "Fast Checkout",
            desc: "Save your info for quicker purchasing.",
          },
          {
            icon: Shield,
            title: "Secure Access",
            desc: "Your data is protected with encryption.",
          },
        ]}
      />

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-background relative overflow-hidden">
        <MobileLogo />

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <LoginForm />
        </div>

        <AuthFooter text="Your account is protected with industry-standard security." />
      </div>
    </div>
  );
};

export default LoginPage;
