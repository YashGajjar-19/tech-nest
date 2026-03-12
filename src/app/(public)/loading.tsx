

export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-bg-primary pt-[15vh] px-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 w-full">
        <div className="h-10 w-1/3 bg-surface border border-border-subtle rounded-xl animate-pulse" />
        <div className="h-4 w-1/2 bg-surface border border-border-subtle rounded-xl animate-pulse" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-surface border border-border-subtle rounded-3xl animate-pulse w-full shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
