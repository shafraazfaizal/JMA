"use client";

import Link from "next/link";
import { ArrowRight, Clock, CalendarDays, MapPin } from "lucide-react";

const news = [
    {
        id: "1",
        slug: "mankumban-masjid-phase-2",
        category: "Project Update",
        categoryColour: { bg: "#E8F4F6", text: "#0D5C6B" },
        title: "Mankumban Masjid Reconstruction Reaches Phase 2",
        excerpt:
            "Foundations are complete and walls are rising. Phase 2 of the Mankumban Masjid project is now underway, thanks to over 140 donors from across the UK.",
        date: "12 Jun 2025",
        readTime: 3,
    },
    {
        id: "2",
        slug: "jaffna-scholarship-2025-recipients",
        category: "Community News",
        categoryColour: { bg: "#EEF2FF", text: "#4338CA" },
        title: "Meet the 2025 Jaffna Scholarship Recipients",
        excerpt:
            "Twenty students from low-income families have been selected for the 2025 scholarship cycle. Read their stories and see how your donations are opening doors.",
        date: "4 Jun 2025",
        readTime: 5,
    },
    {
        id: "3",
        slug: "zakat-distribution-2025",
        category: "Charity Education",
        categoryColour: { bg: "#FAF5E8", text: "#B08D35" },
        title: "How JMA Distributes Your Zakat on the Ground",
        excerpt:
            "A full breakdown of our 2024/25 Zakat distribution — who received it, how much, and the process we use to ensure it reaches the eight categories.",
        date: "28 May 2025",
        readTime: 7,
    },
];

const events = [
    {
        id: "1",
        slug: "jma-annual-fundraising-dinner-2025",
        title: "JMA Annual Fundraising Dinner 2025",
        date: "Sat 19 Jul 2025",
        time: "6:30 PM",
        location: "Manchester",
        venue: "Mercure Manchester Piccadilly",
        isPast: false,
    },
    {
        id: "2",
        slug: "jaffna-day-2025",
        title: "Jaffna Day — Cultural Celebration",
        date: "Sun 14 Sep 2025",
        time: "12:00 PM",
        location: "London",
        venue: "East London Community Hall",
        isPast: false,
    },
    {
        id: "3",
        slug: "qurbani-collection-2025",
        title: "Qurbani Collection Drive 2025",
        date: "Fri 6 Jun 2025",
        time: "All day",
        location: "Nationwide",
        venue: "Online & collection points",
        isPast: true,
    },
];

