"use client";

import { useState } from "react";
import { toast } from "sonner";

interface PartnerFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  partnershipType: string;
  message: string;
}

const initialForm: PartnerFormData = {
  companyName: "", contactName: "", email: "", phone: "",
  website: "", partnershipType: "", message: "",
};

export function usePartnerForm() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Application submitted!", {
      description: "We'll review your application and get back to you within 48 hours.",
    });
    setShowContactForm(false);
    setFormData(initialForm);
    setSubmitting(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field as keyof PartnerFormData]: value }));
  };

  return {
    showContactForm, setShowContactForm, formData, updateField,
    submitting, handleSubmit, partnershipType: formData.partnershipType,
  };
}
