export default function ScoreBreakdown() {
  const scores = [
    { label: "Camera", score: 92 },
    { label: "Software", score: 90 },
    { label: "Display", score: 88 },
    { label: "Performance", score: 86 },
    { label: "Design", score: 84 },
    { label: "Battery", score: 80 },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t">
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground">
          Score Breakdown
        </h2>
      </div>
      <div className="flex flex-col gap-5">
        {scores.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6">
            <div className="w-32 text-sm font-medium text-muted-foreground">
              {item.label}
            </div>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden flex">
              <div
                className="h-full bg-foreground rounded-full"
                style={{ width: `${item.score}%` }}
              />
            </div>
            <div className="w-8 text-right text-sm font-semibold text-foreground">
              {item.score}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
