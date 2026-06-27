import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";

import { Session } from "next-auth";

interface ProfileHeaderProps {
  session: Session | null;
  bio: string;
  location: string;
}

export function ProfileHeader({ session, bio, location }: ProfileHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
      {/* Profile Card - Main Bento Item */}
      <div className="lg:col-span-8 group relative overflow-hidden rounded-[40px] bg-card border border-border/50 shadow-2xl shadow-primary/5 transition-all duration-500 hover:shadow-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/30 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-500" />
            <Avatar className="h-32 w-32 md:h-44 md:w-44 rounded-[28px] border-4 border-background shadow-2xl relative">
              <AvatarImage src={session?.user?.image || undefined} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground text-5xl font-black">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <button 
              className="absolute -bottom-2 -right-2 p-3 bg-card border border-border rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all group/btn"
              title="Update Avatar"
            >
              <Camera className="w-5 h-5 text-primary group-hover/btn:rotate-12 transition-transform" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 pt-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-2">
                {session?.user?.role || "Member"}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                {session?.user?.name}
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
              {bio || "Crafting professional experiences with the User Management System."}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 text-muted-foreground font-bold text-sm">
                <Mail className="w-4 h-4" />
                {session?.user?.email}
              </div>
              {location && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 text-muted-foreground font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  {location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats/Info Bento Item */}
      <div className="lg:col-span-4 grid grid-rows-2 gap-6">
        <div className="rounded-[40px] bg-primary p-8 text-primary-foreground shadow-xl shadow-primary/20 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex justify-between items-start relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-widest opacity-70">Security Status</span>
              <p className="text-xl font-black">Verified</p>
            </div>
          </div>
          <div className="space-y-1 relative z-10">
            <p className="text-4xl font-black">Active</p>
            <p className="text-sm font-bold opacity-70">Account is in good standing</p>
          </div>
        </div>

        <div className="rounded-[40px] bg-card border border-border/50 p-8 shadow-2xl shadow-primary/5 flex flex-col justify-between group hover:border-primary/30 transition-all duration-500">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Member Since</span>
              <p className="text-xl font-black text-foreground">2024</p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-4 border-card bg-muted flex items-center justify-center text-[10px] font-black">
                AWARD
              </div>
            ))}
            <div className="h-10 w-10 rounded-full border-4 border-card bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
              +5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
