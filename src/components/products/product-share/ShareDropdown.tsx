import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link2, Check } from "lucide-react";
import { SHARE_CONFIG } from "@/lib/data/social-share";

interface ShareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: keyof typeof SHARE_CONFIG) => void;
  onCopyLink: () => void;
  onNativeShare?: () => void;
  copied: boolean;
}

export function ShareDropdown({ isOpen, onClose, onShare, onCopyLink, onNativeShare, copied }: ShareDropdownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden"
          >
            <div className="p-3 border-b border-zinc-100 dark:border-white/10">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Share this product</p>
            </div>
            <div className="p-2">
              {onNativeShare && (
                <button onClick={onNativeShare} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-white/10 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">More options...</span>
                </button>
              )}

              {(Object.entries(SHARE_CONFIG) as [keyof typeof SHARE_CONFIG, typeof SHARE_CONFIG[keyof typeof SHARE_CONFIG]][]).map(([platform, config]) => {
                const Icon = config.icon;
                return (
                  <button key={platform} onClick={() => onShare(platform)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    <span className="font-medium text-sm">{config.label}</span>
                  </button>
                );
              })}

              <div className="h-px bg-zinc-100 dark:bg-white/10 my-2" />

              <button onClick={onCopyLink} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4 text-primary" />}
                </div>
                <span className="font-medium text-sm">{copied ? "Copied!" : "Copy link"}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
