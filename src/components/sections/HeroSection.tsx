"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import {
    CheckCircle, Calendar, Users, FolderOpen,
    CalendarDays, HandHeart, GraduationCap, Network, Shield,
    Megaphone, Newspaper, PenSquare, Flag, AlertTriangle,
    ArrowRight, ChevronLeft, ChevronRight, Play, ImageIcon,
} from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import type { FeedAnnouncement } from "@/lib/announcements-feed";
import type { FeaturedMediaItem } from "@/components/sections/MediaShowcase";

const stats = [
    { icon: Calendar, value: 20, suffix: "+", label: "Years of Service", format: false },
    { icon: Users, value: 500, suffix: "+", label: "Families Helped", format: true },
    { icon: FolderOpen, value: 300, suffix: "+", label: "Projects Delivered", format: false },
    { icon: CheckCircle, value: 100, suffix: "%", label: "Donations to Ground", format: false },
];

const pillars = [
    { icon: CalendarDays, label: "Annual Religious & Community Events" },
    { icon: HandHeart, label: "Welfare & Social Support Programmes" },
    { icon: GraduationCap, label: "Education, Training & Youth Development" },
    { icon: Network, label: "Organisational Development & Communication" },
    { icon: Shield, label: "Governance, Meetings & Compliance" },
];

type FeedType = "manual" | "news" | "blog" | "campaign" | "urgent" | "event";

const feedIcons: Record<FeedType, { icon: typeof Megaphone; colour: string; label: string }> = {
    manual: { icon: Megaphone, colour: "#C9A84C", label: "Announcement" },
    news: { icon: Newspaper, colour: "#60A5FA", label: "Latest News" },
    blog: { icon: PenSquare, colour: "#A78BFA", label: "New Blog Post" },
    campaign: { icon: Flag, colour: "#34D399", label: "New Campaign" },
    urgent: { icon: AlertTriangle, colour: "#F87171", label: "Urgent Appeal" },
    event: { icon: CalendarDays, colour: "#FBBF24", label: "Upcoming Event" },
};

