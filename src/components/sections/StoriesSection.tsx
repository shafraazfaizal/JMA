"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const stories = [
    {
        id: "1",
        name: "Fathima Nusrath",
        age: 14,
        location: "Mankumban, Jaffna",
        category: "Education",
        categoryColour: { bg: "#EEF2FF", text: "#4338CA" },
        quote:
            "I used to walk 4 kilometres to school in torn shoes. The scholarship from JMA donors gave me new books, a uniform, and the belief that I belonged there.",
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
        quote:
            "My wife needed dialysis twice a week. We could not afford the transport. JMA arranged everything — they treated us with dignity, not pity.",
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
        quote:
            "Our masjid roof collapsed in the rains. For two years we prayed outside. When JMA said they would rebuild it, we wept — it was not just a building, it was our home.",
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
        quote:
            "After the floods took everything, I did not know how to feed my children. JMA arrived within days. I still cannot find the words.",
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
        quote:
            "I was the first woman in my family to sit A/Levels. JMA's scholarship meant my parents did not have to choose between my education and food.",
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
        quote:
            "We lost our home in the 2021 floods. JMA rebuilt our roof and gave us furniture. My children sleep on a bed for the first time in two years.",
        imageBg: "linear-gradient(160deg, #073D47 0%, #0D5C6B 100%)",
        initials: "HN",
    },
];

