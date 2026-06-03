"use client";

import { useState } from "react";
import { usePartnerForm } from "@/hooks/use-partner-form";
import { PartnersHero } from "@/components/partners/PartnersHero";
import { PartnershipTypes } from "@/components/partners/PartnershipTypes";
import { PartnersGridSection } from "@/components/partners/PartnersGridSection";
import { PartnersTestimonials } from "@/components/partners/PartnersTestimonials";
import { WhyPartnerSection } from "@/components/partners/WhyPartnerSection";
import { PartnerContactForm } from "@/components/partners/PartnerContactForm";

export default function PartnersPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { showContactForm, setShowContactForm, formData, updateField, submitting, handleSubmit } = usePartnerForm();

  return (
    <div className="min-h-screen bg-background">
      <PartnersHero onCtaClick={() => setShowContactForm(true)} />
      <PartnershipTypes
        selectedType={selectedType}
        onSelectType={setSelectedType}
        onApply={(title) => { updateField("partnershipType", title); setShowContactForm(true); }}
      />
      <PartnersGridSection />
      <PartnersTestimonials />
      <WhyPartnerSection onCtaClick={() => setShowContactForm(true)} />
      <PartnerContactForm
        show={showContactForm}
        onClose={() => setShowContactForm(false)}
        formData={formData}
        onUpdate={updateField}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
