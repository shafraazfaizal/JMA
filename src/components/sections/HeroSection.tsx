"use client";

import Link from "next/link";
import { CheckCircle, Calendar, Users, FolderOpen } from "lucide-react";
import CountUp from "@/components/ui/CountUp";

const stats = [
    { icon: Calendar, value: 20, suffix: "+", label: "Years of Service" },
    { icon: Users, value: 3000, suffix: "+", label: "Families Helped", format: true },
    { icon: FolderOpen, value: 200, suffix: "+", label: "Projects Delivered" },
    { icon: CheckCircle, value: 100, suffix: "%", label: "Donations to Ground" },
];

const trustPoints = [
    "100% reaches ground",
    "Gift Aid eligible",
    "Stripe secured",
    "Transparent reporting",
];

export default function HeroSection() {
    return (
        <>
            <section
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "hidden",
                    // No marginTop offset needed — floating navbar doesn't push content
                }}
            >
                {/* Background */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `radial-gradient(ellipse 80% 60% at 50% 40%,
              #1a7a8f 0%,
              #0D5C6B 40%,
              #073D47 75%,
              #031F25 100%
            )`,
                        zIndex: 0,
                    }}
                />

                {/* Gold accent overlays */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(201,168,76,0.06) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%)
            `,
                    }}
                />

                {/* Hero content */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        maxWidth: "80rem",
                        margin: "0 auto",
                        padding: "8rem 1.5rem 10rem",
                        width: "100%",
                    }}
                >
                    {/* Eyebrow badge */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                border: "1px solid rgba(201,168,76,0.5)",
                                borderRadius: "0.375rem",
                                padding: "0.375rem 0.875rem",
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase" as const,
                                color: "#C9A84C",
                            }}
                        >
                            <span
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: "#C9A84C",
                                    flexShrink: 0,
                                }}
                            />
                            UK Registered Charity · Since 2002
                        </span>
                    </div>

                    {/* H1 */}
                    <h1
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
                            lineHeight: 1.08,
                            color: "#ffffff",
                            maxWidth: "820px",
                            marginBottom: "1.5rem",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Serving the Jaffna Muslim{" "}
                        <span
                            style={{
                                color: "#C9A84C",
                                fontStyle: "italic",
                                fontFamily: "var(--font-noto)",
                            }}
                        >
                            community
                        </span>{" "}
                        across two nations
                    </h1>

                    {/* Subtext */}
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1.125rem",
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.75)",
                            maxWidth: "560px",
                            marginBottom: "2.5rem",
                        }}
                    >
                        For over 20 years, JMA has connected the UK diaspora with families
                        on the ground in Jaffna — funding education, rebuilding
                        infrastructure, and restoring dignity.
                    </p>

                    {/* CTAs */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap" as const,
                            gap: "0.875rem",
                            marginBottom: "2.5rem",
                        }}
                    >
                        <Link
                            href="/donate"
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "1rem",
                                color: "#ffffff",
                                backgroundColor: "#C9A84C",
                                padding: "0.8125rem 2rem",
                                borderRadius: "0.5rem",
                                textDecoration: "none",
                                transition: "background-color 0.2s ease",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C";
                            }}
                        >
                            Donate Now
                        </Link>
                        <Link
                            href="/campaigns"
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "1rem",
                                color: "#ffffff",
                                backgroundColor: "transparent",
                                padding: "0.8125rem 2rem",
                                borderRadius: "0.5rem",
                                border: "2px solid rgba(255,255,255,0.45)",
                                textDecoration: "none",
                                transition: "border-color 0.2s ease, background 0.2s ease",
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

                    {/* Trust row */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap" as const,
                            gap: "0.375rem 1.5rem",
                        }}
                    >
                        {trustPoints.map((point) => (
                            <div
                                key={point}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.8125rem",
                                    color: "rgba(255,255,255,0.65)",
                                }}
                            >
                                <CheckCircle
                                    size={13}
                                    style={{ color: "#C9A84C", flexShrink: 0 }}
                                    aria-hidden="true"
                                />
                                {point}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats card — pulled up to overlap bottom of hero */}
            <div
                style={{
                    padding: "0 1.5rem",
                    marginTop: "-80px",
                    position: "relative",
                    zIndex: 10,
                }}
            >
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "1rem",
                            boxShadow:
                                "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.08)",
                            padding: "2rem 2.5rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "1.5rem",
                        }}
                        className="stats-grid"
                    >
                        {stats.map(({ icon: Icon, value, suffix, label, format }) => (
                            <div
                                key={label}
                                style={{
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    alignItems: "center",
                                    textAlign: "center" as const,
                                    gap: "0.5rem",
                                }}
                            >
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "0.625rem",
                                        backgroundColor: "#E8F4F6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Icon size={20} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 800,
                                        fontSize: "2rem",
                                        color: "#0D5C6B",
                                        lineHeight: 1,
                                    }}
                                >
                                    <CountUp to={value} suffix={suffix} format={format} />
                                </div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.8125rem",
                                        color: "#6B7280",
                                        lineHeight: 1.3,
                                    }}
                                >
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
          }
        `}</style>
            </div>
        </>
    );
}