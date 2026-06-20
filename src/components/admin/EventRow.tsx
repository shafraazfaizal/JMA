"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, AlertTriangle, Users } from "lucide-react";
import { deleteEventAction } from "@/app/admin/events/actions";
import { isEventPast } from "@/lib/admin/events-utils";
import type { DBEvent } from "@/types/database";

export default function EventRow({
    event,
    rsvpCount,
    isLast,
}: {
    event: DBEvent;
    rsvpCount: number;
    isLast: boolean;
}) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [isPending, startTransition] = useTransition();
    const isPast = isEventPast(event.event_date);

    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const handleDelete = () => {
        startTransition(async () => {
            await deleteEventAction(event.id);
        });
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "1.25rem 1.5rem",
                borderBottom: isLast ? "none" : "1px solid #F3F4F6",
                opacity: isPending ? 0.5 : 1,
                transition: "opacity 0.2s ease",
            }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem", flexWrap: "wrap" as const }}>
                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>
                        {event.title}
                    </p>
                    <span
                        style={{
                            backgroundColor: isPast ? "#F3F4F6" : "#E8F4F6",
                            color: isPast ? "#6B7280" : "#0D5C6B",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase" as const,
                            padding: "0.2rem 0.625rem",
                            borderRadius: "9999px",
                        }}
                    >
                        {isPast ? "Past" : "Upcoming"}
                    </span>
                    {!isPast && rsvpCount > 0 && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", color: "#C9A84C" }}>
                            <Users size={12} aria-hidden="true" /> {rsvpCount} RSVP{rsvpCount === 1 ? "" : "s"}
                        </span>
                    )}
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                    {fmtDate(event.event_date)} · {event.event_time} · {event.location}
                </p>
            </div>

            {confirmingDelete ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#DC2626", fontWeight: 600 }}>
                        <AlertTriangle size={14} aria-hidden="true" /> Delete this?
                    </span>
                    <button onClick={handleDelete} disabled={isPending} style={{ padding: "0.4375rem 0.875rem", borderRadius: "0.375rem", border: "none", backgroundColor: "#DC2626", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}>
                        Yes, delete
                    </button>
                    <button onClick={() => setConfirmingDelete(false)} style={{ padding: "0.4375rem 0.875rem", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#374151", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer" }}>
                        Cancel
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    <a href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer" title="View live page" style={{ width: "34px", height: "34px", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280", textDecoration: "none" }}>
                        <ExternalLink size={15} aria-hidden="true" />
                    </a>
                    <Link href={`/admin/events/${event.id}/edit`} title="Edit" style={{ width: "34px", height: "34px", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D5C6B", textDecoration: "none" }}>
                        <Pencil size={15} aria-hidden="true" />
                    </Link>
                    <button onClick={() => setConfirmingDelete(true)} title="Delete" style={{ width: "34px", height: "34px", borderRadius: "0.5rem", border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", cursor: "pointer" }}>
                        <Trash2 size={15} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}