import RegistrationForm from "@/components/auth/RegistrationForm";
import React from "react";
import { Gift, Truck, Percent } from "lucide-react";
import { AuthBanner } from "@/components/auth/AuthBanner";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { MobileLogo } from "@/components/auth/MobileLogo";
import { dbConnect } from "@/config/db";
import Settings from "@/models/Settings";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const RegisterPage = async () => {
  await dbConnect();
  const settings = await Settings.findOne();
  const allowRegistration = settings?.allowRegistration !== false;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      <AuthBanner
        order="last"
        title={
          <>
            Create Your <br />
            <span className="text-primary italic">Account</span>
          </>
        }
        description="Join thousands of happy customers and enjoy exclusive benefits, faster checkout, and personalized shopping experience."
        testimonial={{
          quote: "Best online shopping experience I've ever had. Fast delivery, great prices, and amazing customer service!",
          author: "Emily Rodriguez",
          role: "Verified Customer",
          stars: 5,
        }}
        features={[
          {
            icon: Gift,
            title: "Exclusive Deals",
            desc: "Get access to member-only discounts.",
          },
          {
            icon: Truck,
            title: "Free Shipping",
            desc: "Enjoy free shipping on orders over $50.",
          },
          {
            icon: Percent,
            title: "Rewards Program",
            desc: "Earn points with every purchase.",
          },
        ]}
      />

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 bg-background relative overflow-hidden">
        <MobileLogo />

        <div className="w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-700">
          {allowRegistration ? (
            <RegistrationForm />
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 10-8 0v3m-2 4h12a2 2 0 002-2V7a2 2 0 00-2-2h-4.586a1 1 0 00-.707.293l-4.414 4.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-4.414-4.414A1 1 0 006.586 3H2a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Registration Temporarily Closed</h1>
              <p className="text-muted-foreground font-medium">
                Registration is currently disabled. Please contact support or try again later.
              </p>
              <Link href="/login">
                <Button className="w-full h-12 rounded-xl font-bold mt-4">
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        <AuthFooter text="Join our community of 50,000+ happy customers." />
      </div>
    </div>
  );
};

export default RegisterPage;
