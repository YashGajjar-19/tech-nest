import { Scale, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MOCK_PIPELINE = [
  {
    id: "d1",
    title: "S24 Ultra vs iPhone 15 Pro Max",
    date: "2 Days Ago",
    status: "Exploring",
    topRecommendation: "Samsung Galaxy S24 Ultra",
    confidence: 88,
  },
  {
    id: "d2",
    title: "Wait for M4 MacBook Air?",
    date: "1 Week Ago",
    status: "Hold",
    topRecommendation: "Pending Market Shift",
    confidence: 95,
  }
];

export function DecisionPipeline() {
  return (
    <Card className="border-border-subtle bg-surface shadow-none overflow-hidden p-0">
      <CardHeader className="flex flex-row items-center justify-between pb-6 pt-6 px-6">
        <div className="space-y-1.5 focus:outline-none">
          <CardTitle className="text-xl font-medium tracking-tight">Decision Pipeline</CardTitle>
          <CardDescription>Active comparisons and intelligence tracking.</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-border-subtle">
           {MOCK_PIPELINE.map((decision) => (
              <div key={decision.id} className="p-6 hover:bg-bg-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <Scale className="w-5 h-5 text-text-secondary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-text-primary text-base inline-flex gap-2 items-center">
                        {decision.title}
                      </h3>
                      <div className="flex gap-2 items-center text-xs text-text-secondary mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Saved {decision.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex py-1 px-3 border border-border-subtle rounded-full text-xs font-semibold uppercase tracking-widest text-text-secondary bg-bg-primary">
                    {decision.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                  <div className="flex flex-col bg-bg-primary rounded-xl px-4 py-3 border border-border-subtle w-full max-w-sm">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-medium text-text-secondary uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-brand" /> AI Lean</span>
                       <span className="text-xs text-brand font-semibold text-right">{decision.confidence}% Confident</span>
                    </div>
                    <span className="text-sm font-semibold text-text-primary truncate">{decision.topRecommendation}</span>
                  </div>
                  <Button variant="ghost" asChild className="shrink-0 group">
                    <Link href={`/compare`}>
                      Resume Decision <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </Button>
                </div>
              </div>
           ))}
        </div>
      </CardContent>
    </Card>
  );
}
