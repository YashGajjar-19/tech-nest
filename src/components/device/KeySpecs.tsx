export default function KeySpecs() {
  const specs = [
    { label: "Display", value: "6.2\" OLED • 120Hz" },
    { label: "Chipset", value: "Google Tensor G3" },
    { label: "Camera", value: "50MP main" },
    { label: "Battery", value: "4575mAh" },
    { label: "OS", value: "Android 14" },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t">
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground">Key Specifications</h2>
      </div>
      <div className="flex flex-col gap-2">
        {specs.map((spec, idx) => (
          <div key={idx} className="flex justify-between items-center py-4 border-b border-border/50 last:border-0 last:pb-0">
             <span className="text-muted-foreground text-sm font-medium">{spec.label}</span>
             <span className="text-foreground text-[15px] font-medium text-right">{spec.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
