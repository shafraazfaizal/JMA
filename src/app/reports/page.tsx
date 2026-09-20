"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight, FileText, CheckCircle, Shield,
    ClipboardList, Mail, Send,
} from "lucide-react";
import { submitReportRequest } from "./actions";

const steps = [
    {
        icon: ClipboardList,
        step: "01",
        title: "Fill in the form",
        body: "Tell us your name, email, which report year you need, and briefly why you're requesting it.",
    },
    {
        icon: Shield,
        step: "02",
        title: "We review your request",
        body: "Our team reviews every request to ensure our reports are accessed responsibly and for legitimate purposes.",
    },
    {
        icon: Mail,
        step: "03",
        title: "Report delivered to you",
        body: "Once approved, the full PDF report is sent directly to your inbox — usually within 1–2 working days.",
    },
];

const reportYears = ["2024/25", "2023/24", "2022/23", "2021/22"];

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8125rem 1rem",
    border: "1.5px solid #E5E7EB",
    borderRadius: "0.625rem",
    fontFamily: "var(--font-inter)",
    fontSize: "0.9375rem",
    color: "#111827",
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-inter)",
    fontWeight: 600,
    fontSize: "0.8125rem",
    color: "#374151",
    marginBottom: "0.425rem",
};

export default function ReportsPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        organisation: "",
        reportYear: "2024/25",
        reason: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await submitReportRequest(form);
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };

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
                        Our annual reports provide a complete, transparent account of all funds raised and how every penny was used. Available on request to anyone who wishes to see them.
                    </p>
                </div>
            </section>

            {/* ── How it works ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "4.5rem 1.5rem", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0D5C6B", marginBottom: "0.625rem", textAlign: "center" as const }}>
                        How it works
                    </p>
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "#111827", letterSpacing: "-0.02em", textAlign: "center" as const, marginBottom: "3rem" }}>
                        Simple. Transparent. Three steps.
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="steps-grid">
                        {steps.map(({ icon: Icon, step, title, body }, i) => (
                            <div key={step} style={{ position: "relative" }}>
                                {/* connector line */}
                                {i < steps.length - 1 && (
                                    <div aria-hidden="true" className="connector-line" style={{ position: "absolute", top: "28px", left: "calc(50% + 28px)", right: "calc(-50% + 28px)", height: "1px", backgroundColor: "#E5E7EB", zIndex: 0 }} />
                                )}
                                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center" as const, gap: "1rem" }}>
                                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#0D5C6B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <Icon size={22} style={{ color: "#C9A84C" }} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.375rem" }}>
                                            Step {step}
                                        </p>
                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "0.5rem" }}>{title}</p>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.65 }}>{body}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Inline request form ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "680px", margin: "0 auto" }}>

                    {status === "success" ? (
                        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", textAlign: "center" as const, gap: "1.25rem", padding: "4rem 2rem" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CheckCircle size={28} style={{ color: "#0D5C6B" }} />
                            </div>
                            <div>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.75rem" }}>
                                    Request Received
                                </h2>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "#6B7280", lineHeight: 1.7, maxWidth: "420px" }}>
                                    JazākAllāhu Khayran! We&apos;ve received your request for the{" "}
                                    <strong style={{ color: "#111827" }}>{form.reportYear} Annual Report</strong> and sent a confirmation to <strong style={{ color: "#111827" }}>{form.email}</strong>. Our team will be in touch within 1–2 working days.
                                </p>
                            </div>
                            <button
                                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", organisation: "", reportYear: "2024/25", reason: "" }); }}
                                style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 600, color: "#0D5C6B", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", marginTop: "0.5rem" }}
                            >
                                Submit another request
                            </button>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: "2.5rem" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#E8F4F6", padding: "0.375rem 0.875rem", borderRadius: "9999px", marginBottom: "1rem" }}>
                                    <FileText size={13} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, color: "#0D5C6B", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                                        Report Request
                                    </span>
                                </div>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#111827", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
                                    Request an Annual Report
                                </h2>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.7 }}>
                                    Fill in your details below and tell us which report you need. We&apos;ll send it directly to your email once reviewed.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>

                                {/* Name + Email */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-row">
                                    <div>
                                        <label style={labelStyle}>
                                            Full Name <span style={{ color: "#C9A84C" }}>*</span>
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            style={inputStyle}
                                            onFocus={(e) => { e.currentTarget.style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>
                                            Email Address <span style={{ color: "#C9A84C" }}>*</span>
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            style={inputStyle}
                                            onFocus={(e) => { e.currentTarget.style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
                                        />
                                    </div>
                                </div>

                                {/* Organisation */}
                                <div>
                                    <label style={labelStyle}>
                                        Organisation{" "}
                                        <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mosque committee, research institution…"
                                        value={form.organisation}
                                        onChange={(e) => setForm({ ...form, organisation: e.target.value })}
                                        style={inputStyle}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
                                    />
                                </div>

                                {/* Report year */}
                                <div>
                                    <label style={labelStyle}>
                                        Report Year <span style={{ color: "#C9A84C" }}>*</span>
                                    </label>
                                    <select
                                        required
                                        value={form.reportYear}
                                        onChange={(e) => setForm({ ...form, reportYear: e.target.value })}
                                        style={{ ...inputStyle, appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", paddingRight: "2.5rem", cursor: "pointer" }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
                                    >
                                        {reportYears.map((y) => (
                                            <option key={y} value={y}>Annual Report {y}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label style={labelStyle}>
                                        Reason for Request{" "}
                                        <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="e.g. Due diligence before donating, academic research, personal interest…"
                                        value={form.reason}
                                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                        style={{ ...inputStyle, resize: "vertical" as const, minHeight: "100px" }}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
                                    />
                                </div>

                                {status === "error" && (
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#EF4444", margin: 0 }}>
                                        Something went wrong. Please try again or email us at{" "}
                                        <a href="mailto:info@jaffnamuslimuk.org" style={{ color: "#EF4444" }}>info@jaffnamuslimuk.org</a>.
                                    </p>
                                )}

                                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", paddingTop: "0.25rem" }}>
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            padding: "0.9375rem 2rem",
                                            borderRadius: "0.625rem",
                                            backgroundColor: "#0D5C6B",
                                            color: "#ffffff",
                                            fontFamily: "var(--font-jakarta)",
                                            fontWeight: 700,
                                            fontSize: "0.9375rem",
                                            border: "none",
                                            cursor: status === "loading" ? "not-allowed" : "pointer",
                                            opacity: status === "loading" ? 0.7 : 1,
                                            transition: "opacity 0.2s ease, background-color 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => { if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#094955"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D5C6B"; }}
                                    >
                                        <Send size={15} aria-hidden="true" />
                                        {status === "loading" ? "Sending…" : "Submit Request"}
                                    </button>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
                                        You&apos;ll receive a confirmation email right away.
                                    </p>
                                </div>
                            </form>
                        </>
                    )}
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
          .steps-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
          .connector-line { display: none !important; }
        }
      `}</style>
        </main>
    );
}