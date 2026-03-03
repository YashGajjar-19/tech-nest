import { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { OwnedDevicesList } from "@/components/portfolio/OwnedDevicesList";
import { DecisionPipeline } from "@/components/portfolio/DecisionPipeline";
import { PreferenceMatrix } from "@/components/portfolio/PreferenceMatrix";
import { UpgradeTimeline } from "@/components/portfolio/UpgradeTimeline";

export const metadata: Metadata = {
  title: "Portfolio | Tech Nest",
  description: "Your personal technology portfolio and intelligence hub.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-24">
      <Container>
        <div className="max-w-6xl mx-auto space-y-12">
          <PortfolioHeader />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <OwnedDevicesList />
              <DecisionPipeline />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <PreferenceMatrix />
              <UpgradeTimeline />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
