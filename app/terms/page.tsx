import { Gavel, Scale, ShieldAlert, CheckCircle2, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform.
          </p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-[32px] p-8 md:p-12 shadow-sm border border-border space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black text-foreground">1. Acceptance of Terms</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Gavel className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black text-foreground">2. User Responsibilities</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black text-foreground">3. Prohibited Activities</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground font-medium ml-4">
              <li>Engaging in any illegal activity</li>
              <li>Attempting to bypass security measures</li>
              <li>Harassing other users</li>
              <li>Distributing harmful software</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black text-foreground">4. Termination</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
        </div>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-muted-foreground/60 text-sm font-bold uppercase tracking-widest">
            Last Updated: December 25, 2025
          </p>
        </div>
      </div>
    </div>
  );
}
