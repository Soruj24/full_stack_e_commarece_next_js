import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FooterLinkColumnProps {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}

export function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">{title}</h4>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-slate-400 hover:text-violet-400 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 group"
            >
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
