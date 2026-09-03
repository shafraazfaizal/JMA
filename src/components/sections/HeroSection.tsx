"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    CheckCircle, Calendar, Users, FolderOpen,
    CalendarDays, HandHeart, GraduationCap, Network, Shield,
    Megaphone, ArrowRight, ChevronLeft, ChevronRight,
} from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import type { DBHeroAnnouncement } from "@/types/announcement-types";

const stats = [
    { icon: Calendar, value: 20, suffix: "+", label: "Years of Service" },
    { icon: Users, value: 3000, suffix: "+", label: "Families Helped", format: true },
    { icon: FolderOpen, value: 200, suffix: "+", label: "Projects Delivered" },
    { icon: CheckCircle, value: 100, suffix: "%", label: "Donations to Ground" },
];

const pillars = [
    { icon: CalendarDays, label: "Annual Religious & Community Events" },
    { icon: HandHeart, label: "Welfare & Social Support Programmes" },
    { icon: GraduationCap, label: "Education, Training & Youth Development" },
    { icon: Network, label: "Organisational Development & Communication" },
    { icon: Shield, label: "Governance, Meetings & Compliance" },
];

// ── Glassmorphism Announcement Panel ─────────────────────────────────────────
function AnnouncementPanel({ announcements }: { announcements: DBHeroAnnouncement[] }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (announcements.length <= 1 || paused) return;
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [announcements.length, paused]);

    if (announcements.length === 0) return null;

    const current = announcements[index];

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.07)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                borderRadius: "1.25rem",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.12)",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column" as const,
                gap: "1rem",
                minHeight: "200px",
                position: "relative" as const,
                overflow: "hidden",
            }}
        >
            {/* Subtle inner glow */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute", top: "-30px", right: "-30px",
                    width: "120px", height: "120px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative", zIndex: 1 }}>
                <div style={{
                    width: "28px", height: "28px", borderRadius: "0.5rem",
                    backgroundColor: "rgba(201,168,76,0.15)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                    <Megaphone size={13} style={{ color: "#C9A84C" }} aria-hidden="true" />
                </div>
                <span style={{
                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem",
                    letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C",
                }}>
                    Latest Announcements
                </span>
            </div>

            {/* Message */}
            <div
                key={current.id}
                style={{ flex: 1, position: "relative", zIndex: 1, animation: "fadeSlide 0.4s ease" }}
            >
                {current.link_url ? (
                    <Link href={current.link_url} style={{ textDecoration: "none" }}>
                        <p
                            style={{
                                fontFamily: "var(--font-jakarta)", fontWeight: 700,
                                fontSize: "1.0625rem", color: "#ffffff", lineHeight: 1.5,
                                marginBottom: "0.75rem", transition: "color 0.15s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C9A84C"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                        >
                            {current.message}
                        </p>
                        <span style={{
                            display: "inline-flex", alignItems: "center", gap: "0.3rem",
                            fontFamily: "var(--font-inter)", fontWeight: 600,
                            fontSize: "0.8125rem", color: "#C9A84C",
                        }}>
                            Read more <ArrowRight size={13} aria-hidden="true" />
                        </span>
                    </Link>
                ) : (
                    <p style={{
                        fontFamily: "var(--font-jakarta)", fontWeight: 700,
                        fontSize: "1.0625rem", color: "#ffffff", lineHeight: 1.5,
                    }}>
                        {current.message}
                    </p>
                )}
            </div>

            {/* Navigation */}
            {announcements.length > 1 && (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "relative", zIndex: 1,
                }}>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                        {announcements.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to announcement ${i + 1}`}
                                style={{
                                    width: i === index ? "18px" : "6px", height: "6px",
                                    borderRadius: "9999px", border: "none",
                                    backgroundColor: i === index ? "#C9A84C" : "rgba(255,255,255,0.3)",
                                    cursor: "pointer", padding: 0, transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                        {[
                            { dir: -1 as const, Icon: ChevronLeft, disabled: index === 0 },
                            { dir: 1 as const, Icon: ChevronRight, disabled: index === announcements.length - 1 },
                        ].map(({ dir, Icon, disabled }) => (
                            <button
                                key={dir}
                                onClick={() => setIndex((i) => Math.max(0, Math.min(announcements.length - 1, i + dir)))}
                                disabled={disabled}
                                aria-label={dir === -1 ? "Previous" : "Next"}
                                style={{
                                    width: "26px", height: "26px", borderRadius: "0.375rem",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                    color: disabled ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.8)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: disabled ? "default" : "pointer",
                                    transition: "background 0.15s ease",
                                }}
                            >
                                <Icon size={13} aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

// ── Main HeroSection ──────────────────────────────────────────────────────────
interface HeroSectionProps {
    announcements?: DBHeroAnnouncement[];
}

export default function HeroSection({ announcements = [] }: HeroSectionProps) {
    const hasAnnouncements = announcements.length > 0;

    return (
        <>
            <section
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column" as const,
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                {/* Background */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute", inset: 0,
                        background: `radial-gradient(ellipse 80% 60% at 50% 40%,
              #1a7a8f 0%, #0D5C6B 40%, #073D47 75%, #031F25 100%)`,
                        zIndex: 0,
                    }}
                />

                {/* Gold accent overlays */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute", inset: 0, zIndex: 1,
                        backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)
            `,
                    }}
                />

                {/* Hero content */}
                <div
                    className="hero-grid"
                    style={{
                        position: "relative", zIndex: 2,
                        maxWidth: "80rem", margin: "0 auto",
                        padding: "8rem 1.5rem 10rem", width: "100%",
                        display: "grid",
                        gridTemplateColumns: hasAnnouncements ? "1fr 380px" : "1fr",
                        gap: "3rem",
                        alignItems: "center",
                    }}
                >
                    {/* ── Left: main content ── */}
                    <div>
                        <h1
                            style={{
                                fontFamily: "var(--font-jakarta)", fontWeight: 800,
                                fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
                                lineHeight: 1.08, color: "#ffffff",
                                maxWidth: "820px", marginBottom: "1.5rem",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Serving humanity,{" "}
                            <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>
                                one life
                            </span>{" "}
                            at a time.
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
                                    color: "#ffffff", backgroundColor: "transparent",
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
                                    el.style.backgroundColor = "transparent";
                                }}
                            >
                                Our Campaigns
                            </Link>
                        </div>

                        {/* Five Pillars */}
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                            {pillars.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.625rem",
                                        fontFamily: "var(--font-inter)", fontSize: "0.875rem",
                                        color: "rgba(255,255,255,0.75)", fontWeight: 500,
                                    }}
                                >
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
                    </div>

                    {/* ── Right: glassmorphism announcement panel ── */}
                    {hasAnnouncements && (
                        <div className="hero-announcement-panel">
                            <AnnouncementPanel announcements={announcements} />
                        </div>
                    )}
                </div>
            </section>

            {/* Stats card */}
            <div style={{ padding: "0 1.5rem", marginTop: "-80px", position: "relative", zIndex: 10 }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div
                        className="stats-grid"
                        style={{
                            backgroundColor: "#ffffff", borderRadius: "1rem",
                            boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.08)",
                            padding: "2rem 2.5rem",
                            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem",
                        }}
                    >
                        {stats.map(({ icon: Icon, value, suffix, label, format }) => (
                            <div
                                key={label}
                                style={{
                                    display: "flex", flexDirection: "column" as const,
                                    alignItems: "center", textAlign: "center" as const, gap: "0.5rem",
                                }}
                            >
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
          @media (max-width: 767px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              padding: 1.5rem !important;
            }
            .hero-grid {
              grid-template-columns: 1fr !important;
              padding-bottom: 8rem !important;
            }
            .hero-announcement-panel {
              display: none !important;
            }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            .hero-grid {
              grid-template-columns: 1fr 280px !important;
              gap: 2rem !important;
            }
          }
        `}</style>
            </div>
        </>
    );
}