import type { components } from "./api-types";

// A lightweight utility client to communicate with the Tech Nest Python Backend Engine.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";

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
