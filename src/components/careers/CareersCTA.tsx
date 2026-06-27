import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CareersCTA() {
  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-black mb-4">Don&apos;t See Your Role?</h2>
        <p className="text-muted-foreground mb-8">
          We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind.
        </p>
        <Button size="lg" className="rounded-xl px-8 h-14 text-lg font-bold">
          <Mail className="w-5 h-5 mr-2" />
          Send General Application
        </Button>
      </div>
    </section>
  );
}
