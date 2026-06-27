"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OrderDetailsNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-black">Order not found</h2>
      <Link href="/profile">
        <Button className="rounded-2xl">Back to Profile</Button>
      </Link>
    </div>
  );
}