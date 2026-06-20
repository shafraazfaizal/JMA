"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, AlertTriangle, Image as ImageIcon, Video } from "lucide-react";
import { deleteAlbumAction } from "@/app/admin/gallery/actions";
import type { GalleryAlbumWithPhotos } from "@/types/gallery-database";

const categoryColours: Record<string, { bg: string; text: string }> = {
    Projects: { bg: "#E8F4F6", text: "#0D5C6B" },
    Events: { bg: "#FAF5E8", text: "#B08D35" },
    Community: { bg: "#E8F4F6", text: "#094955" },
    Distributions: { bg: "#073D47", text: "#ffffff" },
};

export default function AlbumRow({ album, isLast }: { album: GalleryAlbumWithPhotos; isLast: boolean }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [isPending, startTransition] = useTransition();
    const colour = categoryColours[album.category] ?? { bg: "#F3F4F6", text: "#374151" };
    const thumbnail = album.media_type === "video" ? album.youtube_thumbnail_url : album.cover_image_url;

    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const handleDelete = () => {
        startTransition(async () => {
            await deleteAlbumAction(album.id);
        });
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.5rem",
                borderBottom: isLast ? "none" : "1px solid #F3F4F6",
                opacity: isPending ? 0.5 : 1,
                transition: "opacity 0.2s ease",
            }}
        >
            {/* Thumbnail */}
            <div style={{ width: "56px", height: "56px", borderRadius: "0.5rem", overflow: "hidden", flexShrink: 0, backgroundColor: "#F3F4F6", position: "relative" }}>
                {thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnail} alt={album.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ImageIcon size={18} style={{ color: "#D1D5DB" }} aria-hidden="true" />
                    </div>
                )}
                {album.media_type === "video" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.25)" }}>
                        <Video size={16} style={{ color: "#ffffff" }} aria-hidden="true" />
                    </div>
                )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem", flexWrap: "wrap" as const }}>
                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>
                        {album.title}
                    </p>
                    <span style={{ backgroundColor: colour.bg, color: colour.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.04em", textTransform: "uppercase" as const, padding: "0.2rem 0.625rem", borderRadius: "9999px" }}>
                        {album.category}
                    </span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                    {album.media_type === "video" ? "YouTube video" : `${album.photos.length} photo${album.photos.length === 1 ? "" : "s"}`} · {fmtDate(album.album_date)}
                </p>
            </div>

            {confirmingDelete ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#DC2626", fontWeight: 600 }}>
                        <AlertTriangle size={14} aria-hidden="true" /> Delete album?
                    </span>
                    <button onClick={handleDelete} disabled={isPending} style={{ padding: "0.4375rem 0.875rem", borderRadius: "0.375rem", border: "none", backgroundColor: "#DC2626", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}>
                        Yes, delete
                    </button>
                    <button onClick={() => setConfirmingDelete(false)} style={{ padding: "0.4375rem 0.875rem", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#374151", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}>
                        Cancel
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    <a href="/gallery" target="_blank" rel="noopener noreferrer" title="View live gallery" style={{ width: "34px", height: "34px", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", textDecoration: "none" }}>
                        <ExternalLink size={15} aria-hidden="true" />
                    </a>
                    <Link href={`/admin/gallery/${album.id}/edit`} title="Edit" style={{ width: "34px", height: "34px", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D5C6B", textDecoration: "none" }}>
                        <Pencil size={15} aria-hidden="true" />
                    </Link>
                    <button onClick={() => setConfirmingDelete(true)} title="Delete" style={{ width: "34px", height: "34px", borderRadius: "0.5rem", border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", cursor: "pointer" }}>
                        <Trash2 size={15} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}