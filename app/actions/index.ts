"use server";

import { signIn, signOut } from "@/auth";

export async function doSocialLogin(formData: FormData) {
  const action = formData.get("action");
  if (action) {
    await signIn(action as string, { redirectTo: "/dashboard" });
  } else {
    throw new Error("Action is required");
  }
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(formData: FormData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      otp: formData.get("otp"),
      redirect: false,
    });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "CallbackRouteError") {
      // The actual error thrown in authorize is in err.cause
      return {
        error: {
          message:
            (err.cause as { message?: string })?.message ||
            "Authentication failed",
        },
      };
    }
    // If it's a redirect, we should let it through (though redirect: false should prevent this)
    if ((err as { message?: string })?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return {
      error: {
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      },
    };
  }
}
