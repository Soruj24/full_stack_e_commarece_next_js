"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { CONTACT_INFO } from "@/lib/data/footer";

export function FooterContact() {
  return (
    <div>
      <h4 className="text-foreground font-semibold mb-4 text-[13px]">Contact</h4>
      <ul className="space-y-3">
        <li className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/60" />
          <span>{CONTACT_INFO.address.split("\n").map((line, i) => (<span key={i}>{line}{i === 0 && <br />}</span>))}</span>
        </li>
        <li className="flex items-center gap-2.5 text-[13px]">
          <Mail className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          <a href={`mailto:${CONTACT_INFO.email}`} className="text-muted-foreground hover:text-foreground transition-colors">{CONTACT_INFO.email}</a>
        </li>
        <li className="flex items-center gap-2.5 text-[13px]">
          <Phone className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          <a href={`tel:${CONTACT_INFO.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">{CONTACT_INFO.phone}</a>
        </li>
        <li className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">Live support available</span>
        </li>
      </ul>

      <div className="mt-5">
        <Link
          href="/register"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] font-medium text-foreground bg-accent hover:bg-accent/80 transition-colors w-fit"
        >
          Get $10 off your first order
        </Link>
      </div>
    </div>
  );
}
