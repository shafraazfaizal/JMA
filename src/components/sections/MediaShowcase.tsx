"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";

export interface FeaturedMediaItem {
    id: string;
    title: string;
    caption: string | null;
    cover_url: string | null;       // first photo URL or YouTube thumbnail
    youtube_video_id: string | null;
    album_type: "photos" | "video";
    item_date: string;
}

interface MediaShowcaseProps {
    items: FeaturedMediaItem[];
}

// ── Placeholder shown when no items are featured yet ─────────────────────────
function EmptyState() {
    return (
        <section style={{ backgroundColor: "#0a1628", padding: "5rem 1.5rem" }}>
            <div style={{ maxWidth: "80rem", margin: "0 auto", textAlign: "center" }}>
                <div style={{
                    width: "64px", height: "64px", borderRadius: "1rem",
                    backgroundColor: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.25rem",
                }}>
                    <ImageIcon size={24} style={{ color: "#C9A84C" }} aria-hidden="true" />
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.75rem" }}>
                    From the Ground
                </p>
                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
                    Photos & Videos
                </h2>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                    Featured photos and videos will appear here once the admin marks gallery albums as featured.
                </p>
            </div>
        </section>
    );
}

// ── YouTube modal lightbox ────────────────────────────────────────────────────
function VideoModal({ videoId, title, onClose }: { videoId: string; title: string; onClose: () => void }) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Prevent body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 9999,
                backgroundColor: "rgba(0,0,0,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "1.5rem",
                backdropFilter: "blur(6px)",
                animation: "fadeIn 0.2s ease",
            }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                aria-label="Close video"
                style={{
                    position: "absolute", top: "1.25rem", right: "1.25rem",
                    width: "42px", height: "42px", borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    color: "#ffffff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 10000, transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.1)"; }}
            >
                <X size={18} aria-hidden="true" />
            </button>

            {/* Video container — stop click propagation so clicking the iframe doesn't close modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%", maxWidth: "960px",
                    borderRadius: "0.875rem", overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                    animation: "scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
            >
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: "absolute", top: 0, left: 0,
                            width: "100%", height: "100%",
                            border: "none",
                        }}
                    />
                </div>
            </div>

            <style>{`
                @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}

// ── Individual slide ──────────────────────────────────────────────────────────
function Slide({ item, isActive, onPlayClick }: { item: FeaturedMediaItem; isActive: boolean; onPlayClick: () => void }) {
    const isYoutube = item.album_type === "video" && item.youtube_video_id;

    return (
        <div
            style={{
                position: "absolute", inset: 0,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: isActive ? "auto" : "none",
            }}
        >
            {/* Media */}
            {item.cover_url ? (
                <Image
                    src={item.cover_url}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="100vw"
                    priority={isActive}
                />
            ) : (
                <div style={{ position: "absolute", inset: 0, backgroundColor: "#073D47" }} />
            )}

            {/* Cinematic gradient overlay */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute", inset: 0,
                    background: `
            linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 100%),
            linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 50%)
          `,
                }}
            />

            {/* YouTube play button — now clickable */}
            {isYoutube && (
                <button
                    onClick={onPlayClick}
                    aria-label={`Play ${item.title}`}
                    style={{
                        position: "absolute", top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "64px", height: "64px", borderRadius: "50%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        border: "2px solid rgba(255,255,255,0.6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backdropFilter: "blur(4px)",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.transform = "translate(-50%, -50%) scale(1.1)";
                        el.style.backgroundColor = "rgba(201,168,76,0.7)";
                        el.style.borderColor = "#C9A84C";
                    }}
                    onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.transform = "translate(-50%, -50%) scale(1)";
                        el.style.backgroundColor = "rgba(0,0,0,0.6)";
                        el.style.borderColor = "rgba(255,255,255,0.6)";
                    }}
                >
                    <Play size={22} style={{ color: "#ffffff", marginLeft: "3px" }} aria-hidden="true" />
                </button>
            )}

            {/* Caption */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "2rem 2.5rem",
            }}>
                <p style={{
                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "#C9A84C", marginBottom: "0.5rem",
                }}>
                    {new Date(item.item_date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </p>
                <h3 style={{
                    fontFamily: "var(--font-jakarta)", fontWeight: 800,
                    fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                    color: "#ffffff", lineHeight: 1.25,
                    letterSpacing: "-0.01em", marginBottom: "0.375rem",
                    maxWidth: "560px",
                }}>
                    {item.title}
                </h3>
                {item.caption && (
                    <p style={{
                        fontFamily: "var(--font-inter)", fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.65)", lineHeight: 1.6,
                        maxWidth: "480px",
                    }}>
                        {item.caption}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MediaShowcase({ items }: MediaShowcaseProps) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [modalVideoId, setModalVideoId] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string>("");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const total = items.length;

    const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
    const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

    const openModal = useCallback((videoId: string, title: string) => {
        setModalVideoId(videoId);
        setModalTitle(title);
        setPaused(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalVideoId(null);
        setModalTitle("");
        setPaused(false);
    }, []);

    useEffect(() => {
        if (total <= 1 || paused) return;
        intervalRef.current = setInterval(next, 5000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [total, paused, next]);

    if (total === 0) return <EmptyState />;

    return (
        <>
            {/* YouTube modal */}
            {modalVideoId && (
                <VideoModal
                    videoId={modalVideoId}
                    title={modalTitle}
                    onClose={closeModal}
                />
            )}

            <section
                onMouseEnter={() => { if (!modalVideoId) setPaused(true); }}
                onMouseLeave={() => { if (!modalVideoId) setPaused(false); }}
                style={{ backgroundColor: "#000000", position: "relative" }}
            >
                {/* Section label above */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
                    padding: "1.5rem 2.5rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div>
                        <p style={{
                            fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem",
                            letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C",
                            marginBottom: "0.25rem",
                        }}>
                            From the Ground
                        </p>
                        <h2 style={{
                            fontFamily: "var(--font-jakarta)", fontWeight: 800,
                            fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)",
                            color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1,
                        }}>
                            Photos & Videos
                        </h2>
                    </div>

                    {/* Slide counter */}
                    {total > 1 && (
                        <p style={{
                            fontFamily: "var(--font-inter)", fontSize: "0.8125rem",
                            color: "rgba(255,255,255,0.4)", fontWeight: 500,
                        }}>
                            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </p>
                    )}
                </div>

                {/* Slides container — 16:9 cinematic ratio */}
                <div style={{
                    position: "relative",
                    paddingBottom: "52%",
                    width: "100%",
                    backgroundColor: "#000",
                    overflow: "hidden",
                }}
                    className="media-showcase-slides"
                >
                    {items.map((item, i) => (
                        <Slide
                            key={item.id}
                            item={item}
                            isActive={i === current}
                            onPlayClick={() => {
                                if (item.youtube_video_id) {
                                    openModal(item.youtube_video_id, item.title);
                                }
                            }}
                        />
                    ))}
                </div>

                {/* Controls */}
                {total > 1 && (
                    <div style={{
                        position: "absolute", bottom: "1.75rem", right: "2rem",
                        display: "flex", alignItems: "center", gap: "0.5rem", zIndex: 10,
                    }}>
                        {/* Dot indicators */}
                        <div style={{ display: "flex", gap: "0.375rem", marginRight: "0.75rem" }}>
                            {items.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    style={{
                                        width: i === current ? "24px" : "6px", height: "6px",
                                        borderRadius: "9999px", border: "none", padding: 0, cursor: "pointer",
                                        backgroundColor: i === current ? "#C9A84C" : "rgba(255,255,255,0.35)",
                                        transition: "all 0.3s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Prev / Next */}
                        {[
                            { dir: -1, Icon: ChevronLeft, label: "Previous" },
                            { dir: 1, Icon: ChevronRight, label: "Next" },
                        ].map(({ dir, Icon, label }) => (
                            <button
                                key={dir}
                                onClick={() => dir === -1 ? prev() : next()}
                                aria-label={label}
                                style={{
                                    width: "38px", height: "38px", borderRadius: "50%",
                                    border: "1.5px solid rgba(255,255,255,0.25)",
                                    backgroundColor: "rgba(0,0,0,0.4)",
                                    backdropFilter: "blur(8px)",
                                    color: "#ffffff", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "background 0.2s ease, border-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLButtonElement;
                                    el.style.backgroundColor = "rgba(201,168,76,0.3)";
                                    el.style.borderColor = "#C9A84C";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLButtonElement;
                                    el.style.backgroundColor = "rgba(0,0,0,0.4)";
                                    el.style.borderColor = "rgba(255,255,255,0.25)";
                                }}
                            >
                                <Icon size={16} aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Progress bar */}
                {total > 1 && !paused && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", backgroundColor: "rgba(255,255,255,0.1)", zIndex: 10 }}>
                        <div
                            key={current}
                            style={{
                                height: "100%", backgroundColor: "#C9A84C",
                                animation: "progressBar 5s linear forwards",
                            }}
                        />
                    </div>
                )}

                <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @media (max-width: 767px) {
          .media-showcase-slides { padding-bottom: 70% !important; }
        }
      `}</style>
            </section>
        </>
    );
}