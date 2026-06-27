"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

interface PersonalInfoTabProps {
  name: string;
  setName: (name: string) => void;
  designation: string;
  setDesignation: (designation: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  location: string;
  setLocation: (location: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
    facebook: string;
  };
  setSocialLinks: (links: any) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function PersonalInfoTab({
  name,
  setName,
  designation,
  setDesignation,
  phoneNumber,
  setPhoneNumber,
  location,
  setLocation,
  bio,
  setBio,
  socialLinks,
  setSocialLinks,
  loading,
  onSubmit,
}: PersonalInfoTabProps) {
  const handleSocialChange = (key: string, value: string) => {
    setSocialLinks({
      ...socialLinks,
      [key]: value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          Personal Details
        </h2>
        <p className="text-muted-foreground font-medium">
          Manage your public profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-muted/30"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label>Designation / Title</Label>
          <Input
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="rounded-xl bg-muted/30"
            placeholder="Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="rounded-xl bg-muted/30"
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl bg-muted/30"
            placeholder="New York, USA"
          />
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label>Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="rounded-xl bg-muted/30 min-h-[100px]"
            placeholder="Tell us a little about yourself..."
          />
        </div>
      </div>

      <div className="border-t border-border/50 pt-8">
        <h3 className="text-lg font-black tracking-tight mb-6">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Twitter</Label>
            <Input
              value={socialLinks.twitter}
              onChange={(e) => handleSocialChange("twitter", e.target.value)}
              className="rounded-xl bg-muted/30"
              placeholder="@username"
            />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input
              value={socialLinks.linkedin}
              onChange={(e) => handleSocialChange("linkedin", e.target.value)}
              className="rounded-xl bg-muted/30"
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div className="space-y-2">
            <Label>GitHub</Label>
            <Input
              value={socialLinks.github}
              onChange={(e) => handleSocialChange("github", e.target.value)}
              className="rounded-xl bg-muted/30"
              placeholder="github.com/username"
            />
          </div>
          <div className="space-y-2">
            <Label>Facebook</Label>
            <Input
              value={socialLinks.facebook}
              onChange={(e) => handleSocialChange("facebook", e.target.value)}
              className="rounded-xl bg-muted/30"
              placeholder="facebook.com/username"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl px-8 font-black shadow-lg shadow-primary/20 h-12"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
