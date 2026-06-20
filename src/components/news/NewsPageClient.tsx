"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Clock, ArrowRight, X, Mail } from "lucide-react";
import type { DBNewsArticle } from "@/types/database";

type NewsCategory = DBNewsArticle["category"];

const categories: { value: NewsCategory | "All"; label: string }[] = [
    { value: "All", label: "All News" },
    { value: "Newsletter", label: "Newsletter" },
    { value: "Project Updates", label: "Project Updates" },
    { value: "Community News", label: "Community News" },
    { value: "Charity Education", label: "Charity Education" },
    { value: "Event News", label: "Event News" },
];

const categoryColours: Record<string, { bg: string; text: string }> = {
    "Project Updates": { bg: "#E8F4F6", text: "#0D5C6B" },
    "Community News": { bg: "#EEF2FF", text: "#4338CA" },
    "Charity Education": { bg: "#FAF5E8", text: "#B08D35" },
    "Event News": { bg: "#F0FDF4", text: "#15803D" },
    "Newsletter": { bg: "#FDF2F8", text: "#BE185D" },
};

function NewsPageInner({ articles }: { articles: DBNewsArticle[] }) {
    const searchParams = useSearchParams();
    const initialCategory = (searchParams.get("category") as NewsCategory | null) || "All";

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<NewsCategory | "All">(initialCategory);
    const [emailSub, setEmailSub] = useState("");
    const [subDone, setSubDone] = useState(false);

    const sorted = useMemo(
        () => [...articles].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()),
        [articles]
    );

    const featured = category === "All" ? sorted[0] : null;
    const pool = category === "All" ? sorted.slice(1) : sorted;

    const filtered = useMemo(() => {
        let list = pool;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
        }
        if (category !== "All") list = list.filter((a) => a.category === category);
        return list;
    }, [pool, search, category]);

    const hasFilters = search.trim() || category !== "All";

    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const handleSubscribe = () => {
        if (!emailSub.includes("@")) return;
        // Placeholder — wire to Resend once /api/newsletter is built
        setSubDone(true);
    };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Newsroom
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "560px", marginBottom: "1rem" }}>
                        Updates from the ground in Jaffna
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "520px" }}>
                        Project updates, community news, and our monthly newsletter — all in one place.
                    </p>
                </div>
            </section>

            {/* ── Featured article ── */}
            {featured && (
                <section style={{ backgroundColor: "#F9FAFB", padding: "3.5rem 1.5rem" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                        <Link href={`/news/${featured.slug}`} style={{ textDecoration: "none" }}>
                            <article
                                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)", transition: "box-shadow 0.25s ease" }}
                                className="featured-article"
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px -6px rgba(0,0,0,0.14)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px -4px rgba(0,0,0,0.08)"; }}
                            >
                                <div
                                    style={{
                                        background: featured.image_url
                                            ? `url(${featured.image_url}) center/cover`
                                            : "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)",
                                        minHeight: "280px",
                                        position: "relative",
                                    }}
                                >
                                    {!featured.image_url && (
                                        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 70% 30%, rgba(201,168,76,0.15) 0%, transparent 60%)` }} />
                                    )}
                                    <span style={{ position: "absolute", top: "1.25rem", left: "1.25rem", backgroundColor: "rgba(201,168,76,0.2)", color: "#C9A84C", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.3rem 0.875rem", borderRadius: "9999px" }}>
                                        Featured
                                    </span>
                                </div>
                                <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column" as const, justifyContent: "center", gap: "1rem" }}>
                                    <span style={{ alignSelf: "flex-start", backgroundColor: categoryColours[featured.category]?.bg, color: categoryColours[featured.category]?.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.3rem 0.875rem", borderRadius: "9999px" }}>
                                        {featured.category}
                                    </span>
                                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", lineHeight: 1.25, margin: 0 }}>
                                        {featured.title}
                                    </h2>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
                                        {featured.excerpt}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", marginTop: "0.5rem" }}>
                                        <span>{fmtDate(featured.published_at)}</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Clock size={12} aria-hidden="true" /> {featured.read_time} min read</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Newsletter subscribe strip ── */}
            <section style={{ backgroundColor: "#FDF2F8", padding: "1.75rem 1.5rem", borderBottom: "1px solid #FCE7F3" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" as const, justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "0.625rem", backgroundColor: "#FCE7F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Mail size={18} style={{ color: "#BE185D" }} aria-hidden="true" />
                        </div>
                        <div>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.125rem" }}>
                                Get our monthly newsletter
                            </p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                                Every issue, straight to your inbox — no spam.
                            </p>
                        </div>
                    </div>

                    {subDone ? (
                        <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#BE185D" }}>
                            You&apos;re subscribed!
                        </span>
                    ) : (
                        <div style={{ display: "flex", gap: "0.5rem", flex: 1, maxWidth: "380px", minWidth: "260px" }}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={emailSub}
                                onChange={(e) => setEmailSub(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSubscribe(); }}
                                style={{ flex: 1, padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1.5px solid #FBCFE8", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#111827", outline: "none", backgroundColor: "#ffffff" }}
                            />
                            <button
                                onClick={handleSubscribe}
                                style={{ padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#BE185D", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap" as const }}
                            >
                                Subscribe
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Filters ── */}
            <section style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB", padding: "1.25rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" as const }}>
                    <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
                        <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                        <input type="text" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "100%", padding: "0.5625rem 0.875rem 0.5625rem 2.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#111827", outline: "none", backgroundColor: "#F9FAFB" }}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }} />
                    </div>
                    <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" as const, flex: 1 }}>
                        {categories.map(({ value, label }) => (
                            <button key={value} onClick={() => setCategory(value)}
                                style={{ padding: "0.4375rem 0.875rem", borderRadius: "9999px", border: `1.5px solid ${category === value ? "#0D5C6B" : "#E5E7EB"}`, backgroundColor: category === value ? "#E8F4F6" : "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: category === value ? "#0D5C6B" : "#6B7280", cursor: "pointer", whiteSpace: "nowrap" as const }}>
                                {label}
                            </button>
                        ))}
                    </div>
                    {hasFilters && (
                        <button onClick={() => { setSearch(""); setCategory("All"); }} style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4375rem 0.75rem", borderRadius: "0.5rem", border: "none", backgroundColor: "transparent", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#EF4444", cursor: "pointer" }}>
                            <X size={13} aria-hidden="true" /> Clear
                        </button>
                    )}
                </div>
            </section>

            {/* ── Grid ── */}
            <section style={{ padding: "3rem 1.5rem 5rem", backgroundColor: "#F9FAFB" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", marginBottom: "1.75rem" }}>
                        {filtered.length === 0 ? "No articles found" : `${filtered.length} article${filtered.length === 1 ? "" : "s"}`}
                        {category !== "All" && ` in ${category}`}
                    </p>

                    {filtered.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="news-grid">
                            {filtered.map((article) => (
                                <Link key={article.id} href={`/news/${article.slug}`} style={{ textDecoration: "none" }}>
                                    <article style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" as const, transition: "box-shadow 0.25s ease, transform 0.25s ease" }}
                                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 12px 32px -6px rgba(0,0,0,0.12)"; el.style.transform = "translateY(-2px)"; }}
                                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                                    >
                                        <div style={{ height: "8px", backgroundColor: categoryColours[article.category]?.text ?? "#E5E7EB" }} />
                                        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column" as const, flex: 1, gap: "0.875rem" }}>
                                            <span style={{ alignSelf: "flex-start", backgroundColor: categoryColours[article.category]?.bg, color: categoryColours[article.category]?.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.25rem 0.7rem", borderRadius: "9999px" }}>
                                                {article.category}
                                            </span>
                                            <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.35, color: "#111827", margin: 0 }}>
                                                {article.title}
                                            </h3>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", lineHeight: 1.7, color: "#6B7280", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                                {article.excerpt}
                                            </p>
                                            <div style={{ marginTop: "auto", paddingTop: "0.875rem", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>
                                                    <span>{fmtDate(article.published_at)}</span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Clock size={11} aria-hidden="true" /> {article.read_time} min</span>
                                                </div>
                                                <ArrowRight size={14} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: "center" as const, padding: "5rem 1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB" }}>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>No articles match your search.</p>
                        </div>
                    )}
                </div>
            </section>

            <style>{`
        @media (max-width: 900px) {
          .featured-article { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1023px) {
          .news-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          .news-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}

export default function NewsPageClient({ articles }: { articles: DBNewsArticle[] }) {
    return (
        <Suspense>
            <NewsPageInner articles={articles} />
        </Suspense>
    );
}