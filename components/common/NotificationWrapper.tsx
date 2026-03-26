"use client";

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { NotificationProvider } from '@/context/NotificationContext';

function NotificationWrapper({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    return <>{children}</>;
  }

  return (
    <NotificationProvider userId={userId}>
      {children}
    </NotificationProvider>
  );
}

export default NotificationWrapper;
