import Link from "next/link";
import { fetchDeviceById } from "@/lib/api";

export async function DeviceHero({ slug }: { slug: string }) {
  const device = await fetchDeviceById(slug);
  
  // Un-slugify title safely
  const fallbackName = (slug || "iphone-16-pro").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const deviceName = device?.name || fallbackName;
  const price = device?.specs?.price ? `$${device.specs.price}` : "Starting at $999";
  const release = device?.specs?.release_date ? `Release: ${device.specs.release_date}` : "Release: Q3 2024";

  return (
    <section className="relative w-full min-h-[50vh] flex flex-col items-center pt-[20vh] pb-16 border-b border-border-subtle bg-bg-secondary overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
      <div className="z-10 text-center max-w-4xl px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="w-56 h-72 bg-linear-to-b from-surface to-bg-primary rounded-3xl border border-border-subtle shadow-2xl mb-12 flex items-center justify-center transition-transform hover:scale-105 duration-700 overflow-hidden relative">
           {device?.image_url ? (
             <img src={device.image_url} alt={deviceName} className="object-cover w-full h-full opacity-80" />
           ) : (
             <span className="text-text-secondary text-sm tracking-widest uppercase">Hardware</span>
           )}
        </div>

        {/* Premium Typography Hierarchy */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-text-primary mb-6">
          {deviceName}
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-2xl font-light">
          {price} &middot; {release}
        </p>

        <div className="flex gap-4 items-center">
          <Link href={`/compare/${slug}-vs-galaxy-s24-ultra`}>
            <div className="bg-surface border border-border-subtle text-text-primary font-medium rounded-full px-8 py-3 hover:border-text-secondary transition backdrop-blur-md shadow-sm">
              Compare Device
            </div>
          </Link>
          <button className="bg-accent text-accent-foreground font-medium rounded-full px-8 py-3 hover:opacity-90 transition shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-300">
            Check Prices
          </button>
        </div>
      </div>
    </section>
  );
}
