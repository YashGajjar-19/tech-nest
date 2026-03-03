import React from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { Tags, Plus, Globe, MoreHorizontal } from "lucide-react";

export default async function AdminBrandsPage() {
  const supabase = createAdminClient();

  // Real schema: brands(id, name, slug, logo_url, created_at)
  // Join device count via brand_id FK
  const { data: brands, error } = await supabase
    .from("brands")
    .select(`
      id,
      name,
      slug,
      logo_url,
      created_at,
      devices ( count )
    `)
    .order("name", { ascending: true });

  const rows = brands ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Admin OS</p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Brand Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length > 0 ? `${rows.length} brand${rows.length !== 1 ? "s" : ""} in the database` : "No brands yet"}
          </p>
        </div>
        <span className="text-xs text-muted-foreground px-3 py-2 rounded-xl border border-border bg-surface">
          Brands are created via the Device Wizard
        </span>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
          Failed to load brands: {error.message}
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
            <Tags className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No brands yet</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Brands are added during Step 1 of the Device Wizard.
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="divide-y divide-border">
            {rows.map((brand) => {
              const deviceCount = Array.isArray((brand as any).devices)
                ? ((brand as any).devices[0]?.count ?? 0)
                : 0;

              return (
                <div key={brand.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-elevated transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-foreground/6 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <Tags className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{brand.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">/{brand.slug}</p>
                  </div>
                  <span className="hidden sm:block text-xs text-muted-foreground">
                    {deviceCount} {deviceCount === 1 ? "device" : "devices"}
                  </span>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/6 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
