"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowRight, Users, Clock, AlertTriangle, X } from "lucide-react";
import { formatCurrency, calcProgress } from "@/lib/utils";
import type { DBCampaign } from "@/types/database";

type CampaignCategory = DBCampaign["category"];

const categories: { value: CampaignCategory | "All"; label: string }[] = [
    { value: "All", label: "All Campaigns" },
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Education", label: "Education" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Emergency", label: "Emergency" },
    { value: "Welfare", label: "Welfare" },
];

const categoryColours: Record<string, { bg: string; text: string }> = {
    Infrastructure: { bg: "#E8F4F6", text: "#0D5C6B" },
    Education: { bg: "#EEF2FF", text: "#4338CA" },
    Healthcare: { bg: "#F0FDF4", text: "#15803D" },
    Emergency: { bg: "#FEF2F2", text: "#DC2626" },
    Welfare: { bg: "#FAF5E8", text: "#B08D35" },
};

type SortOption = "default" | "most-raised" | "ending-soon" | "newest";

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "default", label: "Featured" },
    { value: "most-raised", label: "Most Raised" },
    { value: "ending-soon", label: "Ending Soon" },
    { value: "newest", label: "Newest" },
];

function CampaignCard({ campaign }: { campaign: DBCampaign }) {
    const progress = calcProgress(campaign.raised, campaign.goal);
    const colour = categoryColours[campaign.category] ?? { bg: "#F3F4F6", text: "#374151" };
    const isUrgent = campaign.status === "urgent";

    return (
        <article
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column" as const,
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
            }}
            onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 12px 32px -6px rgba(0,0,0,0.12)";
                el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                el.style.transform = "translateY(0)";
            }}
        >
            <div
                style={{
                    height: "192px",
                    background: campaign.image_url
                        ? `url(${campaign.image_url}) center/cover`
                        : "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)",
                    position: "relative",
                    flexShrink: 0,
                }}
            >
                {!campaign.image_url && (
                    <div
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `radial-gradient(circle at 70% 30%, rgba(201,168,76,0.15) 0%, transparent 60%)`,
                        }}
                    />
                )}
                <div
                    style={{
                        position: "absolute",
                        top: "0.875rem",
                        left: "0.875rem",
                        right: "0.875rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <span
                        style={{
                            backgroundColor: colour.bg,
                            color: colour.text,
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase" as const,
                            padding: "0.3rem 0.75rem",
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
                                padding: "0.3rem 0.75rem",
                                borderRadius: "9999px",
                            }}
                        >
                            <AlertTriangle size={10} aria-hidden="true" />
                            Urgent
                        </span>
                    )}
                </div>
            </div>

            <div
                style={{
                    padding: "1.375rem 1.5rem",
                    display: "flex",
                    flexDirection: "column" as const,
                    flex: 1,
                    gap: "0.875rem",
                }}
            >
                <h3
                    style={{
                        fontFamily: "var(--font-jakarta)",
                        fontWeight: 700,
                        fontSize: "1.0625rem",
                        color: "#111827",
                        lineHeight: 1.3,
                        margin: 0,
                    }}
                >
                    {campaign.title}
                </h3>

                <p
                    style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.875rem",
                        color: "#6B7280",
                        lineHeight: 1.65,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                    }}
                >
                    {campaign.short_description}
                </p>

                <div>
                    <div
                        style={{
                            height: "7px",
                            backgroundColor: "#E8F4F6",
                            borderRadius: "9999px",
                            overflow: "hidden",
                            marginBottom: "0.625rem",
                        }}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: `${progress}%`,
                                backgroundColor: "#C9A84C",
                                borderRadius: "9999px",
                                transition: "width 1s ease",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#0D5C6B" }}>
                            {formatCurrency(campaign.raised)}{" "}
                            <span style={{ fontWeight: 400, fontSize: "0.8125rem", color: "#9CA3AF" }}>
                                of {formatCurrency(campaign.goal)}
                            </span>
                        </span>
                        <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#C9A84C" }}>
                            {progress}%
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Users size={13} aria-hidden="true" />
                        {campaign.donor_count} donors
                    </span>
                    {campaign.days_remaining !== null && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: isUrgent ? "#DC2626" : "#9CA3AF", fontWeight: isUrgent ? 600 : 400 }}>
                            <Clock size={13} aria-hidden="true" />
                            {campaign.days_remaining} days left
                        </span>
                    )}
                </div>

                <div style={{ marginTop: "auto", display: "flex", gap: "0.625rem" }}>
                    <Link
                        href={`/donate?campaign=${campaign.id}`}
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.6875rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#C9A84C",
                            color: "#ffffff",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                    >
                        Donate
                    </Link>
                    <Link
                        href={`/campaigns/${campaign.slug}`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.6875rem 0.875rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#ffffff",
                            border: "1.5px solid #E5E7EB",
                            color: "#374151",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            transition: "border-color 0.2s ease",
                            gap: "0.25rem",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0D5C6B"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E5E7EB"; }}
                    >
                        Details
                        <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default function CampaignsPageClient({ campaigns }: { campaigns: DBCampaign[] }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<CampaignCategory | "All">("All");
    const [sort, setSort] = useState<SortOption>("default");
    const [showSort, setShowSort] = useState(false);

    const filtered = useMemo(() => {
        let list = [...campaigns];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.short_description.toLowerCase().includes(q) ||
                    c.category.toLowerCase().includes(q)
            );
        }

        if (category !== "All") {
            list = list.filter((c) => c.category === category);
        }

        if (sort === "most-raised") {
            list.sort((a, b) => b.raised - a.raised);
        } else if (sort === "ending-soon") {
            list.sort((a, b) => {
                const aD = a.days_remaining ?? 9999;
                const bD = b.days_remaining ?? 9999;
                return aD - bD;
            });
        } else if (sort === "newest") {
            list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else {
            list.sort((a, b) => {
                if (a.status === "urgent" && b.status !== "urgent") return -1;
                if (b.status === "urgent" && a.status !== "urgent") return 1;
                return 0;
            });
        }

        return list;
    }, [campaigns, search, category, sort]);

    const urgentCount = campaigns.filter((c) => c.status === "urgent").length;
    const hasFilters = search.trim() || category !== "All" || sort !== "default";

    const clearFilters = () => {
        setSearch("");
        setCategory("All");
        setSort("default");
    };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>

            <section
                style={{
                    backgroundColor: "#0D5C6B",
                    padding: "8rem 1.5rem 4rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `
              radial-gradient(circle at 10% 50%, rgba(201,168,76,0.07) 0%, transparent 50%),
              radial-gradient(circle at 90% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)
            `,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "#C9A84C",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Active Campaigns
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            color: "#ffffff",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                            marginBottom: "1rem",
                            maxWidth: "600px",
                        }}
                    >
                        Where your money goes
                    </h1>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1rem",
                            color: "rgba(255,255,255,0.65)",
                            lineHeight: 1.7,
                            maxWidth: "520px",
                            marginBottom: "2rem",
                        }}
                    >
                        Every campaign is vetted, volunteer-run, and 100% funded through donor generosity. Choose a cause and give with confidence.
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "1.5rem" }}>
                        {[
                            { value: `${campaigns.length}`, label: "Active campaigns" },
                            { value: `${urgentCount}`, label: "Urgent appeals" },
                            { value: "100%", label: "Reaches the ground" },
                        ].map(({ value, label }) => (
                            <div key={label}>
                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff" }}>
                                    {value}
                                </span>
                                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", marginLeft: "0.5rem" }}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                style={{
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #E5E7EB",
                    padding: "1.25rem 1.5rem",
                }}
            >
                <div
                    style={{
                        maxWidth: "80rem",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        flexWrap: "wrap" as const,
                    }}
                >
                    <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
                        <Search
                            size={15}
                            style={{
                                position: "absolute",
                                left: "0.875rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#9CA3AF",
                                pointerEvents: "none",
                            }}
                            aria-hidden="true"
                        />
                        <input
                            type="text"
                            placeholder="Search campaigns…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "0.5625rem 0.875rem 0.5625rem 2.25rem",
                                borderRadius: "0.5rem",
                                border: "1.5px solid #E5E7EB",
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.875rem",
                                color: "#111827",
                                outline: "none",
                                transition: "border-color 0.15s ease",
                                backgroundColor: "#F9FAFB",
                            }}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" as const, flex: 1 }}>
                        {categories.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setCategory(value)}
                                style={{
                                    padding: "0.4375rem 0.875rem",
                                    borderRadius: "9999px",
                                    border: `1.5px solid ${category === value ? "#0D5C6B" : "#E5E7EB"}`,
                                    backgroundColor: category === value ? "#E8F4F6" : "#ffffff",
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: 600,
                                    fontSize: "0.8125rem",
                                    color: category === value ? "#0D5C6B" : "#6B7280",
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    whiteSpace: "nowrap" as const,
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <button
                            onClick={() => setShowSort(!showSort)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.375rem",
                                padding: "0.4375rem 0.875rem",
                                borderRadius: "0.5rem",
                                border: "1.5px solid #E5E7EB",
                                backgroundColor: "#ffffff",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                                color: "#374151",
                                cursor: "pointer",
                                transition: "border-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#0D5C6B"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB"; }}
                        >
                            <SlidersHorizontal size={14} aria-hidden="true" />
                            {sortOptions.find((s) => s.value === sort)?.label}
                        </button>

                        {showSort && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 0.375rem)",
                                    right: 0,
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "0.75rem",
                                    boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)",
                                    overflow: "hidden",
                                    zIndex: 50,
                                    minWidth: "160px",
                                }}
                            >
                                {sortOptions.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => { setSort(value); setShowSort(false); }}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "0.6875rem 1rem",
                                            textAlign: "left" as const,
                                            border: "none",
                                            backgroundColor: sort === value ? "#E8F4F6" : "#ffffff",
                                            fontFamily: "var(--font-inter)",
                                            fontWeight: sort === value ? 600 : 400,
                                            fontSize: "0.875rem",
                                            color: sort === value ? "#0D5C6B" : "#374151",
                                            cursor: "pointer",
                                            transition: "background-color 0.15s ease",
                                        }}
                                        onMouseEnter={(e) => { if (sort !== value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F9FAFB"; }}
                                        onMouseLeave={(e) => { if (sort !== value) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff"; }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                padding: "0.4375rem 0.75rem",
                                borderRadius: "0.5rem",
                                border: "none",
                                backgroundColor: "transparent",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                                color: "#EF4444",
                                cursor: "pointer",
                                flexShrink: 0,
                            }}
                        >
                            <X size={13} aria-hidden="true" />
                            Clear
                        </button>
                    )}
                </div>
            </section>

            <section style={{ padding: "3rem 1.5rem 5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.875rem",
                            color: "#6B7280",
                            marginBottom: "1.75rem",
                        }}
                    >
                        {filtered.length === 0
                            ? "No campaigns found"
                            : `Showing ${filtered.length} campaign${filtered.length === 1 ? "" : "s"}`}
                        {category !== "All" && ` in ${category}`}
                        {search.trim() && ` matching "${search}"`}
                    </p>

                    {filtered.length > 0 ? (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "1.5rem",
                            }}
                            className="campaigns-page-grid"
                        >
                            {filtered.map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: "center" as const,
                                padding: "5rem 1.5rem",
                                backgroundColor: "#ffffff",
                                borderRadius: "1rem",
                                border: "1px solid #E5E7EB",
                            }}
                        >
                            <div
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    borderRadius: "50%",
                                    backgroundColor: "#E8F4F6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 1.25rem",
                                }}
                            >
                                <Search size={24} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                            </div>
                            <h3
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 700,
                                    fontSize: "1.125rem",
                                    color: "#111827",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                No campaigns found
                            </h3>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280", marginBottom: "1.5rem" }}>
                                Try adjusting your search or filters.
                            </p>
                            <button
                                onClick={clearFilters}
                                style={{
                                    padding: "0.625rem 1.5rem",
                                    borderRadius: "0.5rem",
                                    border: "none",
                                    backgroundColor: "#0D5C6B",
                                    color: "#ffffff",
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                    cursor: "pointer",
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section
                style={{
                    backgroundColor: "#0D5C6B",
                    padding: "4rem 1.5rem",
                    textAlign: "center" as const,
                }}
            >
                <div style={{ maxWidth: "540px", margin: "0 auto" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.75rem" }}>
                        Can&apos;t decide?
                    </p>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.875rem" }}>
                        Give to our General Fund
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                        Your donation goes where it is needed most — allocated by our on-the-ground team in Jaffna.
                    </p>
                    <Link
                        href="/donate"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.875rem 2rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#C9A84C",
                            color: "#ffffff",
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 700,
                            fontSize: "1rem",
                            textDecoration: "none",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                    >
                        Donate to General Fund
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {showSort && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 39 }}
                    onClick={() => setShowSort(false)}
                />
            )}

            <style>{`
        @media (max-width: 1023px) {
          .campaigns-page-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          .campaigns-page-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}