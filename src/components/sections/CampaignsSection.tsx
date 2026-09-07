"use client";

import Link from "next/link";
import { ArrowRight, Users, Clock, AlertTriangle } from "lucide-react";
import type { DBCampaign } from "@/types/database";

const categoryColours: Record<string, { bg: string; text: string }> = {
    Infrastructure: { bg: "#E8F4F6", text: "#0D5C6B" },
    Education: { bg: "#EEF2FF", text: "#4338CA" },
    Healthcare: { bg: "#F0FDF4", text: "#15803D" },
    Emergency: { bg: "#FEF2F2", text: "#DC2626" },
    Welfare: { bg: "#FAF5E8", text: "#B08D35" },
};

// ── Mankumban placeholder — shown only when DB has no active campaigns ────────
const PLACEHOLDER_CAMPAIGNS: DBCampaign[] = [
    // {
    //     id: "placeholder-1",
    //     slug: "mankumban-masjid-reconstruction",
    //     title: "Mankumban Masjid Reconstruction",
    //     short_description: "Rebuilding the heart of the Mankumban community — a masjid that served worshippers for generations before the conflict destroyed it.",
    //     description: "",
    //     category: "Infrastructure",
    //     status: "active",
    //     goal: 85000,
    //     raised: 61200,
    //     donor_count: 142,
    //     days_remaining: 38,
    //     image_url: null,
    //     created_at: "",
    //     updated_at: "",
    // },
    // {
    //     id: "placeholder-2",
    //     slug: "jaffna-education-fund-2025",
    //     title: "Jaffna Education Fund 2025",
    //     short_description: "Sponsoring 20 students from low-income families through their A/Levels — covering school fees, uniforms, books, and transport for a full academic year.",
    //     description: "",
    //     category: "Education",
    //     status: "active",
    //     goal: 24000,
    //     raised: 17800,
    //     donor_count: 89,
    //     days_remaining: 62,
    //     image_url: null,
    //     created_at: "",
    //     updated_at: "",
    // },
    // {
    //     id: "placeholder-3",
    //     slug: "emergency-flood-relief-2025",
    //     title: "Emergency Flood Relief — Northern Jaffna",
    //     short_description: "Urgent support for families displaced by the 2025 monsoon floods. Providing emergency shelter, food parcels, and clean water to the most affected areas.",
    //     description: "",
    //     category: "Emergency",
    //     status: "urgent",
    //     goal: 15000,
    //     raised: 11400,
    //     donor_count: 203,
    //     days_remaining: 7,
    //     image_url: null,
    //     created_at: "",
    //     updated_at: "",
    // },
];

function formatCurrency(n: number) {
    return "£" + n.toLocaleString("en-GB");
}

function calcProgress(raised: number, goal: number) {
    return Math.min(100, Math.round((raised / goal) * 100));
}

function CampaignCard({ campaign }: { campaign: DBCampaign }) {
    const progress = calcProgress(campaign.raised, campaign.goal);
    const colour = categoryColours[campaign.category] ?? { bg: "#F3F4F6", text: "#374151" };
    const isUrgent = campaign.status === "urgent";
    const isPlaceholder = campaign.id.startsWith("placeholder");

    return (
        <article
            style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden", display: "flex", flexDirection: "column" as const, transition: "box-shadow 0.25s ease, transform 0.25s ease" }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 12px 32px -6px rgba(0,0,0,0.12)"; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; el.style.transform = "translateY(0)"; }}
        >
            {/* Image / gradient header */}
            <div style={{ height: "192px", background: campaign.image_url ? `url(${campaign.image_url}) center/cover` : "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)", position: "relative", flexShrink: 0 }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 70% 30%, rgba(201,168,76,0.15) 0%, transparent 60%)` }} />
                <div style={{ position: "absolute", top: "0.875rem", left: "0.875rem", right: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ backgroundColor: colour.bg, color: colour.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.05em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "9999px" }}>
                        {campaign.category}
                    </span>
                    {isUrgent && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", backgroundColor: "#DC2626", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.04em", textTransform: "uppercase" as const, padding: "0.3rem 0.75rem", borderRadius: "9999px" }}>
                            <AlertTriangle size={10} aria-hidden="true" /> Urgent
                        </span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "1.375rem 1.5rem", display: "flex", flexDirection: "column" as const, flex: 1, gap: "0.875rem" }}>
                <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827", lineHeight: 1.3, margin: 0 }}>
                    {campaign.title}
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {campaign.short_description}
                </p>

                {/* Progress */}
                <div>
                    <div style={{ height: "7px", backgroundColor: "#E8F4F6", borderRadius: "9999px", overflow: "hidden", marginBottom: "0.625rem" }}>
                        <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "#C9A84C", borderRadius: "9999px", transition: "width 1s ease" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#0D5C6B" }}>
                            {formatCurrency(campaign.raised)}{" "}
                            <span style={{ fontWeight: 400, fontSize: "0.8125rem", color: "#9CA3AF" }}>of {formatCurrency(campaign.goal)}</span>
                        </span>
                        <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#C9A84C" }}>{progress}%</span>
                    </div>
                </div>

                {/* Meta */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Users size={13} aria-hidden="true" /> {campaign.donor_count} donors
                    </span>
                    {campaign.days_remaining !== null && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: isUrgent ? "#DC2626" : "#9CA3AF", fontWeight: isUrgent ? 600 : 400 }}>
                            <Clock size={13} aria-hidden="true" /> {campaign.days_remaining} days left
                        </span>
                    )}
                </div>

                {/* CTA */}
                <div style={{ marginTop: "auto" }}>
                    <Link
                        href={isPlaceholder ? "/campaigns" : `/campaigns/${campaign.slug}`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.6875rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#094955"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0D5C6B"; }}
                    >
                        Donate to this campaign <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

interface CampaignsSectionProps {
    campaigns: DBCampaign[];
}

export default function CampaignsSection({ campaigns }: CampaignsSectionProps) {
    const displayed = campaigns.length > 0 ? campaigns.slice(0, 3) : PLACEHOLDER_CAMPAIGNS;

    return (
        <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
            <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1rem", marginBottom: "3rem" }}>
                    <div>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.5rem" }}>Active Campaigns</p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0 }}>
                            Where your money goes
                        </h2>
                    </div>
                    <Link
                        href="/campaigns"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9rem", color: "#0D5C6B", textDecoration: "none", borderBottom: "1.5px solid #C9A84C", paddingBottom: "1px", whiteSpace: "nowrap" as const }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#094955"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#0D5C6B"; }}
                    >
                        View all campaigns <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="campaigns-grid">
                    {displayed.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 1023px) { .campaigns-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 639px)  { .campaigns-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </section>
    );
}