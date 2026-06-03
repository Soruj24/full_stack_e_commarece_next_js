import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChangelogSubscribe() {
  return (
    <section className="py-16 px-4 bg-primary/5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
        <p className="text-muted-foreground mb-6">Get notified about new releases and important updates.</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 h-12 px-4 rounded-xl border border-input bg-background" />
          <Button className="h-12 rounded-xl px-8">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}
