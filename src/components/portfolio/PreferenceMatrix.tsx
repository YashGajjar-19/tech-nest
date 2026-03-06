import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  SlidersHorizontal,
  Info,
  Camera,
  Battery,
  Gamepad2,
  Smartphone,
} from "lucide-react";

const PREFERENCES = [
  { label: "Camera", weight: 0.9, icon: Camera, color: "bg-blue-500" },
  { label: "Battery", weight: 0.7, icon: Battery, color: "bg-emerald-500" },
  { label: "Gaming", weight: 0.3, icon: Gamepad2, color: "bg-orange-500" },
  {
    label: "Ecosystem (Apple)",
    weight: 0.8,
    icon: Smartphone,
    color: "bg-slate-400",
  },
];

export function PreferenceMatrix() {
  return (
    <Card className="border-border-subtle bg-surface shadow-none overflow-hidden p-0">
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-6 relative">
        <div className="space-y-1.5 focus:outline-none z-10">
          <CardTitle className="text-xl font-medium tracking-tight">
            Intelligence Matrix
          </CardTitle>
          <CardDescription>How the AI weighs your decisions.</CardDescription>
        </div>
        <SlidersHorizontal className="w-5 h-5 text-text-secondary absolute right-6 top-6" />
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        <div className="text-xs text-text-secondary p-3 rounded-lg border border-brand/20 bg-brand/5 leading-relaxed mb-6 flex gap-2 items-start">
          <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <span>
            This vector data is stored locally and securely. Adjustments here
            directly alter global device scoring specifically for your sessions.
          </span>
        </div>

        <div className="space-y-5">
          {PREFERENCES.map((pref, i) => (
            <div key={i} className="group">
              <div className="flex justify-between text-sm mb-2 text-text-primary">
                <span className="flex items-center gap-2 font-medium">
                  <pref.icon className="w-4 h-4 text-text-secondary" />
                  {pref.label}
                </span>
                <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold font-mono">
                  [{pref.weight.toFixed(1)}]
                </span>
              </div>
              <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden border border-border-subtle">
                <div
                  className={`h-full ${pref.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                  style={{ width: `${pref.weight * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle flex justify-between items-center">
          <span className="text-xs text-text-secondary tracking-widest uppercase font-semibold">
            Upgrade Cadence
          </span>
          <span className="text-sm font-semibold text-text-primary bg-bg-primary px-3 py-1 border border-border-subtle rounded-full">
            3 Years
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
