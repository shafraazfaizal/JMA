"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { campaigns } from "@/data/campaigns";
import { formatCurrency, calcProgress } from "@/lib/utils";

export default function CampaignBanner() {
    const campaign = campaigns[0];
    const progress = calcProgress(campaign.raised, campaign.goal);
    const barRef = useRef<HTMLDivElement>(null);
    const [filled, setFilled] = useState(false);

    useEffect(() => {
        const el = barRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setFilled(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            style={{
                backgroundColor: "#0D5C6B",
                padding: "1.5rem",
            }}
        >
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "1.25rem 2.5rem",
                }}
            >
                {/* Label */}
                <div
                    style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        color: "#C9A84C",
                        flexShrink: 0,
                    }}
                >
                    Current Campaign
                </div>

                {/* Title + progress — grows */}
                <div style={{ flex: 1, minWidth: "240px" }}>
                    <div
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            color: "#ffffff",
                            marginBottom: "0.5rem",
                        }}
                    >
                        {campaign.title}
                    </div>

                    {/* Bar track */}
                    <div
                        ref={barRef}
                        style={{
                            height: "6px",
                            backgroundColor: "rgba(255,255,255,0.15)",
                            borderRadius: "9999px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                backgroundColor: "#C9A84C",
                                borderRadius: "9999px",
                                width: filled ? `${progress}%` : "0%",
                                transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        />
                    </div>
                </div>

                {/* Amounts */}
                <div
                    style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.85)",
                        flexShrink: 0,
                        whiteSpace: "nowrap" as const,
                    }}
                >
                    <span style={{ fontWeight: 700, color: "#ffffff" }}>
                        {formatCurrency(campaign.raised)}
                    </span>{" "}
                    raised of{" "}
                    <span style={{ fontWeight: 600 }}>{formatCurrency(campaign.goal)}</span>
                    <span
                        style={{
                            marginLeft: "0.75rem",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.8125rem",
                        }}
                    >
                        {campaign.donorCount} donors · {campaign.daysRemaining} days left
                    </span>
                </div>

                {/* CTA */}
                <Link
                    href={`/campaigns/${campaign.slug}`}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        fontFamily: "var(--font-inter)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#ffffff",
                        textDecoration: "none",
                        whiteSpace: "nowrap" as const,
                        borderBottom: "1px solid rgba(255,255,255,0.4)",
                        paddingBottom: "1px",
                        transition: "border-color 0.15s ease",
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor =
                            "rgba(255,255,255,0.4)";
                    }}
                >
                    Donate to this campaign
                    <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}