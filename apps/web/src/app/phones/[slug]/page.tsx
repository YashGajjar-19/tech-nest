import type { Metadata } from "next";
import { 
  Cpu, 
  Camera, 
  Battery, 
  MonitorSmartphone, 
  Wifi, 
  Wrench, 
  Sparkles, 
  Plus,
  ChevronRight
} from "lucide-react";

interface PhoneDetail {
  slug: string;
  name: string;
  brand: string;
  releaseYear: number;
  status: string;
  price: string;
  imageUrl: string;
  overallScore: number;
  subScores: {
    camera: number;
    performance: number;
    battery: number;
    display: number;
    value: number;
  };
  specs: {
    display: Record<string, string>;
    performance: Record<string, string>;
    camera: Record<string, string>;
    battery: Record<string, string>;
    connectivity: Record<string, string>;
    build: Record<string, string>;
  };
  news: Array<{
    id: string;
    title: string;
    source: string;
    date: string;
    thumbnail: string;
  }>;
}

const mockPhone: PhoneDetail = {
  slug: "samsung-galaxy-s24-ultra",
  name: "Galaxy S24 Ultra",
  brand: "Samsung",
  releaseYear: 2024,
  status: "Available",
  price: "$1,299",
  imageUrl: "https://images.unsplash.com/photo-1706699119630-f9b0f1fae929?auto=format&fit=crop&q=80&w=600&h=800",
  overallScore: 92,
  subScores: {
    camera: 94,
    performance: 98,
    battery: 89,
    display: 96,
    value: 82,
  },
  specs: {
    display: {
      "Type": "Dynamic AMOLED 2X, 120Hz, HDR10+",
      "Size": "6.8 inches, 113.5 cm2 (~88.5% screen-to-body ratio)",
      "Resolution": "1440 x 3120 pixels, 19.5:9 ratio (~505 ppi)",
      "Protection": "Corning Gorilla Armor",
    },
    performance: {
      "OS": "Android 14, One UI 6.1",
      "Chipset": "Qualcomm Snapdragon 8 Gen 3 (4 nm)",
      "CPU": "8-core (1x3.39GHz Cortex-X4 & 3x3.1GHz & ...)",
      "GPU": "Adreno 750 (1 GHz)",
      "RAM": "12GB LPDDR5X",
      "Storage": "256GB / 512GB / 1TB UFS 4.0",
    },
    camera: {
      "Main": "200 MP, f/1.7, 24mm (wide), Laser AF, OIS",
      "Telephoto": "50 MP, f/3.4, 111mm, 5x optical zoom",
      "Ultrawide": "12 MP, f/2.2, 13mm, 120˚",
      "Video": "8K@24/30fps, 4K@30/60/120fps",
      "Selfie": "12 MP, f/2.2, 26mm (wide)",
    },
    battery: {
      "Capacity": "5000 mAh, non-removable",
      "Charging": "45W wired, 15W wireless, 4.5W reverse",
    },
    connectivity: {
      "WLAN": "Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band",
      "Bluetooth": "5.3, A2DP, LE",
      "USB": "USB Type-C 3.2, DisplayPort 1.2, OTG",
      "NFC": "Yes",
    },
    build: {
      "Dimensions": "162.3 x 79 x 8.6 mm",
      "Weight": "232 g",
      "Frame": "Titanium frame, glass front & back",
      "Resistance": "IP68 dust/water resistant (up to 1.5m)",
    }
  },
  news: [
    {
      id: "1",
      title: "Samsung Galaxy S24 Ultra Review: The AI Phone Era Begins",
      source: "TechRadar",
      date: "Jan 25, 2024",
      thumbnail: "https://images.unsplash.com/photo-1610940540024-9b87b7705177?auto=format&fit=crop&q=80&w=400&h=300",
    },
    {
      id: "2",
      title: "Galaxy S24 Ultra Camera Deep Dive: 5x Telephoto Tested",
      source: "The Verge",
      date: "Jan 28, 2024",
      thumbnail: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&q=80&w=400&h=300",
    },
    {
      id: "3",
      title: "Ultimate Drop Test: Can Titanium Save the S24 Ultra?",
      source: "CNET",
      date: "Feb 2, 2024",
      thumbnail: "https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&q=80&w=400&h=300",
    },
    {
      id: "4",
      title: "Battery Showdown: S24 Ultra vs iPhone 15 Pro Max",
      source: "Tom's Guide",
      date: "Feb 10, 2024",
      thumbnail: "https://images.unsplash.com/photo-1621330396167-85fd4fedf0e3?auto=format&fit=crop&q=80&w=400&h=300",
    }
  ]
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params; // Need to await per Next.js 15
  return {
    title: `${mockPhone.name} Specs & Reviews - Tech Nest`,
    description: `Detailed specifications, AI review summary, and latest news for the ${mockPhone.name}.`,
  };
}

