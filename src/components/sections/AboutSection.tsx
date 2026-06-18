"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const miniStats = [
    { value: "22+", label: "Years Active" },
    { value: "£2.4M+", label: "Raised" },
    { value: "85+", label: "Projects" },
];

// const valuePills = [
//     "Full Transparency",
//     "Diaspora-led",
//     "UK Registered",
//     "Grassroots Delivery",
// ];

export default function AboutSection() {
    return (
        <section style={{ backgroundColor: "#ffffff", padding: "6rem 1.5rem" }}>
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4rem",
                    alignItems: "center",
                }}
                className="about-grid"
            >
                {/* ── Left — dark teal quote card ── */}
                <div
                    style={{
                        backgroundColor: "#0D5C6B",
                        borderRadius: "1.25rem",
                        padding: "2.75rem",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Subtle gold glow top-right */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            top: "-60px",
                            right: "-60px",
                            width: "220px",
                            height: "220px",
                            borderRadius: "50%",
                            background:
                                "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />

                    {/* Est. badge */}
                    <div style={{ marginBottom: "2rem" }}>
                        <span
                            style={{
                                display: "inline-block",
                                backgroundColor: "rgba(201,168,76,0.15)",
                                border: "1px solid rgba(201,168,76,0.4)",
                                color: "#C9A84C",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase" as const,
                                padding: "0.3rem 0.875rem",
                                borderRadius: "9999px",
                            }}
                        >
                            Est. 2002
                        </span>
                    </div>

                    {/* Large opening quote mark */}
                    <div
                        aria-hidden="true"
                        style={{
                            fontFamily: "var(--font-noto)",
                            fontSize: "5rem",
                            lineHeight: 0.8,
                            color: "rgba(201,168,76,0.3)",
                            marginBottom: "0.5rem",
                            userSelect: "none",
                        }}
                    >
                        &ldquo;
                    </div>

                    {/* Quote */}
                    <blockquote style={{ margin: 0 }}>
                        <p
                            style={{
                                fontFamily: "var(--font-noto)",
                                fontStyle: "italic",
                                fontSize: "1.125rem",
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.9)",
                                marginBottom: "1.5rem",
                            }}
                        >
                            We were displaced from Jaffna, but we never lost our
                            responsibility to those who remained.
                        </p>
                        <footer
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.8125rem",
                                color: "rgba(255,255,255,0.45)",
                                letterSpacing: "0.02em",
                            }}
                        >
                            — JMA Founding Committee, 2002
                        </footer>
                    </blockquote>

                    {/* Divider */}
                    <div
                        style={{
                            height: "1px",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            margin: "2rem 0",
                        }}
                    />

                    {/* Mini stats row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "0.5rem",
                        }}
                    >
                        {miniStats.map(({ value, label }) => (
                            <div key={label} style={{ textAlign: "center" as const }}>
                                <div
                                    style={{
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 800,
                                        fontSize: "1.375rem",
                                        color: "#C9A84C",
                                        lineHeight: 1,
                                        marginBottom: "0.3rem",
                                    }}
                                >
                                    {value}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.7rem",
                                        color: "rgba(255,255,255,0.45)",
                                        letterSpacing: "0.03em",
                                    }}
                                >
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right — copy ── */}
                <div>
                    {/* Eyebrow */}
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "#C9A84C",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Our Story
                    </p>

                    {/* Headline */}
                    <h2
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                            color: "#111827",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Rooted in Jaffna.{" "}
                        <span
                            style={{
                                color: "#0D5C6B",
                                fontStyle: "italic",
                                fontFamily: "var(--font-noto)",
                            }}
                        >
                            Working
                        </span>{" "}
                        for Jaffna.
                    </h2>

                    {/* Body copy */}
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1rem",
                            lineHeight: 1.8,
                            color: "#4B5563",
                            marginBottom: "1.125rem",
                        }}
                    >
                        The Jaffna Muslim Association was founded in 2002 by members of the
                        Jaffna Muslim diaspora who resettled in the United Kingdom following
                        the civil conflict in Sri Lanka. Though they built new lives here,
                        their hearts remained with the community they left behind.
                    </p>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1rem",
                            lineHeight: 1.8,
                            color: "#4B5563",
                            marginBottom: "2rem",
                        }}
                    >
                        Over two decades, JMA has channelled the generosity of the UK
                        diaspora into tangible, lasting change — rebuilding masjids,
                        sponsoring education, funding healthcare, and standing with families
                        through emergencies. Every project is volunteer-run. Every penny
                        reaches the ground.
                    </p>

                    {/* Value pills */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap" as const,
                            gap: "0.5rem",
                            marginBottom: "2.25rem",
                        }}
                    >
                        {/* {valuePills.map((pill) => (
                            <span
                                key={pill}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                    backgroundColor: "#E8F4F6",
                                    color: "#0D5C6B",
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: 600,
                                    fontSize: "0.8125rem",
                                    padding: "0.4rem 0.875rem",
                                    borderRadius: "9999px",
                                }}
                            >
                                <CheckCircle size={12} aria-hidden="true" />
                                {pill}
                            </span>
                        ))} */}
                    </div>

                    {/* CTA link */}
                    <Link
                        href="/about"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            color: "#0D5C6B",
                            textDecoration: "none",
                            borderBottom: "1.5px solid #C9A84C",
                            paddingBottom: "2px",
                            transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color = "#094955";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.color = "#0D5C6B";
                        }}
                    >
                        Learn more about JMA
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </div>

            <style>{`
        @media (max-width: 767px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
        </section>
    );
}