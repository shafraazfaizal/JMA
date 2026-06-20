"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    X, ChevronLeft, ChevronRight, ArrowRight,
    Image as ImageIcon, Play, Building2, Calendar, Users, Package,
} from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/admin/gallery-utils";
import type { GalleryAlbumWithPhotos } from "@/types/gallery-database";

type GalleryCategory = "Projects" | "Events" | "Community" | "Distributions";

const galleryCategories: { value: GalleryCategory | "All"; label: string }[] = [
    { value: "All", label: "All Albums" },
    { value: "Projects", label: "Projects" },
    { value: "Events", label: "Events" },
    { value: "Community", label: "Community" },
    { value: "Distributions", label: "Distributions" },
];

const categoryIcons: Record<GalleryCategory, typeof Building2> = {
    Projects: Building2,
    Events: Calendar,
    Community: Users,
    Distributions: Package,
};

const categoryGradients: Record<GalleryCategory, string> = {
    Projects: "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)",
    Events: "linear-gradient(135deg, #B08D35 0%, #C9A84C 55%, #8F7026 100%)",
    Community: "linear-gradient(135deg, #094955 0%, #0D5C6B 60%, #1a7a8f 100%)",
    Distributions: "linear-gradient(135deg, #073D47 0%, #0D5C6B 100%)",
};

// ─── Album tile ────────────────────────────────
function AlbumTile({ album, onClick }: { album: GalleryAlbumWithPhotos; onClick: () => void }) {
    const Icon = categoryIcons[album.category];
    const thumbnail = album.media_type === "video" ? album.youtube_thumbnail_url : album.cover_image_url;
    const photoCount = album.photos.length;

    return (
        <button
            onClick={onClick}
            style={{
                display: "block", width: "100%", padding: 0, border: "none", borderRadius: "1rem",
                overflow: "hidden", cursor: "pointer", position: "relative", aspectRatio: "4 / 3",
                backgroundColor: "#F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 12px 32px -6px rgba(0,0,0,0.18)";
                el.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                el.style.transform = "translateY(0)";
            }}
            aria-label={`Open album: ${album.title}`}
        >
            {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt={album.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
                <div style={{ position: "absolute", inset: 0, background: categoryGradients[album.category], display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={22} style={{ color: "rgba(255,255,255,0.85)" }} aria-hidden="true" />
                    </div>
                </div>
            )}

            {/* Video play overlay */}
            {album.media_type === "video" && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.15)" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
                        <Play size={22} style={{ color: "#0D5C6B", marginLeft: "3px" }} fill="#0D5C6B" aria-hidden="true" />
                    </div>
                </div>
            )}

            {/* Multi-photo badge */}
            {album.media_type === "photo" && photoCount > 1 && (
                <span style={{ position: "absolute", top: "0.75rem", right: "0.75rem", backgroundColor: "rgba(0,0,0,0.6)", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "0.375rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <ImageIcon size={11} aria-hidden="true" /> {photoCount}
                </span>
            )}

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.75rem 1rem 0.875rem", background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#ffffff", textAlign: "left" as const, lineHeight: 1.4 }}>
                    {album.title}
                </p>
            </div>
        </button>
    );
}

