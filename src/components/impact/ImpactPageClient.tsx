"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight, ChevronLeft, ChevronRight,
    PoundSterling, Users, FolderOpen, Heart,
    Image as ImageIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import { impactStats } from "@/data/site";
import type { DBImpactStory, DBAnnualHighlight, DBProjectCategory } from "@/types/database";

const categoryColours: Record<string, { bg: string; text: string }> = {
    Infrastructure: { bg: "#E8F4F6", text: "#0D5C6B" },
    Education: { bg: "#EEF2FF", text: "#4338CA" },
    Healthcare: { bg: "#F0FDF4", text: "#15803D" },
    Emergency: { bg: "#FEF2F2", text: "#DC2626" },
    Welfare: { bg: "#FAF5E8", text: "#B08D35" },
};

const categoryGradients: Record<string, string> = {
    Infrastructure: "linear-gradient(160deg, #1a7a8f 0%, #0D5C6B 55%, #073D47 100%)",
    Education: "linear-gradient(160deg, #0D5C6B 0%, #1a7a8f 50%, #094955 100%)",
    Healthcare: "linear-gradient(160deg, #073D47 0%, #0D5C6B 100%)",
    Emergency: "linear-gradient(160deg, #2d3748 0%, #1F2937 60%, #111827 100%)",
    Welfare: "linear-gradient(160deg, #B08D35 0%, #C9A84C 55%, #8F7026 100%)",
};

const iconMap: Record<string, typeof PoundSterling> = {
    PoundSterling, Users, FolderOpen, Heart,
};

