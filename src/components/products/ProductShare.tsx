"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSocialShare } from "@/modules/products/hooks/use-social-share";
import { ShareDropdown } from "./product-share/ShareDropdown";
import type { SocialShareProps } from "@/modules/products/types/social-share";

export function SocialShare({ url, title, description, variant = "default", size = "md" }: SocialShareProps) {
  const { showDropdown, setShowDropdown, copied, handleShare, handleCopyLink, handleNativeShare } = useSocialShare({ url, title, description } as SocialShareProps);

  const sizeClasses = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-5 text-base gap-2" };
  const iconSizes = { sm: 14, md: 16, lg: 18 };

  if (variant === "icon-only") {
    return (
      <div className="relative">
        <Button variant="outline" size="icon" onClick={() => setShowDropdown(!showDropdown)} className="rounded-xl">
          <Share2 className="w-4 h-4" />
        </Button>
        <ShareDropdown isOpen={showDropdown} onClose={() => setShowDropdown(false)} onShare={handleShare} onCopyLink={handleCopyLink} onNativeShare={handleNativeShare} copied={copied} />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setShowDropdown(!showDropdown)} className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        <ShareDropdown isOpen={showDropdown} onClose={() => setShowDropdown(false)} onShare={handleShare} onCopyLink={handleCopyLink} onNativeShare={handleNativeShare} copied={copied} />
      </div>
    );
  }

  return (
    <div className="relative">
      <Button variant="outline" className={cn("rounded-xl font-medium", sizeClasses[size])} onClick={() => setShowDropdown(!showDropdown)}>
        <Share2 style={{ width: iconSizes[size], height: iconSizes[size] }} />
        Share
      </Button>
      <ShareDropdown isOpen={showDropdown} onClose={() => setShowDropdown(false)} onShare={handleShare} onCopyLink={handleCopyLink} onNativeShare={handleNativeShare} copied={copied} />
    </div>
  );
}
