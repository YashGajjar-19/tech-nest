import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { MarketHeader } from "@/components/market/MarketHeader";
import { MarketEventFeed } from "@/components/market/MarketEventFeed";

export const metadata: Metadata = {
  title: "Market Intelligence | Tech Nest",
  description: "Technology market shifts, price drops, and acquisition logic.",
};

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-24">
      <Container className="max-w-5xl">
        <div className="space-y-12">
          <MarketHeader />
          <MarketEventFeed />
        </div>
      </Container>
    </div>
  );
}