// ── Media Carousel ────────────────────────────────────────────────────────────
function MediaCarousel({ items }: { items: FeaturedMediaItem[] }) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const total = items.length;

    const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
    const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

    useEffect(() => {
        if (total <= 1 || paused) return;
        const interval = setInterval(next, 4500);
        return () => clearInterval(interval);
    }, [total, paused, next]);

    if (total === 0) {
        return (
            <div style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "1.25rem",
                display: "flex", flexDirection: "column" as const,
                alignItems: "center", justifyContent: "center",
                gap: "0.75rem", padding: "2rem",
                minHeight: "360px",
            }}>
                <ImageIcon size={28} style={{ color: "rgba(255,255,255,0.2)" }} aria-hidden="true" />
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)", textAlign: "center" as const, lineHeight: 1.6 }}>
                    Feature gallery albums from the admin dashboard to display photos & videos here
                </p>
            </div>
        );
    }

    const item = items[current];

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
                position: "relative",
                borderRadius: "1.25rem",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                minHeight: "360px",
                backgroundColor: "#031e23",
            }}
        >
            {/* Slides */}
            {items.map((slide, i) => (
                <div
                    key={slide.id}
                    style={{
                        position: i === 0 ? "relative" : "absolute",
                        inset: 0,
                        opacity: i === current ? 1 : 0,
                        transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)",
                        pointerEvents: i === current ? "auto" : "none",
                        minHeight: "360px",
                    }}
                >
                    {slide.cover_url ? (
                        <Image
                            src={slide.cover_url}
                            alt={slide.title}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="400px"
                            priority={i === 0}
                        />
                    ) : (
                        <div style={{ position: "absolute", inset: 0, backgroundColor: "#073D47" }} />
                    )}

                    {/* Gradient overlay */}
                    <div aria-hidden="true" style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 100%)",
                    }} />

                    {/* Video play icon */}
                    {slide.album_type === "video" && (
                        <div style={{
                            position: "absolute", top: "50%", left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "48px", height: "48px", borderRadius: "50%",
                            backgroundColor: "rgba(0,0,0,0.55)",
                            border: "1.5px solid rgba(255,255,255,0.5)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            backdropFilter: "blur(4px)",
                        }}>
                            <Play size={18} style={{ color: "#ffffff", marginLeft: "2px" }} aria-hidden="true" />
                        </div>
                    )}
                </div>
            ))}

            {/* Caption */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "1.25rem 1.25rem 1rem", zIndex: 2,
            }}>
                <p style={{
                    fontFamily: "var(--font-inter)", fontWeight: 600,
                    fontSize: "0.65rem", letterSpacing: "0.1em",
                    textTransform: "uppercase" as const, color: "#C9A84C",
                    marginBottom: "0.25rem",
                }}>
                    {item.album_type === "video" ? "Video" : "Photos"} · {new Date(item.item_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </p>
                <p style={{
                    fontFamily: "var(--font-jakarta)", fontWeight: 700,
                    fontSize: "0.9375rem", color: "#ffffff", lineHeight: 1.3,
                }}>
                    {item.title}
                </p>
            </div>

            {/* Prev / Next */}
            {total > 1 && (
                <div style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem",
                    display: "flex", gap: "0.375rem", zIndex: 3,
                }}>
                    {[
                        { dir: -1, Icon: ChevronLeft, label: "Previous" },
                        { dir: 1, Icon: ChevronRight, label: "Next" },
                    ].map(({ dir, Icon, label }) => (
                        <button
                            key={dir}
                            onClick={() => dir === -1 ? prev() : next()}
                            aria-label={label}
                            style={{
                                width: "30px", height: "30px", borderRadius: "50%",
                                border: "1px solid rgba(255,255,255,0.25)",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                backdropFilter: "blur(8px)",
                                color: "#ffffff", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(201,168,76,0.4)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,0,0,0.4)"; }}
                        >
                            <Icon size={13} aria-hidden="true" />
                        </button>
                    ))}
                </div>
            )}

            {/* Dots + progress bar */}
            {total > 1 && (
                <>
                    <div style={{
                        position: "absolute", bottom: "0.875rem", right: "1rem",
                        display: "flex", gap: "0.3rem", zIndex: 3,
                    }}>
                        {items.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                aria-label={`Slide ${i + 1}`}
                                style={{
                                    width: i === current ? "16px" : "5px", height: "5px",
                                    borderRadius: "9999px", border: "none", padding: 0,
                                    backgroundColor: i === current ? "#C9A84C" : "rgba(255,255,255,0.4)",
                                    cursor: "pointer", transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                    {!paused && (
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", backgroundColor: "rgba(255,255,255,0.08)", zIndex: 3 }}>
                            <div
                                key={current}
                                style={{
                                    height: "100%", backgroundColor: "#C9A84C",
                                    animation: "heroProgress 4.5s linear forwards",
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ── Announcement Strip ────────────────────────────────────────────────────────
function AnnouncementStrip({ announcements }: { announcements: FeedAnnouncement[] }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        setIndex(0);
    }, [announcements.length]);

    useEffect(() => {
        if (announcements.length <= 1 || paused) return;
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [announcements.length, paused]);

    if (announcements.length === 0) return null;

    const current = announcements[index] ?? announcements[0];
    if (!current) return null;
    const feedType: FeedType = current.feed_type ?? "manual";
    const { icon: FeedIcon, colour: iconColour, label: typeLabel } = feedIcons[feedType];

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
                backgroundColor: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "1rem",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                flexDirection: "column" as const,
                gap: "0.875rem",
                position: "relative" as const,
                overflow: "hidden",
            }}
        >
            {/* Glow */}
            <div aria-hidden="true" style={{
                position: "absolute", top: "-20px", right: "-20px",
                width: "80px", height: "80px", borderRadius: "50%",
                background: `radial-gradient(circle, ${iconColour}18 0%, transparent 70%)`,
                pointerEvents: "none", transition: "background 0.4s ease",
            }} />

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                    width: "26px", height: "26px", borderRadius: "0.375rem",
                    backgroundColor: `${iconColour}20`,
                    border: `1px solid ${iconColour}50`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    transition: "all 0.3s ease",
                }}>
                    <FeedIcon size={12} style={{ color: iconColour }} aria-hidden="true" />
                </div>
                <span style={{
                    fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "0.65rem",
                    letterSpacing: "0.1em", textTransform: "uppercase" as const,
                    color: iconColour, transition: "color 0.3s ease",
                }}>
                    {typeLabel}
                </span>
            </div>

            {/* Message */}
            <div key={current.id} style={{ animation: "fadeSlide 0.4s ease" }}>
                {current.link_url ? (
                    <Link href={current.link_url} style={{ textDecoration: "none" }}>
                        <p style={{
                            fontFamily: "var(--font-jakarta)", fontWeight: 700,
                            fontSize: "0.9375rem", color: "#ffffff", lineHeight: 1.5,
                            marginBottom: "0.5rem", transition: "color 0.15s ease",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical" as const,
                            overflow: "hidden",
                        }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = iconColour; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                        >
                            {current.message}
                        </p>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.3rem",
                            fontFamily: "var(--font-inter)", fontWeight: 600,
                            fontSize: "0.8rem", color: iconColour,
                        }}>
                            Read more <ArrowRight size={12} aria-hidden="true" />
                        </span>
                    </Link>
                ) : (
                    <p style={{
                        fontFamily: "var(--font-jakarta)", fontWeight: 700,
                        fontSize: "0.9375rem", color: "#ffffff", lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                    }}>
                        {current.message}
                    </p>
                )}
            </div>

            {/* Dot nav */}
            {announcements.length > 1 && (
                <div style={{ display: "flex", gap: "0.375rem" }}>
                    {announcements.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            aria-label={`Announcement ${i + 1}`}
                            style={{
                                width: i === index ? "16px" : "5px", height: "5px",
                                borderRadius: "9999px", border: "none", padding: 0,
                                backgroundColor: i === index ? iconColour : "rgba(255,255,255,0.25)",
                                cursor: "pointer", transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main HeroSection ──────────────────────────────────────────────────────────
interface HeroSectionProps {
    announcements?: FeedAnnouncement[];
    featuredMedia?: FeaturedMediaItem[];
}

export default function HeroSection({ announcements = [], featuredMedia = [] }: HeroSectionProps) {
    const hasRightPanel = featuredMedia.length > 0 || announcements.length > 0;

    return (
        <>
            <section style={{
                position: "relative",
                minHeight: "100dvh", //100vh
                display: "flex",
                flexDirection: "column" as const,
                justifyContent: "center",
                overflow: "hidden",
            }}>
                {/* Background */}
                <div aria-hidden="true" style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse 80% 60% at 50% 40%,
                        #1a7a8f 0%, #0D5C6B 40%, #073D47 75%, #031F25 100%)`,
                    zIndex: 0,
                }} />

                {/* Gold accent overlays */}
                <div aria-hidden="true" style={{
                    position: "absolute", inset: 0, zIndex: 1,
                    backgroundImage: `
                        radial-gradient(circle at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)
                    `,
                }} />

                {/* Hero content */}
                <div
                    className="hero-grid"
                    style={{
                        position: "relative", zIndex: 2,
                        maxWidth: "80rem", margin: "0 auto",
                        padding: "8rem 1.5rem 10rem", width: "100%",
                        display: "grid",
                        gridTemplateColumns: hasRightPanel ? "1fr 400px" : "1fr",
                        gap: "6rem",
                        alignItems: "center",
                    }}
                >
                    {/* Left: main content */}
                    <div>
                        <h1 style={{
                            fontFamily: "var(--font-jakarta)", fontWeight: 800,
                            fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
                            lineHeight: 1.08, color: "#ffffff",
                            maxWidth: "820px", marginBottom: "1.5rem",
                            letterSpacing: "-0.02em",
                        }}>
                            Serving humanity,{" "}
                            <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>
                                one life at a time
                            </span>
                        </h1>

                        <p style={{
                            fontFamily: "var(--font-inter)", fontSize: "1.125rem",
                            lineHeight: 1.7, color: "rgba(255,255,255,0.75)",
                            maxWidth: "560px", marginBottom: "2.5rem",
                        }}>
                            For over 20 years, JMA has empowered communities through five pillars that strengthen lives, foster connection, and build a better future.
                        </p>

                        {/* CTAs */}
                        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.875rem", marginBottom: "2.5rem" }}>
                            <Link
                                href="/donate"
                                style={{
                                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "1rem",
                                    color: "#ffffff", backgroundColor: "#C9A84C",
                                    padding: "0.8125rem 2rem", borderRadius: "0.5rem",
                                    textDecoration: "none", transition: "background-color 0.2s ease",
                                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                    boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                            >
                                Donate Now
                            </Link>
                            <Link
                                href="/campaigns"
                                style={{
                                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "1rem",
                                    color: "#ffffff", backgroundColor: "rgba(0,0,0,0)",
                                    padding: "0.8125rem 2rem", borderRadius: "0.5rem",
                                    border: "2px solid rgba(255,255,255,0.45)",
                                    textDecoration: "none", transition: "border-color 0.2s ease, background 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.borderColor = "rgba(255,255,255,0.9)";
                                    el.style.backgroundColor = "rgba(255,255,255,0.08)";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLAnchorElement;
                                    el.style.borderColor = "rgba(255,255,255,0.45)";
                                    el.style.backgroundColor = "rgba(0,0,0,0)";
                                }}
                            >
                                Our Campaigns
                            </Link>
                        </div>

                        {/* Five Pillars */}
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                            {pillars.map(({ icon: Icon, label }) => (
                                <div key={label} style={{
                                    display: "flex", alignItems: "center", gap: "0.625rem",
                                    fontFamily: "var(--font-inter)", fontSize: "0.875rem",
                                    color: "rgba(255,255,255,0.75)", fontWeight: 500,
                                }}>
                                    <div style={{
                                        width: "26px", height: "26px", borderRadius: "0.375rem",
                                        backgroundColor: "rgba(201,168,76,0.12)",
                                        border: "1px solid rgba(201,168,76,0.25)",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>
                                        <Icon size={13} style={{ color: "#C9A84C" }} aria-hidden="true" />
                                    </div>
                                    {label}
                                </div>
                            ))}
                        </div>

                        {/* Announcement strip — mobile only, hidden on desktop */}
                        {announcements.length > 0 && (
                            <div className="hero-mobile-announcements" style={{ display: "none", marginTop: "1.5rem" }}>
                                <AnnouncementStrip announcements={announcements} />
                            </div>
                        )}
                    </div>

                    {/* Right: media carousel + announcement strip */}
                    {hasRightPanel && (
                        <div className="hero-right-panel" style={{
                            display: "flex", flexDirection: "column" as const, gap: "0.875rem",
                        }}>
                            <MediaCarousel items={featuredMedia} />
                            {announcements.length > 0 && (
                                <AnnouncementStrip announcements={announcements} />
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats card */}
            <div style={{ padding: "0 1.5rem", marginTop: "-80px", position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div className="stats-grid" style={{
                        backgroundColor: "#ffffff", borderRadius: "1rem",
                        boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.08)",
                        padding: "2rem 2.5rem",
                        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem",
                    }}>
                        {stats.map(({ icon: Icon, value, suffix, label, format }) => (
                            <div key={label} style={{
                                display: "flex", flexDirection: "column" as const,
                                alignItems: "center", textAlign: "center" as const, gap: "0.5rem",
                            }}>
                                <div style={{
                                    width: "44px", height: "44px", borderRadius: "0.625rem",
                                    backgroundColor: "#E8F4F6",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Icon size={20} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-jakarta)", fontWeight: 800,
                                    fontSize: "2rem", color: "#0D5C6B", lineHeight: 1,
                                }}>
                                    <CountUp to={value} suffix={suffix} format={format} />
                                </div>
                                <div style={{
                                    fontFamily: "var(--font-inter)", fontSize: "0.8125rem",
                                    color: "#6B7280", lineHeight: 1.3,
                                }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <style>{`
                    @keyframes fadeSlide {
                        from { opacity: 0; transform: translateY(4px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes heroProgress {
                        from { width: 0%; }
                        to   { width: 100%; }
                    }
                    // @media (max-width: 767px) {
                    //     .stats-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 1.5rem !important; }
                    //     .hero-grid { grid-template-columns: 1fr !important; padding-top: 5rem !important; padding-bottom: 8rem !important; }
                    //     .hero-right-panel { display: none !important; }
                    // }
                    @media (max-width: 767px) {
                        .stats-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 1.5rem !important; }
                        .hero-grid { grid-template-columns: 1fr !important; padding-top: 7rem !important; padding-bottom: 6rem !important; }
                        .hero-right-panel { display: none !important; }
                        .hero-mobile-announcements { display: block !important; }
                        .hero-section-mobile { 
                            min-height: auto !important;
                            justify-content: flex-start !important;
                        }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .hero-grid { grid-template-columns: 1fr 300px !important; gap: 2rem !important; }
                    }
                `}</style>
            </div>
        </>
    );
}