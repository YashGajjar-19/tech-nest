"use client";

import { ChevronDown, Cpu, Camera, Battery, Monitor, Smartphone, LayoutTemplate } from "lucide-react";
import { useState } from "react";

export default function SmartSpecs({ device }: { device?: any }) {
  const [expanded, setExpanded] = useState(false);

  // If we have actual specs from the backend, we can map them here instead of using the mock, for now we will keep the structured mock but allow override
  const specCategories = [
    {
      category: "Performance",
      icon: <Cpu className="w-5 h-5" />,
      items: [
        { label: "Chip", value: "A18 Pro (3nm)" },
        { label: "RAM", value: "8GB LPDDR5X" },
        { label: "Storage", value: "256GB / 512GB / 1TB" },
        { label: "OS", value: "iOS 18 (7 years support)" },
      ],
    },
    {
      category: "Cameras",
      icon: <Camera className="w-5 h-5" />,
      items: [
        { label: "Main", value: "48MP, f/1.78, 24mm" },
        { label: "Ultrawide", value: "48MP, f/2.2, 13mm" },
        { label: "Telephoto", value: "12MP, f/2.8, 120mm (5x)" },
        { label: "Video", value: "4K@120fps Dolby Vision" },
      ],
    },
    {
      category: "Battery",
      icon: <Battery className="w-5 h-5" />,
      items: [
        { label: "Capacity", value: "4,685 mAh" },
        { label: "Wired", value: "Up to 30W (50% in 30 min)" },
        { label: "Wireless", value: "25W MagSafe" },
        { label: "Endurance", value: "22h Video Playback" },
      ],
    },
    {
      category: "Display",
      icon: <Monitor className="w-5 h-5" />,
      items: [
        { label: "Type", value: "Super Retina XDR OLED" },
        { label: "Size", value: "6.3 inches" },
        { label: "Resolution", value: "2622 x 1206 pixels" },
        { label: "Refresh Rate", value: "1-120Hz ProMotion" },
      ],
    },
    {
      category: "Design",
      icon: <Smartphone className="w-5 h-5" />,
      items: [
        { label: "Material", value: "Grade 5 Titanium" },
        { label: "Dimensions", value: "149.6 x 71.5 x 8.3 mm" },
        { label: "Weight", value: "199 g" },
        { label: "Durability", value: "IP68 + Ceramic Shield" },
      ],
    },
    {
      category: "Software",
      icon: <LayoutTemplate className="w-5 h-5" />,
      items: [
        { label: "Intelligence", value: "Apple Intelligence (On-device)" },
        { label: "Multitasking", value: "Dynamic Island + Action Button" },
        { label: "Ecosystem", value: "Seamless Mac/iPad integration" },
      ],
    },
  ];

  const visibleCategories = expanded ? specCategories : specCategories.slice(0, 4);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-16 border-t bg-background">
      <div className="flex flex-col mb-12">
        <h2 className="text-3xl font-medium tracking-tight text-text-primary">
          Smart Specs System
        </h2>
        <p className="text-text-secondary text-sm font-medium mt-2">
          Meaningful architecture without the manual reading.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
        {visibleCategories.map((section, idx) => (
          <div key={idx} className="flex flex-col border-b pb-6 last:border-b-0 md:last:border-b-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-text-primary/5 flex items-center justify-center text-text-secondary">
                {section.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary tracking-tight">
                {section.category}
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 text-[15px]">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start gap-4">
                  <span className="text-text-secondary text-sm shrink-0">{item.label}</span>
                  <span className="text-text-primary text-sm font-medium text-right tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 flex justify-center">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-border-subtle hover:bg-surface-elevated text-text-primary transition-colors text-sm font-medium active:bg-surface-elevated/50"
        >
          {expanded ? "Show Less" : "View All Specs"}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-calm ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </section>
  );
}
