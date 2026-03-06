import { fetchDeviceDecision, fetchDeviceById } from "@/lib/api";
import { Zap, CheckCircle2 } from "lucide-react";

export async function DeviceAIInsights({ slug }: { slug: string }) {
  const decision = await fetchDeviceDecision(slug);
  const device = await fetchDeviceById(slug);
  const deviceName =
    device?.name ||
    (slug || "Device")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  // Use real data from API or fallback
  const summary =
    decision?.ai_verdict?.summary ||
    `Iterative perfection focused largely on software for the ${deviceName}.`;
  const strengths = decision?.ai_verdict?.strengths || [
    "Unmatched CPU efficiency and sustained heat dispersion",
    "Reduced chassis weight",
    "Noticeable battery life improvements",
  ];
  const weaknesses = decision?.ai_verdict?.weaknesses || [
    "Highly iterative visual design upgrade",
    "Peak charging speeds remain comparatively slow",
  ];

  return (
    <section className="px-6 max-w-5xl mx-auto w-full mt-12 animate-in fade-in duration-500 delay-150">
      <div className="border border-border-subtle rounded-[2.5rem] bg-surface shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10 group-hover:bg-accent/10 transition-colors duration-1000" />

        <div className="p-10 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Verdict */}
          <div className="lg:w-1/2">
            <div className="flex items-center text-accent font-medium mb-6">
              <Zap className="w-5 h-5 mr-3" />{" "}
              <span className="tracking-wide">AI VERDICT</span>
            </div>
            <h3 className="text-3xl font-semibold mb-6 tracking-tight leading-tight">
              {summary.split(".")[0] + "."}
            </h3>
            <p className="text-lg text-text-secondary leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Pros / Cons grid */}
          <div className="lg:w-1/2 space-y-8 flex flex-col justify-center">
            <div>
              <h5 className="font-semibold text-text-primary text-base flex items-center mb-4 uppercase tracking-wider">
                <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500" />{" "}
                Strengths
              </h5>
              <ul className="text-base space-y-3 text-text-secondary pl-8">
                {strengths.map((str: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-3 text-text-primary opacity-50">•</span>
                    {str}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-px w-full bg-border-subtle"></div>
            <div>
              <h5 className="font-semibold text-text-primary text-base flex items-center mb-4 uppercase tracking-wider">
                <span className="w-5 h-5 mr-3 bg-text-secondary rounded-full flex items-center justify-center text-xs text-surface font-bold">
                  !
                </span>{" "}
                Weaknesses
              </h5>
              <ul className="text-base space-y-3 text-text-secondary pl-8">
                {weaknesses.map((w: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-3 text-text-primary opacity-50">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
