"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import { resolveImage } from "@/lib/utils";
import { Button, Label } from "./ui";

export default function ImageUpload({
  value,
  onChange,
  folder = "media",
  label = "Image",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preview = resolveImage(value);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { url } = await api.uploadFile(file, folder);
      onChange(url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-ink">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-bone-faint">None</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line px-4 py-2 text-sm text-bone transition-colors hover:border-bone">
            {uploading ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
          {value && (
            <Button variant="ghost" onClick={() => onChange(null)} type="button" className="px-0">
              Remove
            </Button>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
