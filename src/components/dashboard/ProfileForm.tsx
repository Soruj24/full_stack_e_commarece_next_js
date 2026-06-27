"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

export function ProfileForm() {
  const { data: session } = useSession();
  
  return (
    <div className="space-y-6 bg-card p-6 rounded-[32px] border border-border/50">
      <div className="space-y-2">
        <h3 className="text-lg font-black uppercase tracking-tight">Personal Information</h3>
        <p className="text-sm text-muted-foreground">Update your personal details here.</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={session?.user?.name || ""} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={session?.user?.email || ""} disabled />
        </div>
        <Button className="w-full sm:w-auto font-black rounded-xl">Save Changes</Button>
      </div>
    </div>
  );
}
