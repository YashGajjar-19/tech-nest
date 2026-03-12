import { Suspense } from "react";
import { DeviceHero } from "@/features/device/device-hero";
import { DeviceScores } from "@/features/device/device-scores";
import { DeviceAIInsights } from "@/features/device/device-ai-insights";
import { DeviceSpecs } from "@/features/device/device-specs";
import { DeviceAlternatives } from "@/features/device/device-alternatives";
import { 
  DeviceHeroSkeleton, 
  DeviceScoresSkeleton, 
  DeviceAIInsightsSkeleton, 
  DeviceSpecsSkeleton 
} from "@/features/device/skeletons";

import { fetchDeviceById } from "@/lib/api";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const device = await fetchDeviceById(params.slug);
  const deviceName = device?.name || (params.slug || "Device").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  
  // Try to use AI summary or fallback
  const description = `${deviceName} reviews, scores, and buying advice.`;
  // Assuming device AI insights or similar is available or we just use a generic SEO optimized string until we add ai_insights to fetchDeviceById payload
  
  return {
    title: `${deviceName} Review & Score | Tech Nest`,
    description: description,
  };
}

export default async function DevicePage({ params }: { params: { slug: string } }) {
  // Extract slug - optionally await if Next.js 15+ 
  const slug = params?.slug || "iphone-16-pro";

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-surface-elevated/50 flex flex-col w-full pb-32">
      
      <Suspense fallback={<DeviceHeroSkeleton />}>
        <DeviceHero slug={slug} />
      </Suspense>

      <Suspense fallback={<DeviceScoresSkeleton />}>
        <DeviceScores slug={slug} />
      </Suspense>

      <div className="h-8"></div>

      <Suspense fallback={<DeviceAIInsightsSkeleton />}>
        <DeviceAIInsights slug={slug} />
      </Suspense>

      <div className="h-8"></div>

      <Suspense fallback={<DeviceSpecsSkeleton />}>
        <DeviceSpecs slug={slug} />
      </Suspense>

      <div className="h-8"></div>

      <DeviceAlternatives slug={slug} />

    </main>
  );
}
