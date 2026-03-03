import DeviceHero from "@/components/device/DeviceHero";
import DecisionSummary from "@/components/device/DecisionSummary";
import SmartSpecs from "@/components/device/SmartSpecs";
import AIInsightSection from "@/components/device/AIInsightSection";
import ComparisonGateway from "@/components/device/ComparisonGateway";
import CommunityIntelligence from "@/components/device/CommunityIntelligence";
import StructuredRatings from "@/components/device/StructuredRatings";
import Alternatives from "@/components/device/Alternatives";
import FinalDecisionCard from "@/components/device/FinalDecisionCard";
import { fetchDeviceById, fetchDeviceDecision } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function DevicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const device = await fetchDeviceById(slug);
  if (!device) return notFound();

  const decision = await fetchDeviceDecision(slug);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/30 flex flex-col items-center w-full">
      <DeviceHero device={device} decision={decision} />
      <DecisionSummary device={device} decision={decision} />
      <SmartSpecs device={device} />
      <AIInsightSection />
      <ComparisonGateway />
      <CommunityIntelligence />
      <StructuredRatings />
      <Alternatives />
      <FinalDecisionCard device={device} decision={decision} />
    </div>
  );
}
