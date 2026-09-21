// src/components/admin/AdminQuizClient.tsx
"use client";

import { useState, useTransition } from "react";
import { Plus, Send, Trophy, Users, ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import type { DBQuizSession, DBQuizRegistration } from "@/types/database";
import {
    createQuizSessionAction,
    openQuizRegistrationAction,
    closeQuizRegistrationAction,
    sendQuizLinkAction,
    publishQuizWinnerAction,
    clearQuizWinnerAction,
    deleteQuizSessionAction,
} from "@/app/community/quiz/actions";

export default function AdminQuizClient({
    sessions,
    registrations,
}: {
    sessions: DBQuizSession[];
    registrations: DBQuizRegistration[];
}) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showNewForm, setShowNewForm] = useState(false);
    const [showRegistrants, setShowRegistrants] = useState(true);
    const [zoomLink, setZoomLink] = useState("");
    const [winnerForm, setWinnerForm] = useState({ name: "", age_group: "", prize: "" });
    const [showWinnerForm, setShowWinnerForm] = useState<string | null>(null);

    // New session form state
    const [newSession, setNewSession] = useState({
        quiz_month: "", title: "", topic: "", scheduled_at: "",
    });

    const activeSession = sessions.find((s) => s.registration_open) ?? null;

    const handle = async (action: () => Promise<{ success: boolean; error?: string; sent?: number }>) => {
        setError(""); setSuccess("");
        startTransition(async () => {
            const res = await action();
            if (res.success) {
                if (res.sent !== undefined) setSuccess(`Zoom link sent to ${res.sent} registrant${res.sent === 1 ? "" : "s"}.`);
                else setSuccess("Done!");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(res.error ?? "Something went wrong.");
            }
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>
            {/* Feedback */}
            {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.5rem", padding: "0.875rem 1.25rem", color: "#991B1B", fontSize: "0.9rem" }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ background: "#D1FAE5", border: "1px solid #A7F3D0", borderRadius: "0.5rem", padding: "0.875rem 1.25rem", color: "#065F46", fontSize: "0.9rem" }}>
                    {success}
                </div>
            )}

            {/* Active session card */}
            {activeSession ? (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #A7F3D0", padding: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap" as const, gap: "0.75rem" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981", display: "inline-block" }} />
                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827" }}>
                                    {activeSession.title}
                                </span>
                            </div>
                            {activeSession.topic && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>
                                    Topic: {activeSession.topic}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => handle(() => closeQuizRegistrationAction(activeSession.id))}
                            disabled={isPending}
                            style={{ padding: "0.625rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                        >
                            Close Registration
                        </button>
                    </div>

                    {/* Registrant count + toggle */}
                    <button
                        onClick={() => setShowRegistrants((v) => !v)}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#0D5C6B", marginBottom: "0.75rem", padding: 0 }}
                    >
                        <Users size={14} />
                        {registrations.length} Registrant{registrations.length === 1 ? "" : "s"}
                        {showRegistrants ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showRegistrants && registrations.length > 0 && (
                        <div style={{ backgroundColor: "#F9FAFB", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1rem" }}>
                            {registrations.map((r, i) => (
                                <div key={r.id} style={{ padding: "0.75rem 1rem", borderBottom: i === registrations.length - 1 ? "none" : "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: "0.5rem" }}>
                                    <div>
                                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 600, fontSize: "0.875rem", color: "#111827" }}>{r.child_name}</span>
                                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", marginLeft: "0.5rem" }}>{r.age_group}</span>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                                        {r.parent_name} · {r.parent_email}
                                        {r.link_sent && <span style={{ marginLeft: "0.5rem", color: "#059669", fontWeight: 600 }}>✓ Link sent</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Send Zoom link */}
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end", flexWrap: "wrap" as const }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>
                                Zoom Link
                            </label>
                            <input
                                type="url"
                                value={zoomLink}
                                onChange={(e) => setZoomLink(e.target.value)}
                                placeholder="https://zoom.us/j/..."
                                style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", fontFamily: "var(--font-inter)", fontSize: "0.875rem", boxSizing: "border-box" as const }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (!zoomLink.trim()) { setError("Please enter a Zoom link."); return; }
                                if (registrations.length === 0) { setError("No registrants to send to."); return; }
                                handle(() => sendQuizLinkAction(activeSession.id, activeSession.quiz_month, zoomLink.trim()));
                            }}
                            disabled={isPending}
                            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap" as const }}
                        >
                            <Send size={14} /> Send Link to All
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ backgroundColor: "#F9FAFB", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "2rem", textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "1rem" }}>
                        No active quiz session. Create a new session to open registration.
                    </p>
                    <button
                        onClick={() => setShowNewForm(true)}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                    >
                        <Plus size={16} /> New Quiz Session
                    </button>
                </div>
            )}

            {/* New session form */}
            {showNewForm && (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.5rem" }}>
                    <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "1.25rem" }}>New Quiz Session</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        {[
                            { label: "Quiz Month (YYYY-MM)", key: "quiz_month", placeholder: "2026-10", type: "text" },
                            { label: "Title", key: "title", placeholder: "October 2026 Quiz", type: "text" },
                            { label: "Topic (optional)", key: "topic", placeholder: "Islamic History", type: "text" },
                            { label: "Scheduled Date & Time (optional)", key: "scheduled_at", placeholder: "", type: "datetime-local" },
                        ].map(({ label, key, placeholder, type }) => (
                            <div key={key}>
                                <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#374151", marginBottom: "0.375rem" }}>
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    value={newSession[key as keyof typeof newSession]}
                                    onChange={(e) => setNewSession((prev) => ({ ...prev, [key]: e.target.value }))}
                                    placeholder={placeholder}
                                    style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", fontFamily: "var(--font-inter)", fontSize: "0.875rem", boxSizing: "border-box" as const }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            onClick={() => {
                                if (!newSession.quiz_month || !newSession.title) { setError("Month and title are required."); return; }
                                handle(async () => {
                                    const res = await createQuizSessionAction({
                                        quiz_month: newSession.quiz_month,
                                        title: newSession.title,
                                        topic: newSession.topic || undefined,
                                        scheduled_at: newSession.scheduled_at || undefined,
                                    });
                                    if (res.success) setShowNewForm(false);
                                    return res;
                                });
                            }}
                            disabled={isPending}
                            style={{ padding: "0.625rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                        >
                            Create Session
                        </button>
                        <button
                            onClick={() => setShowNewForm(false)}
                            style={{ padding: "0.625rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Past sessions + publish winner */}
            {sessions.filter((s) => !s.registration_open).length > 0 && (
                <div>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#374151", marginBottom: "0.75rem" }}>
                        Past Sessions
                    </h2>
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                        {sessions.filter((s) => !s.registration_open).map((s, i, arr) => (
                            <div key={s.id} style={{ padding: "1rem 1.5rem", borderBottom: i === arr.length - 1 ? "none" : "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "0.75rem" }}>
                                <div>
                                    <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>{s.title}</span>
                                    {s.topic && <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", marginLeft: "0.5rem" }}>· {s.topic}</span>}
                                    {s.results_published && s.winner_name && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.25rem" }}>
                                            <Trophy size={12} style={{ color: "#C9A84C" }} />
                                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#92400E", fontWeight: 600 }}>Winner: {s.winner_name}</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                    <button
                                        onClick={() => handle(() => openQuizRegistrationAction({ id: s.id, quiz_month: s.quiz_month, title: s.title }))}
                                        disabled={isPending || !!activeSession}
                                        style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", backgroundColor: "#E8F4F6", color: "#0D5C6B", border: "1px solid #A7D5DE", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
                                    >
                                        Reopen
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!confirm(`Delete "${s.title}"? This cannot be undone.`)) return;
                                            handle(() => deleteQuizSessionAction(s.id));
                                        }}
                                        disabled={isPending}
                                        title="Delete session"
                                        style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
                                    >
                                        <Trash2 size={13} /> Delete
                                    </button>
                                    {s.results_published && s.winner_name ? (
                                        <>
                                            {/* Edit winner */}
                                            <button
                                                onClick={() => {
                                                    setWinnerForm({
                                                        name: s.winner_name ?? "",
                                                        age_group: s.winner_age_group ?? "",
                                                        prize: s.winner_prize ?? "",
                                                    });
                                                    setShowWinnerForm(showWinnerForm === s.id ? null : s.id);
                                                }}
                                                disabled={isPending}
                                                title="Edit winner"
                                                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
                                            >
                                                <Pencil size={13} /> Edit
                                            </button>
                                            {/* Delete / clear winner */}
                                            <button
                                                onClick={() => {
                                                    if (!confirm(`Remove winner "${s.winner_name}" from ${s.title}?`)) return;
                                                    handle(() => clearQuizWinnerAction(s.id));
                                                }}
                                                disabled={isPending}
                                                title="Remove winner"
                                                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", backgroundColor: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
                                            >
                                                <Trash2 size={13} /> Remove
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setWinnerForm({ name: "", age_group: "", prize: "" });
                                                setShowWinnerForm(showWinnerForm === s.id ? null : s.id);
                                            }}
                                            style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", backgroundColor: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
                                        >
                                            <Trophy size={13} /> Publish Winner
                                        </button>
                                    )}
                                </div>
                                {/* Winner form inline (publish or edit) */}
                                {showWinnerForm === s.id && (
                                    <div style={{ width: "100%", backgroundColor: "#FFFBEB", borderRadius: "0.75rem", border: "1px solid #FDE68A", padding: "1rem", marginTop: "0.5rem" }}>
                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#92400E", marginBottom: "0.75rem" }}>
                                            {s.results_published ? "Edit Winner" : "Publish Winner"}
                                        </p>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                            {[
                                                { label: "Winner's Name", key: "name", placeholder: "Child's name" },
                                                { label: "Age Group", key: "age_group", placeholder: "Junior (5–10)" },
                                                { label: "Prize", key: "prize", placeholder: "£20 Amazon Voucher" },
                                            ].map(({ label, key, placeholder }) => (
                                                <div key={key}>
                                                    <label style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#374151", marginBottom: "0.25rem" }}>{label}</label>
                                                    <input
                                                        type="text"
                                                        value={winnerForm[key as keyof typeof winnerForm]}
                                                        onChange={(e) => setWinnerForm((p) => ({ ...p, [key]: e.target.value }))}
                                                        placeholder={placeholder}
                                                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", border: "1px solid #D1D5DB", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", boxSizing: "border-box" as const }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button
                                                onClick={() => {
                                                    if (!winnerForm.name) { setError("Winner name required."); return; }
                                                    handle(async () => {
                                                        const res = await publishQuizWinnerAction(s.id, winnerForm);
                                                        if (res.success) setShowWinnerForm(null);
                                                        return res;
                                                    });
                                                }}
                                                disabled={isPending}
                                                style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                                            >
                                                {s.results_published ? "Save Changes" : "Confirm & Publish"}
                                            </button>
                                            <button
                                                onClick={() => setShowWinnerForm(null)}
                                                style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", backgroundColor: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create first session button when no sessions exist */}
            {sessions.length === 0 && !showNewForm && (
                <button
                    onClick={() => setShowNewForm(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                >
                    <Plus size={16} /> Create First Quiz Session
                </button>
            )}
        </div>
    );
}