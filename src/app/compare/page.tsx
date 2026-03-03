"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ComparisonHero from "@/components/compare/ComparisonHero";
import AIVerdict from "@/components/compare/AIVerdict";
import CategoryWinners from "@/components/compare/CategoryWinners";
import ExperienceDifferences from "@/components/compare/ExperienceDifferences";
import SpecComparison from "@/components/compare/SpecComparison";
import SmartAlternatives from "@/components/compare/SmartAlternatives";
import DecisionCTA from "@/components/compare/DecisionCTA";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary antialiased font-sans selection:bg-surface selection:text-accent-foreground">
      <main className="flex flex-col items-center overflow-x-hidden">
        {/* Sections following the precise blueprint */}
        <ComparisonHero />
        <AIVerdict />
        <CategoryWinners />
        <ExperienceDifferences />
        <SpecComparison />
        <SmartAlternatives />
        <DecisionCTA />
      </main>
    </div>
  );
}
