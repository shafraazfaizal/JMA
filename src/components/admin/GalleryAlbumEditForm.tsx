"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Save, Star, Video, AlertCircle, CheckCircle } from "lucide-react";
import { uploadMedia } from "@/lib/supabase/storage";
import {
    updateAlbumDetailsAction,
    updateAlbumVideoAction,
    addPhotoToAlbumAction,
    removePhotoFromAlbumAction,
    setAlbumCoverAction,
} from "@/app/admin/gallery/actions";
import { getYouTubeThumbnail, getYouTubeWatchUrl } from "@/lib/admin/gallery-utils";
import {
    adminInputStyle, AdminFieldLabel, AdminFieldHint,
    onFocusBorder, onBlurBorder,
} from "@/components/admin/AdminFormFields";
import type { GalleryAlbumWithPhotos } from "@/types/gallery-database";

const categories = ["Projects", "Events", "Community", "Distributions"] as const;

export default function GalleryAlbumEditForm({ album }: { album: GalleryAlbumWithPhotos }) {
    const router = useRouter();

    const [title, setTitle] = useState(album.title);
    const [caption, setCaption] = useState(album.caption);
    const [category, setCategory] = useState<(typeof categories)[number]>(album.category);
    const [albumDate, setAlbumDate] = useState(album.album_date.split("T")[0]);
    const [photos, setPhotos] = useState(album.photos);
    const [coverUrl, setCoverUrl] = useState(album.cover_image_url ?? "");

    const [uploading, setUploading] = useState(false);
    const [savingDetails, setSavingDetails] = useState(false);
    const [detailsSaved, setDetailsSaved] = useState(false);
    const [error, setError] = useState("");

    // Video-only state
    const [youtubeInput, setYoutubeInput] = useState(album.youtube_url ?? "");
    const [savingVideo, setSavingVideo] = useState(false);
    const [videoError, setVideoError] = useState("");
    const [videoSaved, setVideoSaved] = useState(false);

    const handleSaveDetails = async () => {
        setSavingDetails(true);
        await updateAlbumDetailsAction(album.id, { title, caption, category, album_date: albumDate });
        setSavingDetails(false);
        setDetailsSaved(true);
        setTimeout(() => setDetailsSaved(false), 1500);
    };

    const handleSaveVideo = async () => {
        setSavingVideo(true);
        setVideoError("");
        const result = await updateAlbumVideoAction(album.id, youtubeInput);
        setSavingVideo(false);
        if (!result.success) {
            setVideoError(result.error || "Something went wrong.");
            return;
        }
        setVideoSaved(true);
        setTimeout(() => setVideoSaved(false), 1500);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError("");
        try {
            const uploads = await Promise.all(Array.from(files).map((file) => uploadMedia(file, "gallery")));

            for (let i = 0; i < uploads.length; i++) {
                await addPhotoToAlbumAction(album.id, uploads[i], photos.length + i);
            }

            const newPhotos = uploads.map((url, i) => ({
                id: `temp-${Date.now()}-${i}`,
                album_id: album.id,
                image_url: url,
                display_order: photos.length + i,
                created_at: new Date().toISOString(),
            }));
            setPhotos((prev) => [...prev, ...newPhotos]);

            // If there was no cover yet, make the first new upload the cover
            if (!coverUrl && uploads.length > 0) {
                await setAlbumCoverAction(album.id, uploads[0]);
                setCoverUrl(uploads[0]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleRemovePhoto = async (photoId: string, imageUrl: string) => {
        await removePhotoFromAlbumAction(photoId);
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));

        // If we just removed the cover photo, promote the next one
        if (imageUrl === coverUrl) {
            const remaining = photos.filter((p) => p.id !== photoId);
            const newCover = remaining[0]?.image_url ?? "";
            if (newCover) {
                await setAlbumCoverAction(album.id, newCover);
            }
            setCoverUrl(newCover);
        }
    };

    const handleSetCover = async (imageUrl: string) => {
        await setAlbumCoverAction(album.id, imageUrl);
        setCoverUrl(imageUrl);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.75rem" }}>

            {/* Shared details */}
            <div>
                <AdminFieldLabel required>Title</AdminFieldLabel>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={adminInputStyle()} onFocus={onFocusBorder} onBlur={onBlurBorder} />
            </div>

            <div>
                <AdminFieldLabel required>Caption</AdminFieldLabel>
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} style={adminInputStyle()} onFocus={onFocusBorder} onBlur={onBlurBorder} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div>
                    <AdminFieldLabel required>Category</AdminFieldLabel>
                    <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} style={{ ...adminInputStyle(), cursor: "pointer" }}>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <AdminFieldLabel required>Date</AdminFieldLabel>
                    <input type="date" value={albumDate} onChange={(e) => setAlbumDate(e.target.value)} style={adminInputStyle()} onFocus={onFocusBorder} onBlur={onBlurBorder} />
                </div>
            </div>

            <button
                onClick={handleSaveDetails}
                disabled={savingDetails}
                style={{
                    alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.625rem 1.125rem", borderRadius: "0.5rem", border: "none",
                    backgroundColor: detailsSaved ? "#15803D" : "#0D5C6B", color: "#ffffff",
                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem",
                    cursor: savingDetails ? "not-allowed" : "pointer", transition: "background-color 0.2s ease",
                }}
            >
                {detailsSaved ? <CheckCircle size={14} aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
                {detailsSaved ? "Saved!" : savingDetails ? "Saving…" : "Save Details"}
            </button>

            <div style={{ height: "1px", backgroundColor: "#F3F4F6" }} />

            {/* ── Photo album: manage photos ── */}
            {album.media_type === "photo" && (
                <div>
                    <AdminFieldLabel>Photos ({photos.length})</AdminFieldLabel>

                    {photos.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem", marginBottom: "0.875rem" }}>
                            {photos.map((photo) => {
                                const isCover = photo.image_url === coverUrl;
                                return (
                                    <div key={photo.id} style={{ position: "relative", borderRadius: "0.625rem", overflow: "hidden", aspectRatio: "1 / 1", border: isCover ? "2px solid #C9A84C" : "1.5px solid #E5E7EB" }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={photo.image_url} alt="Album photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        {isCover && (
                                            <span style={{ position: "absolute", bottom: "0.25rem", left: "0.25rem", backgroundColor: "rgba(201,168,76,0.95)", color: "#ffffff", fontSize: "0.6rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "0.25rem" }}>COVER</span>
                                        )}
                                        <div style={{ position: "absolute", top: "0.25rem", right: "0.25rem", display: "flex", gap: "0.25rem" }}>
                                            {!isCover && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetCover(photo.image_url)}
                                                    title="Set as cover"
                                                    style={{ width: "22px", height: "22px", borderRadius: "0.3rem", backgroundColor: "rgba(0,0,0,0.6)", border: "none", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                                >
                                                    <Star size={11} aria-hidden="true" />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(photo.id, photo.image_url)}
                                                title="Remove photo"
                                                style={{ width: "22px", height: "22px", borderRadius: "0.3rem", backgroundColor: "rgba(220,38,38,0.85)", border: "none", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                            >
                                                <X size={12} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <label style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.625rem", height: "120px", borderRadius: "0.75rem", border: "2px dashed #D1D5DB", backgroundColor: "#F9FAFB", cursor: "pointer" }}>
                        {uploading ? (
                            <Loader2 size={20} className="animate-spin" style={{ color: "#0D5C6B" }} aria-hidden="true" />
                        ) : (
                            <Plus size={20} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                        )}
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                            {uploading ? "Uploading…" : "Add more photos"}
                        </span>
                        <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: "none" }} disabled={uploading} />
                    </label>
                    {error && <AdminFieldHint>{error}</AdminFieldHint>}
                    <AdminFieldHint>Hover a photo to set it as the cover (shown on the gallery grid) or remove it.</AdminFieldHint>
                </div>
            )}

            {/* ── Video album: update YouTube link ── */}
            {album.media_type === "video" && (
                <div>
                    <AdminFieldLabel required>YouTube Link</AdminFieldLabel>
                    <input
                        type="text"
                        value={youtubeInput}
                        onChange={(e) => { setYoutubeInput(e.target.value); setVideoError(""); }}
                        placeholder="https://youtube.com/watch?v=..."
                        style={adminInputStyle()}
                        onFocus={onFocusBorder}
                        onBlur={onBlurBorder}
                    />

                    {album.youtube_thumbnail_url && (
                        <div style={{ marginTop: "0.875rem", borderRadius: "0.75rem", overflow: "hidden", border: "1.5px solid #E5E7EB", maxWidth: "320px" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={album.youtube_thumbnail_url} alt="Current YouTube thumbnail" style={{ width: "100%", display: "block" }} />
                            <a
                                href={album.youtube_url ? getYouTubeWatchUrl(album.youtube_url) : "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ padding: "0.625rem 0.875rem", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
                            >
                                <Video size={14} style={{ color: "#DC2626" }} aria-hidden="true" />
                                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#6B7280" }}>Current video — click to preview</span>
                            </a>
                        </div>
                    )}

                    {videoError && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.625rem" }}>
                            <AlertCircle size={13} style={{ color: "#EF4444" }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444" }}>{videoError}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSaveVideo}
                        disabled={savingVideo}
                        style={{
                            marginTop: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.625rem 1.125rem", borderRadius: "0.5rem", border: "none",
                            backgroundColor: videoSaved ? "#15803D" : "#0D5C6B", color: "#ffffff",
                            fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem",
                            cursor: savingVideo ? "not-allowed" : "pointer", transition: "background-color 0.2s ease",
                        }}
                    >
                        {videoSaved ? <CheckCircle size={14} aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
                        {videoSaved ? "Updated!" : savingVideo ? "Updating…" : "Update Video"}
                    </button>
                </div>
            )}

            <div style={{ paddingTop: "0.5rem" }}>
                <button
                    onClick={() => router.push("/admin/gallery")}
                    style={{ padding: "0.8125rem 1.5rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: "pointer" }}
                >
                    Done — Back to Gallery
                </button>
            </div>
        </div>
    );
}