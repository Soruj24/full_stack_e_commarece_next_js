"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ContactHeader,
  ContactInfoCards,
  ContactForm,
  ContactSuccess,
} from "@/components/contact";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  userId?: string;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    userId: "",
  });

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        userId: session.user.id || "",
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      subject: "",
      message: "",
      userId: session?.user?.id || "",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-primary/20 selection:text-primary">
      <ContactHeader />

      <div className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ContactInfoCards />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-2xl shadow-primary/5 rounded-[40px] overflow-hidden bg-card h-full">
              <CardContent className="p-10 md:p-16">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <ContactSuccess onReset={handleReset} />
                  ) : (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ContactForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleSubmit}
                        loading={loading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}