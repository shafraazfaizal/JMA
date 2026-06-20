"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft, Users, Clock, AlertTriangle,
    CheckCircle, ArrowRight, Share2, Calendar,
    Image as ImageIcon,
} from "lucide-react";
import { campaigns } from "@/data/campaigns";
import { formatCurrency, calcProgress } from "@/lib/utils";

const categoryColours: Record<string, { bg: string; text: string }> = {
    Infrastructure: { bg: "#E8F4F6", text: "#0D5C6B" },
    Education: { bg: "#EEF2FF", text: "#4338CA" },
    Healthcare: { bg: "#F0FDF4", text: "#15803D" },
    Emergency: { bg: "#FEF2F2", text: "#DC2626" },
    Welfare: { bg: "#FAF5E8", text: "#B08D35" },
};

const donationAmounts = [10, 25, 50, 100, 250, 500];

export default function CampaignDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const campaign = campaigns.find((c) => c.slug === slug);

    if (!campaign) notFound();

    const progress = calcProgress(campaign.raised, campaign.goal);
    const colour = categoryColours[campaign.category] ?? { bg: "#F3F4F6", text: "#374151" };
    const isUrgent = campaign.status === "urgent";
    const remaining = campaign.goal - campaign.raised;

    // Related campaigns — same category, exclude current
    const related = campaigns
        .filter((c) => c.id !== campaign.id && c.category === campaign.category)
        .slice(0, 2);

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>

            {/* ── Hero ── */}
            <section
                style={{
                    background: "linear-gradient(160deg, #0D5C6B 0%, #1a7a8f 40%, #073D47 100%)",
                    padding: "4rem 1.5rem 5rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `radial-gradient(circle at 80% 30%, rgba(201,168,76,0.1) 0%, transparent 55%)`,
                        pointerEvents: "none",
                    }}
                />

                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>

                    {/* Back link */}
                    <Link
                        href="/campaigns"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            color: "rgba(255,255,255,0.65)",
                            textDecoration: "none",
                            marginBottom: "1.75rem",
                            transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)"; }}
                    >
                        <ArrowLeft size={15} aria-hidden="true" />
                        All campaigns
                    </Link>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: "1rem",
                            alignItems: "flex-start",
                        }}
                        className="hero-title-row"
                    >
                        <div>
                            {/* Badges */}
                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" as const }}>
                                <span
                                    style={{
                                        backgroundColor: colour.bg,
                                        color: colour.text,
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase" as const,
                                        padding: "0.3rem 0.875rem",
                                        borderRadius: "9999px",
                                    }}
                                >
                                    {campaign.category}
                                </span>
                                {isUrgent && (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.3rem",
                                            backgroundColor: "#DC2626",
                                            color: "#ffffff",
                                            fontFamily: "var(--font-inter)",
                                            fontWeight: 600,
                                            fontSize: "0.7rem",
                                            letterSpacing: "0.04em",
                                            textTransform: "uppercase" as const,
                                            padding: "0.3rem 0.875rem",
                                            borderRadius: "9999px",
                                        }}
                                    >
                                        <AlertTriangle size={10} aria-hidden="true" />
                                        Urgent Appeal
                                    </span>
                                )}
                            </div>

                            <h1
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.875rem, 4vw, 3rem)",
                                    color: "#ffffff",
                                    lineHeight: 1.1,
                                    letterSpacing: "-0.02em",
                                    maxWidth: "680px",
                                }}
                            >
                                {campaign.title}
                            </h1>
                        </div>

                        {/* Share button */}
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: campaign.title, url: window.location.href });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                }
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                padding: "0.5625rem 1rem",
                                borderRadius: "0.5rem",
                                border: "1px solid rgba(255,255,255,0.25)",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.85)",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                transition: "background-color 0.15s ease",
                                flexShrink: 0,
                                marginTop: "3.25rem",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.18)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                        >
                            <Share2 size={14} aria-hidden="true" />
                            Share
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Main content ── */}
            <section style={{ padding: "0 1.5rem 5rem" }}>
                <div
                    style={{
                        maxWidth: "80rem",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "1fr 380px",
                        gap: "3rem",
                        marginTop: "-2.5rem",
                        alignItems: "start",
                    }}
                    className="detail-grid"
                >

                    {/* ── Left — description + updates ── */}
                    <div>

                        {/* Campaign image placeholder */}
                        <div
                            style={{
                                height: "320px",
                                borderRadius: "1rem",
                                background: "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)",
                                marginBottom: "2rem",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 8px 32px -8px rgba(0,0,0,0.2)",
                            }}
                        >
                            <div
                                aria-hidden="true"
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `radial-gradient(circle at 70% 30%, rgba(201,168,76,0.15) 0%, transparent 60%)`,
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "1.25rem",
                                    left: "1.25rem",
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.45)",
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    padding: "0.25rem 0.625rem",
                                    borderRadius: "0.375rem",
                                }}
                            >
                                Campaign photo coming soon
                            </div>
                        </div>

                        {/* Description */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "1rem",
                                border: "1px solid #E5E7EB",
                                padding: "2rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    color: "#111827",
                                    marginBottom: "1.125rem",
                                }}
                            >
                                About this campaign
                            </h2>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "1rem",
                                    lineHeight: 1.8,
                                    color: "#4B5563",
                                    whiteSpace: "pre-line" as const,
                                }}
                            >
                                {campaign.description}
                            </p>
                        </div>

                        {/* What your donation covers */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "1rem",
                                border: "1px solid #E5E7EB",
                                padding: "2rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    color: "#111827",
                                    marginBottom: "1.25rem",
                                }}
                            >
                                What your donation covers
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                                {[
                                    { amount: "£10", desc: "Covers materials for one day of construction work" },
                                    { amount: "£25", desc: "Provides tools and supplies for a volunteer team" },
                                    { amount: "£50", desc: "Funds one week of skilled labour on-site" },
                                    { amount: "£100", desc: "Covers structural materials for a key section" },
                                    { amount: "£250", desc: "Sponsors a complete phase of the project" },
                                    { amount: "£500", desc: "Funds one month of full project operations" },
                                ].map(({ amount, desc }) => (
                                    <div
                                        key={amount}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "0.875rem",
                                        }}
                                    >
                                        <div
                                            style={{
                                                flexShrink: 0,
                                                backgroundColor: "#E8F4F6",
                                                borderRadius: "0.5rem",
                                                padding: "0.375rem 0.75rem",
                                                fontFamily: "var(--font-jakarta)",
                                                fontWeight: 700,
                                                fontSize: "0.875rem",
                                                color: "#0D5C6B",
                                                minWidth: "54px",
                                                textAlign: "center" as const,
                                            }}
                                        >
                                            {amount}
                                        </div>
                                        <p
                                            style={{
                                                fontFamily: "var(--font-inter)",
                                                fontSize: "0.9rem",
                                                color: "#4B5563",
                                                lineHeight: 1.6,
                                                paddingTop: "0.25rem",
                                            }}
                                        >
                                            {desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Updates */}
                        {campaign.updates && campaign.updates.length > 0 && (
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "1rem",
                                    border: "1px solid #E5E7EB",
                                    padding: "2rem",
                                }}
                            >
                                <h2
                                    style={{
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 700,
                                        fontSize: "1.25rem",
                                        color: "#111827",
                                        marginBottom: "1.5rem",
                                    }}
                                >
                                    Campaign updates
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>
                                    {campaign.updates.map((update) => (
                                        <div
                                            key={update.id}
                                            style={{
                                                paddingLeft: "1.25rem",
                                                borderLeft: "3px solid #C9A84C",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.625rem",
                                                    marginBottom: "0.5rem",
                                                }}
                                            >
                                                <Calendar size={13} style={{ color: "#9CA3AF" }} aria-hidden="true" />
                                                <span
                                                    style={{
                                                        fontFamily: "var(--font-inter)",
                                                        fontSize: "0.8125rem",
                                                        color: "#9CA3AF",
                                                    }}
                                                >
                                                    {update.date}
                                                </span>
                                            </div>
                                            <h3
                                                style={{
                                                    fontFamily: "var(--font-jakarta)",
                                                    fontWeight: 700,
                                                    fontSize: "1rem",
                                                    color: "#111827",
                                                    marginBottom: "0.375rem",
                                                }}
                                            >
                                                {update.title}
                                            </h3>
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-inter)",
                                                    fontSize: "0.9rem",
                                                    color: "#6B7280",
                                                    lineHeight: 1.7,
                                                }}
                                            >
                                                {update.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right — sticky donation panel ── */}
                    <div style={{ position: "sticky", top: "90px" }}>
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "1rem",
                                border: "1px solid #E5E7EB",
                                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)",
                                overflow: "hidden",
                            }}
                        >
                            {/* Progress header */}
                            <div style={{ padding: "1.5rem 1.5rem 1.25rem" }}>
                                {/* Raised amount */}
                                <div style={{ marginBottom: "1rem" }}>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-jakarta)",
                                            fontWeight: 800,
                                            fontSize: "2rem",
                                            color: "#0D5C6B",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {formatCurrency(campaign.raised)}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-inter)",
                                            fontSize: "0.9rem",
                                            color: "#9CA3AF",
                                            marginLeft: "0.5rem",
                                        }}
                                    >
                                        raised of {formatCurrency(campaign.goal)}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div
                                    style={{
                                        height: "8px",
                                        backgroundColor: "#E8F4F6",
                                        borderRadius: "9999px",
                                        overflow: "hidden",
                                        marginBottom: "0.875rem",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: `${progress}%`,
                                            backgroundColor: "#C9A84C",
                                            borderRadius: "9999px",
                                        }}
                                    />
                                </div>

                                {/* Stats row */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "0.5rem",
                                        paddingBottom: "1.25rem",
                                        borderBottom: "1px solid #F3F4F6",
                                    }}
                                >
                                    {[
                                        { value: `${progress}%`, label: "funded" },
                                        { value: `${campaign.donorCount}`, label: "donors" },
                                        { value: campaign.daysRemaining !== null ? `${campaign.daysRemaining}` : "—", label: "days left" },
                                    ].map(({ value, label }) => (
                                        <div key={label} style={{ textAlign: "center" as const }}>
                                            <div
                                                style={{
                                                    fontFamily: "var(--font-jakarta)",
                                                    fontWeight: 800,
                                                    fontSize: "1.125rem",
                                                    color: "#111827",
                                                    lineHeight: 1,
                                                    marginBottom: "0.2rem",
                                                }}
                                            >
                                                {value}
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily: "var(--font-inter)",
                                                    fontSize: "0.75rem",
                                                    color: "#9CA3AF",
                                                }}
                                            >
                                                {label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick donate amounts */}
                            <div style={{ padding: "0 1.5rem 1.5rem" }}>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 600,
                                        fontSize: "0.8125rem",
                                        color: "#374151",
                                        letterSpacing: "0.04em",
                                        textTransform: "uppercase" as const,
                                        marginBottom: "0.75rem",
                                        marginTop: "1.125rem",
                                    }}
                                >
                                    Quick Donate
                                </p>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "0.5rem",
                                        marginBottom: "0.875rem",
                                    }}
                                >
                                    {donationAmounts.map((amt) => (
                                        <Link
                                            key={amt}
                                            href={`/donate?campaign=${campaign.id}&amount=${amt}`}
                                            style={{
                                                display: "block",
                                                padding: "0.625rem",
                                                borderRadius: "0.5rem",
                                                border: "1.5px solid #E5E7EB",
                                                backgroundColor: "#ffffff",
                                                fontFamily: "var(--font-jakarta)",
                                                fontWeight: 700,
                                                fontSize: "0.9375rem",
                                                color: "#374151",
                                                textDecoration: "none",
                                                textAlign: "center" as const,
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget as HTMLAnchorElement;
                                                el.style.borderColor = "#C9A84C";
                                                el.style.backgroundColor = "#FAF5E8";
                                                el.style.color = "#B08D35";
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget as HTMLAnchorElement;
                                                el.style.borderColor = "#E5E7EB";
                                                el.style.backgroundColor = "#ffffff";
                                                el.style.color = "#374151";
                                            }}
                                        >
                                            £{amt}
                                        </Link>
                                    ))}
                                </div>

                                {/* Main donate CTA */}
                                <Link
                                    href={`/donate?campaign=${campaign.id}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "0.5rem",
                                        width: "100%",
                                        padding: "0.875rem",
                                        borderRadius: "0.5rem",
                                        backgroundColor: "#C9A84C",
                                        color: "#ffffff",
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        textDecoration: "none",
                                        transition: "background-color 0.2s ease",
                                        marginBottom: "0.75rem",
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                                >
                                    Donate to this campaign
                                    <ArrowRight size={16} aria-hidden="true" />
                                </Link>

                                {/* Remaining */}
                                {remaining > 0 && (
                                    <p
                                        style={{
                                            fontFamily: "var(--font-inter)",
                                            fontSize: "0.8125rem",
                                            color: "#9CA3AF",
                                            textAlign: "center" as const,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <strong style={{ color: "#0D5C6B" }}>{formatCurrency(remaining)}</strong> still needed to reach the goal
                                    </p>
                                )}
                            </div>

                            {/* Trust row */}
                            <div
                                style={{
                                    borderTop: "1px solid #F3F4F6",
                                    padding: "1rem 1.5rem",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    gap: "0.5rem",
                                }}
                            >
                                {[
                                    "100% reaches the ground",
                                    "Gift Aid eligible",
                                    "UK Registered Charity",
                                ].map((point) => (
                                    <div
                                        key={point}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            fontFamily: "var(--font-inter)",
                                            fontSize: "0.8125rem",
                                            color: "#6B7280",
                                        }}
                                    >
                                        <CheckCircle size={13} style={{ color: "#0D5C6B", flexShrink: 0 }} aria-hidden="true" />
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Urgent banner */}
                        {isUrgent && (
                            <div
                                style={{
                                    marginTop: "1rem",
                                    backgroundColor: "#FEF2F2",
                                    border: "1px solid #FECACA",
                                    borderRadius: "0.875rem",
                                    padding: "1rem 1.25rem",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.75rem",
                                }}
                            >
                                <AlertTriangle size={16} style={{ color: "#DC2626", flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#DC2626", marginBottom: "0.2rem" }}>
                                        Urgent — {campaign.daysRemaining} days remaining
                                    </p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#B91C1C", opacity: 0.8, lineHeight: 1.5 }}>
                                        This campaign needs immediate support to reach its goal on time.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Donor count badge */}
                        <div
                            style={{
                                marginTop: "1rem",
                                backgroundColor: "#E8F4F6",
                                borderRadius: "0.875rem",
                                padding: "0.875rem 1.125rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.625rem",
                            }}
                        >
                            <Users size={15} style={{ color: "#0D5C6B", flexShrink: 0 }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#0D5C6B", fontWeight: 500 }}>
                                <strong>{campaign.donorCount} people</strong> have already donated to this campaign
                            </p>
                        </div>

                        {/* Gallery cross-link */}
                        <Link
                            href="/gallery?category=Projects"
                            style={{
                                marginTop: "1rem",
                                backgroundColor: "#ffffff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "0.875rem",
                                padding: "0.875rem 1.125rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.625rem",
                                textDecoration: "none",
                                transition: "border-color 0.2s ease, background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.borderColor = "#A0CDD5";
                                el.style.backgroundColor = "#E8F4F6";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.borderColor = "#E5E7EB";
                                el.style.backgroundColor = "#ffffff";
                            }}
                        >
                            <ImageIcon size={15} style={{ color: "#0D5C6B", flexShrink: 0 }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#374151", fontWeight: 500 }}>
                                See photos from project sites
                            </p>
                        </Link>
                    </div>
                </div>

                {/* ── Related campaigns ── */}
                {related.length > 0 && (
                    <div style={{ maxWidth: "80rem", margin: "3rem auto 0" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                            <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827" }}>
                                More {campaign.category} campaigns
                            </h2>
                            <Link
                                href="/campaigns"
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#0D5C6B", textDecoration: "none", borderBottom: "1.5px solid #C9A84C", paddingBottom: "1px" }}
                            >
                                All campaigns <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="related-grid">
                            {related.map((c) => {
                                const p = calcProgress(c.raised, c.goal);
                                const col = categoryColours[c.category] ?? { bg: "#F3F4F6", text: "#374151" };
                                return (
                                    <Link key={c.id} href={`/campaigns/${c.slug}`} style={{ textDecoration: "none" }}>
                                        <div
                                            style={{
                                                backgroundColor: "#ffffff",
                                                borderRadius: "1rem",
                                                border: "1px solid #E5E7EB",
                                                overflow: "hidden",
                                                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget as HTMLElement;
                                                el.style.boxShadow = "0 8px 24px -4px rgba(0,0,0,0.1)";
                                                el.style.transform = "translateY(-2px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget as HTMLElement;
                                                el.style.boxShadow = "none";
                                                el.style.transform = "translateY(0)";
                                            }}
                                        >
                                            <div style={{ height: "120px", background: "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)", position: "relative" }}>
                                                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                                                    <span style={{ backgroundColor: col.bg, color: col.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" as const, padding: "0.2rem 0.625rem", borderRadius: "9999px" }}>
                                                        {c.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ padding: "1.125rem 1.25rem" }}>
                                                <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.625rem", lineHeight: 1.3 }}>
                                                    {c.title}
                                                </h3>
                                                <div style={{ height: "5px", backgroundColor: "#E8F4F6", borderRadius: "9999px", overflow: "hidden", marginBottom: "0.5rem" }}>
                                                    <div style={{ height: "100%", width: `${p}%`, backgroundColor: "#C9A84C", borderRadius: "9999px" }} />
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#0D5C6B" }}>{formatCurrency(c.raised)}</span>
                                                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>{p}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>

            <style>{`
        @media (max-width: 1023px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          .related-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 767px) {
          .hero-title-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </main>
    );
}