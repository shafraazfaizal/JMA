"use client";

import Link from "next/link";
import { ArrowRight, PoundSterling, Users, FolderOpen, Heart } from "lucide-react";
import CountUp from "@/components/ui/CountUp";

const stats = [
    {
        icon: PoundSterling,
        prefix: "£",
        value: 2450000,
        suffix: "+",
        label: "Total Funds Raised",
        format: true,
        duration: 2200,
    },
    {
        icon: Users,
        prefix: "",
        value: 12500,
        suffix: "+",
        label: "Families Supported",
        format: true,
        duration: 1800,
    },
    {
        icon: FolderOpen,
        prefix: "",
        value: 85,
        suffix: "+",
        label: "Active Projects",
        format: false,
        duration: 1400,
    },
    {
        icon: Heart,
        prefix: "",
        value: 650,
        suffix: "+",
        label: "Volunteers Worldwide",
        format: false,
        duration: 1600,
    },
];

export default function ImpactSection() {
    return (
        <section
            style={{
                backgroundColor: "#0D5C6B",
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
            radial-gradient(circle at 10% 50%, rgba(201,168,76,0.07) 0%, transparent 50%),
            radial-gradient(circle at 90% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)
          `,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "#C9A84C",
                            marginBottom: "0.875rem",
                        }}
                    >
                        Live Impact
                    </p>
                    <h2
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)",
                            color: "#ffffff",
                            lineHeight: 1.12,
                            letterSpacing: "-0.02em",
                            marginBottom: "1rem",
                        }}
                    >
                        22 years of real change
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1rem",
                            lineHeight: 1.75,
                            color: "rgba(255,255,255,0.65)",
                            maxWidth: "520px",
                            margin: "0 auto",
                        }}
                    >
                        Every statistic represents a life improved, a family stabilised, a
                        community rebuilt.
                    </p>
                </div>

                {/* Stats grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "1.5rem",
                        marginBottom: "3.5rem",
                    }}
                    className="impact-stats-grid"
                >
                    {stats.map(({ icon: Icon, prefix, value, suffix, label, format, duration }) => (
                        <div
                            key={label}
                            style={{
                                backgroundColor: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "1rem",
                                padding: "2rem 1.5rem",
                                display: "flex",
                                flexDirection: "column" as const,
                                alignItems: "center",
                                textAlign: "center" as const,
                                gap: "0.875rem",
                                transition: "background-color 0.25s ease, border-color 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.backgroundColor = "rgba(255,255,255,0.1)";
                                el.style.borderColor = "rgba(201,168,76,0.4)";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.backgroundColor = "rgba(255,255,255,0.06)";
                                el.style.borderColor = "rgba(255,255,255,0.1)";
                            }}
                        >
                            {/* Icon box */}
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "0.75rem",
                                    backgroundColor: "rgba(201,168,76,0.15)",
                                    border: "1px solid rgba(201,168,76,0.25)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Icon size={22} style={{ color: "#C9A84C" }} aria-hidden="true" />
                            </div>

                            {/* Number */}
                            <div
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 800,
                                    fontSize: "clamp(2rem, 3.5vw, 3rem)",
                                    color: "#ffffff",
                                    lineHeight: 1,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {prefix}
                                <CountUp
                                    to={value}
                                    suffix={suffix}
                                    format={format}
                                    duration={duration}
                                />
                            </div>

                            {/* Label */}
                            <div
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.875rem",
                                    color: "rgba(255,255,255,0.6)",
                                    lineHeight: 1.4,
                                }}
                            >
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div style={{ textAlign: "center" }}>
                    <Link
                        href="/impact"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                            color: "rgba(255,255,255,0.75)",
                            textDecoration: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.3)",
                            paddingBottom: "2px",
                            transition: "color 0.15s ease, border-color 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.color = "#ffffff";
                            el.style.borderColor = "rgba(255,255,255,0.7)";
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLAnchorElement;
                            el.style.color = "rgba(255,255,255,0.75)";
                            el.style.borderColor = "rgba(255,255,255,0.3)";
                        }}
                    >
                        See full impact report
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </div>

            <style>{`
        @media (max-width: 1023px) {
          .impact-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 479px) {
          .impact-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    );
}