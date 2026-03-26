"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Mail, ShoppingBag, Package, Heart, ArrowRight } from "lucide-react";
import { Session } from "next-auth";

interface DashboardHeaderProps {
  session: Session;
}

export function DashboardHeader({ session }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-10 rounded-[32px] shadow-2xl shadow-primary/5 border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full -mr-48 -mt-48 blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />
      
      <div className="flex items-center gap-6 md:gap-8 relative z-10">
        <div className="relative">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-2xl">
            <AvatarImage src={session.user.image || ""} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-3xl md:text-4xl font-black">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-green-500 h-6 w-6 md:h-8 md:w-8 rounded-full border-4 border-background shadow-lg shadow-green-500/30" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-xs font-bold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Verified Member
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              {session.user.name?.split(" ")[0] || "User"}!
            </span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {session.user.email}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 relative z-10">
        <Button
          variant="outline"
          className="rounded-xl h-12 px-6 font-bold gap-2"
          asChild
        >
          <Link href="/orders">
            <Package className="h-4 w-4" />
            My Orders
          </Link>
        </Button>
        <Button
          variant="outline"
          className="rounded-xl h-12 px-6 font-bold gap-2"
          asChild
        >
          <Link href="/wishlist">
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
        </Button>
        <Button
          className="rounded-xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20"
          asChild
        >
          <Link href="/products">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
