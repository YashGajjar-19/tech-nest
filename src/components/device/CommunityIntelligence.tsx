import { ThumbsUp, MessageSquare, Wrench } from "lucide-react";

export default function CommunityIntelligence() {
  const experiences = [
    {
      author: "Alex_Tech",
      type: "Power User",
      text: "The new thermal system actually works. I rendered a 4 minute 4K video in LumaFusion and it barely got warm compared to my 15 Pro which used to dim the screen.",
      likes: 342,
    },
    {
      author: "Sarah_Shoots",
      type: "Photographer",
      text: "Photographic Styles are a game changer. Set it to 'Rich Contrast' immediately to fix the default flat Apple look. It bakes it into the RAW file.",
      likes: 891,
    }
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t bg-background">
      <div className="flex flex-col mb-12">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Community Intelligence
        </h2>
        <p className="text-muted-foreground text-[15px] mt-2">
          Real world behaviors, tweaks, and ownership experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Tips and Tweaks */}
        <div className="flex flex-col p-8 rounded-3xl bg-card border col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-5 h-5 text-foreground" />
            <h3 className="font-semibold text-foreground">Required Tweaks</h3>
          </div>
          <ul className="flex flex-col gap-6">
            <li className="flex flex-col gap-1">
              <span className="text-foreground font-medium text-sm">Disable True Tone</span>
              <span className="text-muted-foreground text-sm">OLED calibration is very warm out of the box. True tone makes it muddy.</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-foreground font-medium text-sm">Limit Charge to 80%</span>
              <span className="text-muted-foreground text-sm">New iOS 18 setting helps preserve battery health drastically over 2 years.</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-foreground font-medium text-sm">Remap Action Button</span>
              <span className="text-muted-foreground text-sm">The default flashlight is a waste. Map it to instantly open the ChatGPT app.</span>
            </li>
          </ul>
        </div>

        {/* Real User Experiences */}
        <div className="flex flex-col gap-6 col-span-1 md:col-span-2">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-foreground" />
            <h3 className="font-semibold text-foreground">Verified Ownership Reports</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {experiences.map((exp, idx) => (
              <div key={idx} className="flex flex-col p-6 rounded-2xl bg-card border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-[10px] font-bold text-foreground">
                    {exp.author.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-foreground">@{exp.author}</span>
                    <span className="text-[11px] text-muted-foreground">{exp.type}</span>
                  </div>
                </div>
                
                <p className="text-[14px] text-muted-foreground leading-relaxed flex-1 italic mb-4">
                  "{exp.text}"
                </p>
                
                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground mt-auto">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {exp.likes} found helpful
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
