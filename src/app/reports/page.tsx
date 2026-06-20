"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight, Download, FileText, TrendingUp,
    Users, FolderOpen, CheckCircle, Shield, Mail,
} from "lucide-react";

interface AnnualReport {
    year: string;
    title: string;
    totalRaised: string;
    projectsCompleted: number;
    familiesSupported: string;
    highlights: string[];
    pdfUrl: string | null;
}

const reports: AnnualReport[] = [
    {
        year: "2024/25",
        title: "Annual Report 2024/25",
        totalRaised: "£420,000",
        projectsCompleted: 18,
        familiesSupported: "2,100+",
        highlights: [
            "Mankumban Masjid reconstruction reached Phase 2",
            "20 students sponsored through the Jaffna Scholarship Fund",
            "Khardal Hasana membership grew to over 300 families",
            "Clean water project launched in Vaddukkoddai",
        ],
        pdfUrl: null,
    },
    {
        year: "2023/24",
        title: "Annual Report 2023/24",
        totalRaised: "£385,000",
        projectsCompleted: 22,
        familiesSupported: "1,950+",
        highlights: [
            "Digital platform launched for online donations and Gift Aid",
            "Healthcare programme expanded to two new villages",
            "First full Qurbani season distributed via verified local partners",
            "JMA crossed £2 million in total funds raised since inception",
        ],
        pdfUrl: null,
    },
    {
        year: "2022/23",
        title: "Annual Report 2022/23",
        totalRaised: "£310,000",
        projectsCompleted: 17,
        familiesSupported: "1,600+",
        highlights: [
            "Emergency flood relief delivered to 400+ families",
            "Khardal Hasana fee structure updated for sustainability",
            "Scholarship fund expanded from 12 to 20 annual recipients",
            "New governance framework adopted by the committee",
        ],
        pdfUrl: null,
    },
    {
        year: "2021/22",
        title: "Annual Report 2021/22",
        totalRaised: "£295,000",
        projectsCompleted: 15,
        familiesSupported: "1,400+",
        highlights: [
            "Recovery support delivered through the pandemic period",
            "Healthcare partnership established with local clinics",
            "Winter relief campaign reached over 500 households",
            "Committee restructured with new regional representatives",
        ],
        pdfUrl: null,
    },
];

const trustPoints = [
    { icon: Shield, label: "Independently Audited", body: "Every report is reviewed by independent auditors before publication." },
    { icon: CheckCircle, label: "100% Transparency", body: "Full financial breakdowns published with no figures withheld." },
    { icon: FileText, label: "Charity Commission Filed", body: "All reports filed with the Charity Commission for England and Wales." },
];

