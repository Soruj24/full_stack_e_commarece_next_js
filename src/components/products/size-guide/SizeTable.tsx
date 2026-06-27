import type { SizeGuideTable } from "@/features/products/types/size-guide";

interface SizeTableProps {
  guide: SizeGuideTable | null;
}

export function SizeTable({ guide }: SizeTableProps) {
  if (!guide) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-white/10">
            {guide.headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-zinc-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guide.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
            >
              {Object.values(row).map((value, j) => (
                <td key={j} className="px-4 py-3 text-sm font-medium">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
