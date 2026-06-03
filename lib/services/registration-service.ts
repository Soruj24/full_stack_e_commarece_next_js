export async function checkRegistrationAllowed(): Promise<boolean> {
  const res = await fetch("/api/settings");
  const data = await res.json();
  if (data.success) return data.settings.allowRegistration;
  return true;
}

export async function registerUser(body: { name: string; email: string; password: string; image: string }) {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export async function verifyOTP(email: string, otp: string) {
  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}
