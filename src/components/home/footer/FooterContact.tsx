"use client";

import Link from "next/link";
import { MapPin, Mail, Phone, Zap } from "lucide-react";
import { CONTACT_INFO } from "@/lib/data/footer";

export function FooterContact() {
  return (
    <div>
      <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Contact</h4>
      <ul className="space-y-4">
        <li className="flex items-start gap-3 text-sm text-slate-400">
          <MapPin className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
          <span>{CONTACT_INFO.address.split("\n").map((line, i) => (<span key={i}>{line}<br /></span>))}</span>
        </li>
        <li className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-violet-500 shrink-0" />
          <a href={`mailto:${CONTACT_INFO.email}`} className="text-slate-400 hover:text-violet-400 transition-colors">{CONTACT_INFO.email}</a>
        </li>
        <li className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-violet-500 shrink-0" />
          <a href={`tel:${CONTACT_INFO.phone}`} className="text-slate-400 hover:text-violet-400 transition-colors">{CONTACT_INFO.phone}</a>
        </li>
        <li className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 text-xs font-semibold">Live support available</span>
        </li>
      </ul>

      <div className="mt-6">
        <Link
          href="/register"
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-white w-full"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          <Zap className="w-4 h-4 text-violet-400" />
          Get $10 off your first order
        </Link>
      </div>
    </div>
  );
}
