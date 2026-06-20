"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, AlertTriangle, GripVertical } from "lucide-react";
import { deleteImpactStoryAction } from "@/app/admin/impact/actions";
import type { DBImpactStory } from "@/types/database";

const categoryColours: Record<string, { bg: string; text: string }> = {
    Infrastructure: { bg: "#E8F4F6", text: "#0D5C6B" },
    Education: { bg: "#EEF2FF", text: "#4338CA" },
    Healthcare: { bg: "#F0FDF4", text: "#15803D" },
    Emergency: { bg: "#FEF2F2", text: "#DC2626" },
    Welfare: { bg: "#FAF5E8", text: "#B08D35" },
};

export default function ImpactStoryRow({ story, isLast }: { story: DBImpactStory; isLast: boolean }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [isPending, startTransition] = useTransition();
    const colour = categoryColours[story.category] ?? { bg: "#F3F4F6", text: "#374151" };

    const handleDelete = () => {
        startTransition(async () => {
            await deleteImpactStoryAction(story.id);
        });
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.125rem 1.5rem",
                borderBottom: isLast ? "none" : "1px solid #F3F4F6",
                opacity: isPending ? 0.5 : 1,
                transition: "opacity 0.2s ease",
            }}
        >
            <GripVertical size={15} style={{ color: "#D1D5DB", flexShrink: 0 }} aria-hidden="true" />

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem", flexWrap: "wrap" as const }}>
                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>
                        {story.name}{story.age ? `, ${story.age}` : ""}
                    </p>
                    <span style={{ backgroundColor: colour.bg, color: colour.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.04em", textTransform: "uppercase" as const, padding: "0.2rem 0.625rem", borderRadius: "9999px" }}>
                        {story.category}
                    </span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                    {story.location} · Order: {story.display_order}
                </p>
            </div>

            {confirmingDelete ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#DC2626", fontWeight: 600 }}>
                        <AlertTriangle size={14} aria-hidden="true" /> Delete?
                    </span>
                    <button onClick={handleDelete} disabled={isPending} style={{ padding: "0.375rem 0.75rem", borderRadius: "0.375rem", border: "none", backgroundColor: "#DC2626", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}>
                        Yes
                    </button>
                    <button onClick={() => setConfirmingDelete(false)} style={{ padding: "0.375rem 0.75rem", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#374151", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}>
                        Cancel
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    <Link href={`/admin/impact/stories/${story.id}/edit`} title="Edit" style={{ width: "32px", height: "32px", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D5C6B", textDecoration: "none" }}>
                        <Pencil size={14} aria-hidden="true" />
                    </Link>
                    <button onClick={() => setConfirmingDelete(true)} title="Delete" style={{ width: "32px", height: "32px", borderRadius: "0.5rem", border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", cursor: "pointer" }}>
                        <Trash2 size={14} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}