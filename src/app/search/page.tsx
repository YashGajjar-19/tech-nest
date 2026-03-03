import { Suspense } from "react";
import SearchSurfaceResults from "./SearchSurfaceResults";

export const metadata = {
  title: "Decision Surface",
  description: "Your personalized technology decision orchestrated by Tech Nest AI.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const unresolvedParams = await searchParams;
  const query = typeof unresolvedParams.q === "string" ? unresolvedParams.q : "";

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
      <Suspense fallback={
        <div className="flex flex-col gap-8 opacity-40 blur-[1px] transition-all duration-500">
          <div className="h-8 w-64 bg-surface rounded-lg"></div>
          <div className="h-32 w-full bg-surface rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-surface rounded-2xl"></div>
            <div className="h-80 bg-surface rounded-2xl"></div>
          </div>
        </div>
      }>
        <SearchSurfaceResults query={query} />
      </Suspense>
    </div>
  );
}
