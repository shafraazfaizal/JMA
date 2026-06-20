"use client";

import Link from "next/link";
import {
    ArrowLeft, Clock, Calendar, User, ArrowRight,
    Share2, Image as ImageIcon, Download, FileText,
} from "lucide-react";
import type { DBNewsArticle } from "@/types/database";

const categoryColours: Record<string, { bg: string; text: string }> = {
    "Project Updates": { bg: "#E8F4F6", text: "#0D5C6B" },
    "Community News": { bg: "#EEF2FF", text: "#4338CA" },
    "Charity Education": { bg: "#FAF5E8", text: "#B08D35" },
    "Event News": { bg: "#F0FDF4", text: "#15803D" },
    "Newsletter": { bg: "#FDF2F8", text: "#BE185D" },
};

const categoryToGalleryFilter: Record<string, string> = {
    "Project Updates": "Projects",
    "Community News": "Community",
    "Event News": "Events",
    "Charity Education": "All",
    "Newsletter": "All",
};

interface NewsArticleDetailClientProps {
    article: DBNewsArticle;
    related: DBNewsArticle[];
}

export default function NewsArticleDetailClient({ article, related }: NewsArticleDetailClientProps) {
    const colour = categoryColours[article.category] ?? { bg: "#F3F4F6", text: "#374151" };
    const galleryFilter = categoryToGalleryFilter[article.category] ?? "All";
    const isNewsletter = article.category === "Newsletter";

    const fmtDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ background: "linear-gradient(160deg, #0D5C6B 0%, #1a7a8f 40%, #073D47 100%)", padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 80% 30%, rgba(201,168,76,0.1) 0%, transparent 55%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: "1rem", marginBottom: "1.5rem" }}>
                        <Link href="/news" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "rgba(255,255,255,0.65)", textDecoration: "none", flexShrink: 0 }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)"; }}
                        >
                            <ArrowLeft size={15} aria-hidden="true" /> All news
                        </Link>

                        <span style={{ display: "inline-block", backgroundColor: colour.bg, color: colour.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.3rem 0.875rem", borderRadius: "9999px", flexShrink: 0 }}>
                            {article.category}
                        </span>
                    </div>

                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)", color: "#ffffff", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
                        {article.title}
                    </h1>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" as const }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
                            <User size={14} aria-hidden="true" /> {article.author}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
                            <Calendar size={14} aria-hidden="true" /> {fmtDate(article.published_at)}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
                            <Clock size={14} aria-hidden="true" /> {article.read_time} min read
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Article body ── */}
            <section style={{ padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>

                    {/* Cover image */}
                    <div
                        style={{
                            height: "320px",
                            borderRadius: "1rem",
                            background: article.image_url
                                ? `url(${article.image_url}) center/cover`
                                : "linear-gradient(135deg, #0D5C6B 0%, #1a7a8f 50%, #073D47 100%)",
                            marginBottom: "2.5rem",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {!article.image_url && (
                            <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 70% 30%, rgba(201,168,76,0.15) 0%, transparent 60%)` }} />
                        )}
                    </div>

                    {/* Newsletter PDF download */}
                    {isNewsletter && article.pdf_url && (
                        <a
                            href={article.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex", alignItems: "center", gap: "0.875rem",
                                backgroundColor: "#FDF2F8", border: "1.5px solid #FBCFE8", borderRadius: "0.875rem",
                                padding: "1.125rem 1.375rem", marginBottom: "2.5rem", textDecoration: "none",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FCE7F3"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FDF2F8"; }}
                        >
                            <div style={{ width: "44px", height: "44px", borderRadius: "0.75rem", backgroundColor: "#FBCFE8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <FileText size={20} style={{ color: "#BE185D" }} aria-hidden="true" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#BE185D", marginBottom: "0.125rem" }}>
                                    Download this issue as PDF
                                </p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9D174D" }}>
                                    Get a printable copy of the full newsletter
                                </p>
                            </div>
                            <Download size={18} style={{ color: "#BE185D", flexShrink: 0 }} aria-hidden="true" />
                        </a>
                    )}

                    {/* Body text */}
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                        {article.content.split("\n\n").map((para, i) => (
                            <p key={i} style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", lineHeight: 1.85, color: "#374151" }}>
                                {para}
                            </p>
                        ))}
                    </div>

                    {/* Share row */}
                    <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF" }}>
                            Published {fmtDate(article.published_at)} by {article.author}
                        </p>
                        <button
                            onClick={() => {
                                if (navigator.share) navigator.share({ title: article.title, url: window.location.href });
                                else navigator.clipboard.writeText(window.location.href);
                            }}
                            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", cursor: "pointer" }}
                        >
                            <Share2 size={15} aria-hidden="true" /> Share article
                        </button>
                    </div>

                    {/* Gallery cross-link */}
                    <Link
                        href={`/gallery?category=${galleryFilter}`}
                        style={{
                            marginTop: "1.75rem", display: "flex", alignItems: "center", gap: "0.875rem",
                            backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "0.875rem",
                            padding: "1.125rem 1.375rem", textDecoration: "none",
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
                            el.style.backgroundColor = "#F9FAFB";
                        }}
                    >
                        <div style={{ width: "40px", height: "40px", borderRadius: "0.625rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ImageIcon size={18} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                        </div>
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#111827", marginBottom: "0.125rem" }}>
                                See related photos
                            </p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                                Browse our gallery for visuals from this story
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* ── Donate CTA ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.875rem" }}>
                        Support work like this
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                        Every donation helps JMA continue projects like the one above — 100% reaching families in Jaffna.
                    </p>
                    <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none" }}>
                        Donate Now <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* ── Related articles ── */}
            {related.length > 0 && (
                <section style={{ padding: "4rem 1.5rem", backgroundColor: "#F9FAFB" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1.75rem" }}>
                            More {article.category}
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="related-grid">
                            {related.map((a) => {
                                const c = categoryColours[a.category] ?? { bg: "#F3F4F6", text: "#374151" };
                                return (
                                    <Link key={a.id} href={`/news/${a.slug}`} style={{ textDecoration: "none" }}>
                                        <article style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.5rem", height: "100%", transition: "box-shadow 0.2s ease" }}
                                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -4px rgba(0,0,0,0.1)"; }}
                                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                                        >
                                            <span style={{ display: "inline-block", backgroundColor: c.bg, color: c.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.25rem 0.7rem", borderRadius: "9999px", marginBottom: "0.875rem" }}>
                                                {a.category}
                                            </span>
                                            <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", lineHeight: 1.4, marginBottom: "0.75rem" }}>
                                                {a.title}
                                            </h3>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>{fmtDate(a.published_at)}</p>
                                        </article>
                                    </Link>
                                );
                            })}
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