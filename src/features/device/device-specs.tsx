import { fetchDeviceById } from "@/lib/api";
import { Cpu, Eye, Battery } from "lucide-react";

export async function DeviceSpecs({ slug }: { slug: string }) {
  const device = await fetchDeviceById(slug);

  const chip = device?.specs?.processor || "A18 Pro (3nm)";
  const chipDetails = "Integrated NPU Engine";

  const display = device?.specs?.display || `6.3" LTPO OLED`;
  const displayDetails = "120Hz ProMotion";

  const battery = device?.specs?.battery || "3,582 mAh";
  const batteryDetails = "Fast charging support";

  return (
    <section className="px-6 max-w-6xl mx-auto w-full mt-12 animate-in fade-in duration-500 delay-300">
      <h2 className="text-3xl font-semibold tracking-tight mb-12">
        Key Specifications
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-border-subtle p-8 rounded-4xl shadow-sm hover:shadow-md transition duration-500 group">
          <Cpu className="w-8 h-8 text-text-secondary mb-6 group-hover:text-accent transition-colors" />
          <div className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-2">
            Processor
          </div>
          <div className="text-2xl font-medium tracking-tight">{chip}</div>
          <div className="text-sm text-text-secondary mt-2">{chipDetails}</div>
        </div>

        <div className="bg-surface border border-border-subtle p-8 rounded-4xl shadow-sm hover:shadow-md transition duration-500 group">
          <Eye className="w-8 h-8 text-text-secondary mb-6 group-hover:text-accent transition-colors" />
          <div className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-2">
            Display
          </div>
          <div className="text-2xl font-medium tracking-tight">{display}</div>
          <div className="text-sm text-text-secondary mt-2">
            {displayDetails}
          </div>
        </div>

        <div className="bg-surface border border-border-subtle p-8 rounded-4xl shadow-sm hover:shadow-md transition duration-500 group">
          <Battery className="w-8 h-8 text-text-secondary mb-6 group-hover:text-accent transition-colors" />
          <div className="text-sm font-semibold tracking-wider text-text-secondary uppercase mb-2">
            Battery
          </div>
          <div className="text-2xl font-medium tracking-tight">{battery}</div>
          <div className="text-sm text-text-secondary mt-2">
            {batteryDetails}
          </div>
        </div>
      </div>
    </section>
  );
}
