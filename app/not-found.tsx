"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home,  Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <span className="text-[200px] md:text-[300px] font-black text-primary/5 absolute inset-0 flex items-center justify-center select-none">
              404
            </span>
            <div className="relative z-10 pt-16">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center mb-8 shadow-2xl shadow-primary/30">
                <Search className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="h-14 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20">
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-2xl font-bold border-2">
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>

          <div className="mt-16 p-6 bg-card border border-border rounded-3xl inline-block">
            <p className="text-sm text-muted-foreground mb-4">Popular pages you might be looking for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Products", "Categories", "About", "Contact", "FAQ"].map((page) => (
                <Link
                  key={page}
                  href={page === "Products" ? "/products" : `/${page.toLowerCase()}`}
                  className="px-4 py-2 bg-muted rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
