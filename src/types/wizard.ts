// ─────────────────────────────────────────────────────────────
// Tech Nest — Wizard Types (matched to real Supabase schema)
// ─────────────────────────────────────────────────────────────

// ── Database rows ─────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at?: string;
}

// devices(id, name, slug, brand_id, category_id, release_date, price,
//         short_summary, image_url, reality_score, popularity_score,
//         is_published, created_at, updated_at)
export interface Device {
  id: string;
  name: string;
  slug: string;
  brand_id: string | null;
  category_id: string | null;
  release_date: string | null;
  price: number | null;
  short_summary: string | null;
  image_url: string | null;
  reality_score: number;
  popularity_score: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// device_specs(id, device_id, spec_key, spec_value) — simple key-value
export interface DeviceSpec {
  id: string;
  device_id: string;
  spec_key: string;
  spec_value: string | null;
}

// device_relationships(id, source_device_id, target_device_id, relationship_type, weight)
export type RelationshipType =
  | "competitor"
  | "previous_generation"
  | "upgrade_to"
  | "alternative";

export interface DeviceRelationship {
  id: string;
  source_device_id: string;
  target_device_id: string;
  relationship_type: RelationshipType;
  weight: number;
  // joined
  target_device?: {
    id: string;
    name: string;
    slug: string;
  };
}

// ── Variant shape (stored as JSON in device_specs key="variants") ──────

export interface VariantRow {
  id: string;       // client-only key for React
  ram_gb: string;
  storage_gb: string;
  price: string;
  color: string;
}

// ── Wizard local state ────────────────────────────────────────

export interface WizardProgress {
  deviceId: string | null;
  currentStep: number;
  completedSteps: number[];
  brandId: string | null;
  brandName: string | null;
}

// ── Server Action result wrapper ──────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data?: T; error?: never }
  | { success: false; error: string; data?: never };
