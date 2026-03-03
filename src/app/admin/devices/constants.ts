export interface SpecCategory {
  id: string;
  name: string;
  keys: SpecKey[];
}

export interface SpecKey {
  key: string;
  label: string;
  unit?: string;
  type: "text" | "number" | "boolean";
}

// Hardcoded spec schema — add more as needed
export const SPEC_SCHEMA: SpecCategory[] = [
  {
    id: "display",
    name: "Display",
    keys: [
      { key: "screen_size", label: "Screen Size", unit: "inches", type: "number" },
      { key: "resolution", label: "Resolution", type: "text" },
      { key: "refresh_rate", label: "Refresh Rate", unit: "Hz", type: "number" },
      { key: "panel_type", label: "Panel Type", type: "text" },
    ],
  },
  {
    id: "performance",
    name: "Performance",
    keys: [
      { key: "chipset", label: "Chipset", type: "text" },
      { key: "ram_gb", label: "RAM", unit: "GB", type: "number" },
      { key: "storage_gb", label: "Storage", unit: "GB", type: "number" },
    ],
  },
  {
    id: "camera",
    name: "Camera",
    keys: [
      { key: "main_camera_mp", label: "Main Camera", unit: "MP", type: "number" },
      { key: "front_camera_mp", label: "Front Camera", unit: "MP", type: "number" },
      { key: "video_recording", label: "Video Recording", type: "text" },
    ],
  },
  {
    id: "battery",
    name: "Battery",
    keys: [
      { key: "battery_mah", label: "Capacity", unit: "mAh", type: "number" },
      { key: "charging_w", label: "Fast Charging", unit: "W", type: "number" },
      { key: "wireless_charging", label: "Wireless Charging", type: "boolean" },
    ],
  },
  {
    id: "connectivity",
    name: "Connectivity",
    keys: [
      { key: "5g", label: "5G", type: "boolean" },
      { key: "wifi", label: "Wi-Fi", type: "text" },
      { key: "bluetooth", label: "Bluetooth", type: "text" },
      { key: "nfc", label: "NFC", type: "boolean" },
    ],
  },
];
