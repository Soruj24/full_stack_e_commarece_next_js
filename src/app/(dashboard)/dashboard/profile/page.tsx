"use client";

import { useSession } from "next-auth/react";
import { Loader2, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-gradient-to-br from-card via-card to-primary/5 p-8 rounded-[32px] border border-border/50 shadow-2xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="relative z-10 flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-background shadow-2xl">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-2xl font-black">
              {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">{session?.user?.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Mail className="w-4 h-4" />
              {session?.user?.email}
            </div>
          </div>
        </div>
      </div>

      <ProfileForm />
    </div>
  );
}
