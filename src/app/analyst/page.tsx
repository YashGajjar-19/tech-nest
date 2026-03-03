import { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AnalystHeader } from "@/components/analyst/AnalystHeader";
import { QueryInterface } from "@/components/analyst/QueryInterface";
import { GenerativeWorkspace } from "@/components/analyst/GenerativeWorkspace";

export const metadata: Metadata = {
  title: "AI Analyst | Tech Nest",
  description: "Your high-bandwidth technology intelligence workspace.",
};

export default function AnalystPage() {
  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-24">
      <Container className="max-w-5xl">
        <div className="space-y-10">
          <AnalystHeader />
          <div className="space-y-6">
            <GenerativeWorkspace />
            <QueryInterface />
          </div>
        </div>
      </Container>
    </div>
  );
}
