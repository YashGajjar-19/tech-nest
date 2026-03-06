"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { ActionResult, Brand, Device, DeviceRelationship } from "@/types/wizard";
import { SPEC_SCHEMA } from "./constants";
// ── Brands ───────────────────────────────────────────────────
// Table: brands(id, name, slug, logo_url, created_at)

export async function getBrandsAction(): Promise<ActionResult<Brand[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("brands")
      .select("id, name, slug, logo_url")
      .order("name", { ascending: true });
    if (error) return { success: false, error: error.message };
    return { success: true, data: data ?? [] };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function createBrandAction(name: string): Promise<ActionResult<Brand>> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const slug = slugify(name);
    const { data, error } = await supabase
      .from("brands")
      .insert({ name: name.trim(), slug })
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/brands");
    return { success: true, data };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Device (core identity) ───────────────────────────────────
// Table: devices(id, name, slug, brand_id, category_id, release_date, price,
//               short_summary, image_url, reality_score, popularity_score,
//               is_published, created_at, updated_at)

export async function createDeviceAction(payload: {
  brand_id: string;
  name: string;
  slug: string;
  device_type?: string;
  release_date?: string | null;
  price?: number | null;
  short_summary?: string | null;
  image_url?: string | null;
}): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("devices")
      .insert({ ...payload, device_type: payload.device_type ?? "smartphone", is_published: false })
      .select("id")
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function updateDeviceAction(
  deviceId: string,
  payload: Partial<{
    brand_id: string;
    name: string;
    slug: string;
    release_date: string | null;
    price: number | null;
    short_summary: string | null;
    image_url: string | null;
    is_published: boolean;
  }>,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("devices")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", deviceId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Device Variants ──────────────────────────────────────────
// No device_variants table exists — we store variants as JSON
// in device_specs using spec_key = "variants"

export interface VariantRow {
  id: string; // local client-only id for keying
  ram_gb: string;
  storage_gb: string;
  price: string;
  color: string;
}

export async function getVariantsAction(
  deviceId: string,
): Promise<ActionResult<VariantRow[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("device_specs")
      .select("spec_value")
      .eq("device_id", deviceId)
      .eq("spec_key", "variants")
      .maybeSingle();
    if (error) return { success: false, error: error.message };
    if (!data?.spec_value) return { success: true, data: [] };
    return { success: true, data: JSON.parse(data.spec_value) as VariantRow[] };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function saveVariantsAction(
  deviceId: string,
  variants: VariantRow[],
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("device_specs")
      .upsert(
        { device_id: deviceId, spec_key: "variants", spec_value: JSON.stringify(variants) },
        { onConflict: "device_id,spec_key" },
      );
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Specifications ───────────────────────────────────────────
// Table: device_specs(id, device_id, spec_key, spec_value) — simple KV
// We define the spec schema in code (no DB spec_categories/spec_definitions)

export async function getSpecSchemaAction() {
  return { success: true, data: SPEC_SCHEMA };
}

export async function getSpecValuesAction(deviceId: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("device_specs")
      .select("spec_key, spec_value")
      .eq("device_id", deviceId);
    if (error) return { success: false, error: error.message };
    // Convert array to map: { spec_key: spec_value }
    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.spec_key !== "variants") map[row.spec_key] = row.spec_value ?? "";
    }
    return { success: true, data: map };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function upsertSpecValueAction(
  deviceId: string,
  specKey: string,
  value: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("device_specs")
      .upsert(
        { device_id: deviceId, spec_key: specKey, spec_value: value },
        { onConflict: "device_id,spec_key" },
      );
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Image ─────────────────────────────────────────────────────
// No device_images table — devices has a single image_url column

export async function setDeviceImageAction(
  deviceId: string,
  imageUrl: string | null,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("devices")
      .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
      .eq("id", deviceId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Relationships ────────────────────────────────────────────
// Table: device_relationships(id, source_device_id, target_device_id,
//                              relationship_type, weight)

export async function searchDevicesAction(
  query: string,
  excludeId: string,
): Promise<ActionResult<Pick<Device, "id" | "name" | "slug">[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("devices")
      .select("id, name, slug")
      .ilike("name", `%${query}%`)
      .neq("id", excludeId)
      .limit(10);
    if (error) return { success: false, error: error.message };
    return { success: true, data: data ?? [] };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function getRelationshipsAction(
  deviceId: string,
): Promise<ActionResult<DeviceRelationship[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("device_relationships")
      .select(`
        id,
        source_device_id,
        target_device_id,
        relationship_type,
        weight,
        target_device:devices!target_device_id(id, name, slug)
      `)
      .eq("source_device_id", deviceId);
    if (error) return { success: false, error: error.message };
    return { success: true, data: (data as unknown as DeviceRelationship[]) ?? [] };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function addRelationshipAction(payload: {
  source_device_id: string;
  target_device_id: string;
  relationship_type: string;
}): Promise<ActionResult<DeviceRelationship>> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("device_relationships")
      .insert({ ...payload, weight: 1.0 })
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function deleteRelationshipAction(
  relationshipId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("device_relationships")
      .delete()
      .eq("id", relationshipId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

// ── Publish ──────────────────────────────────────────────────

export async function publishDeviceAction(
  deviceId: string,
  publish: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();

    // 1. Mark as published + set intelligence_status to pending
    const updatePayload: Record<string, unknown> = {
      is_published: publish,
      updated_at: new Date().toISOString(),
    };
    if (publish) {
      updatePayload.intelligence_status = "pending";
    }

    const { error } = await supabase
      .from("devices")
      .update(updatePayload)
      .eq("id", deviceId);

    if (error) return { success: false, error: error.message };

    // 2. Fire intelligence pipeline (non-blocking) — only when publishing
    if (publish) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

      // Fire-and-forget: we don't await this — the pipeline runs async in the backend.
      // We pass the Supabase service key as a bearer token so the backend can
      // validate admin intent. In production, replace with a dedicated internal API key.
      fetch(`${backendUrl}/api/v1/intelligence/generate/${deviceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
        },
      }).catch((err) => {
        // Non-fatal — publish still succeeds even if backend is unreachable.
        console.warn("[publishDeviceAction] Intelligence trigger failed:", err);
      });
    }

    revalidatePath("/admin/devices");
    revalidatePath("/devices");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}


export async function getDeviceForReviewAction(
  deviceId: string,
): Promise<ActionResult<Device & { brand?: Brand }>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("devices")
      .select(`*, brands(id, name, slug)`)
      .eq("id", deviceId)
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as unknown as Device & { brand?: Brand } };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
