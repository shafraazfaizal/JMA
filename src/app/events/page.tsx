"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { events } from "@/data/events";

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

const fmtDateShort = (iso: string) => {
    const d = new Date(iso);
    return { day: d.getDate(), month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() };
};

export default function EventsPage() {
    const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

    const upcoming = useMemo(
        () => events.filter((e) => !e.isPast).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        []
    );
    const past = useMemo(
        () => events.filter((e) => e.isPast).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        []
    );

    const list = tab === "upcoming" ? upcoming : past;

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Events
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "560px" }}>
                        Join the community
                    </h1>
                </div>
            </section>

            {/* ── Tabs ── */}
            <section style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB", padding: "1.25rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", backgroundColor: "#F3F4F6", borderRadius: "0.625rem", padding: "3px" }}>
                        {(["upcoming", "past"] as const).map((t) => (
                            <button key={t} onClick={() => setTab(t)}
                                style={{ padding: "0.5625rem 1.5rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", backgroundColor: tab === t ? "#0D5C6B" : "transparent", color: tab === t ? "#ffffff" : "#6B7280", transition: "all 0.2s ease" }}
                            >
                                {t === "upcoming" ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Events list ── */}
            <section style={{ padding: "3rem 1.5rem 5rem", backgroundColor: "#F9FAFB" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    {list.length === 0 ? (
                        <div style={{ textAlign: "center" as const, padding: "5rem 1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB" }}>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>
                                {tab === "upcoming" ? "No upcoming events scheduled — check back soon." : "No past events to show."}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="events-grid">
                            {list.map((event) => {
                                const { day, month } = fmtDateShort(event.date);
                                return (
                                    <Link key={event.id} href={`/events/${event.slug}`} style={{ textDecoration: "none" }}>
                                        <article
                                            style={{
                                                display: "flex",
                                                gap: "1.25rem",
                                                backgroundColor: "#ffffff",
                                                borderRadius: "1rem",
                                                border: "1px solid #E5E7EB",
                                                padding: "1.5rem",
                                                height: "100%",
                                                opacity: event.isPast ? 0.7 : 1,
                                                transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget as HTMLElement;
                                                el.style.boxShadow = "0 12px 32px -6px rgba(13,92,107,0.12)";
                                                el.style.borderColor = "#A0CDD5";
                                                if (!event.isPast) el.style.transform = "translateY(-2px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget as HTMLElement;
                                                el.style.boxShadow = "none";
                                                el.style.borderColor = "#E5E7EB";
                                                el.style.transform = "translateY(0)";
                                            }}
                                        >
                                            {/* Date block */}
                                            <div style={{ flexShrink: 0, width: "64px", height: "64px", borderRadius: "0.875rem", backgroundColor: event.isPast ? "#F3F4F6" : "#E8F4F6", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
                                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.25rem", color: event.isPast ? "#9CA3AF" : "#0D5C6B", lineHeight: 1 }}>{day}</span>
                                                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.6875rem", color: event.isPast ? "#9CA3AF" : "#0D5C6B", letterSpacing: "0.05em" }}>{month}</span>
                                            </div>

                                            {/* Info */}
                                            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" as const }}>
                                                    <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827", margin: 0, lineHeight: 1.3 }}>
                                                        {event.title}
                                                    </h3>
                                                    {event.isPast && (
                                                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#9CA3AF", backgroundColor: "#F3F4F6", padding: "0.15rem 0.5rem", borderRadius: "9999px", flexShrink: 0 }}>
                                                            Past
                                                        </span>
                                                    )}
                                                </div>

                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                                    {event.description}
                                                </p>

                                                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.25rem 1rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock size={12} aria-hidden="true" /> {event.time}</span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><MapPin size={12} aria-hidden="true" /> {event.location}</span>
                                                </div>

                                                {!event.isPast && (
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#0D5C6B", marginTop: "0.25rem" }}>
                                                        View details <ArrowRight size={13} aria-hidden="true" />
                                                    </span>
                                                )}
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
            <style>{`
        @media (max-width: 767px) {
          .events-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}