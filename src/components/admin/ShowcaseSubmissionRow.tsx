// src/components/admin/ShowcaseSubmissionRow.tsx
"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Trash2, ExternalLink } from "lucide-react";
import type { DBShowcaseSubmission } from "@/types/database";
import {
    publishShowcaseAction,
    rejectShowcaseAction,
    deleteShowcaseAction,
} from "@/app/community/showcase/actions";

const categoryColours: Record<string, string> = {
    "Written Word": "#6366F1",
    "Creative Arts": "#EC4899",
    "Spoken Word": "#F59E0B",
    "Islamic Achievement": "#10B981",
    "Academic": "#3B82F6",
    "Sport & Fitness": "#EF4444",
};

export default function ShowcaseSubmissionRow({
    submission: s,
    isLast,
}: {
    submission: DBShowcaseSubmission;
    isLast: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const colour = categoryColours[s.category] ?? "#6B7280";

    const handle = (action: () => Promise<{ success: boolean; error?: string }>) => {
        setError("");
        startTransition(async () => {
            const res = await action();
            if (!res.success) setError(res.error ?? "Something went wrong.");
        });
    };

    return (
        <div style={{
            padding: "1.25rem 1.5rem",
            borderBottom: isLast ? "none" : "1px solid #F3F4F6",
            display: "flex", gap: "1rem", alignItems: "flex-start",
            opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s",
        }}>
            {/* Category dot */}
            <div style={{
                width: "10px", height: "10px", borderRadius: "50%",
                backgroundColor: colour, flexShrink: 0, marginTop: "6px",
            }} />

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" as const, marginBottom: "0.25rem" }}>
                    <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>
                        {s.title}
                    </span>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px",
                        backgroundColor: `${colour}18`, color: colour, border: `1px solid ${colour}40`,
                    }}>
                        {s.category}
                    </span>
                    {s.status === "published" && (
                        <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px", backgroundColor: "#D1FAE5", color: "#065F46" }}>
                            Published
                        </span>
                    )}
                    {s.status === "rejected" && (
                        <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px", backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                            Rejected
                        </span>
                    )}
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", marginBottom: "0.25rem" }}>
                    {s.child_name} · {s.age_group} · Parent: {s.parent_name} ({s.parent_email})
                </p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#374151", lineHeight: 1.5, marginBottom: s.file_url ? "0.5rem" : 0 }}>
                    {s.description.length > 160 ? s.description.slice(0, 160) + "…" : s.description}
                </p>
                {s.file_url && (
                    <a
                        href={s.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: "#0D5C6B", textDecoration: "none", fontWeight: 600 }}
                    >
                        <ExternalLink size={12} /> View {s.file_type} attachment
                    </a>
                )}
                {error && (
                    <p style={{ fontSize: "0.8125rem", color: "#DC2626", marginTop: "0.5rem" }}>{error}</p>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                {s.status === "pending" && (
                    <>
                        <button
                            onClick={() => handle(() => publishShowcaseAction(s.id))}
                            disabled={isPending}
                            title="Publish"
                            style={{
                                display: "flex", alignItems: "center", gap: "0.375rem",
                                padding: "0.5rem 0.875rem", borderRadius: "0.5rem",
                                backgroundColor: "#0D5C6B", color: "#ffffff", border: "none",
                                fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem",
                                cursor: "pointer",
                            }}
                        >
                            <CheckCircle size={14} /> Publish
                        </button>
                        <button
                            onClick={() => handle(() => rejectShowcaseAction(s.id))}
                            disabled={isPending}
                            title="Reject"
                            style={{
                                display: "flex", alignItems: "center", gap: "0.375rem",
                                padding: "0.5rem 0.875rem", borderRadius: "0.5rem",
                                backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA",
                                fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem",
                                cursor: "pointer",
                            }}
                        >
                            <XCircle size={14} /> Reject
                        </button>
                    </>
                )}
                {s.status === "published" && (
                    <button
                        onClick={() => handle(() => rejectShowcaseAction(s.id))}
                        disabled={isPending}
                        title="Unpublish"
                        style={{
                            padding: "0.5rem 0.875rem", borderRadius: "0.5rem",
                            backgroundColor: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB",
                            fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem",
                            cursor: "pointer",
                        }}
                    >
                        Unpublish
                    </button>
                )}
                <button
                    onClick={() => {
                        if (confirm(`Delete "${s.title}"? This cannot be undone.`)) {
                            handle(() => deleteShowcaseAction(s.id));
                        }
                    }}
                    disabled={isPending}
                    title="Delete"
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: "36px", height: "36px", borderRadius: "0.5rem",
                        backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA",
                        cursor: "pointer",
                    }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}