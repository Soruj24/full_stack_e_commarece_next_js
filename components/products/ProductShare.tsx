"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2, 
  Copy, 
  Check,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  image?: string;
  variant?: "default" | "minimal" | "icon-only";
  size?: "sm" | "md" | "lg";
}

const SHARE_CONFIG = {
  facebook: {
    icon: Facebook,
    label: "Facebook",
    color: "#1877F2",
    getUrl: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
  },
  twitter: {
    icon: Twitter,
    label: "Twitter",
    color: "#000000",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    color: "#0A66C2",
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    icon: MessageCircle,
    label: "WhatsApp",
    color: "#25D366",
    getUrl: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
  },
  email: {
    icon: Mail,
    label: "Email",
    color: "#EA4335",
    getUrl: (url: string, title: string, description?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent((description || "") + "\n\n" + url)}`,
  },
};

export function SocialShare({
  url,
  title,
  description,
  image,
  variant = "default",
  size = "md",
}: SocialShareProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = (platform: keyof typeof SHARE_CONFIG) => {
    const config = SHARE_CONFIG[platform];
    const shareUrlBuilt = config.getUrl(shareUrl, title, description);
    
    if (platform === "email") {
      window.location.href = shareUrlBuilt;
    } else {
      window.open(shareUrlBuilt, "_blank", "width=600,height=400");
    }
    
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
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      setShowDropdown(true);
    }
    setShowDropdown(false);
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-5 text-base gap-2",
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  if (variant === "icon-only") {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDropdown(!showDropdown)}
          className="rounded-xl"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        
        <ShareDropdown
          isOpen={showDropdown}
          onClose={() => setShowDropdown(false)}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
          onNativeShare={handleNativeShare}
          copied={copied}
          size="sm"
        />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDropdown(!showDropdown)}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
        
        <ShareDropdown
          isOpen={showDropdown}
          onClose={() => setShowDropdown(false)}
          onShare={handleShare}
          onCopyLink={handleCopyLink}
          onNativeShare={handleNativeShare}
          copied={copied}
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn("rounded-xl font-medium", sizeClasses[size])}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Share2 className="w-4 h-4" style={{ width: iconSizes[size], height: iconSizes[size] }} />
        Share
      </Button>
      
      <ShareDropdown
        isOpen={showDropdown}
        onClose={() => setShowDropdown(false)}
        onShare={handleShare}
        onCopyLink={handleCopyLink}
        onNativeShare={handleNativeShare}
        copied={copied}
        size={size}
      />
    </div>
  );
}

interface ShareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: keyof typeof SHARE_CONFIG) => void;
  onCopyLink: () => void;
  onNativeShare?: () => void;
  copied: boolean;
  size: "sm" | "md" | "lg";
}

function ShareDropdown({
  isOpen,
  onClose,
  onShare,
  onCopyLink,
  onNativeShare,
  copied,
  size,
}: ShareDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden"
          >
            <div className="p-3 border-b border-zinc-100 dark:border-white/10">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Share this product
              </p>
            </div>
            
            <div className="p-2">
              {onNativeShare && (
                <button
                  onClick={onNativeShare}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">More options...</span>
                </button>
              )}
              
              {(Object.entries(SHARE_CONFIG) as [keyof typeof SHARE_CONFIG, typeof SHARE_CONFIG.facebook][]).map(
                ([platform, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={platform}
                      onClick={() => onShare(platform)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      <span className="font-medium text-sm">{config.label}</span>
                    </button>
                  );
                }
              )}
              
              <div className="h-px bg-zinc-100 dark:bg-white/10 my-2" />
              
              <button
                onClick={onCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Link2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="font-medium text-sm">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
