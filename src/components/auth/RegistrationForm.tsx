"use client";

import { useRegistrationForm } from "@/modules/auth/hooks/use-registration-form";
import { RegistrationClosed } from "./RegistrationClosed";
import { RegistrationVerify } from "./RegistrationVerify";
import { RegistrationFormFields } from "./RegistrationFormFields";

const RegistrationForm = () => {
  const {
    isRegistrationAllowed,
    error, step, userEmail, otp, setOtp,
    isVerifying, isLoading, showPassword, setShowPassword,
    setStep, handleSubmit, handleVerifyOTP,
  } = useRegistrationForm();

  if (isRegistrationAllowed === false && step !== "verify") {
    return <RegistrationClosed />;
  }

  if (step === "verify") {
    return (
      <RegistrationVerify
        userEmail={userEmail}
        otp={otp}
        error={error}
        isVerifying={isVerifying}
        onOtpChange={setOtp}
        onVerify={handleVerifyOTP}
        onBack={() => setStep("register")}
      />
    );
  }

  return (
    <RegistrationFormFields
      error={error}
      isLoading={isLoading}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
      onSubmit={handleSubmit}
    />
  );
};

export default RegistrationForm;
