import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCampaignById } from "@/lib/admin/campaigns";
import CampaignForm from "@/components/admin/CampaignForm";

export default async function EditCampaignPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const campaign = await getCampaignById(id);

    if (!campaign) notFound();

    return (
        <div style={{ maxWidth: "720px" }}>
            <Link
                href="/admin/campaigns"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "#6B7280", textDecoration: "none", marginBottom: "1.5rem" }}
            >
                <ArrowLeft size={15} aria-hidden="true" /> Back to Campaigns
            </Link>

            <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.375rem" }}>
                Edit Campaign
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "2rem" }}>
                Changes are published to the live site immediately upon saving.
            </p>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "2rem" }}>
                <CampaignForm campaign={campaign} />
            </div>
        </div>
    );
}