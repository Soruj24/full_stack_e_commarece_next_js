"use client";

import { useState } from "react";
import { doSocialLogin } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Github, Chrome, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SocialLogins = () => {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSocialLogin = async (formData: FormData) => {
        const action = formData.get("action") as string;
        setIsLoading(action);
        try {
            await doSocialLogin(formData);
        } catch (error) {
            console.error("Social login error:", error);
            setIsLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                    <span className="bg-background px-4 text-muted-foreground/60">
                        Secure Authentication Protocols
                    </span>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
            >
                <form action={handleSocialLogin} className="contents">
                    <Button
                        type="submit"
                        name="action"
                        value="google"
                        disabled={!!isLoading}
                        variant="outline"
                        className="w-full h-16 flex items-center justify-center gap-4 rounded-2xl border border-border/40 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all font-black uppercase text-[10px] tracking-[0.2em] active:scale-[0.98] group relative overflow-hidden"
                    >
                        {isLoading === "google" ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                            <>
                                <Chrome className="h-5 w-5 text-[#4285F4] transition-transform group-hover:rotate-12" />
                                <span>Google</span>
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>

                    <Button
                        type="submit"
                        name="action"
                        value="github"
                        disabled={!!isLoading}
                        variant="outline"
                        className="w-full h-16 flex items-center justify-center gap-4 rounded-2xl border border-border/40 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all font-black uppercase text-[10px] tracking-[0.2em] active:scale-[0.98] group relative overflow-hidden"
                    >
                        {isLoading === "github" ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        ) : (
                            <>
                                <Github className="h-5 w-5 transition-transform group-hover:rotate-12" />
                                <span>GitHub</span>
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default SocialLogins;