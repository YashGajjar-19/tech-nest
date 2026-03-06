import Link from "next/link";
import { Smartphone, Laptop, Watch, Headphones, Camera } from "lucide-react";

export function CategorySection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full">
       <div className="mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary">Explore Categories</h2>
       </div>

       <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
             { icon: Smartphone, label: "Phones", href: "/phones" },
             { icon: Laptop, label: "Laptops", href: "/laptops" },
             { icon: Watch, label: "Wearables", href: "/wearables" },
             { icon: Headphones, label: "Audio", href: "/audio" },
             { icon: Camera, label: "Cameras", href: "/cameras" }
          ].map((cat) => (
             <Link key={cat.label} href={cat.href} className="group bg-surface border border-border-subtle hover:border-accent p-8 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                <cat.icon className="w-10 h-10 mb-6 text-text-secondary group-hover:text-text-primary transition-colors" />
                <span className="font-semibold text-lg tracking-tight">{cat.label}</span>
             </Link>
          ))}
       </div>
    </section>
  );
}
