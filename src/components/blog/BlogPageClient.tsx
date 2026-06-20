"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, ArrowRight, X, PenSquare } from "lucide-react";
import type { DBBlogPost } from "@/types/database";

export default function BlogPageClient({ posts }: { posts: DBBlogPost[] }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string>("All");

    const sorted = useMemo(
        () => [...posts].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()),
        [posts]
    );

    const categories = useMemo(() => {
        const unique = Array.from(new Set(posts.map((p) => p.category)));
        return ["All", ...unique];
    }, [posts]);

    const featured = category === "All" ? sorted[0] : null;
    const pool = category === "All" ? sorted.slice(1) : sorted;

    const filtered = useMemo(() => {
        let list = pool;
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
        }
        if (category !== "All") list = list.filter((p) => p.category === category);
        return list;
    }, [pool, search, category]);

    const hasFilters = search.trim() || category !== "All";

    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const initials = (name: string) =>
        name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#073D47", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 85% 30%, rgba(201,168,76,0.08) 0%, transparent 50%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Blog
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "600px", marginBottom: "1rem" }}>
                        Reflections, voices, and stories from our community
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "520px" }}>
                        Thoughts from our committee, guest contributors, and the Jaffna Muslim community — on faith, charity, and giving back.
                    </p>
                </div>
            </section>

            {/* ── Featured post ── */}
            {featured && (
                <section style={{ backgroundColor: "#F9FAFB", padding: "3.5rem 1.5rem" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                        <Link href={`/blog/${featured.slug}`} style={{ textDecoration: "none" }}>
                            <article
                                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)", transition: "box-shadow 0.25s ease" }}
                                className="featured-post"
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px -6px rgba(0,0,0,0.14)"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px -4px rgba(0,0,0,0.08)"; }}
                            >
                                <div
                                    style={{
                                        background: featured.image_url
                                            ? `url(${featured.image_url}) center/cover`
                                            : "linear-gradient(135deg, #C9A84C 0%, #B08D35 55%, #8F7026 100%)",
                                        minHeight: "280px",
                                        position: "relative",
                                    }}
                                >
                                    {!featured.image_url && (
                                        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 70% 30%, rgba(13,92,107,0.15) 0%, transparent 60%)` }} />
                                    )}
                                    <span style={{ position: "absolute", top: "1.25rem", left: "1.25rem", backgroundColor: "rgba(13,92,107,0.85)", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.3rem 0.875rem", borderRadius: "9999px" }}>
                                        Latest
                                    </span>
                                </div>
                                <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column" as const, justifyContent: "center", gap: "1rem" }}>
                                    <span style={{ alignSelf: "flex-start", backgroundColor: "#FAF5E8", color: "#B08D35", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.3rem 0.875rem", borderRadius: "9999px" }}>
                                        {featured.category}
                                    </span>
                                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", lineHeight: 1.25, margin: 0 }}>
                                        {featured.title}
                                    </h2>
                                    <p style={{ fontFamily: "var(--font-noto)", fontStyle: "italic", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
                                        {featured.excerpt}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0D5C6B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.7rem", color: "#ffffff", flexShrink: 0 }}>
                                            {initials(featured.author_name)}
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#111827" }}>
                                                {featured.author_name}{featured.author_role ? ` · ${featured.author_role}` : ""}
                                            </p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>
                                                {fmtDate(featured.published_at)} · {featured.read_time} min read
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Filters ── */}
            <section style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB", padding: "1.25rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" as const }}>
                    <div style={{ position: "relative", flex: 1, minWidth: "200px", maxWidth: "320px" }}>
                        <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                        <input type="text" placeholder="Search posts…" value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{ width: "100%", padding: "0.5625rem 0.875rem 0.5625rem 2.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#111827", outline: "none", backgroundColor: "#F9FAFB" }}
                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#C9A84C"; }}
                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }} />
                    </div>
                    <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" as const, flex: 1 }}>
                        {categories.map((c) => (
                            <button key={c} onClick={() => setCategory(c)}
                                style={{ padding: "0.4375rem 0.875rem", borderRadius: "9999px", border: `1.5px solid ${category === c ? "#C9A84C" : "#E5E7EB"}`, backgroundColor: category === c ? "#FAF5E8" : "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: category === c ? "#B08D35" : "#6B7280", cursor: "pointer", whiteSpace: "nowrap" as const }}>
                                {c === "All" ? "All Posts" : c}
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
                    {posts.length === 0 ? (
                        <div style={{ textAlign: "center" as const, padding: "5rem 1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB" }}>
                            <PenSquare size={32} style={{ color: "#D1D5DB", margin: "0 auto 1rem" }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>No blog posts published yet — check back soon.</p>
                        </div>
                    ) : (
                        <>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", marginBottom: "1.75rem" }}>
                                {filtered.length === 0 ? "No posts found" : `${filtered.length} post${filtered.length === 1 ? "" : "s"}`}
                                {category !== "All" && ` in ${category}`}
                            </p>

                            {filtered.length > 0 ? (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="blog-grid">
                                    {filtered.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                                            <article style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" as const, transition: "box-shadow 0.25s ease, transform 0.25s ease" }}
                                                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 12px 32px -6px rgba(0,0,0,0.12)"; el.style.transform = "translateY(-2px)"; }}
                                                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                                            >
                                                <div style={{ height: "8px", backgroundColor: "#C9A84C" }} />
                                                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column" as const, flex: 1, gap: "0.875rem" }}>
                                                    <span style={{ alignSelf: "flex-start", backgroundColor: "#FAF5E8", color: "#B08D35", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.07em", textTransform: "uppercase" as const, padding: "0.25rem 0.7rem", borderRadius: "9999px" }}>
                                                        {post.category}
                                                    </span>
                                                    <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", lineHeight: 1.35, color: "#111827", margin: 0 }}>
                                                        {post.title}
                                                    </h3>
                                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", lineHeight: 1.7, color: "#6B7280", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                                                        {post.excerpt}
                                                    </p>
                                                    <div style={{ marginTop: "auto", paddingTop: "0.875rem", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#0D5C6B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.6rem", color: "#ffffff", flexShrink: 0 }}>
                                                                {initials(post.author_name)}
                                                            </div>
                                                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>{fmtDate(post.published_at)}</span>
                                                        </div>
                                                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>
                                                            <Clock size={11} aria-hidden="true" /> {post.read_time} min
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: "center" as const, padding: "5rem 1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB" }}>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280" }}>No posts match your search.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.875rem" }}>
                        Want to share your story?
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                        We welcome reflections and stories from members of our community.
                    </p>
                    <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none" }}>
                        Get in Touch <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <style>{`
        @media (max-width: 900px) {
          .featured-post { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1023px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}