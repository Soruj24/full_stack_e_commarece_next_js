"use client";

import { useState } from "react";
import { Briefcase, MapPin, Clock, DollarSign, Heart, Users, Zap, Globe, Coffee, Gift, Cpu, Building, ChevronDown, ChevronUp, Send, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const departments = ["All", "Engineering", "Design", "Marketing", "Sales", "Customer Success"];

const jobs = [
  {
    id: "senior-frontend",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    description: "We're looking for a Senior Frontend Engineer to help build the future of e-commerce. You'll work with React, TypeScript, and Next.js to create exceptional user experiences.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with Next.js",
      "Excellent communication skills",
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    description: "Join our design team to create beautiful, intuitive interfaces that millions of users interact with daily. You'll own the design of key product features.",
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma",
      "Strong portfolio",
      "Experience with design systems",
    ],
  },
  {
    id: "marketing-manager",
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    description: "Drive user acquisition and growth through data-driven marketing campaigns. You'll work closely with product and sales teams.",
    requirements: [
      "4+ years in growth marketing",
      "Experience with paid acquisition",
      "Strong analytical skills",
      "SEO/SEM expertise",
    ],
  },
  {
    id: "customer-success",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$70,000 - $95,000",
    description: "Help our customers succeed! You'll be the bridge between our product and customers, ensuring they get maximum value.",
    requirements: [
      "2+ years in customer success",
      "Excellent interpersonal skills",
      "Technical aptitude",
      "Experience with CRM tools",
    ],
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    description: "Build scalable APIs and services that power our platform. You'll work with Node.js, Python, and cloud infrastructure.",
    requirements: [
      "4+ years of backend development",
      "Experience with Node.js or Python",
      "Database design skills",
      "Cloud infrastructure knowledge",
    ],
  },
  {
    id: "sales-rep",
    title: "Enterprise Sales Representative",
    department: "Sales",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80,000 - $120,000 + Commission",
    description: "Drive revenue by selling our enterprise solutions to large organizations. You'll manage the full sales cycle from prospecting to close.",
    requirements: [
      "5+ years of B2B sales experience",
      "Track record of exceeding quotas",
      "Experience with enterprise deals",
      "Strong presentation skills",
    ],
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive medical, dental, and vision insurance for you and your family.",
  },
  {
    icon: Globe,
    title: "Remote Work",
    description: "Work from anywhere in the world with flexible hours and async culture.",
  },
  {
    icon: Gift,
    title: "Equity & Compensation",
    description: "Competitive salary with equity options so you share in our success.",
  },
  {
    icon: Coffee,
    title: "Work-Life Balance",
    description: "Unlimited PTO, parental leave, and sabbatical programs.",
  },
  {
    icon: Zap,
    title: "Learning & Development",
    description: "$5,000 annual budget for courses, conferences, and books.",
  },
  {
    icon: Users,
    title: "Team Events",
    description: "Quarterly team retreats and annual company offsite.",
  },
];

const values = [
  {
    icon: Cpu,
    title: "Innovation First",
    description: "We push boundaries and embrace new technologies.",
  },
  {
    icon: Building,
    title: "Customer Obsessed",
    description: "Every decision starts with the customer in mind.",
  },
  {
    icon: Users,
    title: "Team Powered",
    description: "We believe in collaboration and mutual growth.",
  },
];

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    resume: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredJobs = selectedDepartment === "All"
    ? jobs
    : jobs.filter(job => job.department === selectedDepartment);

  const handleApply = (job: typeof jobs[0]) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
    setExpandedJob(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Application submitted successfully!", {
      description: "We'll review your application and get back to you soon.",
    });
    
    setShowApplicationForm(false);
    setApplicationForm({
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      portfolio: "",
      coverLetter: "",
      resume: null,
    });
    setSelectedJob(null);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            We're Hiring!
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Build the Future of <span className="text-primary">E-Commerce</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our team of innovators and help millions of businesses succeed online. 
            We're building something extraordinary, and we want you to be part of it.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>100+ Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>15+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Remote-First</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-card rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">Benefits & Perks</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We take care of our team with competitive benefits and perks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4 p-6 bg-card rounded-2xl border border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">Open Positions</h2>
          <p className="text-muted-foreground text-center mb-12">
            {jobs.length} positions available
          </p>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedDepartment === dept
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-primary/10"
                )}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {expandedJob === job.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedJob === job.id && (
                  <div className="px-6 pb-6 border-t border-border/50 pt-4">
                    <p className="text-muted-foreground mb-4">{job.description}</p>
                    <div className="mb-6">
                      <h4 className="font-bold mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button onClick={() => handleApply(job)} className="rounded-xl">
                      Apply for this Position
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No positions available in this department.</p>
            </div>
          )}
        </div>
      </section>

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Apply for {selectedJob.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedJob.location} • {selectedJob.department}</p>
              </div>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={applicationForm.name}
                    onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationForm.email}
                    onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={applicationForm.linkedin}
                    onChange={(e) => setApplicationForm({ ...applicationForm, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio / Website</Label>
                <Input
                  id="portfolio"
                  value={applicationForm.portfolio}
                  onChange={(e) => setApplicationForm({ ...applicationForm, portfolio: e.target.value })}
                  placeholder="yourportfolio.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume *</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setApplicationForm({ ...applicationForm, resume: e.target.files?.[0] || null })}
                  required
                />
                <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX format</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  placeholder="Tell us why you'd be a great fit..."
                  rows={5}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Don't See Your Role?</h2>
          <p className="text-muted-foreground mb-8">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" className="rounded-xl px-8 h-14 text-lg font-bold">
            <Mail className="w-5 h-5 mr-2" />
            Send General Application
          </Button>
        </div>
      </section>
    </div>
  );
}

function Mail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
