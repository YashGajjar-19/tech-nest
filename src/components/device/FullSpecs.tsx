export default function FullSpecs() {
  const specGroups = [
    {
      category: "Display",
      items: [
        { label: "Display Size", value: "6.2 inches" },
        { label: "Resolution", value: "2400 × 1080" },
        { label: "Refresh Rate", value: "120Hz" },
      ]
    },
    {
      category: "Performance",
      items: [
        { label: "Chipset", value: "Google Tensor G3" },
        { label: "RAM", value: "8GB LPDDR5X" },
        { label: "Storage", value: "128GB / 256GB UFS 3.1" },
      ]
    },
    {
      category: "Camera",
      items: [
        { label: "Primary", value: "50 MP, f/1.68, 1/1.31\" sensor" },
        { label: "Ultrawide", value: "12 MP, f/2.2, 125˚ FOV" },
        { label: "Front Camera", value: "10.5 MP, f/2.2" },
      ]
    },
    {
      category: "Battery",
      items: [
        { label: "Capacity", value: "4575 mAh" },
        { label: "Charging", value: "27W wired, 18W wireless" },
      ]
    }
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t">
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-foreground">Full Specifications</h2>
      </div>
      
      <div className="flex flex-col gap-12">
        {specGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{group.category}</h3>
            <div className="border rounded-2xl overflow-hidden bg-card">
              <table className="w-full text-left text-[14px] border-collapse">
                <tbody>
                  {group.items.map((item, iIdx) => (
                    <tr key={iIdx} className="border-b last:border-0 hover:bg-muted/5 transition-colors">
                      <td className="w-1/3 text-muted-foreground px-6 py-4 font-medium align-top bg-muted/10 border-r">{item.label}</td>
                      <td className="text-foreground px-6 py-4 font-medium align-top leading-relaxed">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
