"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWizard } from "./WizardContext";
import {
  getRelationshipsAction,
  searchDevicesAction,
  addRelationshipAction,
  deleteRelationshipAction,
} from "@/app/admin/devices/actions";
import type { DeviceRelationship, RelationshipType } from "@/types/wizard";
import {
  Search,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RELATION_TYPES: { value: RelationshipType; label: string; color: string }[] = [
  { value: "competitor", label: "Competitor", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  { value: "previous_generation", label: "Prev Gen", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { value: "upgrade_to", label: "Upgrade To", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { value: "alternative", label: "Alternative", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
];

export function StepRelations() {
  const { deviceId, nextStep, prevStep, markStepComplete } = useWizard();

  const [relationships, setRelationships] = useState<DeviceRelationship[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedType, setSelectedType] = useState<RelationshipType>("competitor");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!deviceId) { setIsLoading(false); return; }
    getRelationshipsAction(deviceId).then((r) => {
      if (r.success && r.data) setRelationships(r.data);
      setIsLoading(false);
    });
  }, [deviceId]);

  // Search with debounce
  useEffect(() => {
    if (!query.trim() || !deviceId) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const r = await searchDevicesAction(query, deviceId);
      if (r.success && r.data) setResults(r.data);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, deviceId]);

  const handleAdd = async (relatedId: string, relatedName: string) => {
    if (!deviceId) return;
    setIsAdding(true);
    const result = await addRelationshipAction({
      source_device_id: deviceId,
      target_device_id: relatedId,
      relationship_type: selectedType,
    });
    if (result.success) {
      // Optimistic update
      setRelationships((prev) => [
        ...prev,
        {
          id: result.data?.id ?? `temp_${Date.now()}`,
          source_device_id: deviceId,
          target_device_id: relatedId,
          relationship_type: selectedType,
          weight: 1.0,
          target_device: { id: relatedId, name: relatedName, slug: "" },
        },
      ]);
    }
    setQuery("");
    setResults([]);
    setIsAdding(false);
  };

  const handleDelete = async (rel: DeviceRelationship) => {
    await deleteRelationshipAction(rel.id);
    setRelationships((prev) => prev.filter((r) => r.id !== rel.id));
  };

  const getTypeStyle = (type: RelationshipType) =>
    RELATION_TYPES.find((t) => t.value === type)?.color ?? "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Step 6 of 7
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
          Relationships
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Link this device to others in the database.
        </p>
      </div>

      {/* Relationship type picker */}
      <div className="flex flex-wrap gap-2">
        {RELATION_TYPES.map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => setSelectedType(value)}
            className={cn(
              "px-3 py-1.5 rounded-full border text-xs font-semibold transition-all",
              selectedType === value
                ? cn("border", color)
                : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search device to link as ${selectedType.replace(/_/g, " ")}…`}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600/40 transition-all"
        />
        {isSearching && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 animate-spin" />
        )}
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          {results.map((device) => (
            <button
              key={device.id}
              onClick={() => handleAdd(device.id, device.name)}
              disabled={isAdding || relationships.some((r) => r.target_device_id === device.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/50 last:border-0 disabled:opacity-40"
            >
              <span className="text-zinc-200 font-medium">{device.name}</span>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", getTypeStyle(selectedType))}>
                {selectedType.replace(/_/g, " ")}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Existing relationships */}
      {relationships.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Linked Devices
          </h3>
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            {relationships.map((rel) => (
              <div
                key={rel.id}
                className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                      getTypeStyle(rel.relationship_type)
                    )}
                  >
                    {rel.relationship_type.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm text-zinc-200">
                    {rel.target_device?.name ?? rel.target_device_id}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(rel)}
                  className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-4 py-2.5 text-zinc-400 hover:text-zinc-100 rounded-xl text-sm font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => { markStepComplete(6); nextStep(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-semibold hover:bg-white transition-all"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
