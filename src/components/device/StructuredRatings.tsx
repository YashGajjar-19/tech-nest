import { Camera, Gamepad2, BatteryMedium, DollarSign } from "lucide-react";

export default function StructuredRatings() {
  const ratings = [
    {
      icon: <Camera />,
      type: "Photography",
      score: 9.8,
      description: "Class leading dynamic range and 4K 120fps video.",
    },
    {
      icon: <Gamepad2 />,
      type: "Power / Gaming",
      score: 9.5,
      description: "A18 Pro prevents thermal throttling in AAA games.",
    },
    {
      icon: <BatteryMedium />,
      type: "Daily Endurance",
      score: 8.5,
      description: "Easily lasts all day, but falls short of the Max model.",
    },
    {
      icon: <DollarSign />,
      type: "Value seekers",
      score: 7.0,
      description: "A premium product with a price tag that reflects it.",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t bg-background">
      <div className="flex flex-col mb-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Structured Ratings
        </h2>
        <p className="text-muted-foreground text-[15px] mt-2">
          How it performs relative to specific use cases.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {ratings.map((rating, idx) => (
          <div key={idx} className="flex flex-col p-6 rounded-3xl bg-card border group">
             <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3 text-foreground">
                   <div className="w-10 h-10 rounded-xl bg-background border flex items-center justify-center">
                     {rating.icon}
                   </div>
                   <h3 className="font-semibold text-[17px]">{rating.type}</h3>
                </div>
                
                <div className="flex flex-col text-right">
                  <span className={`text-xl font-bold ${rating.score >= 9 ? "text-green-500" : rating.score >= 8 ? "text-yellow-500" : "text-red-500"}`}>
                    {rating.score.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                    / 10
                  </span>
                </div>
             </div>

             <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mb-4">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${rating.score >= 9 ? "bg-green-500" : rating.score >= 8 ? "bg-yellow-500" : "bg-red-500"}`}
                 style={{ width: `${(rating.score / 10) * 100}%` }}
               />
             </div>

             <p className="text-sm text-muted-foreground leading-relaxed">
               {rating.description}
             </p>
          </div>
        ))}
      </div>
    </section>
  );
}
