import Link from "next/link";
import Image from "next/image";

const ARTICLES = [
  {
    id: "snapdragon-8-elite",
    title: "Snapdragon 8 Elite changes the game for Android",
    category: "Architecture",
    date: "Feb 23, 2026",
    imgUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    href: "/news/snapdragon-8-elite",
  },
  {
    id: "apple-intelligence",
    title: "How Apple Intelligence integrates locally",
    category: "Software",
    date: "Feb 18, 2026",
    imgUrl:
      "https://images.unsplash.com/photo-1621360841013-c76831f13b19?w=1200&q=80",
    href: "/news/apple-local-ai",
  },
  {
    id: "s25-ultra-display",
    title: "The anti-reflective display of S25 Ultra",
    category: "Display Tech",
    date: "Feb 14, 2026",
    imgUrl:
      "https://images.unsplash.com/photo-1620286829744-b006bd1d4285?w=1200&q=80",
    href: "/news/s25-ultra-display",
  },
];

export default function LatestTech() {
  return (
    <section className="py-24 px-6 md:py-32 w-full max-w-5xl mx-auto border-t border-border-subtle bg-bg-primary">
      <div className="flex justify-between items-baseline mb-12">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary/90">
          Latest Analysis
        </h2>
        <Link
          href="/news"
          className="text-sm font-medium text-text-primary/50 hover:text-text-secondary transition-colors"
        >
          View all editorial
        </Link>
      </div>

      {/* Grid: 3 large cohesive cards. First one takes full width on mobile, top row on md if possible, or standard grid. Apple-style: masonry or 1 large 2 small. We'll do a simple 1 large, 2 small. */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Featured Left Card */}
        <Link
          href={ARTICLES[0].href}
          className="group relative col-span-1 md:col-span-2 md:row-span-1 rounded-4xl overflow-hidden bg-text-primary/5 border border-border-subtle h-[400px] md:h-[500px]"
        >
          <div className="absolute inset-0 bg-bg-primary z-10 transition-colors duration-500 group-hover:bg-bg-primary" />
          <Image
            src={ARTICLES[0].imgUrl}
            alt={ARTICLES[0].title}
            fill
            className="object-cover transition-opacity duration-300 ease-calm opacity-60 group-hover:opacity-80"
            sizes="(max-width: 768px) 100vw, 1000px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-10" />

          <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 flex flex-col gap-3 max-w-2xl">
            <span className="text-[11px] uppercase tracking-widest font-bold text-text-primary/60">
              {ARTICLES[0].category}
            </span>
            <h3 className="text-2xl md:text-4xl font-semibold text-text-primary leading-tight">
              {ARTICLES[0].title}
            </h3>
            <span className="text-sm font-medium text-text-primary/40 mt-1">
              {ARTICLES[0].date}
            </span>
          </div>
        </Link>

        {/* Small Cards */}
        {ARTICLES.slice(1).map((article) => (
          <Link
            key={article.id}
            href={article.href}
            className="group relative rounded-3xl overflow-hidden bg-text-primary/5 border border-border-subtle h-[350px]"
          >
            <div className="absolute inset-0 bg-bg-primary z-10 transition-colors duration-500 group-hover:bg-bg-primary" />
            <Image
              src={article.imgUrl}
              alt={article.title}
              fill
              className="object-cover transition-opacity duration-300 ease-calm opacity-50 group-hover:opacity-70"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent z-10" />

            <div className="absolute bottom-0 left-0 p-8 z-20 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-text-primary/60">
                {article.category}
              </span>
              <h3 className="text-xl md:text-2xl font-semibold text-text-primary leading-tight">
                {article.title}
              </h3>
              <span className="text-xs font-medium text-text-primary/40 mt-1">
                {article.date}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
