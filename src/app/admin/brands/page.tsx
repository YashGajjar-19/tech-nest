import React from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { Tags, Plus, Globe, MoreHorizontal, Shield, ArrowRight } from "lucide-react";

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Shield className="w-3.5 h-3.5 text-blue-500" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Knowledge System</p>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Brand Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length > 0 ? `${rows.length} ecosystem nodes detected.` : "No brands yet"}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="text-xs text-muted-foreground px-4 py-2.5 rounded-2xl border border-border bg-foreground/2 backdrop-blur-3xl font-medium">
             Controlled via Device Wizard
           </div>
        </div>
      </div>


      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
          Failed to load brands: {error.message}
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className="rounded-4xl border border-dashed border-border py-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-foreground/5 border border-border flex items-center justify-center">
            <Tags className="w-6 h-6 text-muted-foreground/30" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Schema is empty</h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">
              Brands are automatically indexed during new device integration.
            </p>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((brand) => {
            const deviceCount = Array.isArray((brand as any).devices)
              ? ((brand as any).devices[0]?.count ?? 0)
              : 0;

            return (
              <div 
                key={brand.id} 
                className="group relative flex items-center gap-4 p-5 rounded-3xl border border-border bg-foreground/1.5 hover:bg-foreground/5 transition-all duration-300 hover:scale-[1.02] cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-foreground/10 transition-colors">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Globe className="w-6 h-6 text-muted-foreground/40" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{brand.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-muted-foreground opacity-60">/{brand.slug}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-tighter">
                      {deviceCount} Devices
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                   <ArrowRight className="w-3.5 h-3.5 text-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