export default async function PhoneDetailPage({ params }: PageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug } = await params;
  
  // Data fetching would happen here using `slug`
  const phone = mockPhone;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16 animate-tn-fade-in">
      
      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Image */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="aspect-3/4 relative rounded-2xl tn-card bg-tn-bg-secondary flex items-center justify-center p-8 overflow-hidden group">
            {/* Soft backdrop glow behind image */}
            <div className="absolute inset-0 bg-tn-accent/5 blur-3xl opacity-50 transition-opacity group-hover:opacity-100 duration-700"></div>
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={phone.imageUrl} 
              alt={phone.name} 
              className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 z-10 mix-blend-multiply dark:mix-blend-normal" 
            />
            
            <div className="absolute top-5 left-5 z-20">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tn-surface shadow-sm text-tn-text-primary uppercase tracking-wider border border-tn-border-strong">
                {phone.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Info Header & Key Specs */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="tn-label text-tn-accent">{phone.brand}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-tn-border-strong"></span>
              <span className="tn-label">{phone.releaseYear}</span>
            </div>
            <h1 className="tn-display mb-6">{phone.name}</h1>
            
            <div className="flex items-baseline space-x-3 mb-8">
              <span className="text-4xl font-bold tracking-tight text-foreground">{phone.price}</span>
              <span className="tn-label text-(--tn-text-muted)">Launch Price</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-tn-accent hover:bg-tn-accent-hover text-white font-semibold transition-all shadow-(--tn-shadow-accent) hover:-translate-y-0.5">
                <Plus className="w-5 h-5 mr-2" />
                Add to Compare
              </button>
            </div>
          </div>

          {/* Quick Specs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="tn-card bg-tn-surface p-5 flex flex-col hover:border-tn-accent/50 transition-colors">
              <MonitorSmartphone className="w-5 h-5 text-tn-accent mb-3" />
              <p className="tn-label mb-1">Display</p>
              <p className="tn-spec text-sm">6.8" AMOLED</p>
            </div>
            <div className="tn-card bg-tn-surface p-5 flex flex-col hover:border-tn-accent/50 transition-colors">
              <Cpu className="w-5 h-5 text-tn-accent mb-3" />
              <p className="tn-label mb-1">System</p>
              <p className="tn-spec text-sm">Snapdragon 8</p>
            </div>
            <div className="tn-card bg-tn-surface p-5 flex flex-col hover:border-tn-accent/50 transition-colors">
              <Camera className="w-5 h-5 text-tn-accent mb-3" />
              <p className="tn-label mb-1">Main Cam</p>
              <p className="tn-spec text-sm">200 MP</p>
            </div>
            <div className="tn-card bg-tn-surface p-5 flex flex-col hover:border-tn-accent/50 transition-colors">
              <Battery className="w-5 h-5 text-tn-accent mb-3" />
              <p className="tn-label mb-1">Battery</p>
              <p className="tn-spec text-sm">5000 mAh</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. AI Summary & Score Section Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* AI Insight (Span 7) */}
        <div className="md:col-span-7">
          <div className="h-full tn-glass p-8 rounded-2xl border border-tn-accent/30 relative overflow-hidden group shadow-(--tn-shadow-md) hover:border-tn-accent/60 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-tn-accent/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-tn-accent/10 flex items-center justify-center shrink-0 text-tn-accent border border-tn-accent/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="tn-h4 flex items-center m-0">
                    AI Insight summary
                    <span className="ml-3 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider rounded border border-tn-accent/40 text-tn-accent bg-tn-accent/5">Coming Soon</span>
                  </h3>
                </div>
              </div>
              <p className="tn-body-lg text-tn-text-secondary leading-relaxed">
                We are training our AI on thousands of reviews, benchmarks, and user sentiment data for the {phone.name}. 
                Soon, this section will provide a synthesized, unbiased verdict highlighting real-world pros, cons, and performance insights.
              </p>
            </div>
          </div>
        </div>

        {/* Score Section (Span 5) */}
        <div className="md:col-span-5 h-full tn-card bg-tn-bg-secondary p-8 rounded-2xl flex flex-col justify-center border border-tn-border-subtle hover:border-tn-border transition-colors">
          <div className="flex items-center justify-between xl:justify-start xl:space-x-12 mb-8">
            <h2 className="tn-h3 m-0">Nest Score</h2>
            <div className="flex items-center justify-center relative w-16 h-16 shrink-0">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-tn-border-strong fill-transparent" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" className="stroke-tn-accent fill-transparent transition-all duration-1000" strokeWidth="6" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * phone.overallScore / 100)} strokeLinecap="round" />
              </svg>
              <span className="font-bold text-xl">{phone.overallScore}</span>
            </div>
          </div>

          <div className="space-y-4 w-full">
            {Object.entries(phone.subScores).map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between items-end mb-1.5">
                  <span className="tn-label capitalize">{key}</span>
                  <span className="font-mono text-xs font-semibold">{score}/100</span>
                </div>
                <div className="h-1.5 w-full bg-tn-border-strong rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full transition-all duration-1000 delay-300" style={{ width: `${score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Detailed Specs Table */}
      <section className="space-y-6">
        <h2 className="tn-h2 m-0">Technical Specifications</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {Object.entries(phone.specs).map(([category, specs]) => {
            const Icon = 
              category === 'display' ? MonitorSmartphone :
              category === 'performance' ? Cpu :
              category === 'camera' ? Camera :
              category === 'battery' ? Battery :
              category === 'connectivity' ? Wifi : Wrench;

            return (
              <div key={category} className="tn-card overflow-hidden border-tn-border">
                <div className="flex items-center px-6 py-5 bg-tn-bg-secondary border-b border-tn-border">
                  <Icon className="w-5 h-5 mr-3 text-tn-accent" />
                  <h3 className="tn-h4 capitalize m-0">{category}</h3>
                </div>
                <div className="p-0">
                  {Object.entries(specs).map(([key, value], idx, arr) => (
                    <div key={key} className={`flex flex-col sm:flex-row sm:items-baseline px-6 py-4 hover:bg-tn-bg-secondary/30 transition-colors ${idx !== arr.length - 1 ? 'border-b border-tn-border-subtle' : ''}`}>
                      <span className="sm:w-1/3 tn-label mb-1 sm:mb-0 shrink-0">{key}</span>
                      <span className="sm:w-2/3 tn-body-sm leading-relaxed">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Related News */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-tn-border pb-4">
          <h2 className="tn-h3 m-0">Related Coverage</h2>
          <a href="#" className="tn-label text-tn-accent hover:text-tn-accent-hover flex items-center transition-colors">
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {phone.news.map((item) => (
            <a key={item.id} href="#" className="w-72 sm:w-80 shrink-0 snap-start tn-card tn-card-hover overflow-hidden flex flex-col group border-tn-border">
              <div className="aspect-video w-full bg-tn-bg-secondary overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="p-6 flex flex-col grow bg-tn-surface group-hover:bg-tn-bg-secondary/30 transition-colors">
                <h4 className="font-semibold text-[1.05rem] mb-4 leading-relaxed line-clamp-2">
                  {item.title}
                </h4>
                <div className="mt-auto flex items-center justify-between tn-label text-[0.65rem] text-(--tn-text-muted)">
                  <span className="text-foreground">{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
