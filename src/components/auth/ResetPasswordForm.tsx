"use client";

import { useResetPassword } from "@/modules/auth/hooks/use-reset-password";
import { TokenLoadingState } from "./reset-password/TokenLoadingState";
import { TokenErrorState } from "./reset-password/TokenErrorState";
import { PasswordForm } from "./reset-password/PasswordForm";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { password, setPassword, confirmPassword, setConfirmPassword, message, error, loading, validating, isValidToken, handleSubmit, router } = useResetPassword(token);

  if (validating) return <TokenLoadingState />;
  if (!isValidToken) return <TokenErrorState error={error} onReturn={() => router.push("/login")} />;

  return (
    <PasswordForm
      password={password} confirmPassword={confirmPassword}
      message={message} error={error} loading={loading}
      onPasswordChange={setPassword} onConfirmChange={setConfirmPassword}
      onSubmit={handleSubmit}
    />
  );
}