function initials(name: string) {
    return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Stories carousel ─────────────────────────
function StoriesCarousel({ stories }: { stories: DBImpactStory[] }) {
    const [index, setIndex] = useState(0);
    const maxIndex = stories.length - 1;
    const prev = () => { if (index > 0) setIndex((i) => i - 1); };
    const next = () => { if (index < maxIndex) setIndex((i) => i + 1); };

    if (stories.length === 0) {
        return (
            <div style={{ textAlign: "center" as const, padding: "3rem 1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#9CA3AF" }}>No stories to show yet.</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <button
                    onClick={prev}
                    disabled={index === 0}
                    aria-label="Previous story"
                    style={{
                        width: "40px", height: "40px", minWidth: "40px",
                        borderRadius: "50%",
                        border: `1.5px solid ${index > 0 ? "#D1D5DB" : "#E5E7EB"}`,
                        backgroundColor: index > 0 ? "#ffffff" : "#F3F4F6",
                        color: index > 0 ? "#374151" : "#D1D5DB",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: index > 0 ? "pointer" : "default",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                    }}
                >
                    <ChevronLeft size={18} aria-hidden="true" />
                </button>

                <div style={{ flex: 1, overflow: "hidden" }}>
                    <div
                        className="stories-track"
                        style={{
                            display: "flex",
                            gap: "1rem",
                            transition: "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
                            willChange: "transform",
                        }}
                        ref={(el) => { if (el) el.style.setProperty("--idx", String(index)); }}
                    >
                        {stories.map((story) => {
                            const colour = categoryColours[story.category] ?? { bg: "#F3F4F6", text: "#374151" };
                            const gradient = categoryGradients[story.category] ?? categoryGradients.Healthcare;
                            return (
                                <div
                                    key={story.id}
                                    className="story-card"
                                    style={{
                                        flexShrink: 0,
                                        backgroundColor: "#ffffff",
                                        borderRadius: "1rem",
                                        border: "1px solid #E5E7EB",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column" as const,
                                        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = "0 8px 24px -4px rgba(13,92,107,0.14)";
                                        el.style.borderColor = "#A0CDD5";
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = "none";
                                        el.style.borderColor = "#E5E7EB";
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "180px",
                                            background: story.image_url ? `url(${story.image_url}) center/cover` : gradient,
                                            position: "relative",
                                            flexShrink: 0,
                                            display: "flex",
                                            flexDirection: "column" as const,
                                            justifyContent: "space-between",
                                            padding: "1rem",
                                        }}
                                    >
                                        {!story.image_url && (
                                            <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.08) 0%, transparent 50%)" }} />
                                        )}
                                        <span style={{ backgroundColor: colour.bg, color: colour.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.25rem 0.7rem", borderRadius: "9999px", alignSelf: "flex-start", position: "relative", zIndex: 1 }}>
                                            {story.category}
                                        </span>
                                        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                            <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.75rem", color: "#ffffff", flexShrink: 0 }}>
                                                {initials(story.name)}
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#ffffff", lineHeight: 1.2, margin: 0 }}>{story.name}</p>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>{story.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                                        {story.age && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 500, color: "#9CA3AF", margin: 0 }}>Age {story.age}</p>}
                                        <p style={{ fontFamily: "var(--font-noto)", fontStyle: "italic", fontSize: "0.9375rem", lineHeight: 1.7, color: "#1F2937", margin: 0, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                            &ldquo;{story.quote}&rdquo;
                                        </p>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.6, marginTop: "auto", paddingTop: "0.625rem", borderTop: "1px solid #F3F4F6" }}>
                                            {story.detail}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={next}
                    disabled={index === maxIndex}
                    aria-label="Next story"
                    style={{
                        width: "40px", height: "40px", minWidth: "40px",
                        borderRadius: "50%",
                        border: `1.5px solid ${index < maxIndex ? "#0D5C6B" : "#E5E7EB"}`,
                        backgroundColor: index < maxIndex ? "#0D5C6B" : "#F3F4F6",
                        color: index < maxIndex ? "#ffffff" : "#D1D5DB",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: index < maxIndex ? "pointer" : "default",
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                    }}
                >
                    <ChevronRight size={18} aria-hidden="true" />
                </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                {stories.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Go to story ${i + 1}`}
                        style={{
                            width: i === index ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "9999px",
                            border: "none",
                            backgroundColor: i === index ? "#0D5C6B" : "#D1D5DB",
                            cursor: "pointer",
                            padding: 0,
                            transition: "all 0.3s ease",
                        }}
                    />
                ))}
            </div>

            <style>{`
        .story-card { width: 100%; }
        .stories-track { transform: translateX(calc(-1 * var(--idx, 0) * (100% + 1rem))); }
        @media (min-width: 640px) {
          .story-card { width: calc(50% - 0.5rem); }
          .stories-track { transform: translateX(calc(-1 * var(--idx, 0) * (50% + 0.5rem))); }
        }
        @media (min-width: 1024px) {
          .story-card { width: calc(33.333% - 0.667rem); }
          .stories-track { transform: translateX(calc(-1 * var(--idx, 0) * (33.333% + 0.333rem))); }
        }
      `}</style>
        </div>
    );
}

// ─── Page ─────────────────────────────────────
interface ImpactPageClientProps {
    stories: DBImpactStory[];
    highlights: DBAnnualHighlight[];
    projectCategories: DBProjectCategory[];
}

export default function ImpactPageClient({ stories, highlights, projectCategories }: ImpactPageClientProps) {
    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 10% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 90% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Our Impact
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.25rem)", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "680px", marginBottom: "1.25rem" }}>
                        22 years of{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>real change</span>{" "}
                        in Jaffna
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: "560px", marginBottom: "2.25rem" }}>
                        Every statistic on this page represents a real family, a real life changed. This is what your generosity makes possible on the ground in Jaffna.
                    </p>
                    <Link
                        href="/donate"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                    >
                        Add to this impact <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* ── Stats ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>By the Numbers</p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15 }}>The scale of our work</h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="stats-grid">
                        {impactStats.map(({ icon, value, numericValue, suffix, label }) => {
                            const Icon = iconMap[icon] ?? PoundSterling;
                            const format = numericValue >= 1000;
                            const prefix = icon === "PoundSterling" ? "£" : "";
                            return (
                                <div
                                    key={label}
                                    style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "2rem 1.5rem", display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center" as const, gap: "0.875rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s ease, border-color 0.2s ease" }}
                                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 8px 24px -4px rgba(13,92,107,0.12)"; el.style.borderColor = "#A0CDD5"; }}
                                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; el.style.borderColor = "#E5E7EB"; }}
                                >
                                    <div style={{ width: "52px", height: "52px", borderRadius: "0.875rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Icon size={24} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                    </div>
                                    <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.875rem, 3vw, 2.5rem)", color: "#0D5C6B", lineHeight: 1, letterSpacing: "-0.02em" }}>
                                        {prefix}<CountUp to={numericValue} suffix={suffix} format={format} />
                                    </div>
                                    <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>{label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Project breakdown ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="breakdown-grid">
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.75rem" }}>Project Breakdown</p>
                            <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1.25rem" }}>Where the projects go</h2>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", lineHeight: 1.8, color: "#4B5563", marginBottom: "2rem" }}>
                                Over 200 projects delivered across six categories since 2002. Infrastructure remains our largest area — rebuilding what was damaged or destroyed during the conflict years.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
                                {projectCategories.map((cat) => {
                                    const Icon = (Icons as unknown as Record<string, typeof PoundSterling>)[cat.icon_name] ?? FolderOpen;
                                    return (
                                        <div key={cat.id}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <Icon size={15} style={{ color: cat.colour_hex, flexShrink: 0 }} aria-hidden="true" />
                                                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151" }}>{cat.label}</span>
                                                </div>
                                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: cat.colour_hex }}>{cat.count} projects</span>
                                            </div>
                                            <div style={{ height: "6px", backgroundColor: "#F3F4F6", borderRadius: "9999px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${cat.percentage}%`, backgroundColor: cat.colour_hex, borderRadius: "9999px" }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "1rem" }}>Annual Highlights</p>
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                                {highlights.map((h) => (
                                    <div
                                        key={h.id}
                                        style={{
                                            backgroundColor: h.is_latest ? "#0D5C6B" : "#F9FAFB",
                                            borderRadius: "0.875rem",
                                            border: `1px solid ${h.is_latest ? "transparent" : "#E5E7EB"}`,
                                            padding: "1.25rem 1.5rem",
                                            display: "grid",
                                            gridTemplateColumns: "1fr repeat(3, auto)",
                                            gap: "1.5rem",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: h.is_latest ? "#ffffff" : "#111827" }}>{h.year_label}</span>
                                        {[
                                            { val: `£${h.raised.toLocaleString("en-GB")}`, lbl: "raised" },
                                            { val: String(h.projects_completed), lbl: "projects" },
                                            { val: h.families_supported.toLocaleString("en-GB") + "+", lbl: "families" },
                                        ].map(({ val, lbl }) => (
                                            <div key={lbl} style={{ textAlign: "right" as const }}>
                                                <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.9375rem", color: h.is_latest ? "#C9A84C" : "#0D5C6B", lineHeight: 1 }}>{val}</div>
                                                <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: h.is_latest ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>{lbl}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: "1.5rem" }}>
                                <Link href="/reports" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#0D5C6B", textDecoration: "none", borderBottom: "1.5px solid #C9A84C", paddingBottom: "1px" }}>
                                    Download full annual reports <ArrowRight size={14} aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stories ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 0" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", marginBottom: "2.75rem" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.5rem" }}>Stories of Impact</p>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0 }}>The faces behind the numbers</h2>
                </div>
                <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
                    <StoriesCarousel stories={stories} />
                </div>
            </section>

            {/* ── Gallery teaser ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", backgroundColor: "#F9FAFB", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "0.875rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ImageIcon size={22} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                        </div>
                        <div>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827", marginBottom: "0.25rem" }}>See the impact in photos</p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>Browse our gallery of projects, distributions, and community moments.</p>
                        </div>
                    </div>
                    <Link
                        href="/gallery"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", flexShrink: 0, transition: "background-color 0.2s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#094955"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0D5C6B"; }}
                    >
                        View Gallery <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "5rem 1.5rem", textAlign: "center" as const, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)` }} />
                <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem" }}>Be part of the next chapter</h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "2rem" }}>
                        Every donation you make adds to this record of impact. The next story could be made possible by you.
                    </p>
                    <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" as const }}>
                        <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                        >
                            Donate Now <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <Link href="/campaigns" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.5rem", border: "2px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "1rem", textDecoration: "none", transition: "border-color 0.2s ease, background 0.2s ease", backgroundColor: "transparent" }}
                            onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.7)"; el.style.backgroundColor = "rgba(255,255,255,0.08)"; }}
                            onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.35)"; el.style.backgroundColor = "transparent"; }}
                        >
                            View Campaigns
                        </Link>
                    </div>
                </div>
            </section>

            <style>{`
        @media (max-width: 1023px) {
          .stats-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .breakdown-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
        @media (max-width: 479px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}