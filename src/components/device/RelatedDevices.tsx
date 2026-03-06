import { ArrowRight } from "lucide-react";

export default function RelatedDevices() {
  const groups = [
    { title: "Competitors", devices: ["Galaxy S24", "iPhone 15"] },
    { title: "Previous Generation", devices: ["Pixel 7"] },
    { title: "Upgrade Options", devices: ["Pixel 9"] },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t">
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground">Related Devices</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {groups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-5">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">{group.title}</h3>
            <div className="flex flex-col gap-4">
              {group.devices.map((device, dIdx) => (
                <button key={dIdx} className="w-fit flex items-center gap-2 text-foreground hover:text-brand transition-colors group/btn">
                  <span className="font-medium text-[15px]">{device}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-brand" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
