"use client";

import Link from "next/link";
import {
    ArrowRight, Megaphone, Newspaper, PenSquare,
    Calendar, TrendingUp, Image as ImageIcon,
} from "lucide-react";

// Maps a serialisable string name (safe to pass from Server -> Client)
// to the actual icon component, resolved here on the client side.
const iconMap = {
    Megaphone,
    Newspaper,
    PenSquare,
    Calendar,
    TrendingUp,
    ImageIcon,
} as const;

export type DashboardIconName = keyof typeof iconMap;

interface DashboardStatCardProps {
    href: string;
    label: string;
    iconName: DashboardIconName;
    colour: string;
    count: number;
}

export default function DashboardStatCard({ href, label, iconName, colour, count }: DashboardStatCardProps) {
    const Icon = iconMap[iconName];

    return (
        <Link
            href={href}
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                border: "1px solid #E5E7EB",
                padding: "1.5rem",
                textDecoration: "none",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                display: "block",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 8px 24px -4px rgba(0,0,0,0.1)";
                el.style.borderColor = colour;
                el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "none";
                el.style.borderColor = "#E5E7EB";
                el.style.transform = "translateY(0)";
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div
                    style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "0.75rem",
                        backgroundColor: `${colour}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon size={20} style={{ color: colour }} aria-hidden="true" />
                </div>
                <ArrowRight size={16} style={{ color: "#D1D5DB" }} aria-hidden="true" />
            </div>
            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.875rem", color: "#111827", marginBottom: "0.25rem" }}>
                {count}
            </p>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>
                {label}
            </p>
        </Link>
    );
}