import React from "react";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { Plus, Pencil, ArrowUpDown } from "lucide-react";

export default async function AdminDevicesPage() {
  const supabase = createAdminClient();

  // Real schema: devices(id, name, slug, brand_id → brands(name), release_date,
  //                      price, is_published, short_summary, image_url, updated_at)
  const { data: devices, error } = await supabase
    .from("devices")
    .select(`
      id,
      name,
      slug,
      price,
      is_published,
      release_date,
      updated_at,
      brands ( name )
    `)
    .order("updated_at", { ascending: false })
    .limit(100);

  const rows = devices ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Admin OS</p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Device Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {rows.length > 0 ? `${rows.length} device${rows.length !== 1 ? "s" : ""}` : "No devices yet"}
          </p>
        </div>
        <Link
          href="/admin/devices/new"
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Device
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
          Failed to load devices: {error.message}
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-12 flex flex-col items-center justify-center gap-3 text-center min-h-[360px]">
          <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center">
            <Plus className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No devices yet</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Start by adding your first device through the guided wizard.
          </p>
          <Link
            href="/admin/devices/new"
            className="mt-2 px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Add First Device
          </Link>
        </div>
      )}

      {rows.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background/60">
                <tr>
                  {["Device", "Brand", "Price", "Status", "Released", "Last Updated", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left">
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {h}{h && h !== "" && <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((device) => (
                  <tr key={device.id} className="hover:bg-surface-elevated transition-colors group">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{device.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{device.slug}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {/* @ts-expect-error supabase join shape */}
                      <span className="text-sm text-muted-foreground">{device.brands?.name ?? "—"}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {device.price != null ? `$${Number(device.price).toLocaleString()}` : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide ${
                        device.is_published
                          ? "text-emerald-500 bg-emerald-500/8 border-emerald-500/20"
                          : "text-muted-foreground bg-foreground/5 border-border"
                      }`}>
                        {device.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {device.release_date
                          ? new Date(device.release_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground">
                        {device.updated_at
                          ? new Date(device.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/devices/${device.id}/edit`}
                        className="inline-flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/6 opacity-0 group-hover:opacity-100 transition-all"
                        title="Edit Device"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
