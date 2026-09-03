"use client";

import Image from "next/image";
import { Quote } from "lucide-react";

export default function PresidentMessage() {
    return (
        <section
            style={{
                backgroundColor: "#073D47",
                padding: "6rem 1.5rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background texture */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
            radial-gradient(circle at 0% 50%, rgba(201,168,76,0.07) 0%, transparent 50%),
            radial-gradient(circle at 100% 50%, rgba(13,92,107,0.4) 0%, transparent 60%),
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 50%)
          `,
                    pointerEvents: "none",
                }}
            />

            {/* Decorative arc */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "-120px",
                    right: "-120px",
                    width: "480px",
                    height: "480px",
                    borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.08)",
                    pointerEvents: "none",
                }}
            />
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "-60px",
                    right: "-60px",
                    width: "360px",
                    height: "360px",
                    borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.05)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "5rem",
                    alignItems: "center",
                }}
                className="president-grid"
            >
                {/* ── Left: Photo + identity card ── */}
                <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "2rem" }}>

                    {/* Photo with ring treatment */}
                    <div style={{ position: "relative" }}>
                        {/* Outer gold ring */}
                        <div style={{
                            width: "280px",
                            height: "280px",
                            borderRadius: "50%",
                            border: "2px solid rgba(201,168,76,0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "6px",
                        }}
                            className="president-photo-ring"
                        >
                            {/* Inner ring */}
                            <div style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                border: "1px solid rgba(201,168,76,0.15)",
                                overflow: "hidden",
                                position: "relative",
                            }}>
                                <Image
                                    src="/images/committee/fazil-gaffoor.png"
                                    alt="Mohamed Fazil Abdul Gaffoor — President, JMA"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        </div>

                        {/* Gold accent dot */}
                        <div style={{
                            position: "absolute",
                            bottom: "16px",
                            right: "16px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#C9A84C",
                            border: "3px solid #073D47",
                            boxShadow: "0 0 0 2px rgba(201,168,76,0.3)",
                        }} />
                    </div>

                    {/* Glassmorphism identity card */}
                    <div style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "1rem",
                        padding: "1.5rem 2rem",
                        textAlign: "center" as const,
                        width: "100%",
                        maxWidth: "280px",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}>
                        <p style={{
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase" as const,
                            color: "#C9A84C",
                            marginBottom: "0.5rem",
                        }}>
                            President
                        </p>
                        <p style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "1.0625rem",
                            color: "#ffffff",
                            lineHeight: 1.3,
                            marginBottom: "0.375rem",
                        }}>
                            Mohamed Fazil<br />Abdul Gaffoor
                        </p>
                        <p style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.8125rem",
                            color: "rgba(255,255,255,0.45)",
                        }}>
                            Jaffna Muslim Association UK
                        </p>
                    </div>
                </div>

                {/* ── Right: message ── */}
                <div>
                    {/* Section label */}
                    <p style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        color: "#C9A84C",
                        marginBottom: "1rem",
                    }}>
                        A Message from our President
                    </p>

                    {/* Large pull quote */}
                    <div style={{ position: "relative", marginBottom: "2rem" }}>
                        <Quote
                            size={48}
                            style={{
                                color: "rgba(201,168,76,0.15)",
                                position: "absolute",
                                top: "-8px",
                                left: "-8px",
                            }}
                            aria-hidden="true"
                        />
                        <blockquote style={{
                            fontFamily: "var(--font-noto)",
                            fontStyle: "italic",
                            fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)",
                            color: "#ffffff",
                            lineHeight: 1.6,
                            letterSpacing: "-0.01em",
                            paddingLeft: "1rem",
                            margin: 0,
                            position: "relative",
                            zIndex: 1,
                        }}>
                            "Every pound entrusted to JMA carries with it the hope of a family in Jaffna. We treat that trust as sacred."
                        </blockquote>
                    </div>

                    {/* Gold divider */}
                    <div style={{
                        width: "48px",
                        height: "2px",
                        backgroundColor: "#C9A84C",
                        borderRadius: "9999px",
                        marginBottom: "1.75rem",
                        opacity: 0.6,
                    }} />

                    {/* Body paragraphs */}
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                        {[
                            "Bismillah. On behalf of the entire JMA committee, I want to express our deepest gratitude to every single donor, volunteer, and supporter who has stood with us over the past two decades. What we have achieved together is not the work of an organisation — it is the work of a community.",
                            "The Jaffna Muslim community has endured much. Displacement, loss, and hardship that most of us in the UK will never fully understand. But what has never wavered is the resilience and faith of our brothers and sisters on the ground — and the generosity of our community here in Britain who have never forgotten where they came from.",
                            "JMA exists as a bridge between two nations. Every project we deliver — every masjid rebuilt, every child educated, every family supported through hardship — is a testament to what becomes possible when a community unites behind a shared purpose. We remain committed to full transparency, grassroots delivery, and serving with the dignity that every beneficiary deserves.",
                            "I ask Allah to accept our efforts, bless our donors abundantly, and grant ease to every family we serve. Ameen.",
                        ].map((para, i) => (
                            <p
                                key={i}
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.9375rem",
                                    lineHeight: 1.85,
                                    color: i === 3 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)",
                                    fontStyle: i === 3 ? "italic" : "normal",
                                }}
                            >
                                {para}
                            </p>
                        ))}
                    </div>

                    {/* Signature line */}
                    <div style={{
                        marginTop: "2.25rem",
                        paddingTop: "1.5rem",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            position: "relative",
                            flexShrink: 0,
                            border: "1.5px solid rgba(201,168,76,0.4)",
                        }}>
                            <Image
                                src="/images/committee/fazil-gaffoor.png"
                                alt="Mohamed Fazil"
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <div>
                            <p style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 700,
                                fontSize: "0.9375rem",
                                color: "#ffffff",
                                marginBottom: "0.125rem",
                            }}>
                                Mohamed Fazil Abdul Gaffoor
                            </p>
                            <p style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.8125rem",
                                color: "rgba(255,255,255,0.45)",
                            }}>
                                President, Jaffna Muslim Association UK
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 767px) {
          .president-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .president-photo-ring {
            width: 200px !important;
            height: 200px !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .president-grid {
            gap: 3rem !important;
          }
        }
      `}</style>
        </section>
    );
}