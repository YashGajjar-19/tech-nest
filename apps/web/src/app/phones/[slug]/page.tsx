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
  ArrowRight
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
      "Type": "AMOLED 2X, 120Hz, HDR10+",
      "Size": "6.8 inches, 113.5 cm2",
      "Resolution": "1440 x 3120 pixels, 19.5:9 ratio",
      "Protection": "Corning Gorilla Armor",
    },
    performance: {
      "OS": "Android 14, One UI 6.1",
      "Chipset": "Snapdragon 8 Gen 3 (4 nm)",
      "CPU": "8-core (1x3.39GHz & ...)",
      "RAM": "12GB LPDDR5X",
      "Storage": "256GB / 512GB / 1TB",
    },
    camera: {
      "Main": "200 MP, f/1.7, OIS",
      "Telephoto": "50 MP, f/3.4, 5x optical zoom",
      "Ultrawide": "12 MP, f/2.2, 120˚",
      "Video": "8K@30fps, 4K@120fps",
    },
    battery: {
      "Capacity": "5000 mAh",
      "Charging": "45W wired, 15W wireless",
    },
    connectivity: {
      "WLAN": "Wi-Fi 7, tri-band",
      "Bluetooth": "5.3, A2DP, LE",
      "USB": "USB Type-C 3.2",
    },
    build: {
      "Dimensions": "162.3 x 79 x 8.6 mm",
      "Weight": "232 g",
      "Frame": "Titanium, glass front & back",
      "Resistance": "IP68 dust/water resistant",
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
      source: "Toms Guide",
      date: "Feb 10, 2024",
      thumbnail: "https://images.unsplash.com/photo-1621330396167-85fd4fedf0e3?auto=format&fit=crop&q=80&w=400&h=300",
    }
  ]
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  return {
    title: `${mockPhone.name} - Tech Nest`,
    description: `Detailed specs and AI review summary for ${mockPhone.name}.`,
  };
}

