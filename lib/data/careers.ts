import { Heart, Globe, Gift, Coffee, Zap, Users, Cpu, Building } from "lucide-react";
import type { ComponentType } from "react";

export const departments = ["All", "Engineering", "Design", "Marketing", "Sales", "Customer Success"];

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

export const jobs: Job[] = [
  {
    id: "senior-frontend",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    description: "We're looking for a Senior Frontend Engineer to help build the future of e-commerce. You'll work with React, TypeScript, and Next.js to create exceptional user experiences.",
    requirements: ["5+ years of experience with React", "Strong TypeScript skills", "Experience with Next.js", "Excellent communication skills"],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $140,000",
    description: "Join our design team to create beautiful, intuitive interfaces that millions of users interact with daily.",
    requirements: ["3+ years of product design experience", "Proficiency in Figma", "Strong portfolio", "Experience with design systems"],
  },
  {
    id: "marketing-manager",
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    description: "Drive user acquisition and growth through data-driven marketing campaigns.",
    requirements: ["4+ years in growth marketing", "Experience with paid acquisition", "Strong analytical skills", "SEO/SEM expertise"],
  },
  {
    id: "customer-success",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$70,000 - $95,000",
    description: "Help our customers succeed! You'll be the bridge between our product and customers.",
    requirements: ["2+ years in customer success", "Excellent interpersonal skills", "Technical aptitude", "Experience with CRM tools"],
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $150,000",
    description: "Build scalable APIs and services that power our platform.",
    requirements: ["4+ years of backend development", "Experience with Node.js or Python", "Database design skills", "Cloud infrastructure knowledge"],
  },
  {
    id: "sales-rep",
    title: "Enterprise Sales Representative",
    department: "Sales",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80,000 - $120,000 + Commission",
    description: "Drive revenue by selling our enterprise solutions to large organizations.",
    requirements: ["5+ years of B2B sales experience", "Track record of exceeding quotas", "Experience with enterprise deals", "Strong presentation skills"],
  },
];

export interface Benefit {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision insurance for you and your family." },
  { icon: Globe, title: "Remote Work", description: "Work from anywhere in the world with flexible hours and async culture." },
  { icon: Gift, title: "Equity & Compensation", description: "Competitive salary with equity options so you share in our success." },
  { icon: Coffee, title: "Work-Life Balance", description: "Unlimited PTO, parental leave, and sabbatical programs." },
  { icon: Zap, title: "Learning & Development", description: "$5,000 annual budget for courses, conferences, and books." },
  { icon: Users, title: "Team Events", description: "Quarterly team retreats and annual company offsite." },
];

export interface Value {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const values: Value[] = [
  { icon: Cpu, title: "Innovation First", description: "We push boundaries and embrace new technologies." },
  { icon: Building, title: "Customer Obsessed", description: "Every decision starts with the customer in mind." },
  { icon: Users, title: "Team Powered", description: "We believe in collaboration and mutual growth." },
];
