"use client";

import { Code, Terminal, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ApiHeader({ sidebarOpen, onToggleSidebar }: Props) {
  return (
    <header className="border-b bg-card/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold">API Reference</h1>
              <p className="text-xs text-muted-foreground">v1.0</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <code className="text-sm">curl https://api.example.com/v1</code>
          </div>
          <Button size="sm" className="gap-2">Get API Key <ArrowRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </header>
  );
}
