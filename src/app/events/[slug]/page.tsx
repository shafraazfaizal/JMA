"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft, Calendar, Clock, MapPin, ArrowRight,
    Share2, CheckCircle, Mail, User,
} from "lucide-react";
import { events } from "@/data/events";

function inputStyle(hasValue: boolean): React.CSSProperties {
    return {
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: `1.5px solid ${hasValue ? "#0D5C6B" : "#E5E7EB"}`,
        fontFamily: "var(--font-inter)",
        fontWeight: 500,
        fontSize: "0.9rem",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box" as const,
    };
}

export default function EventDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const event = events.find((e) => e.slug === slug);

    if (!event) notFound();

    const related = events.filter((e) => e.id !== event.id && e.isPast === event.isPast).slice(0, 2);

    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    // RSVP form state
    const [rsvpName, setRsvpName] = useState("");
    const [rsvpEmail, setRsvpEmail] = useState("");
    const [rsvpGuests, setRsvpGuests] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleRSVP = async () => {
        if (!rsvpName.trim()) { setError("Please enter your name."); return; }
        if (!rsvpEmail.includes("@")) { setError("Please enter a valid email."); return; }
        setError("");
        setSubmitting(true);
        // Placeholder — wire to /api/events/rsvp + Resend once built
        await new Promise((r) => setTimeout(r, 800));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ background: "linear-gradient(160deg, #0D5C6B 0%, #1a7a8f 40%, #073D47 100%)", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 80% 30%, rgba(201,168,76,0.1) 0%, transparent 55%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", textDecoration: "none", marginBottom: "1.75rem" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)"; }}
                    >
                        <ArrowLeft size={15} aria-hidden="true" /> All events
                    </Link>

                    {event.isPast && (
                        <span style={{ display: "inline-block", backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.3rem 0.875rem", borderRadius: "9999px", marginBottom: "1.25rem" }}>
                            Past Event
                        </span>
                    )}

                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)", color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
                        {event.title}
                    </h1>

                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "1.5rem" }}>
                        {[
                            { icon: Calendar, value: fmtDate(event.date) },
                            { icon: Clock, value: event.time },
                            { icon: MapPin, value: event.location },
                        ].map(({ icon: Icon, value }) => (
                            <span key={value} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.75)" }}>
                                <Icon size={15} aria-hidden="true" /> {value}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Content ── */}
            <section style={{ padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem", alignItems: "start" }} className="event-grid">

                    {/* Left — description */}
                    <div>
                        <div style={{ height: "260px", borderRadius: "1rem", background: "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)", marginBottom: "2rem", position: "relative", overflow: "hidden" }}>
                            <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 70% 30%, rgba(201,168,76,0.15) 0%, transparent 60%)` }} />
                        </div>

                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1rem" }}>
                            About this event
                        </h2>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", lineHeight: 1.85, color: "#374151", marginBottom: "2rem" }}>
                            {event.description}
                        </p>

                        {event.address && (
                            <div style={{ backgroundColor: "#F9FAFB", borderRadius: "0.875rem", border: "1px solid #E5E7EB", padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                                <MapPin size={18} style={{ color: "#0D5C6B", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#111827", marginBottom: "0.25rem" }}>Venue</p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.5 }}>{event.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — sticky panel: RSVP form (upcoming) or closed state (past) */}
                    <div style={{ position: "sticky", top: "90px" }}>
                        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07)", padding: "1.75rem" }}>
                            {event.isPast ? (
                                <>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
                                        <CheckCircle size={18} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#6B7280" }}>This event has ended</p>
                                    </div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                                        Thank you to everyone who joined us. Stay tuned for our next event.
                                    </p>
                                    <Link href="/events" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8125rem", borderRadius: "0.5rem", backgroundColor: "#F3F4F6", color: "#374151", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
                                        View upcoming events
                                    </Link>
                                </>
                            ) : submitted ? (
                                <div style={{ textAlign: "center" as const, padding: "0.5rem 0" }}>
                                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                                        <CheckCircle size={22} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                    </div>
                                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "0.5rem" }}>
                                        You&apos;re on the list!
                                    </p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.6 }}>
                                        We&apos;ve sent a confirmation to <strong style={{ color: "#111827" }}>{rsvpEmail}</strong>. We look forward to seeing you there.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "1.25rem" }}>
                                        Register Your Interest
                                    </p>

                                    <div style={{ marginBottom: "0.875rem" }}>
                                        <div style={{ position: "relative" }}>
                                            <User size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                value={rsvpName}
                                                onChange={(e) => { setRsvpName(e.target.value); setError(""); }}
                                                style={{ ...inputStyle(!!rsvpName), paddingLeft: "2.25rem" }}
                                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = rsvpName ? "#0D5C6B" : "#E5E7EB"; }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "0.875rem" }}>
                                        <div style={{ position: "relative" }}>
                                            <Mail size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                value={rsvpEmail}
                                                onChange={(e) => { setRsvpEmail(e.target.value); setError(""); }}
                                                style={{ ...inputStyle(!!rsvpEmail), paddingLeft: "2.25rem" }}
                                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = rsvpEmail ? "#0D5C6B" : "#E5E7EB"; }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "1rem" }}>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
                                            Number attending
                                        </p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <button onClick={() => setRsvpGuests(Math.max(1, rsvpGuests - 1))}
                                                style={{ width: "32px", height: "32px", borderRadius: "0.4rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#374151", cursor: "pointer" }}>
                                                −
                                            </button>
                                            <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#0D5C6B", minWidth: "20px", textAlign: "center" as const }}>{rsvpGuests}</span>
                                            <button onClick={() => setRsvpGuests(rsvpGuests + 1)}
                                                style={{ width: "32px", height: "32px", borderRadius: "0.4rem", border: "1.5px solid #0D5C6B", backgroundColor: "#0D5C6B", color: "#ffffff", cursor: "pointer" }}>
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginBottom: "0.875rem" }}>{error}</p>
                                    )}

                                    <button
                                        onClick={handleRSVP}
                                        disabled={submitting}
                                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8125rem", borderRadius: "0.5rem", border: "none", backgroundColor: submitting ? "#B08D35" : "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", cursor: submitting ? "not-allowed" : "pointer", marginBottom: "0.875rem", transition: "background-color 0.2s ease" }}
                                        onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                        onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}
                                    >
                                        {submitting ? "Registering…" : (<>Register Interest <ArrowRight size={15} aria-hidden="true" /></>)}
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (navigator.share) navigator.share({ title: event.title, url: window.location.href });
                                            else navigator.clipboard.writeText(window.location.href);
                                        }}
                                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", cursor: "pointer" }}
                                    >
                                        <Share2 size={14} aria-hidden="true" /> Share event
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Related events ── */}
            {related.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", backgroundColor: "#F9FAFB" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1.75rem" }}>
                            {event.isPast ? "More past events" : "More upcoming events"}
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="related-events-grid">
                            {related.map((e) => (
                                <Link key={e.id} href={`/events/${e.slug}`} style={{ textDecoration: "none" }}>
                                    <article style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.5rem", transition: "box-shadow 0.2s ease" }}
                                        onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -4px rgba(0,0,0,0.1)"; }}
                                        onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                                    >
                                        <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.5rem" }}>{e.title}</h3>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>{fmtDate(e.date)} · {e.location}</p>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
        @media (max-width: 900px) {
          .event-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          .related-events-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}