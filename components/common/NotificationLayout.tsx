"use client";

import { useSession } from "next-auth/react";
import { NotificationProvider } from "@/context/NotificationContext";
import { ReactNode } from "react";

export function NotificationLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    <NotificationProvider userId={userId || ""}>
      {children}
    </NotificationProvider>
  );
}
