"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from '@/lib/types';

interface EditUserFormFieldsProps {
  user: User;
  onChange: (user: User) => void;
}

export function EditUserFormFields({ user, onChange }: EditUserFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Full Name">
          <Input value={user.name} onChange={(e) => onChange({ ...user, name: e.target.value })} className="h-12 rounded-xl bg-muted/50 border-none" />
        </Field>
        <Field label="Email (Cannot be changed)">
          <Input disabled value={user.email} className="h-12 rounded-xl bg-muted/50 border-none text-muted-foreground/50" />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Designation">
          <Input value={(user as any).designation || ""} onChange={(e) => onChange({ ...user, designation: e.target.value })} className="h-12 rounded-xl bg-muted/50 border-none" />
        </Field>
        <Field label="Phone Number">
          <Input value={(user as any).phoneNumber || ""} onChange={(e) => onChange({ ...user, phoneNumber: e.target.value })} className="h-12 rounded-xl bg-muted/50 border-none" />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Location">
          <Input value={(user as any).location || ""} onChange={(e) => onChange({ ...user, location: e.target.value })} className="h-12 rounded-xl bg-muted/50 border-none" />
        </Field>
        <Field label="Website">
          <Input value={(user as any).website || ""} onChange={(e) => onChange({ ...user, website: e.target.value })} className="h-12 rounded-xl bg-muted/50 border-none" />
        </Field>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-bold text-muted-foreground ml-1">Bio</Label>
        <Textarea value={(user as any).bio || ""} onChange={(e) => onChange({ ...user, bio: e.target.value })} className="rounded-xl bg-muted/50 border-none min-h-[100px]" />
      </div>
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SocialField label="Twitter" value={(user as any).socialLinks?.twitter || ""} onChange={(v) => onChange({ ...user, socialLinks: { ...(user as any).socialLinks, twitter: v } })} />
          <SocialField label="LinkedIn" value={(user as any).socialLinks?.linkedin || ""} onChange={(v) => onChange({ ...user, socialLinks: { ...(user as any).socialLinks, linkedin: v } })} />
          <SocialField label="GitHub" value={(user as any).socialLinks?.github || ""} onChange={(v) => onChange({ ...user, socialLinks: { ...(user as any).socialLinks, github: v } })} />
          <SocialField label="Facebook" value={(user as any).socialLinks?.facebook || ""} onChange={(v) => onChange({ ...user, socialLinks: { ...(user as any).socialLinks, facebook: v } })} />
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-muted-foreground ml-1">{label}</Label>
      {children}
    </div>
  );
}

function SocialField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold text-muted-foreground ml-1">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-xl bg-muted/50 border-none" />
    </div>
  );
}
