import CampaignsPageClient from "@/components/campaigns/CampaignsPageClient";
import { getAllCampaigns } from "@/lib/admin/campaigns";

// Revalidate this page's data at most every 60 seconds, and instantly
// whenever the admin saves a campaign (via revalidatePath in actions.ts)
export const revalidate = 60;

export default async function CampaignsPage() {
    const campaigns = await getAllCampaigns();

    return <CampaignsPageClient campaigns={campaigns} />;
}