"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Pencil, 
  ArrowUpDown, 
  Search, 
  Filter, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDevices } from "@/lib/api";

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchDevices();
    setDevices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.slug.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || 
                          (filter === "published" && d.is_published) || 
                          (filter === "draft" && !d.is_published) ||
                          (filter === "failed" && d.intelligence_status === "failed");
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "processing": return <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />;
      case "failed": return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      default: return <Clock className="w-3.5 h-3.5 text-zinc-500" />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Device Catalog</p>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {devices.length} objects currently registered in the knowledge graph.
          </p>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex items-center gap-3 w-full md:w-auto"
        >
           <Link
            href="/admin/devices/new"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-foreground text-background text-xs font-bold rounded-2xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-foreground/10"
          >
            <Plus className="w-4 h-4" />
            Integrate New Device
          </Link>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by name, slug or specs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-foreground/2 border border-border rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-foreground/5 transition-all"
          />
        </div>
        <div className="flex gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-foreground/2 border border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:outline-hidden"
            >
               <option value="all">All Status</option>
               <option value="published">Published</option>
               <option value="draft">Drafts</option>
               <option value="failed">Failed Intelligence</option>
            </select>
            <button 
              onClick={loadData}
              className="p-3 bg-foreground/2 border border-border rounded-2xl hover:bg-foreground/5 transition-colors"
            >
               <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      {loading && devices.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
           <div className="w-12 h-12 border-2 border-foreground/5 border-t-foreground rounded-full animate-spin" />
           <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hydrating Device Store...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-4xl border border-dashed border-border py-20 flex flex-col items-center justify-center text-center gap-4">
            <Smartphone className="w-12 h-12 text-muted-foreground/20" />
            <div>
               <h3 className="font-bold text-foreground">No devices matched</h3>
               <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
            </div>
        </div>
      ) : (
        <div className="rounded-4xl border border-border bg-foreground/1.5 overflow-hidden shadow-sm backdrop-blur-3xl">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {["Device & Brand", "Market Value", "Status", "Intelligence", "Modified", ""].map((h) => (
                    <th key={h} className="px-8 py-5 text-left">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        {h}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody 
                variants={container}
                initial="hidden"
                animate="show"
                className="divide-y divide-border/30"
              >
                {filtered.map((device) => (
                  <motion.tr 
                    variants={item}
                    key={device.id} 
                    className="hover:bg-foreground/3 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-foreground/3 border border-border flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                           <Smartphone className="w-4 h-4 text-muted-foreground group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:translate-x-0.5 transition-transform">{device.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">
                            {device.brands?.name ?? "Unknown Brand"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-sm font-mono text-foreground font-medium">
                        {device.price != null ? `$${Number(device.price).toLocaleString()}` : "—"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-widest ${
                        device.is_published
                          ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/20"
                          : "text-zinc-500 bg-foreground/5 border-border"
                      }`}>
                        {device.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          {getStatusIcon(device.intelligence_status)}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                             {device.intelligence_status || "Pending"}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-foreground">
                            {new Date(device.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium opacity-60 uppercase">
                             {new Date(device.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/devices/${device.id}/edit`}
                          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