export default function NewsEventsSection() {
    return (
        <section style={{ backgroundColor: "#ffffff", padding: "6rem 1.5rem" }}>
            <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

                {/* ── News ── */}
                <div style={{ marginBottom: "5rem" }}>

                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "1rem",
                            marginBottom: "2.5rem",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    color: "#C9A84C",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                Latest News
                            </p>
                            <h2
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                                    color: "#111827",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.15,
                                    margin: 0,
                                }}
                            >
                                Updates from the ground
                            </h2>
                        </div>

                        <Link
                            href="/news"
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
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.color = "#094955";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.color = "#0D5C6B";
                            }}
                        >
                            All news
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>

                    {/* News grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1.5rem",
                        }}
                        className="news-grid"
                    >
                        {news.map((article, i) => (
                            <Link
                                key={article.id}
                                href={`/news/${article.slug}`}
                                style={{ textDecoration: "none" }}
                            >
                                <article
                                    style={{
                                        backgroundColor: i === 0 ? "#0D5C6B" : "#ffffff",
                                        borderRadius: "1rem",
                                        border: `1px solid ${i === 0 ? "transparent" : "#E5E7EB"}`,
                                        overflow: "hidden",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column" as const,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                        transition: "box-shadow 0.25s ease, transform 0.25s ease",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = "0 12px 32px -6px rgba(0,0,0,0.14)";
                                        el.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                                        el.style.transform = "translateY(0)";
                                    }}
                                >
                                    {/* Top image bar */}
                                    <div
                                        style={{
                                            height: "8px",
                                            backgroundColor:
                                                i === 0 ? "#C9A84C" : "#E8F4F6",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <div
                                        style={{
                                            padding: "1.5rem",
                                            display: "flex",
                                            flexDirection: "column" as const,
                                            flex: 1,
                                            gap: "0.875rem",
                                        }}
                                    >
                                        {/* Category pill */}
                                        <span
                                            style={{
                                                display: "inline-block",
                                                backgroundColor:
                                                    i === 0
                                                        ? "rgba(201,168,76,0.18)"
                                                        : article.categoryColour.bg,
                                                color:
                                                    i === 0 ? "#C9A84C" : article.categoryColour.text,
                                                fontFamily: "var(--font-inter)",
                                                fontWeight: 600,
                                                fontSize: "0.65rem",
                                                letterSpacing: "0.07em",
                                                textTransform: "uppercase" as const,
                                                padding: "0.25rem 0.7rem",
                                                borderRadius: "9999px",
                                                alignSelf: "flex-start",
                                            }}
                                        >
                                            {article.category}
                                        </span>

                                        {/* Title */}
                                        <h3
                                            style={{
                                                fontFamily: "var(--font-jakarta)",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                lineHeight: 1.35,
                                                color: i === 0 ? "#ffffff" : "#111827",
                                                margin: 0,
                                            }}
                                        >
                                            {article.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p
                                            style={{
                                                fontFamily: "var(--font-inter)",
                                                fontSize: "0.875rem",
                                                lineHeight: 1.7,
                                                color: i === 0 ? "rgba(255,255,255,0.65)" : "#6B7280",
                                                margin: 0,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical" as const,
                                                overflow: "hidden",
                                            }}
                                        >
                                            {article.excerpt}
                                        </p>

                                        {/* Footer meta */}
                                        <div
                                            style={{
                                                marginTop: "auto",
                                                paddingTop: "0.875rem",
                                                borderTop: `1px solid ${i === 0
                                                        ? "rgba(255,255,255,0.1)"
                                                        : "#F3F4F6"
                                                    }`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: "0.5rem",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.875rem",
                                                    fontFamily: "var(--font-inter)",
                                                    fontSize: "0.75rem",
                                                    color:
                                                        i === 0
                                                            ? "rgba(255,255,255,0.45)"
                                                            : "#9CA3AF",
                                                }}
                                            >
                                                <span>{article.date}</span>
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.25rem",
                                                    }}
                                                >
                                                    <Clock size={11} aria-hidden="true" />
                                                    {article.readTime} min read
                                                </span>
                                            </div>

                                            <ArrowRight
                                                size={14}
                                                style={{
                                                    color:
                                                        i === 0 ? "#C9A84C" : "#0D5C6B",
                                                    flexShrink: 0,
                                                }}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Events ── */}
                <div>
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "1rem",
                            marginBottom: "2rem",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    color: "#C9A84C",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                Upcoming Events
                            </p>
                            <h2
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                                    color: "#111827",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.15,
                                    margin: 0,
                                }}
                            >
                                Join the community
                            </h2>
                        </div>

                        <Link
                            href="/events"
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
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.color = "#094955";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.color = "#0D5C6B";
                            }}
                        >
                            All events
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Events list */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: "0.875rem",
                        }}
                    >
                        {events.map((event) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.slug}`}
                                style={{ textDecoration: "none" }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1.25rem",
                                        backgroundColor: event.isPast ? "#F9FAFB" : "#ffffff",
                                        border: "1px solid #E5E7EB",
                                        borderRadius: "0.875rem",
                                        padding: "1.25rem 1.5rem",
                                        cursor: "pointer",
                                        opacity: event.isPast ? 0.6 : 1,
                                        transition:
                                            "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (event.isPast) return;
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow =
                                            "0 8px 24px -4px rgba(13,92,107,0.1)";
                                        el.style.borderColor = "#A0CDD5";
                                        el.style.transform = "translateX(4px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (event.isPast) return;
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.boxShadow = "none";
                                        el.style.borderColor = "#E5E7EB";
                                        el.style.transform = "translateX(0)";
                                    }}
                                    className="event-row"
                                >
                                    {/* Date block */}
                                    <div
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                            borderRadius: "0.625rem",
                                            backgroundColor: event.isPast ? "#E5E7EB" : "#E8F4F6",
                                            display: "flex",
                                            flexDirection: "column" as const,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <CalendarDays
                                            size={20}
                                            style={{
                                                color: event.isPast ? "#9CA3AF" : "#0D5C6B",
                                            }}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.625rem",
                                                marginBottom: "0.25rem",
                                                flexWrap: "wrap" as const,
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontFamily: "var(--font-jakarta)",
                                                    fontWeight: 700,
                                                    fontSize: "0.9375rem",
                                                    color: "#111827",
                                                    margin: 0,
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {event.title}
                                            </h3>
                                            {event.isPast && (
                                                <span
                                                    style={{
                                                        fontFamily: "var(--font-inter)",
                                                        fontSize: "0.65rem",
                                                        fontWeight: 600,
                                                        letterSpacing: "0.06em",
                                                        textTransform: "uppercase" as const,
                                                        color: "#9CA3AF",
                                                        backgroundColor: "#F3F4F6",
                                                        padding: "0.15rem 0.5rem",
                                                        borderRadius: "9999px",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    Past
                                                </span>
                                            )}
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap" as const,
                                                gap: "0.25rem 1rem",
                                                fontFamily: "var(--font-inter)",
                                                fontSize: "0.8125rem",
                                                color: "#6B7280",
                                            }}
                                        >
                                            <span>
                                                {event.date} · {event.time}
                                            </span>
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.25rem",
                                                }}
                                            >
                                                <MapPin size={11} aria-hidden="true" />
                                                {event.venue}, {event.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    {!event.isPast && (
                                        <ArrowRight
                                            size={16}
                                            style={{ color: "#0D5C6B", flexShrink: 0 }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 767px) {
          .news-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .news-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
        </section>
    );
}