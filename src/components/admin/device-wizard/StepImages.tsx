"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWizard } from "./WizardContext";
import { setDeviceImageAction } from "@/app/admin/devices/actions";
import { createClient } from "@/lib/supabase/client";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function StepImages() {
  const { deviceId, nextStep, prevStep, markStepComplete } = useWizard();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing image_url from the device record via wizard context
  useEffect(() => {
    if (!deviceId) {
      setIsLoading(false);
      return;
    }
    // Fetch current image_url for this device
    const supabase = createClient();
    supabase
      .from("devices")
      .select("image_url")
      .eq("id", deviceId)
      .single()
      .then(({ data }) => {
        if (data?.image_url) setImageUrl(data.image_url);
        setIsLoading(false);
      });
  }, [deviceId]);

  const uploadFile = async (file: File) => {
    if (!deviceId) return;
    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `devices/${deviceId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("device-images")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("device-images")
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl;

      // Save URL to the devices.image_url column
      const result = await setDeviceImageAction(deviceId, publicUrl);
      if (result.success) {
        setImageUrl(publicUrl);
      }
    } catch (e) {
      console.error("Upload error:", e);
    }
    setIsUploading(false);
  };

  const handleRemove = async () => {
    if (!deviceId) return;
    await setDeviceImageAction(deviceId, null);
    setImageUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = Array.from(e.dataTransfer.files).find((f) =>
      f.type.startsWith("image/")
    );
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
          Step 5 of 7
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100 tracking-tight">
          Device Image
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Upload the main device image. This will appear on the device card and
          detail page.
        </p>
      </div>

      {/* Current image preview */}
      {imageUrl ? (
        <div className="relative group rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/50 aspect-video flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Device"
            className="max-h-64 object-contain"
          />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
          {/* Replace label */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-xs font-semibold text-zinc-200 bg-zinc-900/80 px-3 py-1.5 rounded-lg">
              Click to replace
            </span>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed p-16 flex flex-col items-center gap-3 cursor-pointer transition-all",
            dragOver
              ? "border-zinc-500 bg-zinc-800/30"
              : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
              <p className="text-sm text-zinc-500">Uploading…</p>
            </>
          ) : (
            <>
              {dragOver ? (
                <Upload className="w-8 h-8 text-zinc-400" />
              ) : (
                <ImageIcon className="w-8 h-8 text-zinc-600" />
              )}
              <p className="text-sm text-zinc-400 font-medium">
                Drop an image here, or click to browse
              </p>
              <p className="text-xs text-zinc-600">PNG, JPG, WebP</p>
            </>
          )}
        </div>
      )}

      {/* Uploading overlay when replacing */}
      {isUploading && imageUrl && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading new image…
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

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
          onClick={() => {
            markStepComplete(5);
            nextStep();
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-semibold hover:bg-white transition-all"
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
