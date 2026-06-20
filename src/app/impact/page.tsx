import {
    getAllImpactStories,
    getAllAnnualHighlights,
    getAllProjectCategories,
} from "@/lib/admin/impact";
import ImpactPageClient from "@/components/impact/ImpactPageClient";

export const revalidate = 60;

export default async function ImpactPage() {
    const [stories, highlights, projectCategories] = await Promise.all([
        getAllImpactStories(),
        getAllAnnualHighlights(),
        getAllProjectCategories(),
    ]);

    return (
        <ImpactPageClient
            stories={stories}
            highlights={highlights}
            projectCategories={projectCategories}
        />
    );
}