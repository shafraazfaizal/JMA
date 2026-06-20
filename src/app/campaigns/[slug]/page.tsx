import { notFound } from "next/navigation";
import { getCampaignBySlug, getCampaignUpdates, getAllCampaigns } from "@/lib/admin/campaigns";
import CampaignDetailClient from "@/components/campaigns/CampaignDetailClient";

export const revalidate = 60;

export default async function CampaignDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const campaign = await getCampaignBySlug(slug);

    if (!campaign) notFound();

    const [updates, allCampaigns] = await Promise.all([
        getCampaignUpdates(campaign.id),
        getAllCampaigns(),
    ]);

    const related = allCampaigns
        .filter((c) => c.id !== campaign.id && c.category === campaign.category)
        .slice(0, 2);

    return <CampaignDetailClient campaign={campaign} updates={updates} related={related} />;
}