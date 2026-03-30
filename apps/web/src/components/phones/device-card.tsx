"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ──────────────────────────────────────────────────────────────
   "PULSE" DEVICE CARD — Visual Intelligence Component

   Dark Mode (Linear):
     · Bordered card (#0F0F10), 1px border (#1F1F22)
     · Inner glow on top edge (accent gradient)
     · Gradient sweep on hover
   
   Light Mode (Apple):
     · Pure white pedestal, no border
     · Highly diffused "Airy Shadow" (0px 10px 40px rgba(0,0,0,0.04))
     · 3D product-hero feel

   Specs use Geist Mono for "engineered" data feel.
   ────────────────────────────────────────────────────────────── */

interface DeviceSpec {
  label: string;
  value: string;
}

interface DeviceCardProps {
  slug: string;
  name: string;
  brand: string;
  price: string;
  imageUrl: string;
  specs: DeviceSpec[];
  badge?: string;
  score?: number;
  loading?: boolean;
  className?: string;
  index?: number;
}

function DeviceCard({
  slug,
  name,
  brand,
  price,
  imageUrl,
  specs,
  badge,
  score,
  loading = false,
  className,
  index = 0,
}: DeviceCardProps) {
  if (loading) {
    return <DeviceCardSkeleton className={className} />;
  }

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Slight 4 degree max tilt mimicking heavy material
  const rotateX = useSpring(useTransform(y, [0, 1], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-4, 4]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        delay: index * 0.05
      }}
      className="perspective-[1000px]"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full"
      >
      <Link
        href={`/phones/${slug}`}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-[var(--card-radius)]",
          "bg-[var(--card-bg)] border border-[var(--card-border)]",
          "shadow-[var(--card-shadow)]",
          "transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          "hover:shadow-[var(--card-hover-shadow)] dark:hover:border-[var(--accent-muted)]",
          className
        )}
      >
        {/* Dark mode: inner glow top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--accent-muted) 30%, var(--accent) 50%, var(--accent-muted) 70%, transparent 100%)",
          }}
        />

        {/* Dark mode: gradient sweep overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[500ms]"
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, transparent 40%, var(--accent-subtle) 50%, transparent 60%, transparent 100%)",
          }}
        />

        {/* Image — clean, product-hero feel */}
        <div className="relative aspect-square bg-[var(--bg-secondary)] flex items-center justify-center p-8 overflow-hidden">
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="secondary">{badge}</Badge>
            </div>
          )}
          <div className="relative z-[1] w-full h-full pb-4">
            {/* Main Phone Image */}
            <img
              src={imageUrl}
              alt={name}
              className="relative z-10 w-full h-full object-contain opacity-90 transition-all duration-[300ms] group-hover:opacity-100 group-hover:scale-[1.02]"
            />
            {/* Reflection Effect */}
            <img
              src={imageUrl}
              alt=""
              className="absolute left-0 -bottom-[100%] w-full h-full object-contain scale-y-[-1] opacity-20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_30%)] pointer-events-none z-0"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Info */}
        <div className="relative z-[2] flex flex-col gap-3 p-8">
          {/* Brand + Name */}
          <div className="flex flex-col gap-1">
            <span className="tn-label">{brand}</span>
            <h3 className="text-[15px] font-medium text-[var(--text-primary)] truncate leading-[22px] tracking-[-0.01em] font-[family-name:var(--font-geist-sans)]">
              {name}
            </h3>
          </div>

          {/* Price + Score */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[var(--text-primary)]">
              {price}
            </span>
            {score !== undefined && (
              <span className="tn-spec text-[var(--accent)]">{score}/10</span>
            )}
          </div>

          {/* Key Highlights — 3 max */}
          {specs.length > 0 && (
            <div className="flex flex-col gap-2 pt-3 border-t border-[var(--divider)]">
              {specs.slice(0, 3).map((spec) => (
                <div key={spec.label} className="flex items-center justify-between transition-colors duration-300 group-hover:text-[var(--accent)] group-hover:drop-shadow-[0_0_8px_rgba(15,118,110,0.5)]">
                  <span className="tn-label group-hover:text-inherit">{spec.label}</span>
                  <span className="tn-spec group-hover:text-inherit">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Skeleton — diagonal shimmer ── */

function DeviceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--card-radius)] bg-[var(--card-bg)] border border-[var(--card-border)]",
        className
      )}
    >
      <div className="aspect-square w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-5 w-3/4 rounded-md" />
        </div>
        <Skeleton className="h-4 w-20 rounded-md" />
        <div className="flex flex-col gap-2 pt-3 border-t border-[var(--divider)]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-14 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { DeviceCard, DeviceCardSkeleton };
export type { DeviceCardProps, DeviceSpec };
