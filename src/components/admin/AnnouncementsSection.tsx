"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Check, X, AlertTriangle, Eye, EyeOff } from "lucide-react";
import {
    createAnnouncementAction,
    updateAnnouncementAction,
    deleteAnnouncementAction,
} from "@/app/admin/announcements/actions";
import type { DBHeroAnnouncement } from "@/types/announcement-types";

interface FormState {
    message: string;
    link_url: string;
    is_active: boolean;
}

const emptyForm: FormState = { message: "", link_url: "", is_active: true };

function smallInputStyle(): React.CSSProperties {
    return {
        width: "100%",
        padding: "0.5rem 0.625rem",
        borderRadius: "0.375rem",
        border: "1.5px solid #E5E7EB",
        fontFamily: "var(--font-inter)",
        fontSize: "0.8125rem",
        color: "#111827",
        outline: "none",
        boxSizing: "border-box" as const,
        backgroundColor: "#ffffff",
    };
}

export default function AnnouncementsSection({ announcements }: { announcements: DBHeroAnnouncement[] }) {
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const startAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setAdding(true);
    };

    const startEdit = (a: DBHeroAnnouncement) => {
        setForm({ message: a.message, link_url: a.link_url ?? "", is_active: a.is_active });
        setAdding(false);
        setEditingId(a.id);
    };

    const cancel = () => { setAdding(false); setEditingId(null); setForm(emptyForm); };

    const save = () => {
        if (!form.message.trim()) return;
        const input = {
            message: form.message.trim(),
            link_url: form.link_url.trim() || null,
            is_active: form.is_active,
            display_order: editingId
                ? announcements.find((a) => a.id === editingId)?.display_order ?? 0
                : announcements.length,
        };
        startTransition(async () => {
            if (editingId) {
                await updateAnnouncementAction(editingId, input);
            } else {
                await createAnnouncementAction(input);
            }
            cancel();
        });
    };

    const handleToggleActive = (a: DBHeroAnnouncement) => {
        startTransition(async () => {
            await updateAnnouncementAction(a.id, { is_active: !a.is_active });
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteAnnouncementAction(id);
            setDeletingId(null);
        });
    };

    const FormRow = (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: "0.625rem", alignItems: "center", padding: "0.875rem 1.5rem", backgroundColor: "#E8F4F6" }}>
            <input
                placeholder="Announcement message, e.g. Qurbani applications are now open"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
                style={smallInputStyle()}
                autoFocus
            />
            <input
                placeholder="Link URL (optional)"
                value={form.link_url}
                onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                style={{ ...smallInputStyle(), minWidth: "160px" }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#0D5C6B", whiteSpace: "nowrap" as const, cursor: "pointer" }}>
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} style={{ accentColor: "#0D5C6B" }} />
                Active
            </label>
            <button onClick={save} disabled={isPending || !form.message.trim()} style={{ width: "30px", height: "30px", borderRadius: "0.375rem", border: "none", backgroundColor: "#0D5C6B", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: form.message.trim() ? "pointer" : "not-allowed", flexShrink: 0 }} title="Save">
                <Check size={14} aria-hidden="true" />
            </button>
            <button onClick={cancel} style={{ width: "30px", height: "30px", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }} title="Cancel">
                <X size={14} aria-hidden="true" />
            </button>
        </div>
    );

    return (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #F3F4F6" }}>
                <div>
                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827" }}>
                        Hero Announcements
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                        Rotating ticker shown below the homepage hero. Active items cycle every 5 seconds.
                    </p>
                </div>
                {!adding && !editingId && (
                    <button onClick={startAdd} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1.5px solid #0D5C6B", backgroundColor: "#E8F4F6", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#0D5C6B", cursor: "pointer" }}>
                        <Plus size={14} aria-hidden="true" /> Add Announcement
                    </button>
                )}
            </div>

            {/* Column labels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 60px 80px", gap: "1rem", padding: "0.5rem 1.5rem", backgroundColor: "#F9FAFB", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
                <span>Message</span><span>Link</span><span>Status</span><span></span>
            </div>

            {adding && FormRow}

            {announcements.length === 0 && !adding ? (
                <div style={{ padding: "2.5rem 1.5rem", textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF" }}>No announcements yet. Add one and it will appear on the live homepage immediately.</p>
                </div>
            ) : (
                announcements.map((a) =>
                    editingId === a.id ? (
                        <div key={a.id}>{FormRow}</div>
                    ) : (
                        <div
                            key={a.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                padding: "0.875rem 1.5rem",
                                borderBottom: "1px solid #F3F4F6",
                                opacity: isPending || !a.is_active ? 0.6 : 1,
                                transition: "opacity 0.2s ease",
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "#111827", marginBottom: "0.125rem" }}>
                                    {a.message}
                                </p>
                                {a.link_url && (
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>
                                        → {a.link_url}
                                    </p>
                                )}
                            </div>

                            <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", flexShrink: 0, color: a.is_active ? "#15803D" : "#9CA3AF", backgroundColor: a.is_active ? "#F0FDF4" : "#F3F4F6", padding: "0.2rem 0.625rem", borderRadius: "9999px" }}>
                                {a.is_active ? "Active" : "Hidden"}
                            </span>

                            {deletingId === a.id ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#DC2626", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                        <AlertTriangle size={12} aria-hidden="true" /> Delete?
                                    </span>
                                    <button onClick={() => handleDelete(a.id)} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.25rem", border: "none", backgroundColor: "#DC2626", color: "#fff", fontSize: "0.75rem", cursor: "pointer" }}>Yes</button>
                                    <button onClick={() => setDeletingId(null)} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.25rem", border: "1px solid #E5E7EB", backgroundColor: "#fff", fontSize: "0.75rem", cursor: "pointer" }}>No</button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                                    <button
                                        onClick={() => handleToggleActive(a)}
                                        title={a.is_active ? "Hide from homepage" : "Show on homepage"}
                                        style={{ width: "28px", height: "28px", borderRadius: "0.375rem", border: `1.5px solid ${a.is_active ? "#BBF7D0" : "#E5E7EB"}`, backgroundColor: a.is_active ? "#F0FDF4" : "#F9FAFB", color: a.is_active ? "#15803D" : "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                    >
                                        {a.is_active ? <Eye size={13} aria-hidden="true" /> : <EyeOff size={13} aria-hidden="true" />}
                                    </button>
                                    <button onClick={() => startEdit(a)} title="Edit" style={{ width: "28px", height: "28px", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#0D5C6B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        <Pencil size={13} aria-hidden="true" />
                                    </button>
                                    <button onClick={() => setDeletingId(a.id)} title="Delete" style={{ width: "28px", height: "28px", borderRadius: "0.375rem", border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        <Trash2 size={13} aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                )
            )}
        </div>
    );
}