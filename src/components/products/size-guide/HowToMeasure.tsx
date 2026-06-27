export function HowToMeasure() {
  const steps = [
    { num: "1", title: "Chest/Bust", desc: "Measure around the fullest part of your chest, keeping the tape horizontal." },
    { num: "2", title: "Waist", desc: "Measure around your natural waistline, keeping the tape comfortably loose." },
    { num: "3", title: "Hip", desc: 'Measure around the fullest part of your hips, about 8" below your waist.' },
    { num: "4", title: "Inseam", desc: "Measure from the crotch seam to the bottom of the leg." },
  ];

  return (
    <div className="mt-8 p-5 bg-zinc-50 dark:bg-white/5 rounded-2xl">
      <h4 className="text-sm font-bold mb-4">How to Measure</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{step.num}</span>
            </div>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-zinc-500 text-xs">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
