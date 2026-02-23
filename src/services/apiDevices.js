import { supabase } from "@/lib/supabase";

export async function getProducts() {
    const { data, error } = await supabase
      .from("devices")
      .select(`
        *,
        brands ( name, logo_url ),
        device_variants ( price_launch_usd ),
        device_specs ( spec_key, raw_value )
      `)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
}

  export async function getDeviceBySlug(slug) {
    const { data, error } = await supabase
      .from("devices")
      .select(`
        *,
        brands ( name, logo_url ),
        device_variants ( * ),
        device_specs (
          spec_key,
          raw_value,
          spec_definitions ( display_label, category, unit )
        )
      `)
      .eq("slug", slug)
      .single();
  
    if (error) throw new Error("Device not found");
    return data;
  }

  export async function getDevicesForBattle(ids) {
    if (!ids.length) return [];
    
    const { data, error } = await supabase
      .from("devices")
      .select(`
        *,
        brands ( name, logo_url ),
        device_specs (
          spec_key,
          raw_value,
          spec_definitions ( display_label, category, unit )
        )
      `)
      .in("id", ids); // Fetch all IDs in one request
  
    if (error) throw new Error("Comparison data unavailable");
    return data;
  }

  export async function deleteDevice(id) {
    const { error } = await supabase
      .from("devices")
      .delete()
      .eq("id", id);
  
    if (error) {
      console.error("Delete failed:", error);
      throw new Error("Could not delete device");
    }
  }

  // FETCH BRANDS FOR DROPDOWN
export async function getBrands() {
  const { data, error } = await supabase.from("brands").select("*");
  if (error) throw new Error("Could not load brands");
  return data;
}

// THE "GOD MODE" INSERT
export async function createFullDevice({ device, variant, specs }) {
  // 1. Create the Device
  const { data: devData, error: devError } = await supabase
    .from("devices")
    .insert([{
      brand_id: device.brand_id,
      model_name: device.model_name,
      slug: device.slug,
      image_url: device.image_url,
      ai_summary: device.ai_summary
    }])
    .select()
    .single();

  if (devError) throw devError;
  const deviceId = devData.id;

  // 2. Create the Variant (Price/Storage)
  const { error: varError } = await supabase
    .from("device_variants")
    .insert([{
      device_id: deviceId,
      region: "Global",
      price_launch_usd: variant.price,
      storage_gb: variant.storage,
      ram_gb: variant.ram
    }]);

  if (varError) throw varError;

  // 3. Create Specs (Loop through keys)
  // We filter out empty specs to keep DB clean
  const specInserts = Object.entries(specs)
    .filter(([_, value]) => value) // only non-empty
    .map(([key, value]) => ({
      device_id: deviceId,
      spec_key: key,
      raw_value: value
    }));

  if (specInserts.length > 0) {
    const { error: specError } = await supabase
      .from("device_specs")
      .insert(specInserts);
    
    if (specError) throw specError;
  }

  return devData;
}

// 1. GET FULL DEVICE DATA FOR EDITING
export async function getDeviceById(id) {
  const { data, error } = await supabase
    .from("devices")
    .select(`
      *,
      device_variants (*),
      device_specs (*)
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error("Could not load device data");
  return data;
}

// 2. UPDATE DEVICE (The Complex Part)
export async function updateFullDevice(id, { device, variant, specs }) {
  // A. Update Main Device Info
  const { error: devError } = await supabase
    .from("devices")
    .update(device)
    .eq("id", id);
  if (devError) throw devError;

  // B. Update Variant (Assuming single variant for now)
  // We need to find the variant ID or just update by device_id
  const { error: varError } = await supabase
    .from("device_variants")
    .update({
        price_launch_usd: variant.price,
        storage_gb: variant.storage,
        ram_gb: variant.ram
    })
    .eq("device_id", id); // Updates all variants for this device (simplified)
  if (varError) throw varError;

  // C. Update Specs (Delete All & Re-insert Strategy - Safest)
  await supabase.from("device_specs").delete().eq("device_id", id);
  
  const specInserts = Object.entries(specs)
    .filter(([_, value]) => value)
    .map(([key, value]) => ({
      device_id: id,
      spec_key: key,
      raw_value: value
    }));

  if (specInserts.length > 0) {
    const { error: specError } = await supabase.from("device_specs").insert(specInserts);
    if (specError) throw specError;
  }
}

export async function uploadDeviceImage(file) {
  // 1. Create a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // 2. Upload to 'gadgets' bucket
  const { error: uploadError } = await supabase.storage
    .from('gadgets')
    .upload(filePath, file);

  if (uploadError) throw new Error("Image upload failed");

  // 3. Get the Public URL
  const { data } = supabase.storage
    .from('gadgets')
    .getPublicUrl(filePath);

  return data.publicUrl;
}