export default function StoriesSection() {
    const [index, setIndex] = useState(0);

    // Step by 1 always — CSS controls how many cards are visible per breakpoint
    const maxIndex = stories.length - 1;
    const canPrev = index > 0;
    const canNext = index < maxIndex;

    const prev = () => { if (canPrev) setIndex((i) => i - 1); };
    const next = () => { if (canNext) setIndex((i) => i + 1); };

    return (
        <section style={{ backgroundColor: "#F9FAFB", padding: "6rem 0" }}>

            {/* Header */}
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "2.75rem",
                }}
            >
                <div>
                    <p style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        color: "#C9A84C",
                        marginBottom: "0.5rem",
                    }}>
                        Stories of Impact
                    </p>
                    <h2 style={{
                        fontFamily: "var(--font-jakarta)",
                        fontWeight: 800,
                        fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                        color: "#111827",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                        margin: 0,
                    }}>
                        The faces behind the numbers
                    </h2>
                </div>

                <Link
                    href="/impact"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#0D5C6B",
                        textDecoration: "none",
                        borderBottom: "1.5px solid #C9A84C",
                        paddingBottom: "1px",
                        whiteSpace: "nowrap" as const,
                        transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#094955"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0D5C6B"; }}
                >
                    All stories
                    <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </div>

            {/* Carousel — arrows sit OUTSIDE the overflow:hidden viewport */}
            <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

                    {/* Prev */}
                    <button
                        onClick={prev}
                        aria-label="Previous story"
                        disabled={!canPrev}
                        style={{
                            width: "40px", height: "40px", minWidth: "40px",
                            borderRadius: "50%",
                            border: `1.5px solid ${canPrev ? "#D1D5DB" : "#E5E7EB"}`,
                            backgroundColor: canPrev ? "#ffffff" : "#F3F4F6",
                            color: canPrev ? "#374151" : "#D1D5DB",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: canPrev ? "pointer" : "default",
                            flexShrink: 0,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            if (!canPrev) return;
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.backgroundColor = "#0D5C6B";
                            el.style.borderColor = "#0D5C6B";
                            el.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                            if (!canPrev) return;
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.backgroundColor = "#ffffff";
                            el.style.borderColor = "#D1D5DB";
                            el.style.color = "#374151";
                        }}
                    >
                        <ChevronLeft size={18} aria-hidden="true" />
                    </button>

                    {/* Clipping viewport */}
                    <div style={{ flex: 1, overflow: "hidden" }}>
                        <div
                            className="stories-track"
                            style={{
                                display: "flex",
                                gap: "1rem",
                                transition: "transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
                                willChange: "transform",
                            }}
                            /* index is passed via a CSS custom property on the element */
                            ref={(el) => {
                                if (el) el.style.setProperty("--idx", String(index));
                            }}
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
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
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
                                        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                                        el.style.borderColor = "#E5E7EB";
                                    }}
                                >
                                    {/* Image area */}
                                    <div style={{
                                        height: "180px",
                                        background: story.imageBg,
                                        position: "relative",
                                        flexShrink: 0,
                                        display: "flex",
                                        flexDirection: "column" as const,
                                        justifyContent: "space-between",
                                        padding: "1rem",
                                    }}>
                                        <div aria-hidden="true" style={{
                                            position: "absolute", inset: 0,
                                            backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.08) 0%, transparent 50%)",
                                        }} />

                                        {/* Category */}
                                        <div style={{ position: "relative", zIndex: 1 }}>
                                            <span style={{
                                                display: "inline-block",
                                                backgroundColor: story.categoryColour.bg,
                                                color: story.categoryColour.text,
                                                fontFamily: "var(--font-inter)",
                                                fontWeight: 600,
                                                fontSize: "0.65rem",
                                                letterSpacing: "0.07em",
                                                textTransform: "uppercase" as const,
                                                padding: "0.25rem 0.7rem",
                                                borderRadius: "9999px",
                                            }}>
                                                {story.category}
                                            </span>
                                        </div>

                                        {/* Avatar + name */}
                                        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                            <div style={{
                                                width: "38px", height: "38px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(255,255,255,0.2)",
                                                border: "1.5px solid rgba(255,255,255,0.4)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontFamily: "var(--font-jakarta)",
                                                fontWeight: 800, fontSize: "0.75rem",
                                                color: "#ffffff", flexShrink: 0,
                                            }}>
                                                {story.initials}
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#ffffff", lineHeight: 1.2, margin: 0 }}>
                                                    {story.name}
                                                </p>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "rgba(255,255,255,0.65)", margin: 0 }}>
                                                    {story.location}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column" as const, flex: 1, gap: "0.75rem" }}>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 500, color: "#9CA3AF", margin: 0 }}>
                                            Age {story.age}
                                        </p>
                                        <p style={{
                                            fontFamily: "var(--font-noto)",
                                            fontStyle: "italic",
                                            fontSize: "0.9375rem",
                                            lineHeight: 1.7,
                                            color: "#1F2937",
                                            margin: 0,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 4,
                                            WebkitBoxOrient: "vertical" as const,
                                            overflow: "hidden",
                                        }}>
                                            &ldquo;{story.quote}&rdquo;
                                        </p>
                                        <div style={{ marginTop: "auto", paddingTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
                                            <div style={{
                                                width: "30px", height: "30px",
                                                borderRadius: "50%",
                                                border: "1.5px solid #E5E7EB",
                                                backgroundColor: "#F9FAFB",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <ArrowRight size={13} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next */}
                    <button
                        onClick={next}
                        aria-label="Next story"
                        disabled={!canNext}
                        style={{
                            width: "40px", height: "40px", minWidth: "40px",
                            borderRadius: "50%",
                            border: `1.5px solid ${canNext ? "#0D5C6B" : "#E5E7EB"}`,
                            backgroundColor: canNext ? "#0D5C6B" : "#F3F4F6",
                            color: canNext ? "#ffffff" : "#D1D5DB",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: canNext ? "pointer" : "default",
                            flexShrink: 0,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            if (!canNext) return;
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.backgroundColor = "#094955";
                            el.style.borderColor = "#094955";
                        }}
                        onMouseLeave={(e) => {
                            if (!canNext) return;
                            const el = e.currentTarget as HTMLButtonElement;
                            el.style.backgroundColor = "#0D5C6B";
                            el.style.borderColor = "#0D5C6B";
                        }}
                    >
                        <ChevronRight size={18} aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Dot indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
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
                /* Mobile first — 1 card, full width of viewport minus arrows */
                .story-card {
                    width: 100%;
                }
                .stories-track {
                    transform: translateX(calc(-1 * var(--idx, 0) * (100% + 1rem)));
                }

                /* Tablet — 2 cards */
                @media (min-width: 640px) {
                    .story-card {
                        width: calc(50% - 0.5rem);
                    }
                    .stories-track {
                        transform: translateX(calc(-1 * var(--idx, 0) * (50% + 0.5rem)));
                    }
                }

                /* Desktop — 4 cards */
                @media (min-width: 1024px) {
                    .story-card {
                        width: calc(25% - 0.75rem);
                    }
                    .stories-track {
                        transform: translateX(calc(-1 * var(--idx, 0) * (25% + 0.25rem)));
                    }
                }
            `}</style>
        </section>
    );
}