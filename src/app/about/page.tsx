"use client";

import { motion } from "framer-motion";
import {
  AboutHero,
  AboutStory,
  AboutStats,
  AboutTeam,
  AboutCTA,
} from "@/components/about";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <AboutHero />
      
      <AboutStory />
      
      <AboutStats />
      
      <AboutTeam />
      
      <AboutCTA />
    </div>
  );
}