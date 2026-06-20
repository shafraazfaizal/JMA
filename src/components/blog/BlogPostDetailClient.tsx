"use client";

import Link from "next/link";
import {
    ArrowLeft, Clock, Calendar, ArrowRight, Share2,
} from "lucide-react";
import type { DBBlogPost } from "@/types/database";

interface BlogPostDetailClientProps {
    post: DBBlogPost;
    related: DBBlogPost[];
}

export default function BlogPostDetailClient({ post, related }: BlogPostDetailClientProps) {
    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    const initials = (name: string) =>
        name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ background: "linear-gradient(160deg, #073D47 0%, #0D5C6B 50%, #1a7a8f 100%)", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 80% 30%, rgba(201,168,76,0.12) 0%, transparent 55%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: "1rem", marginBottom: "1.5rem" }}>
                        <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", textDecoration: "none", flexShrink: 0 }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)"; }}
                        >
                            <ArrowLeft size={15} aria-hidden="true" /> All blog posts
                        </Link>

                        <span style={{ display: "inline-block", backgroundColor: "rgba(201,168,76,0.2)", color: "#C9A84C", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.3rem 0.875rem", borderRadius: "9999px", flexShrink: 0 }}>
                            {post.category}
                        </span>
                    </div>

                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)", color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
                        {post.title}
                    </h1>

                    {/* Author card */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(201,168,76,0.2)", border: "1.5px solid rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.9375rem", color: "#C9A84C", flexShrink: 0 }}>
                            {initials(post.author_name)}
                        </div>
                        <div>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#ffffff", marginBottom: "0.125rem" }}>
                                {post.author_name}
                                {post.author_role && (
                                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}> · {post.author_role}</span>
                                )}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Calendar size={12} aria-hidden="true" /> {fmtDate(post.published_at)}</span>
                                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Clock size={12} aria-hidden="true" /> {post.read_time} min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Post body ── */}
            <section style={{ padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>

                    {/* Cover image */}
                    <div
                        style={{
                            height: "320px",
                            borderRadius: "1rem",
                            background: post.image_url
                                ? `url(${post.image_url}) center/cover`
                                : "linear-gradient(135deg, #C9A84C 0%, #B08D35 55%, #8F7026 100%)",
                            marginBottom: "2.5rem",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {!post.image_url && (
                            <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 70% 30%, rgba(13,92,107,0.15) 0%, transparent 60%)` }} />
                        )}
                    </div>

                    {/* Body text */}
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                        {post.content.split("\n\n").map((para, i) => (
                            <p key={i} style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", lineHeight: 1.85, color: "#374151" }}>
                                {para}
                            </p>
                        ))}
                    </div>

                    {/* Share row */}
                    <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF" }}>
                            Published {fmtDate(post.published_at)} by {post.author_name}
                        </p>
                        <button
                            onClick={() => {
                                if (navigator.share) navigator.share({ title: post.title, url: window.location.href });
                                else navigator.clipboard.writeText(window.location.href);
                            }}
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", cursor: "pointer" }}
                        >
                            <Share2 size={15} aria-hidden="true" /> Share post
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Donate CTA ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.875rem" }}>
                        Support our work
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                        Every donation helps JMA continue serving families in Jaffna — 100% reaches the ground.
                    </p>
                    <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none" }}>
                        Donate Now <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* ── Related posts ── */}
            {related.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", backgroundColor: "#F9FAFB" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1.75rem" }}>
                            More {post.category}
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="related-grid">
                            {related.map((p) => (
                                <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                                    <article style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.5rem", height: "100%", transition: "box-shadow 0.2s ease" }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -4px rgba(0,0,0,0.1)"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                                    >
                                        <span style={{ display: "inline-block", backgroundColor: "#FAF5E8", color: "#B08D35", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.25rem 0.7rem", borderRadius: "9999px", marginBottom: "0.875rem" }}>
                                            {p.category}
                                        </span>
                                        <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", lineHeight: 1.4, marginBottom: "0.75rem" }}>
                                            {p.title}
                                        </h3>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>{p.author_name} · {fmtDate(p.published_at)}</p>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
        @media (max-width: 900px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}