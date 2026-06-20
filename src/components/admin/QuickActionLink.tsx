"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function QuickActionLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.125rem",
                borderRadius: "0.75rem",
                border: "1.5px dashed #D1D5DB",
                backgroundColor: "#ffffff",
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                textDecoration: "none",
                transition: "border-color 0.15s ease, background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "#0D5C6B";
                el.style.backgroundColor = "#E8F4F6";
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "#D1D5DB";
                el.style.backgroundColor = "#ffffff";
            }}
        >
            <Plus size={15} style={{ color: "#0D5C6B" }} aria-hidden="true" />
            {label}
        </Link>
    );
}