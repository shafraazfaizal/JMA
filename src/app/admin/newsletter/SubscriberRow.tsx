// src/app/admin/newsletter/SubscriberRow.tsx
"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { removeSubscriberAction } from "./actions";

interface Props {
    id: string;
    email: string;
    status: string;
    date: string;
    isLast: boolean;
}

export default function SubscriberRow({ id, email, status, date, isLast }: Props) {
    const [confirming, setConfirming] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            await removeSubscriberAction(id);
        });
    };

    return (
        <div
            style={{
                display: "grid", gridTemplateColumns: "1fr 100px 140px 80px",
                gap: "1rem", padding: "0.9375rem 1.5rem", alignItems: "center",
                borderBottom: isLast ? "none" : "1px solid #F3F4F6",
                opacity: isPending ? 0.4 : 1, transition: "opacity 0.2s ease",
            }}
        >
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#111827", fontWeight: 500 }}>
                {email}
            </span>

            <span style={{
                display: "inline-flex", alignItems: "center",
                fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem",
                letterSpacing: "0.06em", textTransform: "uppercase" as const,
                padding: "0.25rem 0.625rem", borderRadius: "9999px",
                backgroundColor: status === "active" ? "#F0FDF4" : "#F3F4F6",
                color: status === "active" ? "#15803D" : "#6B7280",
                width: "fit-content",
            }}>
                {status}
            </span>

            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                {date}
            </span>

            {/* Delete */}
            {confirming ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.25rem",
                            padding: "0.375rem 0.625rem", borderRadius: "0.375rem",
                            border: "none", backgroundColor: "#DC2626", color: "#ffffff",
                            fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem",
                            cursor: "pointer",
                        }}
                    >
                        <AlertTriangle size={11} aria-hidden="true" /> Yes
                    </button>
                    <button
                        onClick={() => setConfirming(false)}
                        style={{
                            padding: "0.375rem 0.5rem", borderRadius: "0.375rem",
                            border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff",
                            fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem",
                            color: "#374151", cursor: "pointer",
                        }}
                    >
                        No
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setConfirming(true)}
                    title="Remove subscriber"
                    style={{
                        width: "34px", height: "34px", borderRadius: "0.5rem",
                        border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#DC2626", cursor: "pointer",
                    }}
                >
                    <Trash2 size={14} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}