export default async function PhoneDetailPage({ params }: PageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug } = await params;
  const phone = mockPhone;

  return (
    <div className="bg-tn-bg text-tn-text-primary font-sans pt-24 pb-32 w-full min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col space-y-24 md:space-y-32">
        
        {/* 1. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left: Image Container */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center p-8 bg-tn-bg-secondary rounded-[16px] border border-tn-border-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={phone.imageUrl} 
              alt={phone.name} 
              className="w-full max-w-xs object-contain mix-blend-multiply dark:mix-blend-normal" 
            />
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-6">
              <span className="tn-label inline-flex items-center px-3 py-1 rounded-full border border-tn-border">
                {phone.status}
              </span>
            </div>
            
            <p className="tn-label mb-4">{phone.brand} • {phone.releaseYear}</p>
            <h1 className="tn-h1 mb-8">
              {phone.name}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-6 mb-8">
              <span className="tn-h2">{phone.price}</span>
              <button className="inline-flex items-center justify-center h-10 px-6 rounded-[10px] bg-tn-accent text-white hover:opacity-90 font-medium transition-opacity duration-[150ms]">
                <Plus className="w-4 h-4 mr-2" />
                Add to Compare
              </button>
            </div>

            {/* Quick Specs Grid (2x2) */}
            <div className="grid grid-cols-2 gap-px bg-tn-border-subtle rounded-[16px] overflow-hidden border border-tn-border-subtle">
              <div className="bg-tn-bg p-6 flex flex-col justify-center group">
                <MonitorSmartphone className="w-4 h-4 mb-4 text-tn-text-muted group-hover:text-tn-accent transition-colors duration-[180ms]" />
                <span className="tn-label mb-1">Display</span>
                <span className="tn-body-sm font-medium">6.8&quot; AMOLED</span>
              </div>
              <div className="bg-tn-bg p-6 flex flex-col justify-center group">
                <Cpu className="w-4 h-4 mb-4 text-tn-text-muted group-hover:text-tn-accent transition-colors duration-[180ms]" />
                <span className="tn-label mb-1">System</span>
                <span className="tn-body-sm font-medium">Snapdragon 8 Gen 3</span>
              </div>
              <div className="bg-tn-bg p-6 flex flex-col justify-center group">
                <Camera className="w-4 h-4 mb-4 text-tn-text-muted group-hover:text-tn-accent transition-colors duration-[180ms]" />
                <span className="tn-label mb-1">Camera</span>
                <span className="tn-body-sm font-medium">200 MP Primary</span>
              </div>
              <div className="bg-tn-bg p-6 flex flex-col justify-center group">
                <Battery className="w-4 h-4 mb-4 text-tn-text-muted group-hover:text-tn-accent transition-colors duration-[180ms]" />
                <span className="tn-label mb-1">Battery</span>
                <span className="tn-body-sm font-medium">5000 mAh</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Specifications */}
        <section className="space-y-8">
          <div className="flex items-baseline justify-between border-b border-tn-border pb-6">
            <h2 className="tn-h2">Technical details</h2>
          </div>
          
          <div className="flex flex-col">
            {Object.entries(phone.specs).map(([category, specs], idx) => {
              const Icon = 
                category === 'display' ? MonitorSmartphone :
                category === 'performance' ? Cpu :
                category === 'camera' ? Camera :
                category === 'battery' ? Battery :
                category === 'connectivity' ? Wifi : Wrench;

              return (
                <div key={category} className={`grid grid-cols-1 md:grid-cols-4 py-8 group ${idx !== Object.keys(phone.specs).length - 1 ? 'border-b border-tn-border' : ''}`}>
                  <div className="md:col-span-1 flex items-start space-x-4 mb-6 md:mb-0 text-tn-text-muted group-hover:text-tn-text-primary transition-colors duration-[180ms]">
                    <Icon className="w-4 h-4 mt-0.5" />
                    <h3 className="tn-label">{category}</h3>
                  </div>
                  <div className="md:col-span-3 flex flex-col space-y-1">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-1 sm:grid-cols-3 py-4 border-b border-tn-border-subtle last:border-0 -mx-4 px-4 rounded-[12px]">
                        <span className="tn-body-sm text-tn-text-muted font-medium">{key}</span>
                        <span className="tn-body-sm font-medium sm:col-span-2 leading-relaxed">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. AI Insight Summary */}
        <section>
          <div className="relative p-8 border border-tn-accent-muted rounded-[16px] overflow-hidden">
            <div className="absolute inset-0 bg-tn-accent-subtle"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-start md:space-x-8">
              <div className="mb-6 md:mb-0 shrink-0">
                <div className="w-10 h-10 rounded-[10px] border border-tn-accent-muted flex items-center justify-center bg-tn-accent-subtle tn-accent-text">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="max-w-3xl">
                <h3 className="tn-label mb-6 flex items-center gap-3">
                  AI Insight Summary
                  <span className="px-2 py-1 rounded-full border border-tn-accent-muted text-tn-accent tn-label bg-tn-accent-subtle">Coming Soon</span>
                </h3>
                <p className="tn-body-lg">
                  We are evaluating thousands of reviews, benchmarks, and real-world sentiment for the {phone.name}. Expect a synthesized, unbiased verdict arriving soon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Rating Section */}
        <section>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0">
              <span className="tn-label mb-6">Nest Score</span>
              <span className="text-display font-medium tracking-tighter leading-none">{phone.overallScore}</span>
            </div>
            <div className="flex flex-col space-y-8 w-full max-w-xl">
              {Object.entries(phone.subScores).map(([key, score]) => (
                <div key={key} className="group relative">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="tn-body-sm capitalize font-medium text-tn-text-secondary">{key}</span>
                    <span className="tn-spec text-tn-text-muted">{score}</span>
                  </div>
                  <div className="tn-score-bar w-full">
                    <div 
                      className="tn-score-bar-fill active" 
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Related News */}
        <section className="space-y-8 pb-8">
          <div className="flex items-baseline justify-between border-b border-tn-border pb-6">
            <h2 className="tn-h2">Related coverage</h2>
            <a href="#" className="tn-label hover:text-tn-accent transition-colors flex items-center">
              View all <ArrowRight className="w-3 h-3 ml-2" />
            </a>
          </div>
          
          <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-6 -mx-6 px-6 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {phone.news.map((item) => (
              <a key={item.id} href="#" className="w-[300px] sm:w-[380px] shrink-0 snap-start group flex flex-col">
                <div className="aspect-[4/3] w-full rounded-[16px] overflow-hidden mb-4 bg-tn-bg-secondary relative border border-tn-border-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-[180ms]" 
                  />
                </div>
                <div className="flex flex-col px-1">
                  <div className="flex items-center space-x-3 tn-label mb-3">
                    <span>{item.source}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="tn-h4 group-hover:text-tn-accent transition-colors duration-[180ms]">
                    {item.title}
                  </h4>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
