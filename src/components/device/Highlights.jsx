import { Monitor, Cpu, Camera, Battery, Shield, Code } from "lucide-react";

export default function Highlights ( { device } )
{
    const highlights = [
        {
            id: 'display',
            icon: Monitor,
            title: "Display",
            summary: "6.8\" LTPO AMOLED",
            sub: "120Hz smooth refresh rate"
        },
        {
            id: 'performance',
            icon: Cpu,
            title: "Performance",
            summary: "Snapdragon 8 Gen 3",
            sub: "Top tier gaming power"
        },
        {
            id: 'camera',
            icon: Camera,
            title: "Camera",
            summary: "200MP Main",
            sub: "Professional-grade optics"
        },
        {
            id: 'battery',
            icon: Battery,
            title: "Battery",
            summary: "5000mAh",
            sub: "All-day endurance"
        },
        {
            id: 'build',
            icon: Shield,
            title: "Build",
            summary: "Titanium Frame",
            sub: "IP68 water resistant"
        },
        {
            id: 'software',
            icon: Code,
            title: "Software",
            summary: "Android 14",
            sub: "7 years of updates"
        }
    ];

    return (
        <section className="mb-24">
            <h2 className="text-2xl font-bold mb-8 text-text-primary uppercase tracking-tight">At a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                { highlights.map( item => (
                    <div key={ item.id } className="bg-bg-card border border-border-color rounded-3xl p-6 hover:border-text-secondary/30 transition-colors group">
                        <item.icon size={ 28 } className="text-hyper-cyan mb-4 group-hover:scale-110 transition-transform duration-500 ease-spring" />
                        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{ item.title }</h3>
                        <p className="font-semibold text-lg text-text-primary leading-tight mb-1">{ item.summary }</p>
                        <p className="text-sm text-text-secondary">{ item.sub }</p>
                    </div>
                ) ) }
            </div>
        </section>
    );
}
