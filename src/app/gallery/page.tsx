"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    X, ChevronLeft, ChevronRight, ArrowRight,
    ImageIcon, Building2, Calendar, Users, Package,
} from "lucide-react";
import { galleryItems, galleryCategories } from "@/data/gallery";
import type { GalleryCategory } from "@/data/gallery";

// ─── Placeholder visuals per category ──────────
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

const aspectRatios: Record<string, string> = {
    wide: "4 / 3",
    tall: "3 / 4",
    square: "1 / 1",
};

// ─── Tile component — handles real image OR placeholder ──
function GalleryTile({
    item,
    onClick,
}: {
    item: (typeof galleryItems)[number];
    onClick: () => void;
}) {
    const Icon = categoryIcons[item.category];

    return (
        <button
            onClick={onClick}
            style={{
                display: "block",
                width: "100%",
                padding: 0,
                border: "none",
                borderRadius: "1rem",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                aspectRatio: aspectRatios[item.aspect],
                backgroundColor: "#F3F4F6",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
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
            aria-label={`View photo: ${item.caption}`}
        >
            {item.src ? (
                <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            ) : (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: categoryGradients[item.category],
                        display: "flex",
                        flexDirection: "column" as const,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.625rem",
                    }}
                >
                    <div
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `radial-gradient(circle at 75% 25%, rgba(201,168,76,0.15) 0%, transparent 55%)`,
                        }}
                    />
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.12)",
                            border: "1.5px solid rgba(255,255,255,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Icon size={22} style={{ color: "rgba(255,255,255,0.85)" }} aria-hidden="true" />
                    </div>
                </div>
            )}

            {/* Caption overlay — always shown (works for both states) */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.75rem 1rem 0.875rem",
                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        color: "#ffffff",
                        textAlign: "left" as const,
                        lineHeight: 1.4,
                    }}
                >
                    {item.caption}
                </p>
            </div>
        </button>
    );
}

// ─── Lightbox ───────────────────────────────────
function Lightbox({
    items,
    index,
    onClose,
    onNav,
}: {
    items: typeof galleryItems;
    index: number;
    onClose: () => void;
    onNav: (dir: -1 | 1) => void;
}) {
    const item = items[index];
    const Icon = categoryIcons[item.category];

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onNav(-1);
            if (e.key === "ArrowRight") onNav(1);
        },
        [onClose, onNav]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [handleKey]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                backgroundColor: "rgba(7,20,23,0.96)",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
            }}
            onClick={onClose}
        >
            {/* Close */}
            <button
                onClick={onClose}
                aria-label="Close"
                style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
            >
                <X size={20} aria-hidden="true" />
            </button>

            {/* Prev */}
            <button
                onClick={(e) => { e.stopPropagation(); onNav(-1); }}
                aria-label="Previous photo"
                disabled={index === 0}
                style={{
                    position: "absolute",
                    left: "1.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: index === 0 ? "rgba(255,255,255,0.25)" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: index === 0 ? "default" : "pointer",
                }}
            >
                <ChevronLeft size={22} aria-hidden="true" />
            </button>

            {/* Next */}
            <button
                onClick={(e) => { e.stopPropagation(); onNav(1); }}
                aria-label="Next photo"
                disabled={index === items.length - 1}
                style={{
                    position: "absolute",
                    right: "1.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: index === items.length - 1 ? "rgba(255,255,255,0.25)" : "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: index === items.length - 1 ? "default" : "pointer",
                }}
            >
                <ChevronRight size={22} aria-hidden="true" />
            </button>

            {/* Image / placeholder */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: "min(900px, 90vw)",
                    width: "100%",
                    aspectRatio: "4 / 3",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "#111",
                }}
            >
                {item.src ? (
                    <Image src={item.src} alt={item.alt} fill style={{ objectFit: "contain" }} sizes="90vw" />
                ) : (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: categoryGradients[item.category],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                width: "84px",
                                height: "84px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                border: "1.5px solid rgba(255,255,255,0.25)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Icon size={38} style={{ color: "rgba(255,255,255,0.8)" }} aria-hidden="true" />
                        </div>
                    </div>
                )}
            </div>

            {/* Caption */}
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "min(900px, 90vw)", width: "100%", marginTop: "1.25rem", textAlign: "center" as const }}>
                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#ffffff", marginBottom: "0.375rem" }}>
                    {item.caption}
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}>
                    {item.category} · {index + 1} of {items.length}
                </p>
            </div>
        </div>
    );
}

// ─── Page ───────────────────────────────────────
function GalleryPageInner() {
    const searchParams = useSearchParams();
    const initialCategory = (searchParams.get("category") as GalleryCategory | null) || "All";

    const [category, setCategory] = useState<GalleryCategory | "All">(initialCategory);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const filtered =
        category === "All" ? galleryItems : galleryItems.filter((g) => g.category === category);

    const sorted = [...filtered].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const handleNav = (dir: -1 | 1) => {
        setLightboxIndex((i) => {
            if (i === null) return i;
            const next = i + dir;
            if (next < 0 || next >= sorted.length) return i;
            return next;
        });
    };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Gallery
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "560px", marginBottom: "1rem" }}>
                        Moments from the ground
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "520px" }}>
                        Projects, distributions, events, and community gatherings — a visual record of your generosity in action.
                    </p>
                </div>
            </section>

            {/* ── Filters ── */}
            <section style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB", padding: "1.25rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                    {galleryCategories.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setCategory(value)}
                            style={{
                                padding: "0.5rem 1.125rem",
                                borderRadius: "9999px",
                                border: `1.5px solid ${category === value ? "#0D5C6B" : "#E5E7EB"}`,
                                backgroundColor: category === value ? "#E8F4F6" : "#ffffff",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: category === value ? "#0D5C6B" : "#6B7280",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Masonry grid ── */}
            <section style={{ padding: "3rem 1.5rem 5rem", backgroundColor: "#F9FAFB" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    {sorted.length === 0 ? (
                        <div style={{ textAlign: "center" as const, padding: "5rem 1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB" }}>
                            <ImageIcon size={32} style={{ color: "#D1D5DB", margin: "0 auto 1rem" }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>No photos in this category yet.</p>
                        </div>
                    ) : (
                        <div className="gallery-masonry">
                            {sorted.map((item, i) => (
                                <div key={item.id} className="gallery-masonry-item">
                                    <GalleryTile item={item} onClick={() => setLightboxIndex(i)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section style={{ backgroundColor: "#073D47", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.875rem" }}>
                        Be part of the next photo
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                        Every donation funds the projects and moments captured here.
                    </p>
                    <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none" }}>
                        Donate Now <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* ── Lightbox ── */}
            {lightboxIndex !== null && (
                <Lightbox
                    items={sorted}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onNav={handleNav}
                />
            )}

            <style>{`
        .gallery-masonry {
          columns: 3;
          column-gap: 1.25rem;
        }
        .gallery-masonry-item {
          break-inside: avoid;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 1023px) {
          .gallery-masonry { columns: 2; }
        }
        @media (max-width: 639px) {
          .gallery-masonry { columns: 1; }
        }
      `}</style>
        </main>
    );
}

export default function GalleryPage() {
    return (
        <Suspense>
            <GalleryPageInner />
        </Suspense>
    );
}