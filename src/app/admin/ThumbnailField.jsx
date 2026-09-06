"use client";
import { useRef, useState } from "react";
import { divisions } from "@/lib/divisions";
import { apiUpload } from "./api";

// One branded SVG per division already ships in public/thumbnails, so a post
// can be given a sensible cover without finding an image first.
const presets = divisions.map((division) => ({
  key: division.key,
  label: division.label,
  url: `/thumbnails/${division.key}.svg`,
}));

const tabs = [
  { key: "upload", label: "Upload" },
  { key: "url", label: "Image link" },
  { key: "preset", label: "Section image" },
];

export default function ThumbnailField({ value, onChange, error }) {
  const [tab, setTab] = useState("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInput = useRef(null);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const saved = await apiUpload(file);
      onChange(saved.url);
    } catch (failure) {
      setUploadError(failure.message);
    } finally {
      setUploading(false);
      // Clear it so picking the same file again still fires a change event.
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="admin-field">
      <span className="admin-field-label">Thumbnail image</span>

      <div className="admin-thumb">
        <div className="admin-thumb-preview">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Thumbnail preview" />
          ) : (
            <span>No image yet</span>
          )}
        </div>

        <div>
          <div className="admin-thumb-tabs">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`admin-thumb-tab${tab === item.key ? " is-active" : ""}`}
                onClick={() => setTab(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === "upload" && (
            <>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFile}
                disabled={uploading}
              />
              <p className="admin-field-hint">
                {uploading ? "Uploading…" : "JPG, PNG, WebP or GIF up to 5 MB."}
              </p>
            </>
          )}

          {tab === "url" && (
            <>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={value?.startsWith("http") ? value : ""}
                onChange={(event) => onChange(event.target.value.trim())}
              />
              <p className="admin-field-hint">Paste a link to an image already on the web.</p>
            </>
          )}

          {tab === "preset" && (
            <>
              <div className="admin-thumb-presets">
                {presets.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    title={preset.label}
                    aria-label={preset.label}
                    className={`admin-thumb-preset${value === preset.url ? " is-active" : ""}`}
                    onClick={() => onChange(preset.url)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preset.url} alt="" />
                  </button>
                ))}
              </div>
              <p className="admin-field-hint">Use the ready-made image for a section.</p>
            </>
          )}

          {value && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              style={{ marginTop: 10 }}
              onClick={() => onChange("")}
            >
              Remove image
            </button>
          )}

          {(uploadError || error) && <p className="admin-field-error">{uploadError || error}</p>}
        </div>
      </div>
    </div>
  );
}
