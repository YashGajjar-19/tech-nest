export default function HeroCTAs() {
  return (
    // On mobile: horizontal scroll row (no wrapping). On desktop: wrapped flex.
    <div className="w-full mt-6 sm:mt-8">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto sm:flex-wrap sm:justify-center px-4 sm:px-0 pb-1 scrollbar-hide">
        {["Best Phones 2026", "Compare Devices", "Ask AI", "Top Rated"].map(
          (chip) => (
            <button
              key={chip}
              className="shrink-0 h-10 sm:h-10 px-4 sm:px-5 rounded-full border border-border-subtle bg-transparent hover:bg-text-primary/5 active:bg-text-primary/10 hover:border-text-primary/10 text-text-secondary hover:text-text-primary text-sm font-medium transition-colors flex items-center justify-center whitespace-nowrap"
            >
              {chip}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
