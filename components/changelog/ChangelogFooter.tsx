import { Twitter, Github } from "lucide-react";

export function ChangelogFooter() {
  return (
    <section className="py-8 px-4 border-t">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Want to suggest a feature?{" "}
          <a href="/contact" className="text-primary hover:underline">Contact us</a>
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-5 h-5" /></a>
        </div>
      </div>
    </section>
  );
}
