"use client";

import { Briefcase, MapPin, Clock, DollarSign, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { departments } from "@/lib/data/careers";
import type { Job } from "@/lib/data/careers";

interface Props {
  selectedDepartment: string;
  onDepartmentChange: (d: string) => void;
  filteredJobs: Job[];
  expandedJob: string | null;
  onToggleExpand: (id: string | null) => void;
  onApply: (job: Job) => void;
}

export function CareersPositions({
  selectedDepartment, onDepartmentChange,
  filteredJobs, expandedJob, onToggleExpand, onApply,
}: Props) {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-4">Open Positions</h2>
        <p className="text-muted-foreground text-center mb-12">{filteredJobs.length} positions available</p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => onDepartmentChange(dept)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedDepartment === dept
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-primary/10",
              )}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <button
                onClick={() => onToggleExpand(expandedJob === job.id ? null : job.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 flex-wrap">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">{job.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="w-4 h-4" />{job.salary}
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
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />{req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => onApply(job)} className="rounded-xl">Apply for this Position</Button>
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
  );
}
