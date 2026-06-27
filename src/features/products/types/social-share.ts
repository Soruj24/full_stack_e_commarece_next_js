export interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  image?: string;
  variant?: "default" | "minimal" | "icon-only";
  size?: "sm" | "md" | "lg";
}
