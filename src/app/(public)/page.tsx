import { HeroSection } from "@/features/home/hero-section";
import { TrendingSection } from "@/features/home/trending-section";
import { ComparisonsSection } from "@/features/home/comparisons-section";
import { RecommendationsSection } from "@/features/home/recommendations-section";
import { TrustSection } from "@/features/home/trust-section";

export default function Home() {
  return (
    <main className="flex flex-col w-full selection:bg-surface-elevated/50 bg-bg-primary overflow-x-hidden min-h-screen">
      <HeroSection />
      <TrendingSection />
      <ComparisonsSection />
      <RecommendationsSection />
      <TrustSection />
    </main>
  );
}