export default function ReportsPage() {
    const [expandedYear, setExpandedYear] = useState<string | null>(reports[0]?.year ?? null);

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Transparency
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.25rem)", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "640px", marginBottom: "1.25rem" }}>
                        Annual{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>Reports</span>
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: "560px" }}>
                        Every year we publish a full breakdown of funds raised, projects completed, and how every penny was spent. No exceptions.
                    </p>
                </div>
            </section>

            {/* ── Trust strip ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "3rem 1.5rem", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="trust-grid">
                    {trustPoints.map(({ icon: Icon, label, body }) => (
                        <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "0.75rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={18} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                            </div>
                            <div>
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.25rem" }}>{label}</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.5 }}>{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Reports list ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                        {reports.map((report, i) => {
                            const isExpanded = expandedYear === report.year;
                            const isLatest = i === 0;

                            return (
                                <div
                                    key={report.year}
                                    style={{
                                        backgroundColor: isLatest ? "#0D5C6B" : "#ffffff",
                                        borderRadius: "1.25rem",
                                        border: isLatest ? "none" : "1px solid #E5E7EB",
                                        overflow: "hidden",
                                        boxShadow: isLatest ? "0 8px 32px -8px rgba(13,92,107,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
                                        transition: "box-shadow 0.2s ease",
                                    }}
                                >
                                    {/* Header row */}
                                    <button
                                        onClick={() => setExpandedYear(isExpanded ? null : report.year)}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "1.5rem",
                                            padding: "1.75rem 2rem",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "left" as const,
                                            flexWrap: "wrap" as const,
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" as const }}>
                                            <div
                                                style={{
                                                    width: "52px",
                                                    height: "52px",
                                                    borderRadius: "0.875rem",
                                                    backgroundColor: isLatest ? "rgba(201,168,76,0.15)" : "#E8F4F6",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <FileText size={22} style={{ color: isLatest ? "#C9A84C" : "#0D5C6B" }} aria-hidden="true" />
                                            </div>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
                                                    <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.125rem", color: isLatest ? "#ffffff" : "#111827" }}>
                                                        {report.title}
                                                    </p>
                                                    {isLatest && (
                                                        <span style={{ backgroundColor: "rgba(201,168,76,0.2)", color: "#C9A84C", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.2rem 0.625rem", borderRadius: "9999px" }}>
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: isLatest ? "rgba(255,255,255,0.6)" : "#6B7280" }}>
                                                    {report.totalRaised} raised · {report.projectsCompleted} projects
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            style={{
                                                fontFamily: "var(--font-inter)",
                                                fontWeight: 600,
                                                fontSize: "0.8125rem",
                                                color: isLatest ? "rgba(255,255,255,0.7)" : "#0D5C6B",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {isExpanded ? "Hide details" : "View details"}
                                        </span>
                                    </button>

                                    {/* Expanded content */}
                                    {isExpanded && (
                                        <div style={{ padding: "0 2rem 2rem" }}>
                                            <div style={{ height: "1px", backgroundColor: isLatest ? "rgba(255,255,255,0.1)" : "#F3F4F6", marginBottom: "1.5rem" }} />

                                            {/* Stats row */}
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.75rem" }} className="report-stats">
                                                {[
                                                    { icon: TrendingUp, value: report.totalRaised, label: "Total Raised" },
                                                    { icon: FolderOpen, value: String(report.projectsCompleted), label: "Projects Completed" },
                                                    { icon: Users, value: report.familiesSupported, label: "Families Supported" },
                                                ].map(({ icon: Icon, value, label }) => (
                                                    <div
                                                        key={label}
                                                        style={{
                                                            backgroundColor: isLatest ? "rgba(255,255,255,0.06)" : "#F9FAFB",
                                                            border: isLatest ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E5E7EB",
                                                            borderRadius: "0.75rem",
                                                            padding: "1rem",
                                                            textAlign: "center" as const,
                                                        }}
                                                    >
                                                        <Icon size={16} style={{ color: isLatest ? "#C9A84C" : "#0D5C6B", margin: "0 auto 0.5rem" }} aria-hidden="true" />
                                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.0625rem", color: isLatest ? "#ffffff" : "#0D5C6B", marginBottom: "0.125rem" }}>{value}</p>
                                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: isLatest ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>{label}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Highlights */}
                                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: isLatest ? "rgba(255,255,255,0.6)" : "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.875rem" }}>
                                                Key Highlights
                                            </p>
                                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem", marginBottom: "1.75rem" }}>
                                                {report.highlights.map((h) => (
                                                    <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                                                        <CheckCircle size={14} style={{ color: isLatest ? "#C9A84C" : "#0D5C6B", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                                                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: isLatest ? "rgba(255,255,255,0.8)" : "#4B5563", lineHeight: 1.5 }}>{h}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Download */}
                                            {report.pdfUrl ? (
                                                <a
                                                    href={report.pdfUrl}
                                                    download
                                                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", backgroundColor: isLatest ? "#C9A84C" : "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
                                                >
                                                    <Download size={15} aria-hidden="true" />
                                                    Download Full Report (PDF)
                                                </a>
                                            ) : (
                                                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", backgroundColor: isLatest ? "rgba(255,255,255,0.08)" : "#F3F4F6", color: isLatest ? "rgba(255,255,255,0.5)" : "#9CA3AF", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem" }}>
                                                    <FileText size={15} aria-hidden="true" />
                                                    Full PDF report coming soon
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Request older reports ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "4rem 1.5rem" }}>
                <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" as const }}>
                    <Mail size={28} style={{ color: "#0D5C6B", margin: "0 auto 1rem" }} aria-hidden="true" />
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "0.75rem" }}>
                        Looking for an older report?
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                        Reports prior to 2021/22 are available on request. Get in touch with our team and we&apos;ll send them directly.
                    </p>
                    <Link
                        href="/contact"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#094955"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0D5C6B"; }}
                    >
                        Contact Us
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section style={{ backgroundColor: "#073D47", padding: "5rem 1.5rem", textAlign: "center" as const, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)` }} />
                <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem" }}>
                        Trust built on transparency
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "2rem" }}>
                        Every donation you make will be reflected in next year&apos;s report, in full.
                    </p>
                    <Link
                        href="/donate"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                    >
                        Donate Now
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <style>{`
        @media (max-width: 767px) {
          .trust-grid { grid-template-columns: 1fr !important; }
          .report-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}