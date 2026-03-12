import Link from "next/link";
import { DeviceCardSkeleton } from "@/features/device/device-card-skeleton"; // Needs to be created
import { DecisionCard } from "@/features/device/device-card";
import { Suspense } from "react";
import { fetchDevices, fetchDeviceDecision } from "@/lib/api";

const FALLBACK_IMAGES: Record<string, string> = {
  dev1: "https://images.unsplash.com/photo-1736691459585-703eaeb720ca?w=800&q=80",
  dev2: "https://images.unsplash.com/photo-1707227155604-bb56df2e2ef9?w=800&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=800&q=80";

async function TrendingDevicesList() {
  const devices = await fetchDevices(undefined, 3) || [];
  
  const enrichedDevices = await Promise.all(
    devices.map(async (device: any) => {
      const decision = await fetchDeviceDecision(device.id);
      return {
        id: device.id,
        name: device.name,
        brand: device.brand || "Unknown Brand",
        score: decision ? Math.round(decision.tech_nest_score * 10) : 0, 
        price: device.price ? `$${device.price}` : "N/A",
        highlights: decision?.ai_verdict?.strengths?.slice(0, 3) || ["Great display", "Fast processor", "All-day battery"],
      };
    })
  );

  // If backend fails or returns empty, show empty state instead of faking data.
  if (enrichedDevices.length === 0) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-text-secondary py-12">
        <p>No trending devices available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {enrichedDevices.map((d: any) => (
        <DecisionCard
          key={d.id}
          id={d.id}
          name={d.name}
          brand={d.brand}
          score={d.score}
          price={d.price}
          highlights={d.highlights}
          href={`/device/${d.id}`}
        />
      ))}
    </>
  );
}

export function TrendingSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-border-subtle" id="trending">
      <div className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">Trending Devices</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={
            <>
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
            </>
          }>
            <TrendingDevicesList />
          </Suspense>
      </div>
    </section>
  );
}
