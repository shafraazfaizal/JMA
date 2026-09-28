"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CATEGORY_CONFIG,
    type YearGroup,
    type ProjectCategory,
} from "@/lib/projects-data";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stats {
    totalProjects: number;
    totalGBP: number;
    totalLKR: number;
    uniqueLocations: number;
}

interface Props {
    yearGroups: YearGroup[];
    stats: Stats;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtGBP = (n: number) =>
    n > 0
        ? new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            maximumFractionDigits: 0,
        }).format(n)
        : null;

const fmtLKR = (n: number) =>
    n > 0
        ? "Rs " +
        new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(n)
        : null;

const fmtShort = (n: number) =>
    n >= 1_000_000
        ? (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
        : n >= 1_000
            ? (n / 1_000).toFixed(0) + "K"
            : String(n);

// ─── Category Badge ───────────────────────────────────────────────────────────

function Badge({ type }: { type: ProjectCategory }) {
    const c = CATEGORY_CONFIG[type];
    return (
        <span
            className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap"
            style={{ color: c.textColor, backgroundColor: c.bgColor }}
        >
            {c.label}
        </span>
    );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────

function StatPill({
    value,
    label,
    gold,
}: {
    value: string;
    label: string;
    gold?: boolean;
}) {
    return (
        <div className="flex flex-col items-center text-center">
            <span
                className="text-xl sm:text-2xl font-bold leading-none"
                style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: gold ? "#C9A84C" : "#ffffff",
                }}
            >
                {value}
            </span>
            <span
                className="mt-1 text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.5)" }}
            >
                {label}
            </span>
        </div>
    );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function ProjectsClient({ yearGroups, stats }: Props) {
    // Show most recent year first in the tabs
    const reversedYears = useMemo(() => [...yearGroups].reverse(), [yearGroups]);

    // Default to the most recent year (last item in original array = first in reversed)
    const [activeYearId, setActiveYearId] = useState<string>(
        yearGroups[yearGroups.length - 1]?.id ?? ""
    );
    const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">("all");

    // Active year group — still look up from original array by id
    const activeYear = useMemo(
        () => yearGroups.find((g) => g.id === activeYearId) ?? yearGroups[yearGroups.length - 1],
        [yearGroups, activeYearId]
    );

    // Filtered projects for the active year
    const visibleProjects = useMemo(
        () =>
            activeFilter === "all"
                ? activeYear.projects
                : activeYear.projects.filter((p) => p.type === activeFilter),
        [activeYear, activeFilter]
    );

    // Live stats for the visible set
    const liveStats = useMemo(() => {
        let gbp = 0,
            lkr = 0;
        const locs = new Set<string>();
        for (const p of visibleProjects) {
            gbp += p.gbp;
            lkr += p.lkr;
            if (p.location) locs.add(p.location.split(",")[0].trim());
        }
        return { gbp, lkr, count: visibleProjects.length, locs: locs.size };
    }, [visibleProjects]);

    // Category pills — only show categories present in active year
    const yearCategories = useMemo(() => {
        const seen = new Set(activeYear.projects.map((p) => p.type));
        return (["all"] as (ProjectCategory | "all")[]).concat(
            (Object.keys(CATEGORY_CONFIG) as ProjectCategory[]).filter((k) =>
                seen.has(k)
            )
        );
    }, [activeYear]);

    // Reset filter when switching years if the filter no longer applies
    const handleYearChange = (id: string) => {
        setActiveYearId(id);
        const newYear = yearGroups.find((g) => g.id === id);
        if (
            activeFilter !== "all" &&
            newYear &&
            !newYear.projects.some((p) => p.type === activeFilter)
        ) {
            setActiveFilter("all");
        }
    };

    return (
        <div style={{ backgroundColor: "#F5F0E1", minHeight: "100vh" }}>
            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section
                style={{
                    background:
                        "linear-gradient(135deg, #073D47 0%, #0D5C6B 55%, #0E6B7C 100%)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Subtle grid pattern */}
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `radial-gradient(circle, rgba(201,168,76,0.07) 1px, transparent 1px)`,
                        backgroundSize: "32px 32px",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "clamp(4rem, 10vw, 7rem) 1.25rem 2.5rem",
                    }}
                >
                    {/* Heading */}
                    <h1
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                            fontWeight: 800,
                            color: "#ffffff",
                            margin: "0 0 1rem",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Our Project History
                    </h1>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
                            color: "rgba(255,255,255,0.65)",
                            margin: "0 0 3rem",
                            maxWidth: "560px",
                            lineHeight: 1.65,
                        }}
                    >
                        Over two decades of charitable work — education, medical aid, housing,
                        clean water, emergency relief and more for communities across Sri Lanka
                        and beyond.
                    </p>

                    {/* Stats row — 2×2 on mobile, 4 cols on md+ */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "0",
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.13)",
                            borderRadius: "1rem",
                            overflow: "hidden",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            width: "100%",
                            maxWidth: "560px",
                        }}
                        className="sm:grid-cols-4 sm:max-w-none sm:inline-grid sm:w-auto"
                    >
                        {[
                            { value: stats.totalProjects + "+", label: "Projects" },
                            {
                                value: "£" + fmtShort(stats.totalGBP),
                                label: "Raised (GBP)",
                                gold: true,
                            },
                            {
                                value: "Rs " + fmtShort(stats.totalLKR),
                                label: "Disbursed (LKR)",
                                gold: true,
                            },
                            { value: stats.uniqueLocations + "+", label: "Locations" },
                        ].map((s, i) => (
                            <div
                                key={s.label}
                                style={{
                                    padding: "1rem 1.25rem",
                                    borderRight:
                                        i % 2 === 0 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                    borderBottom:
                                        i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                }}
                            >
                                <StatPill value={String(s.value)} label={s.label} gold={s.gold} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Year Tabs — descending (most recent first) ─────────────── */}
            <div
                style={{
                    backgroundColor: "#073D47",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    overflowX: "auto",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "0 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        minWidth: "max-content",
                    }}
                >
                    {reversedYears.map((g) => {
                        const isActive = g.id === activeYearId;
                        return (
                            <button
                                key={g.id}
                                onClick={() => handleYearChange(g.id)}
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
                                    color: isActive ? "#073D47" : "rgba(255,255,255,0.6)",
                                    background: isActive ? "#C9A84C" : "transparent",
                                    border: "none",
                                    padding: "0.625rem 0.75rem",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    position: "relative",
                                    transition: "all 0.2s ease",
                                    borderBottom: isActive
                                        ? "3px solid #C9A84C"
                                        : "3px solid transparent",
                                    borderRadius: "6px 6px 0 0",
                                    marginTop: "0.375rem",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                                        (e.currentTarget as HTMLButtonElement).style.background =
                                            "rgba(255,255,255,0.07)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        (e.currentTarget as HTMLButtonElement).style.color =
                                            "rgba(255,255,255,0.6)";
                                        (e.currentTarget as HTMLButtonElement).style.background =
                                            "transparent";
                                    }
                                }}
                            >
                                {g.label}
                                <span
                                    style={{
                                        marginLeft: "0.4rem",
                                        fontSize: "0.6875rem",
                                        fontWeight: 600,
                                        opacity: isActive ? 0.7 : 0.5,
                                    }}
                                >
                                    {g.projects.length}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Content ───────────────────────────────────────────────── */}
            <div
                style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}
            >
                {/* Live stats bar for active year + filter */}
                <div style={{ marginBottom: "1.25rem" }}>
                    {/* Counts row */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "baseline",
                            gap: "1rem 1.5rem",
                            marginBottom: "1rem",
                            paddingBottom: "1rem",
                            borderBottom: "1px solid rgba(13,92,107,0.1)",
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 800,
                                    fontSize: "1.5rem",
                                    color: "#073D47",
                                    lineHeight: 1,
                                }}
                            >
                                {liveStats.count}
                            </span>
                            <span
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.8125rem",
                                    color: "#0D5C6B",
                                    marginLeft: "0.4rem",
                                    fontWeight: 500,
                                }}
                            >
                                project{liveStats.count !== 1 ? "s" : ""}
                            </span>
                        </div>
                        {liveStats.gbp > 0 && (
                            <div>
                                <span
                                    style={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1.125rem",
                                        color: "#C9A84C",
                                        lineHeight: 1,
                                    }}
                                >
                                    {fmtGBP(liveStats.gbp)}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.6875rem",
                                        color: "#0D5C6B",
                                        marginLeft: "0.35rem",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    GBP
                                </span>
                            </div>
                        )}
                        {liveStats.lkr > 0 && (
                            <div>
                                <span
                                    style={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1.125rem",
                                        color: "#0D5C6B",
                                        lineHeight: 1,
                                    }}
                                >
                                    {fmtLKR(liveStats.lkr)}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.6875rem",
                                        color: "#0D5C6B",
                                        marginLeft: "0.35rem",
                                        fontWeight: 600,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    LKR
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Category filter chips — horizontal scroll on mobile */}
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                            overflowX: "auto",
                            WebkitOverflowScrolling: "touch",
                            scrollbarWidth: "none",
                            paddingBottom: "2px",
                        }}
                    >
                        {yearCategories.map((cat) => {
                            const isActive = activeFilter === cat;
                            const cfg = cat !== "all" ? CATEGORY_CONFIG[cat] : null;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 600,
                                        fontSize: "0.75rem",
                                        padding: "0.375rem 0.875rem",
                                        borderRadius: "9999px",
                                        border: isActive
                                            ? "1.5px solid #0D5C6B"
                                            : "1.5px solid rgba(13,92,107,0.2)",
                                        color: isActive
                                            ? "#ffffff"
                                            : cfg
                                                ? cfg.textColor
                                                : "#0D5C6B",
                                        background: isActive
                                            ? "#0D5C6B"
                                            : cfg
                                                ? cfg.bgColor
                                                : "rgba(13,92,107,0.06)",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}
                                >
                                    {cat === "all" ? "All" : cfg!.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Table / Cards */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeYearId + "-" + activeFilter}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {visibleProjects.length === 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "5rem 1rem",
                                    color: "#0D5C6B",
                                    opacity: 0.5,
                                    fontFamily: "var(--font-inter)",
                                }}
                            >
                                <p style={{ fontSize: "2.5rem", margin: "0 0 0.75rem" }}>🔍</p>
                                <p
                                    style={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1.125rem",
                                        margin: "0 0 0.5rem",
                                    }}
                                >
                                    No projects in this category for {activeYear.label}
                                </p>
                                <button
                                    onClick={() => setActiveFilter("all")}
                                    style={{
                                        marginTop: "1rem",
                                        padding: "0.5rem 1.25rem",
                                        background: "#0D5C6B",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "0.5rem",
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                        cursor: "pointer",
                                        opacity: 1,
                                    }}
                                >
                                    Show all
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Desktop table */}
                                <div
                                    className="hidden md:block"
                                    style={{
                                        background: "#ffffff",
                                        borderRadius: "1rem",
                                        border: "1px solid rgba(13,92,107,0.1)",
                                        overflow: "hidden",
                                        boxShadow:
                                            "0 4px 24px rgba(7,61,71,0.06), 0 1px 4px rgba(7,61,71,0.04)",
                                    }}
                                >
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr
                                                style={{
                                                    background:
                                                        "linear-gradient(90deg, #073D47 0%, #0D5C6B 100%)",
                                                }}
                                            >
                                                {["Date", "Category", "Project", "Location", "GBP", "LKR"].map(
                                                    (h) => (
                                                        <th
                                                            key={h}
                                                            style={{
                                                                padding: "0.875rem 1rem",
                                                                textAlign:
                                                                    h === "GBP" || h === "LKR" ? "right" : "left",
                                                                fontFamily: "var(--font-inter)",
                                                                fontWeight: 700,
                                                                fontSize: "0.6875rem",
                                                                letterSpacing: "0.1em",
                                                                textTransform: "uppercase",
                                                                color: "rgba(255,255,255,0.7)",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {h}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visibleProjects.map((p, i) => (
                                                <tr
                                                    key={i}
                                                    style={{
                                                        borderBottom:
                                                            i < visibleProjects.length - 1
                                                                ? "1px solid rgba(13,92,107,0.07)"
                                                                : "none",
                                                        background:
                                                            i % 2 === 0 ? "#ffffff" : "rgba(245,240,225,0.4)",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        (
                                                            e.currentTarget as HTMLTableRowElement
                                                        ).style.background = "rgba(13,92,107,0.04)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        (
                                                            e.currentTarget as HTMLTableRowElement
                                                        ).style.background =
                                                            i % 2 === 0
                                                                ? "#ffffff"
                                                                : "rgba(245,240,225,0.4)";
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "0.875rem 1rem",
                                                            fontFamily: "var(--font-inter)",
                                                            fontSize: "0.75rem",
                                                            color: "rgba(15,5,5,0.45)",
                                                            whiteSpace: "nowrap",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {p.month}
                                                    </td>
                                                    <td style={{ padding: "0.875rem 1rem" }}>
                                                        <Badge type={p.type} />
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "0.875rem 1rem",
                                                            fontFamily: "var(--font-inter)",
                                                            fontSize: "0.875rem",
                                                            fontWeight: 600,
                                                            color: "#0F0505",
                                                            lineHeight: 1.4,
                                                        }}
                                                    >
                                                        {p.label}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "0.875rem 1rem",
                                                            fontFamily: "var(--font-inter)",
                                                            fontSize: "0.8125rem",
                                                            color: "rgba(15,5,5,0.5)",
                                                        }}
                                                    >
                                                        {p.location}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "0.875rem 1rem",
                                                            textAlign: "right",
                                                            fontFamily: "var(--font-inter)",
                                                            fontSize: "0.875rem",
                                                            fontWeight: 600,
                                                            color: p.gbp > 0 ? "#C9A84C" : "rgba(15,5,5,0.2)",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {fmtGBP(p.gbp) ?? "—"}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "0.875rem 1rem",
                                                            textAlign: "right",
                                                            fontFamily: "var(--font-inter)",
                                                            fontSize: "0.875rem",
                                                            fontWeight: 600,
                                                            color: p.lkr > 0 ? "#0D5C6B" : "rgba(15,5,5,0.2)",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {fmtLKR(p.lkr) ?? "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        {/* Year totals footer */}
                                        <tfoot>
                                            <tr
                                                style={{
                                                    background: "rgba(7,61,71,0.04)",
                                                    borderTop: "2px solid rgba(13,92,107,0.15)",
                                                }}
                                            >
                                                <td
                                                    colSpan={4}
                                                    style={{
                                                        padding: "0.75rem 1rem",
                                                        fontFamily: "var(--font-inter)",
                                                        fontSize: "0.75rem",
                                                        fontWeight: 700,
                                                        color: "#073D47",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.08em",
                                                    }}
                                                >
                                                    {activeYear.label} total
                                                    {activeFilter !== "all" &&
                                                        ` · ${CATEGORY_CONFIG[activeFilter as ProjectCategory]?.label}`}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.75rem 1rem",
                                                        textAlign: "right",
                                                        fontFamily: "var(--font-inter)",
                                                        fontSize: "0.875rem",
                                                        fontWeight: 700,
                                                        color: "#C9A84C",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {fmtGBP(liveStats.gbp) ?? "—"}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.75rem 1rem",
                                                        textAlign: "right",
                                                        fontFamily: "var(--font-inter)",
                                                        fontSize: "0.875rem",
                                                        fontWeight: 700,
                                                        color: "#0D5C6B",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {fmtLKR(liveStats.lkr) ?? "—"}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Mobile cards */}
                                <div className="md:hidden space-y-3">
                                    {visibleProjects.map((p, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                background: "#ffffff",
                                                borderRadius: "0.875rem",
                                                border: "1px solid rgba(13,92,107,0.1)",
                                                padding: "1rem",
                                                boxShadow: "0 2px 12px rgba(7,61,71,0.06)",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-start",
                                                    marginBottom: "0.5rem",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <Badge type={p.type} />
                                                <span
                                                    style={{
                                                        fontFamily: "var(--font-inter)",
                                                        fontSize: "0.6875rem",
                                                        color: "rgba(15,5,5,0.4)",
                                                        whiteSpace: "nowrap",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {p.month}
                                                </span>
                                            </div>
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-inter)",
                                                    fontWeight: 600,
                                                    fontSize: "0.9375rem",
                                                    color: "#0F0505",
                                                    margin: "0 0 0.25rem",
                                                    lineHeight: 1.35,
                                                }}
                                            >
                                                {p.label}
                                            </p>
                                            <p
                                                style={{
                                                    fontFamily: "var(--font-inter)",
                                                    fontSize: "0.8125rem",
                                                    color: "rgba(15,5,5,0.45)",
                                                    margin: "0 0 0.875rem",
                                                }}
                                            >
                                                {p.location}
                                            </p>
                                            {(p.gbp > 0 || p.lkr > 0) && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "1.25rem",
                                                        borderTop: "1px solid rgba(13,92,107,0.08)",
                                                        paddingTop: "0.75rem",
                                                    }}
                                                >
                                                    {p.gbp > 0 && (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    fontFamily: "var(--font-inter)",
                                                                    fontSize: "0.625rem",
                                                                    color: "rgba(15,5,5,0.35)",
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.1em",
                                                                    fontWeight: 600,
                                                                    margin: "0 0 2px",
                                                                }}
                                                            >
                                                                GBP
                                                            </p>
                                                            <p
                                                                style={{
                                                                    fontFamily: "var(--font-inter)",
                                                                    fontWeight: 700,
                                                                    fontSize: "1rem",
                                                                    color: "#C9A84C",
                                                                    margin: 0,
                                                                }}
                                                            >
                                                                {fmtGBP(p.gbp)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {p.lkr > 0 && (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    fontFamily: "var(--font-inter)",
                                                                    fontSize: "0.625rem",
                                                                    color: "rgba(15,5,5,0.35)",
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.1em",
                                                                    fontWeight: 600,
                                                                    margin: "0 0 2px",
                                                                }}
                                                            >
                                                                LKR
                                                            </p>
                                                            <p
                                                                style={{
                                                                    fontFamily: "var(--font-inter)",
                                                                    fontWeight: 700,
                                                                    fontSize: "1rem",
                                                                    color: "#0D5C6B",
                                                                    margin: 0,
                                                                }}
                                                            >
                                                                {fmtLKR(p.lkr)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Footer note ───────────────────────────────────────────── */}
            <div
                style={{
                    borderTop: "1px solid rgba(13,92,107,0.1)",
                    background: "rgba(7,61,71,0.04)",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "1.5rem",
                        textAlign: "center",
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.8125rem",
                        color: "rgba(15,5,5,0.4)",
                        lineHeight: 1.6,
                    }}
                >
                    All figures sourced directly from JMA UK's official project reports.
                    GBP reflects UK fundraising; LKR reflects in-country disbursements.
                </div>
            </div>
        </div>
    );
}