"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { jobs } from "@/lib/data/careers";
import type { Job } from "@/lib/data/careers";

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  coverLetter: string;
  resume: File | null;
}

const initialForm: ApplicationForm = {
  name: "", email: "", phone: "", linkedin: "", portfolio: "", coverLetter: "", resume: null,
};

export function useCareers() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const filteredJobs = useMemo(() =>
    selectedDepartment === "All"
      ? jobs
      : jobs.filter((job) => job.department === selectedDepartment),
    [selectedDepartment],
  );

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
    setExpandedJob(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Application submitted successfully!", {
      description: "We'll review your application and get back to you soon.",
    });
    setShowApplicationForm(false);
    setApplicationForm(initialForm);
    setSelectedJob(null);
    setSubmitting(false);
  };

  return {
    selectedDepartment, setSelectedDepartment,
    expandedJob, setExpandedJob,
    showApplicationForm, setShowApplicationForm,
    selectedJob,
    applicationForm, setApplicationForm,
    submitting,
    filteredJobs, handleApply, handleSubmitApplication,
  };
}
