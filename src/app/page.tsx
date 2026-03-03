import HeroSection from "@/components/hero/HeroSection";
import SmartSearchStrip from "@/components/home/SmartSearchStrip";
import TrendingDevices from "@/components/home/TrendingDevices";
import CompareExperience from "@/components/home/CompareExperience";
import AIDiscovery from "@/components/home/AIDiscovery";
import CategoryExplorer from "@/components/home/CategoryExplorer";
import LatestTech from "@/components/home/LatestTech";
import TrustSection from "@/components/home/TrustSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary selection:bg-brand/10 text-text-primary flex flex-col w-full overflow-x-hidden">
      <HeroSection />
      <SmartSearchStrip />
      <TrendingDevices />
      <CompareExperience />
      <AIDiscovery />
      <CategoryExplorer />
      <LatestTech />
      <TrustSection />
    </main>
  );
}
