"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, Save, Image as ImageIcon, Video, Plus } from "lucide-react";
import { uploadMedia } from "@/lib/supabase/storage";
import { createPhotoAlbumAction, createVideoAlbumAction } from "@/app/admin/gallery/actions";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/admin/gallery-utils";
import {
    adminInputStyle, AdminFieldLabel, AdminFieldHint,
    onFocusBorder, onBlurBorder,
} from "@/components/admin/AdminFormFields";

const categories = ["Projects", "Events", "Community", "Distributions"] as const;

export default function GalleryAlbumForm() {
    const router = useRouter();

    const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
    const [title, setTitle] = useState("");
    const [caption, setCaption] = useState("");
    const [category, setCategory] = useState<(typeof categories)[number]>("Projects");
    const [albumDate, setAlbumDate] = useState(new Date().toISOString().split("T")[0]);

    // Photo mode
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    // Video mode
    const [youtubeInput, setYoutubeInput] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const previewVideoId = mediaType === "video" ? extractYouTubeId(youtubeInput) : null;

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError("");
        try {
            const uploads = await Promise.all(
                Array.from(files).map((file) => uploadMedia(file, "gallery"))
            );
            setPhotoUrls((prev) => [...prev, ...uploads]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = ""; // allow re-selecting the same file
        }
    };

    const removePhoto = (url: string) => {
        setPhotoUrls((prev) => prev.filter((u) => u !== url));
    };

    const handleSubmit = async () => {
        if (!title.trim() || !caption.trim()) {
            setError("Please fill in the title and caption.");
            return;
        }

        setSubmitting(true);
        setError("");

        if (mediaType === "photo") {
            if (photoUrls.length === 0) {
                setError("Please upload at least one photo.");
                setSubmitting(false);
                return;
            }
            const result = await createPhotoAlbumAction({
                title, caption, category, album_date: albumDate, photoUrls,
            });
            if (result && !result.success) {
                setError(result.error || "Something went wrong.");
                setSubmitting(false);
            }
        } else {
            if (!previewVideoId) {
                setError("Please enter a valid YouTube link.");
                setSubmitting(false);
                return;
            }
            const result = await createVideoAlbumAction({
                title, caption, category, album_date: albumDate, youtubeUrlRaw: youtubeInput,
            });
            if (result && !result.success) {
                setError(result.error || "Something went wrong.");
                setSubmitting(false);
            }
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>

            {/* Media type toggle */}
            <div>
                <AdminFieldLabel required>Album Type</AdminFieldLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {([
                        { value: "photo" as const, icon: ImageIcon, label: "Photos", desc: "Upload one or more images" },
                        { value: "video" as const, icon: Video, label: "YouTube Video", desc: "Link an existing YouTube video" },
                    ]).map(({ value, icon: Icon, label, desc }) => {
                        const isActive = mediaType === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setMediaType(value)}
                                style={{
                                    padding: "1.125rem", borderRadius: "0.875rem",
                                    border: `2px solid ${isActive ? "#0D5C6B" : "#E5E7EB"}`,
                                    backgroundColor: isActive ? "#E8F4F6" : "#ffffff",
                                    cursor: "pointer", textAlign: "left" as const, transition: "all 0.2s ease",
                                }}
                            >
                                <Icon size={20} style={{ color: isActive ? "#0D5C6B" : "#9CA3AF", marginBottom: "0.5rem" }} aria-hidden="true" />
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9rem", color: isActive ? "#0D5C6B" : "#111827", marginBottom: "0.125rem" }}>{label}</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: isActive ? "#0D5C6B" : "#9CA3AF", opacity: isActive ? 0.75 : 1 }}>{desc}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Title */}
            <div>
                <AdminFieldLabel required>Title</AdminFieldLabel>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mankumban Masjid — Phase 2 Construction"
                    style={adminInputStyle()}
                    onFocus={onFocusBorder}
                    onBlur={onBlurBorder}
                />
            </div>

            {/* Caption */}
            <div>
                <AdminFieldLabel required>Caption</AdminFieldLabel>
                <input
                    type="text"
                    required
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Short caption shown under the photo in the gallery"
                    style={adminInputStyle()}
                    onFocus={onFocusBorder}
                    onBlur={onBlurBorder}
                />
            </div>

            {/* Category + Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div>
                    <AdminFieldLabel required>Category</AdminFieldLabel>
                    <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} style={{ ...adminInputStyle(), cursor: "pointer" }}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <AdminFieldLabel required>Date</AdminFieldLabel>
                    <input type="date" required value={albumDate} onChange={(e) => setAlbumDate(e.target.value)} style={adminInputStyle()} onFocus={onFocusBorder} onBlur={onBlurBorder} />
                </div>
            </div>

            {/* ── Photo mode: multi-upload ── */}
            {mediaType === "photo" && (
                <div>
                    <AdminFieldLabel required>Photos</AdminFieldLabel>

                    {photoUrls.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem", marginBottom: "0.875rem" }}>
                            {photoUrls.map((url, i) => (
                                <div key={url} style={{ position: "relative", borderRadius: "0.625rem", overflow: "hidden", aspectRatio: "1 / 1", border: i === 0 ? "2px solid #C9A84C" : "1.5px solid #E5E7EB" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt={`Upload ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    {i === 0 && (
                                        <span style={{ position: "absolute", bottom: "0.25rem", left: "0.25rem", backgroundColor: "rgba(201,168,76,0.95)", color: "#ffffff", fontSize: "0.6rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>COVER</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(url)}
                                        style={{ position: "absolute", top: "0.25rem", right: "0.25rem", width: "22px", height: "22px", borderRadius: "0.3rem", backgroundColor: "rgba(0,0,0,0.6)", border: "none", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                        aria-label="Remove photo"
                                    >
                                        <X size={12} aria-hidden="true" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.625rem", height: "120px", borderRadius: "0.75rem", border: "2px dashed #D1D5DB", backgroundColor: "#F9FAFB", cursor: "pointer" }}>
                        {uploading ? (
                            <Loader2 size={20} className="animate-spin" style={{ color: "#0D5C6B" }} aria-hidden="true" />
                        ) : (
                            <Plus size={20} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                        )}
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                            {uploading ? "Uploading…" : photoUrls.length > 0 ? "Add more photos" : "Click to upload photos"}
                        </span>
                        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: "none" }} disabled={uploading} />
                    </label>
                    <AdminFieldHint>You can select multiple photos at once. The first photo becomes the album cover shown on the gallery grid.</AdminFieldHint>
                </div>
            )}

            {/* ── Video mode: YouTube URL ── */}
            {mediaType === "video" && (
                <div>
                    <AdminFieldLabel required>YouTube Link</AdminFieldLabel>
                    <input
                        type="text"
                        value={youtubeInput}
                        onChange={(e) => setYoutubeInput(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or just the video ID"
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />
                    <AdminFieldHint>Paste any YouTube link — full URL, shortened youtu.be link, or just the video ID.</AdminFieldHint>

                    {previewVideoId && (
                        <div style={{ marginTop: "0.875rem", borderRadius: "0.75rem", overflow: "hidden", border: "1.5px solid #E5E7EB", maxWidth: "320px" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getYouTubeThumbnail(previewVideoId, "max")} alt="YouTube thumbnail preview" style={{ width: "100%", display: "block" }} />
                            <div style={{ padding: "0.625rem 0.875rem", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Video size={14} style={{ color: "#DC2626" }} aria-hidden="true" />
                                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#6B7280" }}>Thumbnail auto-fetched from YouTube</span>
                            </div>
                        </div>
                    )}
                    {youtubeInput && !previewVideoId && (
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.5rem" }}>
                            That doesn&apos;t look like a valid YouTube link yet.
                        </p>
                    )}
                </div>
            )}

            {error && (
                <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem", padding: "0.875rem 1rem" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#DC2626" }}>{error}</p>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #F3F4F6" }}>
                <button
                    type="button"
                    onClick={() => router.push("/admin/gallery")}
                    style={{ padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: "pointer" }}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || uploading}
                    style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "none",
                        backgroundColor: submitting ? "#094955" : "#0D5C6B", color: "#ffffff",
                        fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem",
                        cursor: submitting || uploading ? "not-allowed" : "pointer", transition: "background-color 0.2s ease",
                    }}
                >
                    {submitting ? "Publishing…" : (<><Save size={16} aria-hidden="true" /> Publish Album</>)}
                </button>
            </div>
        </div>
    );
}