// ─── Lightbox ───────────────────────────────────
function Lightbox({ album, onClose }: { album: GalleryAlbumWithPhotos; onClose: () => void }) {
    const [photoIndex, setPhotoIndex] = useState(0);
    const isVideo = album.media_type === "video";
    const photos = album.photos;

    const navPhoto = useCallback((dir: -1 | 1) => {
        setPhotoIndex((i) => {
            const next = i + dir;
            if (next < 0 || next >= photos.length) return i;
            return next;
        });
    }, [photos.length]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (!isVideo) {
                if (e.key === "ArrowLeft") navPhoto(-1);
                if (e.key === "ArrowRight") navPhoto(1);
            }
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose, navPhoto, isVideo]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(7,20,23,0.96)", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                aria-label="Close"
                style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}
            >
                <X size={20} aria-hidden="true" />
            </button>

            {isVideo ? (
                <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(960px, 92vw)", width: "100%" }}>
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "0.75rem", overflow: "hidden", backgroundColor: "#000" }}>
                        {album.youtube_url && (
                            <iframe
                                src={`${getYouTubeEmbedUrl(album.youtube_url)}?autoplay=1`}
                                title={album.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                            />
                        )}
                    </div>
                    <div style={{ marginTop: "1.25rem", textAlign: "center" as const }}>
                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#ffffff", marginBottom: "0.375rem" }}>{album.title}</p>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}>{album.caption}</p>
                    </div>
                </div>
            ) : (
                <>
                    {photos.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navPhoto(-1); }}
                            disabled={photoIndex === 0}
                            aria-label="Previous photo"
                            style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.08)", color: photoIndex === 0 ? "rgba(255,255,255,0.25)" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: photoIndex === 0 ? "default" : "pointer", zIndex: 2 }}
                        >
                            <ChevronLeft size={22} aria-hidden="true" />
                        </button>
                    )}

                    {photos.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); navPhoto(1); }}
                            disabled={photoIndex === photos.length - 1}
                            aria-label="Next photo"
                            style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.08)", color: photoIndex === photos.length - 1 ? "rgba(255,255,255,0.25)" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: photoIndex === photos.length - 1 ? "default" : "pointer", zIndex: 2 }}
                        >
                            <ChevronRight size={22} aria-hidden="true" />
                        </button>
                    )}

                    <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(900px, 90vw)", width: "100%", aspectRatio: "4 / 3", borderRadius: "0.75rem", overflow: "hidden", position: "relative", backgroundColor: "#111" }}>
                        {photos[photoIndex] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photos[photoIndex].image_url} alt={album.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                            <div style={{ position: "absolute", inset: 0, background: categoryGradients[album.category] }} />
                        )}
                    </div>

                    <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(900px, 90vw)", width: "100%", marginTop: "1.25rem", textAlign: "center" as const }}>
                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#ffffff", marginBottom: "0.375rem" }}>{album.title}</p>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}>
                            {album.caption}
                            {photos.length > 1 && <> · {photoIndex + 1} of {photos.length}</>}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Page ───────────────────────────────────────
function GalleryPageInner({ albums }: { albums: GalleryAlbumWithPhotos[] }) {
    const searchParams = useSearchParams();
    const initialCategory = (searchParams.get("category") as GalleryCategory | null) || "All";

    const [category, setCategory] = useState<GalleryCategory | "All">(initialCategory);
    const [activeAlbum, setActiveAlbum] = useState<GalleryAlbumWithPhotos | null>(null);

    const filtered = category === "All" ? albums : albums.filter((a) => a.category === category);
    const sorted = [...filtered].sort((a, b) => new Date(b.album_date).getTime() - new Date(a.album_date).getTime());

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>Gallery</p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "560px", marginBottom: "1rem" }}>Moments from the ground</h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "520px" }}>
                        Projects, distributions, events, and community gatherings — a visual record of your generosity in action.
                    </p>
                </div>
            </section>

            <section style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB", padding: "1.25rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                    {galleryCategories.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setCategory(value)}
                            style={{ padding: "0.5rem 1.125rem", borderRadius: "9999px", border: `1.5px solid ${category === value ? "#0D5C6B" : "#E5E7EB"}`, backgroundColor: category === value ? "#E8F4F6" : "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: category === value ? "#0D5C6B" : "#6B7280", cursor: "pointer", transition: "all 0.15s ease" }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            <section style={{ padding: "3rem 1.5rem 5rem", backgroundColor: "#F9FAFB" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    {sorted.length === 0 ? (
                        <div style={{ textAlign: "center" as const, padding: "5rem 1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB" }}>
                            <ImageIcon size={32} style={{ color: "#D1D5DB", margin: "0 auto 1rem" }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>
                                {albums.length === 0 ? "No albums published yet — check back soon." : "No albums in this category yet."}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="gallery-grid">
                            {sorted.map((album) => (
                                <AlbumTile key={album.id} album={album} onClick={() => setActiveAlbum(album)} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section style={{ backgroundColor: "#073D47", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.875rem" }}>Be part of the next photo</h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "1.75rem" }}>Every donation funds the projects and moments captured here.</p>
                    <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none" }}>
                        Donate Now <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {activeAlbum && <Lightbox album={activeAlbum} onClose={() => setActiveAlbum(null)} />}

            <style>{`
        @media (max-width: 1023px) { .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 639px) { .gallery-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </main>
    );
}

export default function GalleryPageClient({ albums }: { albums: GalleryAlbumWithPhotos[] }) {
    return (
        <Suspense>
            <GalleryPageInner albums={albums} />
        </Suspense>
    );
}