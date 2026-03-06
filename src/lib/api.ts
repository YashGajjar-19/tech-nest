import type { components } from "./api-types";

// A lightweight utility client to communicate with the Tech Nest Python Backend Engine.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export type Device = components["schemas"]["Device"];

export async function fetchDevices(category?: string, limit: number = 20): Promise<Device[]> {
  const url = new URL(`${API_BASE_URL}/devices`);
  if (category) url.searchParams.append("category", category);
  if (limit) url.searchParams.append("limit", limit.toString());

  try {
    // For development, disable cache to ensure we see the latest from the working backend
    const res = await fetch(url.toString(), {
      cache: "no-store"
    });
    
    if (!res.ok) throw new Error("Failed to fetch devices");
    
    return await res.json();
  } catch (error) {
    // Suppress console errors to allow graceful UI fallbacks
    return [];
  }
}

export async function fetchDeviceById(id: string): Promise<Device | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/devices/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    // Suppress console errors to allow graceful UI fallbacks
    return null;
  }
}

export async function fetchDeviceDecision(id: string, context?: string) {
  const url = new URL(`${API_BASE_URL}/devices/${id}/decision`);
  if (context) url.searchParams.append("user_context", context);
  
  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    // Suppress console errors to allow graceful UI fallbacks
    return null;
  }
}

export async function compareDevices(deviceIds: string[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deviceIds),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    // Suppress console errors to allow graceful UI fallbacks
    return null;
  }
}

export async function fetchIntelligenceMetrics() {
  try {
    const res = await fetch(`${API_BASE_URL}/intelligence/admin/metrics`, {
      cache: "no-store",
      headers: {
        "x-admin-role": "admin" // For simulation; real app would use proper JWT auth
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function triggerNetworkAggregation() {
  try {
    const res = await fetch(`${API_BASE_URL}/network/aggregate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      cache: "no-store",
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}

export async function triggerBulkIntelligence() {
  try {
    const devices = await fetchDevices();
    const ids = devices.map(d => d.id);
    const res = await fetch(`${API_BASE_URL}/intelligence/bulk-generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_ids: ids, force: false }),
      cache: "no-store",
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}

export async function fetchIntelligenceQueue(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/intelligence/admin/queue`, {
      cache: "no-store",
      headers: {
        "x-admin-role": "admin"
      }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function fetchAnalyticsSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/summary`, {
      cache: "no-store",
      headers: {
        "x-admin-role": "admin"
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function fetchSystemLogs(limit = 50) {
  try {
    const res = await fetch(`${API_BASE_URL}/system/logs?limit=${limit}`, {
      cache: "no-store",
      headers: { "x-admin-role": "admin" }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function fetchSystemSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/system/settings`, {
      cache: "no-store",
      headers: { "x-admin-role": "admin" }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}



