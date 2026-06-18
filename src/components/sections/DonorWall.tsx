"use client";

import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { donorWallItems } from "@/data/site";
import { formatCurrency } from "@/lib/utils";

export default function DonorWall() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);

    // Duplicate items 3× so the infinite loop never shows a gap
    const items = [...donorWallItems, ...donorWallItems, ...donorWallItems];

    return (
        <section
            style={{
                backgroundColor: "#F0F9FA",
                borderTop: "1px solid #E8F4F6",
                borderBottom: "1px solid #E8F4F6",
                padding: "2.25rem 0",
                overflow: "hidden",
            }}
        >
            {/* Label row */}
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                }}
            >
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        color: "#0D5C6B",
                        flexShrink: 0,
                    }}
                >
                    {/* Pulsing live dot */}
                    <span style={{ position: "relative", display: "inline-flex" }}>
                        <span
                            style={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                backgroundColor: "#C9A84C",
                                display: "block",
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "50%",
                                backgroundColor: "#C9A84C",
                                opacity: 0,
                                animation: "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                            }}
                        />
                    </span>
                    Live Donations
                </span>

                <div
                    style={{
                        height: "1px",
                        backgroundColor: "#D1E9ED",
                        flex: 1,
                    }}
                />
            </div>

            {/* Ticker track */}
            <div
                style={{ overflow: "hidden", cursor: "pointer" }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div
                    ref={trackRef}
                    style={{
                        display: "flex",
                        gap: "0.875rem",
                        width: "max-content",
                        animation: `ticker-scroll 40s linear infinite`,
                        animationPlayState: paused ? "paused" : "running",
                    }}
                >
                    {items.map((item, i) => (
                        <div
                            key={`${item.id}-${i}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.625rem",
                                backgroundColor: "#ffffff",
                                border: "1px solid #E8F4F6",
                                borderRadius: "9999px",
                                padding: "0.5rem 1rem 0.5rem 0.75rem",
                                flexShrink: 0,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                whiteSpace: "nowrap" as const,
                            }}
                        >
                            {/* Heart icon */}
                            <span
                                style={{
                                    width: "26px",
                                    height: "26px",
                                    borderRadius: "50%",
                                    backgroundColor: "#E8F4F6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Heart
                                    size={12}
                                    style={{ color: "#0D5C6B", fill: "#0D5C6B" }}
                                    aria-hidden="true"
                                />
                            </span>

                            {/* Text */}
                            <span
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.8125rem",
                                    color: "#374151",
                                }}
                            >
                                <span style={{ fontWeight: 600, color: "#111827" }}>
                                    {item.donorName}
                                </span>{" "}
                                <span style={{ color: "#9CA3AF" }}>from</span>{" "}
                                <span style={{ fontWeight: 500 }}>{item.location}</span>{" "}
                                <span style={{ color: "#9CA3AF" }}>donated</span>{" "}
                                <span style={{ fontWeight: 700, color: "#0D5C6B" }}>
                                    {formatCurrency(item.amount)}
                                </span>{" "}
                                <span style={{ color: "#9CA3AF" }}>to</span>{" "}
                                <span style={{ fontWeight: 500, color: "#374151" }}>
                                    {item.campaign}
                                </span>
                            </span>

                            {/* Time ago pill */}
                            <span
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.7rem",
                                    color: "#9CA3AF",
                                    backgroundColor: "#F9FAFB",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "9999px",
                                    padding: "0.15rem 0.5rem",
                                    flexShrink: 0,
                                }}
                            >
                                {item.timeAgo}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.6; }
          80%  { transform: scale(2.2); opacity: 0;   }
          100% { transform: scale(2.2); opacity: 0;   }
        }
      `}</style>
        </section>
    );
}