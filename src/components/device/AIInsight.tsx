import { Sparkles } from "lucide-react";

export default function AIInsight() {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-card border flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-brand" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">AI Insight</h2>
      </div>

      <div className="bg-card border rounded-[1.5rem] p-8 mb-8">
        <p className="text-[16px] leading-relaxed text-foreground/90 font-medium whitespace-pre-line">
          The Pixel 8 is an excellent choice for users who prioritize camera
          quality and clean software. It delivers one of the best smartphone
          photography experiences in its price range.
          {"\n\n"}
          However, battery life and charging speed are average compared to
          competitors like the Galaxy S24.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Pros
          </h3>
          <ul className="flex flex-col gap-2">
            <li className="text-green-600 dark:text-green-400 text-[14px] font-medium px-4 py-2.5 bg-green-500/10 rounded-xl">
              + Excellent camera
            </li>
            <li className="text-green-600 dark:text-green-400 text-[14px] font-medium px-4 py-2.5 bg-green-500/10 rounded-xl">
              + Clean Android
            </li>
            <li className="text-green-600 dark:text-green-400 text-[14px] font-medium px-4 py-2.5 bg-green-500/10 rounded-xl">
              + Compact design
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Cons
          </h3>
          <ul className="flex flex-col gap-2">
            <li className="text-red-600 dark:text-red-400 text-[14px] font-medium px-4 py-2.5 bg-red-500/10 rounded-xl">
              - Slower charging
            </li>
            <li className="text-red-600 dark:text-red-400 text-[14px] font-medium px-4 py-2.5 bg-red-500/10 rounded-xl">
              - Average battery
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
