export default function VariantsPricing() {
  const variants = [
    { config: "8GB / 128GB", price: "₹49,999" },
    { config: "8GB / 256GB", price: "₹56,999" },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16 border-t">
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-foreground">
          Variants & Pricing
        </h2>
      </div>
      <div className="border rounded-2xl overflow-hidden bg-card">
        <table className="w-full text-left text-[15px] border-collapse">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="font-semibold text-muted-foreground px-6 py-4 text-sm">
                Variant
              </th>
              <th className="font-semibold text-muted-foreground px-6 py-4 text-sm text-right">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr
                key={i}
                className="border-b last:border-0 hover:bg-muted/10 transition-colors"
              >
                <td className="text-foreground px-6 py-5 font-medium">
                  {v.config}
                </td>
                <td className="text-foreground px-6 py-5 font-medium text-right">
                  {v.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
