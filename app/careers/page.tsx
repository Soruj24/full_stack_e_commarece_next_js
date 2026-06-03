"use client";

import { useCareers } from "@/hooks/use-careers";
import { CareersHero } from "@/components/careers/CareersHero";
import { CareersValues } from "@/components/careers/CareersValues";
import { CareersBenefits } from "@/components/careers/CareersBenefits";
import { CareersPositions } from "@/components/careers/CareersPositions";
import { CareersApplicationForm } from "@/components/careers/CareersApplicationForm";
import { CareersCTA } from "@/components/careers/CareersCTA";

export default function CareersPage() {
  const {
    selectedDepartment, setSelectedDepartment,
    expandedJob, setExpandedJob,
    showApplicationForm,
    selectedJob,
    applicationForm, setApplicationForm,
    submitting,
    filteredJobs, handleApply, handleSubmitApplication,
    setShowApplicationForm,
  } = useCareers();

  return (
    <div className="min-h-screen bg-background">
      <CareersHero />
      <CareersValues />
      <CareersBenefits />
      <CareersPositions
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        filteredJobs={filteredJobs}
        expandedJob={expandedJob}
        onToggleExpand={setExpandedJob}
        onApply={handleApply}
      />
      {showApplicationForm && selectedJob && (
        <CareersApplicationForm
          job={selectedJob}
          form={applicationForm}
          submitting={submitting}
          onFormChange={setApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={handleSubmitApplication}
        />
      )}
      <CareersCTA />
    </div>
  );
}
