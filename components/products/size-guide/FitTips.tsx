import { Check } from "lucide-react";

export function FitTips() {
  const tips = [
    "If between sizes, size up for a looser fit or size down for a more fitted look.",
    "Consider the fabric composition - stretchy materials may fit differently.",
    "Check the product description for specific fit recommendations.",
  ];

  return (
    <div className="mt-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Check className="w-4 h-4 text-green-600" />
        Fit Tips
      </h4>
      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
