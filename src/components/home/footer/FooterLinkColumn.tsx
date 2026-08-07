import Link from "next/link";

interface FooterLinkColumnProps {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}

export function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h4 className="text-foreground font-semibold mb-4 text-[13px]">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
