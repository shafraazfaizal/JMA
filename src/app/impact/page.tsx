"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight, ChevronLeft, ChevronRight,
    PoundSterling, Users, FolderOpen, Heart,
    GraduationCap, Stethoscope, Building2,
    Droplets, Baby, AlertTriangle,
} from "lucide-react";
import CountUp from "@/components/ui/CountUp";

// ─── Data ─────────────────────────────────────

const impactStats = [
    { icon: PoundSterling, prefix: "£", value: 2450000, suffix: "+", label: "Total Raised", format: true, duration: 2200 },
    { icon: Users, prefix: "", value: 12500, suffix: "+", label: "Families Supported", format: true, duration: 1800 },
    { icon: FolderOpen, prefix: "", value: 200, suffix: "+", label: "Projects Delivered", format: false, duration: 1400 },
    { icon: Heart, prefix: "", value: 650, suffix: "+", label: "Volunteers Worldwide", format: false, duration: 1600 },
];

const projectBreakdown = [
    { icon: Building2, label: "Infrastructure", count: 62, pct: 31, colour: "#0D5C6B" },
    { icon: GraduationCap, label: "Education", count: 48, pct: 24, colour: "#4338CA" },
    { icon: Stethoscope, label: "Healthcare", count: 36, pct: 18, colour: "#15803D" },
    { icon: Droplets, label: "Food & Water", count: 24, pct: 12, colour: "#0891B2" },
    { icon: Baby, label: "Orphans & Widows", count: 18, pct: 9, colour: "#C9A84C" },
    { icon: AlertTriangle, label: "Emergency Relief", count: 12, pct: 6, colour: "#DC2626" },
];

const stories = [
    {
        id: "1",
        name: "Fathima Nusrath",
        age: 14,
        location: "Mankumban, Jaffna",
        category: "Education",
        categoryColour: { bg: "#EEF2FF", text: "#4338CA" },
        quote: "I used to walk 4 kilometres to school in torn shoes. The scholarship from JMA donors gave me new books, a uniform, and the belief that I belonged there.",
        detail: "Fathima is one of 20 students sponsored through the 2024 Jaffna Scholarship Fund. She ranked first in her class this year.",
        imageBg: "linear-gradient(160deg, #1a7a8f 0%, #0D5C6B 55%, #073D47 100%)",
        initials: "FN",
    },
    {
        id: "2",
        name: "Abdul Majeed",
        age: 67,
        location: "Vaddukkoddai, Jaffna",
        category: "Healthcare",
        categoryColour: { bg: "#F0FDF4", text: "#15803D" },
        quote: "My wife needed dialysis twice a week. We could not afford the transport. JMA arranged everything — they treated us with dignity, not pity.",
        detail: "Abdul's family was identified through JMA's welfare outreach programme. Transport and treatment costs are now fully covered.",
        imageBg: "linear-gradient(160deg, #0a4a56 0%, #0D5C6B 60%, #094955 100%)",
        initials: "AM",
    },
    {
        id: "3",
        name: "Ummu Kulthum",
        age: 38,
        location: "Allaipiddy, Jaffna",
        category: "Infrastructure",
        categoryColour: { bg: "#E8F4F6", text: "#0D5C6B" },
        quote: "Our masjid roof collapsed in the rains. For two years we prayed outside. When JMA said they would rebuild it, we wept — it was not just a building, it was our home.",
        detail: "The Allaipiddy community masjid was fully reconstructed in 2023 through JMA's Infrastructure Fund, serving over 300 worshippers.",
        imageBg: "linear-gradient(160deg, #B08D35 0%, #C9A84C 55%, #8F7026 100%)",
        initials: "UK",
    },
    {
        id: "4",
        name: "Mohamed Razeek",
        age: 52,
        location: "Chavakacheri, Jaffna",
        category: "Welfare",
        categoryColour: { bg: "#FAF5E8", text: "#B08D35" },
        quote: "After the floods took everything, I did not know how to feed my children. JMA arrived within days. I still cannot find the words.",
        detail: "Mohamed's family received emergency food parcels, shelter materials, and a follow-up welfare grant through JMA's Emergency Relief Fund.",
        imageBg: "linear-gradient(160deg, #2d3748 0%, #1F2937 60%, #111827 100%)",
        initials: "MR",
    },
    {
        id: "5",
        name: "Safiya Hassan",
        age: 29,
        location: "Kondavil, Jaffna",
        category: "Education",
        categoryColour: { bg: "#EEF2FF", text: "#4338CA" },
        quote: "I was the first woman in my family to sit A/Levels. JMA's scholarship meant my parents did not have to choose between my education and food.",
        detail: "Safiya completed her A/Levels with distinction and is now studying nursing at the University of Jaffna.",
        imageBg: "linear-gradient(160deg, #0D5C6B 0%, #1a7a8f 50%, #094955 100%)",
        initials: "SH",
    },
    {
        id: "6",
        name: "Hussain Nizar",
        age: 44,
        location: "Manipay, Jaffna",
        category: "Welfare",
        categoryColour: { bg: "#FAF5E8", text: "#B08D35" },
        quote: "We lost our home in the 2021 floods. JMA rebuilt our roof and gave us furniture. My children sleep on a bed for the first time in two years.",
        detail: "Hussain's family received full roof reconstruction and household support through JMA's Welfare Fund in partnership with local builders.",
        imageBg: "linear-gradient(160deg, #073D47 0%, #0D5C6B 100%)",
        initials: "HN",
    },
];

