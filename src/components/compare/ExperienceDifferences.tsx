import React from "react";

export default function ExperienceDifferences() {
  const experiences = [
    {
      title: "The Camera Philosophy",
      iphone: "Apple prefers 'What you see is what you get.' Photos are generally warmer, more natural, and highly consistent. Video recording is miles ahead with smooth transitions and unmatched stabilization.",
      galaxy: "Samsung leans toward 'Make it pop.' Photos are vibrant, sharpened, and instantly ready for social media. The 5x optical zoom lens allows for dramatic compression and far superior concert/wildlife shots."
    },
    {
      title: "Daily Friction & OS Flow",
      iphone: "iOS relies on fluid, unbreakable animations and strict ecosystem rules. Everything from adjusting volume to opening a notification feels heavy and smooth. However, notification management remains messy compared to Android.",
      galaxy: "One UI is incredibly dense with features. You can resize windows, split screen almost anything, and use the S-Pen for precise selection. It's a pocket PC, but sometimes that immense capability comes with occasional animation stutters or overwhelming menus."
    },
    {
      title: "Battery & Heat Management",
      iphone: "Outstanding standby time. You can leave the iPhone unplugged overnight and lose maybe 2%. It manages heat well during everyday tasks, though aggressive gaming can cause the titanium frame to warm up noticeably.",
      galaxy: "Excellent active usage time, especially with the vapor chamber cooling that keeps the phone icy during gaming. Standby isn't quite as magical as iOS, but rapid charging gets you back to 100% significantly faster."
    }
  ];

  return (
    <section className="w-full px-6 lg:px-12 py-24 flex justify-center border-t border-border-subtle">
      <div className="w-full max-w-4xl">
        <div className="text-left mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-text-primary mb-6">
            Beyond the Spec Sheet
          </h2>
          <p className="text-text-secondary text-lg">
            How these devices actually feel in your hand, separate from marketing terminology and benchmark scores.
          </p>
        </div>

        <div className="space-y-16">
          {experiences.map((exp, index) => (
            <div key={index} className="grid md:grid-cols-12 gap-6 md:gap-12">
              <div className="md:col-span-4">
                <h3 className="text-xl font-medium text-text-primary sticky top-32">
                  {exp.title}
                </h3>
              </div>
              
              <div className="md:col-span-8 space-y-8">
                <div className="p-6 rounded-2xl bg-surface border border-border-subtle">
                  <div className="text-sm font-semibold text-text-secondary mb-3 tracking-wide uppercase">iPhone Experience</div>
                  <p className="text-text-primary leading-relaxed font-light">{exp.iphone}</p>
                </div>
                
                <div className="p-6 rounded-2xl bg-surface border border-border-subtle">
                  <div className="text-sm font-semibold text-text-secondary mb-3 tracking-wide uppercase">Galaxy Experience</div>
                  <p className="text-text-primary leading-relaxed font-light">{exp.galaxy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
