"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { updateProjectCategoryAction } from "@/app/admin/impact/actions";
import type { DBProjectCategory } from "@/types/database";

export default function ProjectCategoriesSection({ categories }: { categories: DBProjectCategory[] }) {
    const [values, setValues] = useState<Record<string, { count: string; percentage: string }>>(
        Object.fromEntries(categories.map((c) => [c.id, { count: String(c.count), percentage: String(c.percentage) }]))
    );
    const [isPending, startTransition] = useTransition();
    const [savedId, setSavedId] = useState<string | null>(null);

    const totalPercentage = Object.values(values).reduce((sum, v) => sum + (Number(v.percentage) || 0), 0);

    const handleSave = (id: string) => {
        const v = values[id];
        startTransition(async () => {
            await updateProjectCategoryAction(id, {
                count: Number(v.count) || 0,
                percentage: Number(v.percentage) || 0,
            });
            setSavedId(id);
            setTimeout(() => setSavedId(null), 1500);
        });
    };

    return (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F3F4F6" }}>
                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827" }}>Project Breakdown Bars</p>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                    The horizontal bar chart on the Impact page. Percentages should add up to 100%.
                </p>
            </div>

            {totalPercentage !== 100 && (
                <div style={{ backgroundColor: "#FEF2F2", padding: "0.75rem 1.5rem", borderBottom: "1px solid #FECACA" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#DC2626" }}>
                        ⚠ Percentages currently total {totalPercentage}% — should add up to 100% for the bars to read correctly.
                    </p>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" as const }}>
                {categories.map((cat) => {
                    const v = values[cat.id];
                    return (
                        <div
                            key={cat.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "180px 1fr 100px 100px auto",
                                gap: "1rem",
                                alignItems: "center",
                                padding: "1rem 1.5rem",
                                borderBottom: "1px solid #F3F4F6",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: cat.colour_hex, flexShrink: 0 }} />
                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#111827" }}>{cat.label}</span>
                            </div>

                            <div style={{ height: "6px", backgroundColor: "#F3F4F6", borderRadius: "9999px", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Number(v.percentage) || 0}%`, backgroundColor: cat.colour_hex, borderRadius: "9999px", transition: "width 0.3s ease" }} />
                            </div>

                            <input
                                type="number"
                                min="0"
                                value={v.count}
                                onChange={(e) => setValues({ ...values, [cat.id]: { ...v, count: e.target.value } })}
                                placeholder="Count"
                                style={{ width: "100%", padding: "0.4375rem 0.625rem", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#111827", outline: "none", boxSizing: "border-box" as const }}
                            />

                            <div style={{ position: "relative" }}>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={v.percentage}
                                    onChange={(e) => setValues({ ...values, [cat.id]: { ...v, percentage: e.target.value } })}
                                    placeholder="%"
                                    style={{ width: "100%", padding: "0.4375rem 1.375rem 0.4375rem 0.625rem", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#111827", outline: "none", boxSizing: "border-box" as const }}
                                />
                                <span style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "#9CA3AF", pointerEvents: "none" }}>%</span>
                            </div>

                            <button
                                onClick={() => handleSave(cat.id)}
                                disabled={isPending}
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.3rem",
                                    padding: "0.4375rem 0.75rem", borderRadius: "0.375rem", border: "none",
                                    backgroundColor: savedId === cat.id ? "#15803D" : "#0D5C6B", color: "#ffffff",
                                    fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem",
                                    cursor: isPending ? "not-allowed" : "pointer", transition: "background-color 0.2s ease",
                                    whiteSpace: "nowrap" as const,
                                }}
                            >
                                <Save size={12} aria-hidden="true" />
                                {savedId === cat.id ? "Saved!" : "Save"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}