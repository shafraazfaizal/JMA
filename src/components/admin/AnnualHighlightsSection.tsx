"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Check, X, Star } from "lucide-react";
import {
    createAnnualHighlightAction,
    updateAnnualHighlightAction,
    deleteAnnualHighlightAction,
} from "@/app/admin/impact/actions";
import type { DBAnnualHighlight } from "@/types/database";

interface FormState {
    year_label: string;
    raised: string;
    projects_completed: string;
    families_supported: string;
    is_latest: boolean;
}

const emptyForm: FormState = { year_label: "", raised: "", projects_completed: "", families_supported: "", is_latest: false };

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
    };
}

export default function AnnualHighlightsSection({ highlights }: { highlights: DBAnnualHighlight[] }) {
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

    const startEdit = (h: DBAnnualHighlight) => {
        setForm({
            year_label: h.year_label,
            raised: String(h.raised),
            projects_completed: String(h.projects_completed),
            families_supported: String(h.families_supported),
            is_latest: h.is_latest,
        });
        setAdding(false);
        setEditingId(h.id);
    };

    const cancel = () => {
        setAdding(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const save = () => {
        const input = {
            year_label: form.year_label,
            raised: Number(form.raised) || 0,
            projects_completed: Number(form.projects_completed) || 0,
            families_supported: Number(form.families_supported) || 0,
            is_latest: form.is_latest,
            display_order: editingId
                ? highlights.find((h) => h.id === editingId)?.display_order ?? 0
                : highlights.length,
        };

        startTransition(async () => {
            if (editingId) {
                await updateAnnualHighlightAction(editingId, input);
            } else {
                await createAnnualHighlightAction(input);
            }
            cancel();
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteAnnualHighlightAction(id);
            setDeletingId(null);
        });
    };

    const FormRow = (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto", gap: "0.625rem", alignItems: "center", padding: "0.875rem 1.5rem", backgroundColor: "#FAF5E8" }}>
            <input placeholder="2025/26" value={form.year_label} onChange={(e) => setForm({ ...form, year_label: e.target.value })} style={smallInputStyle()} />
            <input placeholder="Raised (£)" type="number" value={form.raised} onChange={(e) => setForm({ ...form, raised: e.target.value })} style={smallInputStyle()} />
            <input placeholder="Projects" type="number" value={form.projects_completed} onChange={(e) => setForm({ ...form, projects_completed: e.target.value })} style={smallInputStyle()} />
            <input placeholder="Families" type="number" value={form.families_supported} onChange={(e) => setForm({ ...form, families_supported: e.target.value })} style={smallInputStyle()} />
            <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#B08D35", whiteSpace: "nowrap" as const, cursor: "pointer" }}>
                <input type="checkbox" checked={form.is_latest} onChange={(e) => setForm({ ...form, is_latest: e.target.checked })} style={{ accentColor: "#C9A84C" }} />
                Latest
            </label>
            <div style={{ display: "flex", gap: "0.375rem" }}>
                <button onClick={save} disabled={isPending} style={{ width: "30px", height: "30px", borderRadius: "0.375rem", border: "none", backgroundColor: "#0D5C6B", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Save">
                    <Check size={14} aria-hidden="true" />
                </button>
                <button onClick={cancel} style={{ width: "30px", height: "30px", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Cancel">
                    <X size={14} aria-hidden="true" />
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", borderBottom: "1px solid #F3F4F6" }}>
                <div>
                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827" }}>Annual Highlights</p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>The year-by-year table on the Impact page</p>
                </div>
                {!adding && (
                    <button onClick={startAdd} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1.5px solid #0D5C6B", backgroundColor: "#E8F4F6", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#0D5C6B", cursor: "pointer" }}>
                        <Plus size={14} aria-hidden="true" /> Add Year
                    </button>
                )}
            </div>

            {/* Column labels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto", gap: "0.625rem", padding: "0.625rem 1.5rem", backgroundColor: "#F9FAFB", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>
                <span>Year</span><span>Raised</span><span>Projects</span><span>Families</span><span></span><span></span>
            </div>

            {adding && FormRow}

            {highlights.length === 0 && !adding ? (
                <div style={{ padding: "2rem 1.5rem", textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF" }}>No annual highlights yet.</p>
                </div>
            ) : (
                highlights.map((h) =>
                    editingId === h.id ? (
                        <div key={h.id}>{FormRow}</div>
                    ) : (
                        <div
                            key={h.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr auto auto",
                                gap: "0.625rem",
                                alignItems: "center",
                                padding: "0.875rem 1.5rem",
                                borderBottom: "1px solid #F3F4F6",
                                opacity: isPending ? 0.5 : 1,
                            }}
                        >
                            <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#111827", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                {h.year_label}
                                {h.is_latest && <Star size={12} style={{ color: "#C9A84C", fill: "#C9A84C" }} aria-hidden="true" />}
                            </span>
                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#374151" }}>£{h.raised.toLocaleString("en-GB")}</span>
                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#374151" }}>{h.projects_completed}</span>
                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#374151" }}>{h.families_supported.toLocaleString("en-GB")}</span>
                            <span />
                            {deletingId === h.id ? (
                                <div style={{ display: "flex", gap: "0.25rem" }}>
                                    <button onClick={() => handleDelete(h.id)} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.25rem", border: "none", backgroundColor: "#DC2626", color: "#fff", fontSize: "0.7rem", cursor: "pointer" }}>Yes</button>
                                    <button onClick={() => setDeletingId(null)} style={{ padding: "0.25rem 0.5rem", borderRadius: "0.25rem", border: "1px solid #E5E7EB", backgroundColor: "#fff", fontSize: "0.7rem", cursor: "pointer" }}>No</button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", gap: "0.375rem" }}>
                                    <button onClick={() => startEdit(h)} style={{ width: "28px", height: "28px", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#0D5C6B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        <Pencil size={12} aria-hidden="true" />
                                    </button>
                                    <button onClick={() => setDeletingId(h.id)} style={{ width: "28px", height: "28px", borderRadius: "0.375rem", border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                        <Trash2 size={12} aria-hidden="true" />
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