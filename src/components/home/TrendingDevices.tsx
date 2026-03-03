import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { fetchDevices, fetchDeviceDecision } from "@/lib/api";

// Fallback images since our backend mock currently returns None for images
const FALLBACK_IMAGES: Record<string, string> = {
  dev1: "https://images.unsplash.com/photo-1736691459585-703eaeb720ca?w=800&q=80",
  dev2: "https://images.unsplash.com/photo-1707227155604-bb56df2e2ef9?w=800&q=80",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=800&q=80";

export default async function TrendingDevices() {
  // 1. Fetch from the Python Machine/Backend Engine
  const devices = await fetchDevices(undefined, 6) || [];

  // Wait for all decision scores and build map
  const enrichedDevices = await Promise.all(
    devices.map(async (device: any) => {
      const decision = await fetchDeviceDecision(device.id);
      return {
        id: device.id,
        name: device.name,
        chip: device.specs?.processor || "Unknown Chip",
        // The Decision Engine's Score:
        score: decision ? Math.round(decision.tech_nest_score * 10) : "N/A", 
        imgUrl: device.image_url || FALLBACK_IMAGES[device.id] || DEFAULT_IMAGE,
      };
    })
  );

  return (
    <section className="py-16 md:py-32 w-full md:max-w-5xl md:mx-auto md:px-6">
      <div className="flex items-center justify-between mb-8 px-6 md:px-0">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary/90">
          Trending
        </h2>
        <Link
          href="/devices"
          className="group flex items-center text-sm font-medium text-text-primary/50 hover:text-text-secondary/80 transition-colors"
        >
          View Database
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Mobile: horizontal snap scroll | Desktop: grid */}
      <div className="md:grid md:grid-cols-3 md:gap-8">
        {/* Mobile wrapper */}
        <div className="flex md:contents gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-6 pr-6 pb-2">
          {enrichedDevices.length > 0 ? (
            enrichedDevices.map((device) => (
              <Link
                key={device.id}
                href={`/devices/${device.id}`}
                className="group relative flex flex-col gap-4 rounded-2xl bg-text-primary/5 border border-border-subtle p-4 md:p-6 transition-all duration-300 ease-calm hover:bg-text-primary/5 hover:border-text-primary/20 hover:shadow-premium-md snap-start shrink-0 w-[70vw] sm:w-[45vw] md:w-auto"
              >
                <div className="relative aspect-square w-full rounded-xl bg-bg-primary border border-border-subtle overflow-hidden">
                  <Image
                    src={device.imgUrl}
                    alt={device.name}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300 ease-calm"
                    sizes="(max-width: 768px) 70vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                </div>
                <div className="flex flex-col gap-1 relative z-20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
                      {device.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-sm">
                      {device.score}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-primary/40 font-medium">
                    {device.chip}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-text-primary/50 w-full">
              No devices available. Make sure the Python server is running.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
