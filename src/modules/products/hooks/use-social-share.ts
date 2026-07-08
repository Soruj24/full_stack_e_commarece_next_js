import { useState } from "react";
import { toast } from "sonner";
import { SHARE_CONFIG } from "@/lib/data/social-share";
import type { SocialShareProps } from "@/modules/products/types/social-share";

export function useSocialShare({ url, title, description }: SocialShareProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = (platform: keyof typeof SHARE_CONFIG) => {
    const config = SHARE_CONFIG[platform];
    const shareUrlBuilt = config.getUrl(shareUrl, title, description);
    if (platform === "email") window.location.href = shareUrlBuilt;
    else window.open(shareUrlBuilt, "_blank", "width=600,height=400");
    setShowDropdown(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
    setShowDropdown(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: description, url: shareUrl }); }
      catch (err) { if ((err as Error).name !== "AbortError") toast.error("Failed to share"); }
    } else {
      setShowDropdown(true);
    }
    setShowDropdown(false);
  };

  return { showDropdown, setShowDropdown, copied, handleShare, handleCopyLink, handleNativeShare };
}
