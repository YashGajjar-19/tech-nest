export default function AdminLoading() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 w-full">
          <div className="w-48 h-10 bg-foreground/5 rounded-2xl animate-pulse" />
          <div className="w-full max-w-lg h-16 bg-foreground/5 rounded-2xl animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-foreground/5 rounded-4xl border border-border animate-pulse shadow-sm" />
        ))}
      </div>
    </div>
  );
}
