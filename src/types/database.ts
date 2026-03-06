import { UUID } from 'crypto';

export interface Brand {
  id: string; // UUID
  name: string;
  slug: string;
  logo_url: string | null;
  country: string | null;
  is_active: boolean;
  created_at: string; // ISO date string
}

export interface Device {
  id: string; // UUID
  brand_id: string; // UUID
  name: string;
  slug: string;
  device_type: 'smartphone' | 'tablet' | 'laptop' | 'wearable' | string;
  release_date: string | null; // YYYY-MM-DD
  status: 'released' | 'upcoming' | 'rumored' | string | null;
  hero_image: string | null;
  created_at: string; // ISO date string
  
  // Relations (often joined)
  brand?: Brand;
  variants?: DeviceVariant[];
  scores?: DeviceScore;
  ai_insights?: DeviceAiInsight;
  images?: DeviceImage[];
  spec_values?: DeviceSpecValue[];
  relationships?: DeviceRelationship[];
}

export interface DeviceVariant {
  id: string; // UUID
  device_id: string; // UUID
  ram_gb: number | null;
  storage_gb: number | null;
  price: number | null;
  currency: string;
  sku_name: string | null;
}

export interface SpecCategory {
  id: string; // UUID
  name: string;
  display_order: number;
}

export interface SpecDefinition {
  id: string; // UUID
  key: string;
  label: string;
  category_id: string; // UUID
  unit: string | null;
  value_type: 'number' | 'string' | 'boolean' | string | null;
  
  // Relations
  category?: SpecCategory;
}

export interface DeviceSpecValue {
  device_id: string; // UUID
  spec_id: string; // UUID
  value_number: number | null;
  value_text: string | null;
  
  // Relations
  spec_definition?: SpecDefinition;
}

export interface DeviceScore {
  device_id: string; // UUID
  display_score: number;
  performance_score: number;
  camera_score: number;
  battery_score: number;
  design_score: number;
  software_score: number;
  overall_score: number;
  updated_at: string; // ISO date string
}

export interface DeviceAiInsight {
  device_id: string; // UUID
  summary: string | null;
  pros: string[];
  cons: string[];
  best_for: string | null;
  avoid_if: string | null;
  generated_at: string; // ISO date string
}

export interface DeviceImage {
  id: string; // UUID
  device_id: string; // UUID
  image_url: string;
  image_type: 'hero' | 'gallery' | 'color_variant' | string | null;
  display_order: number;
}

export interface DeviceRelationship {
  device_id: string; // UUID
  related_device_id: string; // UUID
  relation_type: 'competitor' | 'previous_generation' | 'upgrade_to' | 'alternative' | string;
  
  // Relations
  related_device?: Device;
}

export interface DeviceNetworkStat {
  device_id: string; // UUID
  views: number;
  comparisons: number;
  recommendations: number;
  selections: number;
  trend_score: number;
  updated_at: string; // ISO date string
}

export interface DecisionSession {
  id: string; // UUID
  query: string | null;
  parsed_intent: any | null; // Replace with specific interface if needed
  filters: any | null; // Replace with specific interface if needed
  created_at: string; // ISO date string
}
