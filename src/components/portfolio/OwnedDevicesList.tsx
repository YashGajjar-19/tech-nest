import {
  Smartphone,
  Laptop,
  Plus,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_OWNED_DEVICES = [
  {
    id: "1",
    name: "iPhone 13 Pro",
    type: "smartphone",
    purchaseDate: "Oct 2021",
    purchasePrice: 999,
    currentValue: 340,
    depreciation: 66,
    aiRecommendation: "Approaching Optimal Upgrade Window",
    urgency: "medium", // low, medium, high
  },
  {
    id: "2",
    name: "MacBook Pro 14 (M1 Pro)",
    type: "laptop",
    purchaseDate: "Feb 2022",
    purchasePrice: 1999,
    currentValue: 1100,
    depreciation: 45,
    aiRecommendation: "Hold - Performance remains top tier",
    urgency: "low",
  },
];

export function OwnedDevicesList() {
  return (
    <Card className="border-border-subtle bg-surface shadow-none overflow-hidden text-clip p-0">
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-6">
        <div className="space-y-1.5 focus:outline-none">
          <CardTitle className="text-xl font-medium tracking-tight">
            Owned Devices
          </CardTitle>
          <CardDescription>
            Track the lifecycle and value of your technology.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Add Device
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border-subtle">
          {MOCK_OWNED_DEVICES.map((device) => (
            <div
              key={device.id}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-bg-primary/50 transition-colors"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-bg-primary border border-border-subtle flex items-center justify-center text-text-secondary">
                  {device.type === "smartphone" ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-text-primary text-base">
                    {device.name}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Purchased {device.purchaseDate} for ${device.purchasePrice}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-8">
                {/* Financials */}
                <div className="flex flex-col sm:items-end">
                  <span className="text-sm text-text-secondary mb-1">
                    Est. Value
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-text-primary">
                      ${device.currentValue}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                      <TrendingDown className="w-3 h-3" />
                      {device.depreciation}%
                    </span>
                  </div>
                </div>

                {/* AI Rec */}
                <div className="hidden md:flex flex-col items-end w-48 text-right">
                  <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">
                    AI Analyst
                  </span>
                  <span
                    className={`text-sm font-medium ${device.urgency === "medium" ? "text-orange-400" : "text-emerald-500"}`}
                  >
                    {device.aiRecommendation}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-text-secondary hover:text-text-primary"
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
