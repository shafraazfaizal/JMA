"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, ArrowRight } from "lucide-react";
import type { DBHeroAnnouncement } from "@/types/announcement-types";

export default function AnnouncementTicker({ announcements }: { announcements: DBHeroAnnouncement[] }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (announcements.length <= 1 || paused) return;
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [announcements.length, paused]);

    if (announcements.length === 0) return null;

    const current = announcements[index];

    const content = (
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {current.message}
            {current.link_url && <ArrowRight size={13} aria-hidden="true" />}
        </span>
    );

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
                backgroundColor: "#073D47",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "0.625rem 1.5rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    justifyContent: "center",
                }}
            >
                <Megaphone size={14} style={{ color: "#C9A84C", flexShrink: 0 }} aria-hidden="true" />

                <div
                    key={current.id}
                    style={{
                        fontFamily: "var(--font-inter)",
                        fontWeight: 500,
                        fontSize: "0.8125rem",
                        color: "rgba(255,255,255,0.85)",
                        animation: "ticker-fade 0.4s ease",
                    }}
                >
                    {current.link_url ? (
                        <Link
                            href={current.link_url}
                            style={{ color: "inherit", textDecoration: "none" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)"; }}
                        >
                            {content}
                        </Link>
                    ) : (
                        content
                    )}
                </div>

                {/* Dots — only shown if there's more than one announcement */}
                {announcements.length > 1 && (
                    <div style={{ display: "flex", gap: "0.3rem", marginLeft: "0.5rem", flexShrink: 0 }}>
                        {announcements.map((a, i) => (
                            <button
                                key={a.id}
                                onClick={() => setIndex(i)}
                                aria-label={`Show announcement ${i + 1}`}
                                style={{
                                    width: i === index ? "14px" : "5px",
                                    height: "5px",
                                    borderRadius: "9999px",
                                    border: "none",
                                    backgroundColor: i === index ? "#C9A84C" : "rgba(255,255,255,0.25)",
                                    cursor: "pointer",
                                    padding: 0,
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes ticker-fade {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}