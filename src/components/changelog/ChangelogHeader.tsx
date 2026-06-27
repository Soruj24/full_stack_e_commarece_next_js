import { FileText } from "lucide-react";
import { versions } from "@/lib/data/changelog";

interface Props {
  totalChanges: number;
}

export function ChangelogHeader({ totalChanges }: Props) {
  return (
    <section className="border-b bg-card/50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <FileText className="w-4 h-4" />Changelog
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6">
          Product <span className="text-primary">Updates</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stay up to date with our latest features, improvements, and bug fixes.
        </p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-black text-primary">{versions.length}</div>
            <div className="text-sm text-muted-foreground">Releases</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-primary">{totalChanges}</div>
            <div className="text-sm text-muted-foreground">Changes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-green-600">{versions[0]?.version}</div>
            <div className="text-sm text-muted-foreground">Latest</div>
          </div>
        </div>
      </div>
    </section>
  );
}
