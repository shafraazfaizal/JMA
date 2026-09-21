// src/app/admin/showcase/page.tsx
import Link from "next/link";
import { getAllShowcaseSubmissions } from "@/lib/admin/showcase";
import ShowcaseSubmissionRow from "@/components/admin/ShowcaseSubmissionRow";

export default async function AdminShowcasePage() {
    const submissions = await getAllShowcaseSubmissions();

    const pending = submissions.filter((s) => s.status === "pending");
    const published = submissions.filter((s) => s.status === "published");
    const rejected = submissions.filter((s) => s.status === "rejected");

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap" as const, gap: "1rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                        Student Showcase
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                        {pending.length} pending · {published.length} published · {rejected.length} rejected
                    </p>
                </div>
                <Link
                    href="/community/showcase"
                    target="_blank"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                >
                    View Public Page ↗
                </Link>
            </div>

            {/* Pending */}
            {pending.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#92400E", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                        Awaiting Review ({pending.length})
                    </h2>
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #FDE68A", overflow: "hidden" }}>
                        {pending.map((s, i) => (
                            <ShowcaseSubmissionRow key={s.id} submission={s} isLast={i === pending.length - 1} />
                        ))}
                    </div>
                </div>
            )}

            {/* Published */}
            {published.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#065F46", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                        Published ({published.length})
                    </h2>
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                        {published.map((s, i) => (
                            <ShowcaseSubmissionRow key={s.id} submission={s} isLast={i === published.length - 1} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {submissions.length === 0 && (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                        No submissions yet. Share the showcase page with your community!
                    </p>
                </div>
            )}
        </div>
    );
}