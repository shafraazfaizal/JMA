import Link from "next/link";
import { Plus } from "lucide-react";
import {
    getAllImpactStories,
    getAllAnnualHighlights,
    getAllProjectCategories,
} from "@/lib/admin/impact";
import ImpactStoryRow from "@/components/admin/ImpactStoryRow";
import AnnualHighlightsSection from "@/components/admin/AnnualHighlightsSection";
import ProjectCategoriesSection from "@/components/admin/ProjectCategoriesSection";

export default async function AdminImpactPage() {
    const [stories, highlights, categories] = await Promise.all([
        getAllImpactStories(),
        getAllAnnualHighlights(),
        getAllProjectCategories(),
    ]);

    return (
        <div>
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                    Impact Page
                </h1>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                    Manage the stats, stories, and project breakdown shown on the public Impact page. Changes appear live immediately.
                </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "2.5rem" }}>

                {/* ── Stories ── */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <div>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827" }}>Impact Stories</p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>{stories.length} stories in the carousel</p>
                        </div>
                        <Link
                            href="/admin/impact/stories/new"
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1.125rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.8125rem", textDecoration: "none" }}
                        >
                            <Plus size={14} aria-hidden="true" /> New Story
                        </Link>
                    </div>

                    {stories.length === 0 ? (
                        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "3rem 1.5rem", textAlign: "center" as const }}>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>No stories yet. Add the first one to populate the carousel.</p>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                            {stories.map((story, i) => (
                                <ImpactStoryRow key={story.id} story={story} isLast={i === stories.length - 1} />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Annual Highlights ── */}
                <AnnualHighlightsSection highlights={highlights} />

                {/* ── Project Categories ── */}
                <ProjectCategoriesSection categories={categories} />
            </div>
        </div>
    );
}