const annualHighlights = [
    { year: "2024/25", raised: "£420,000", projects: 18, families: 2100 },
    { year: "2023/24", raised: "£385,000", projects: 22, families: 1950 },
    { year: "2022/23", raised: "£310,000", projects: 17, families: 1600 },
    { year: "2021/22", raised: "£295,000", projects: 15, families: 1400 },
];

// ─── Stories carousel ─────────────────────────
function StoriesCarousel() {
    const [index, setIndex] = useState(0);
    const maxIndex = stories.length - 1;
    const prev = () => { if (index > 0) setIndex((i) => i - 1); };
    const next = () => { if (index < maxIndex) setIndex((i) => i + 1); };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Prev */}
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
                    onMouseEnter={(e) => {
                        if (index === 0) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.backgroundColor = "#0D5C6B";
                        el.style.borderColor = "#0D5C6B";
                        el.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                        if (index === 0) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.backgroundColor = "#ffffff";
                        el.style.borderColor = "#D1D5DB";
                        el.style.color = "#374151";
                    }}
                >
                    <ChevronLeft size={18} aria-hidden="true" />
                </button>

                {/* Track */}
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
                        {stories.map((story) => (
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
                                {/* Image area */}
                                <div
                                    style={{
                                        height: "180px",
                                        background: story.imageBg,
                                        position: "relative",
                                        flexShrink: 0,
                                        display: "flex",
                                        flexDirection: "column" as const,
                                        justifyContent: "space-between",
                                        padding: "1rem",
                                    }}
                                >
                                    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.08) 0%, transparent 50%)" }} />
                                    <span style={{ backgroundColor: story.categoryColour.bg, color: story.categoryColour.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.25rem 0.7rem", borderRadius: "9999px", alignSelf: "flex-start", position: "relative", zIndex: 1 }}>
                                        {story.category}
                                    </span>
                                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.75rem", color: "#ffffff", flexShrink: 0 }}>
                                            {story.initials}
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#ffffff", lineHeight: 1.2, margin: 0 }}>{story.name}</p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>{story.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 500, color: "#9CA3AF", margin: 0 }}>Age {story.age}</p>
                                    <p style={{ fontFamily: "var(--font-noto)", fontStyle: "italic", fontSize: "0.9375rem", lineHeight: 1.7, color: "#1F2937", margin: 0, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                        &ldquo;{story.quote}&rdquo;
                                    </p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.6, marginTop: "auto", paddingTop: "0.625rem", borderTop: "1px solid #F3F4F6" }}>
                                        {story.detail}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next */}
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
                    onMouseEnter={(e) => {
                        if (index === maxIndex) return;
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#094955";
                    }}
                    onMouseLeave={(e) => {
                        if (index === maxIndex) return;
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D5C6B";
                    }}
                >
                    <ChevronRight size={18} aria-hidden="true" />
                </button>
            </div>

            {/* Dots */}
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
export default function ImpactPage() {
    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section
                style={{
                    backgroundColor: "#0D5C6B",
                    padding: "8rem 1.5rem 5rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `
              radial-gradient(circle at 10% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
              radial-gradient(circle at 90% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)
            `,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Our Impact
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                            color: "#ffffff",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            maxWidth: "680px",
                            marginBottom: "1.25rem",
                        }}
                    >
                        22 years of{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>
                            real change
                        </span>{" "}
                        in Jaffna
                    </h1>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1.0625rem",
                            color: "rgba(255,255,255,0.7)",
                            lineHeight: 1.75,
                            maxWidth: "560px",
                            marginBottom: "2.25rem",
                        }}
                    >
                        Every statistic on this page represents a real family, a real life changed. This is what your generosity makes possible on the ground in Jaffna.
                    </p>
                    <Link
                        href="/donate"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.875rem 1.75rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#C9A84C",
                            color: "#ffffff",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            textDecoration: "none",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                    >
                        Add to this impact
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* ── Stats ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>
                            By the Numbers
                        </p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                            The scale of our work
                        </h2>
                    </div>

                    <div
                        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}
                        className="stats-grid"
                    >
                        {impactStats.map(({ icon: Icon, prefix, value, suffix, label, format, duration }) => (
                            <div
                                key={label}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "1rem",
                                    border: "1px solid #E5E7EB",
                                    padding: "2rem 1.5rem",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    alignItems: "center",
                                    textAlign: "center" as const,
                                    gap: "0.875rem",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "0 8px 24px -4px rgba(13,92,107,0.12)";
                                    el.style.borderColor = "#A0CDD5";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                                    el.style.borderColor = "#E5E7EB";
                                }}
                            >
                                <div style={{ width: "52px", height: "52px", borderRadius: "0.875rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon size={24} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.875rem, 3vw, 2.5rem)", color: "#0D5C6B", lineHeight: 1, letterSpacing: "-0.02em" }}>
                                    {prefix}<CountUp to={value} suffix={suffix} format={format} duration={duration} />
                                </div>
                                <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Project breakdown ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
                        className="breakdown-grid"
                    >
                        {/* Left */}
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.75rem" }}>
                                Project Breakdown
                            </p>
                            <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1.25rem" }}>
                                Where the projects go
                            </h2>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", lineHeight: 1.8, color: "#4B5563", marginBottom: "2rem" }}>
                                Over 200 projects delivered across six categories since 2002. Infrastructure remains our largest area — rebuilding what was damaged or destroyed during the conflict years.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
                                {projectBreakdown.map(({ icon: Icon, label, count, pct, colour }) => (
                                    <div key={label}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <Icon size={15} style={{ color: colour, flexShrink: 0 }} aria-hidden="true" />
                                                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151" }}>{label}</span>
                                            </div>
                                            <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: colour }}>
                                                {count} projects
                                            </span>
                                        </div>
                                        <div style={{ height: "6px", backgroundColor: "#F3F4F6", borderRadius: "9999px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${pct}%`, backgroundColor: colour, borderRadius: "9999px" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — annual highlights */}
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "1rem" }}>
                                Annual Highlights
                            </p>
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                                {annualHighlights.map(({ year, raised, projects, families }, i) => (
                                    <div
                                        key={year}
                                        style={{
                                            backgroundColor: i === 0 ? "#0D5C6B" : "#F9FAFB",
                                            borderRadius: "0.875rem",
                                            border: `1px solid ${i === 0 ? "transparent" : "#E5E7EB"}`,
                                            padding: "1.25rem 1.5rem",
                                            display: "grid",
                                            gridTemplateColumns: "1fr repeat(3, auto)",
                                            gap: "1.5rem",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: i === 0 ? "#ffffff" : "#111827" }}>
                                            {year}
                                        </span>
                                        {[
                                            { val: raised, lbl: "raised" },
                                            { val: String(projects), lbl: "projects" },
                                            { val: families.toLocaleString("en-GB") + "+", lbl: "families" },
                                        ].map(({ val, lbl }) => (
                                            <div key={lbl} style={{ textAlign: "right" as const }}>
                                                <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.9375rem", color: i === 0 ? "#C9A84C" : "#0D5C6B", lineHeight: 1 }}>{val}</div>
                                                <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: i === 0 ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>{lbl}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: "1.5rem" }}>
                                <Link
                                    href="/reports"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.375rem",
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                        color: "#0D5C6B",
                                        textDecoration: "none",
                                        borderBottom: "1.5px solid #C9A84C",
                                        paddingBottom: "1px",
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#094955"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0D5C6B"; }}
                                >
                                    Download full annual reports
                                    <ArrowRight size={14} aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stories ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 0" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", marginBottom: "2.75rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.5rem" }}>
                                Stories of Impact
                            </p>
                            <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0 }}>
                                The faces behind the numbers
                            </h2>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
                    <StoriesCarousel />
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section
                style={{
                    backgroundColor: "#0D5C6B",
                    padding: "5rem 1.5rem",
                    textAlign: "center" as const,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)` }} />
                <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem" }}>
                        Be part of the next chapter
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "2rem" }}>
                        Every donation you make adds to this record of impact. The next story could be made possible by you.
                    </p>
                    <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" as const }}>
                        <Link
                            href="/donate"
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                        >
                            Donate Now <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <Link
                            href="/campaigns"
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.5rem", border: "2px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "1rem", textDecoration: "none", transition: "border-color 0.2s ease, background 0.2s ease", backgroundColor: "transparent" }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.borderColor = "rgba(255,255,255,0.7)";
                                el.style.backgroundColor = "rgba(255,255,255,0.08)";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.borderColor = "rgba(255,255,255,0.35)";
                                el.style.backgroundColor = "transparent";
                            }}
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