export default function VariantTable ()
{
    // Placeholder data for Variants
    const variants = [
        { id: 1, ram: "12GB", storage: "256GB", region: "Global", price: "$1,299" },
        { id: 2, ram: "12GB", storage: "512GB", region: "Global", price: "$1,419" },
        { id: 3, ram: "12GB", storage: "1TB", region: "Global", price: "$1,659" },
    ];

    return (
        <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8 text-text-primary uppercase tracking-tight">Variants & Pricing</h2>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-color">
                            <th className="py-4 text-xs font-bold text-text-secondary uppercase tracking-widest w-1/4">RAM</th>
                            <th className="py-4 text-xs font-bold text-text-secondary uppercase tracking-widest w-1/4">Storage</th>
                            <th className="py-4 text-xs font-bold text-text-secondary uppercase tracking-widest w-1/4">Region</th>
                            <th className="py-4 text-xs font-bold text-text-secondary uppercase tracking-widest w-1/4">Launch Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        { variants.map( ( v ) => (
                            <tr key={ v.id } className="hover:bg-bg-card/50 transition-colors">
                                <td className="py-4 font-mono text-sm text-text-primary">{ v.ram }</td>
                                <td className="py-4 font-mono text-sm text-text-primary">{ v.storage }</td>
                                <td className="py-4 font-mono text-sm text-text-primary">{ v.region }</td>
                                <td className="py-4 font-mono text-sm font-bold text-hyper-cyan">{ v.price }</td>
                            </tr>
                        ) ) }
                    </tbody>
                </table>
            </div>
        </section>
    );
}
