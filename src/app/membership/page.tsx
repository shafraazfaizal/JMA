"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight, CheckCircle, Vote, Users, FileText,
    Mail, Phone, MapPin, User, Send, Calendar,
} from "lucide-react";

const benefits = [
    {
        icon: Vote,
        title: "Voting Rights",
        body: "Members have a formal vote at JMA's Annual General Meeting, shaping the direction of the organisation and electing the committee.",
    },
    {
        icon: Users,
        title: "Community Standing",
        body: "Join a registered body of Jaffna Muslims in the UK committed to preserving culture, faith, and mutual support.",
    },
    {
        icon: FileText,
        title: "Transparency Access",
        body: "Members receive direct access to detailed financial reports and project updates ahead of public release.",
    },
    {
        icon: Calendar,
        title: "Priority Event Invites",
        body: "Be the first to know about JMA gatherings, fundraising dinners, and community celebrations throughout the year.",
    },
];

const eligibility = [
    "Must be of Jaffna Muslim heritage or have a direct family connection",
    "Must be 18 years of age or older",
    "Must reside in the United Kingdom",
    "Must agree to JMA's constitution and code of conduct",
];

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
    connection: string;
    reason: string;
}

const defaultForm: FormData = {
    fullName: "", email: "", phone: "", address: "",
    city: "", postcode: "", connection: "", reason: "",
};

function inputStyle(hasValue: boolean, hasError?: boolean): React.CSSProperties {
    return {
        width: "100%",
        padding: "0.8125rem 1rem",
        borderRadius: "0.5rem",
        border: `1.5px solid ${hasError ? "#EF4444" : hasValue ? "#0D5C6B" : "#E5E7EB"}`,
        fontFamily: "var(--font-inter)",
        fontWeight: 500,
        fontSize: "0.9375rem",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box" as const,
    };
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label
            style={{
                display: "block",
                fontFamily: "var(--font-inter)",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: "#374151",
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                marginBottom: "0.5rem",
            }}
        >
            {children}
            {required && <span style={{ color: "#EF4444", marginLeft: "0.25rem" }}>*</span>}
        </label>
    );
}

export default function MembershipPage() {
    const [form, setForm] = useState<FormData>(defaultForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm((p) => ({ ...p, [k]: v }));
    const clearError = (k: keyof FormData) => setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

    const validate = () => {
        const e: Partial<Record<keyof FormData, string>> = {};
        if (!form.fullName.trim()) e.fullName = "Please enter your full name.";
        if (!form.email.trim() || !form.email.includes("@")) e.email = "Please enter a valid email address.";
        if (!form.phone.trim()) e.phone = "Please enter a phone number.";
        if (!form.city.trim()) e.city = "Please enter your city.";
        if (!form.connection.trim()) e.connection = "Please describe your connection to the Jaffna Muslim community.";
        if (!agreed) e.reason = "Please confirm you agree to the eligibility criteria.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        // Placeholder — wire to Resend / DB once API route is built
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section
                style={{
                    backgroundColor: "#0D5C6B",
                    padding: "8rem 1.5rem 5rem",
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
              radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
              radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)
            `,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Membership
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                            color: "#ffffff",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            maxWidth: "640px",
                            margin: "0 auto 1.25rem",
                        }}
                    >
                        Become part of the{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>family</span>
                    </h1>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1.0625rem",
                            color: "rgba(255,255,255,0.7)",
                            lineHeight: 1.75,
                            maxWidth: "560px",
                            margin: "0 auto",
                        }}
                    >
                        JMA membership is open to the UK Jaffna Muslim community. Join a body of people committed to preserving our heritage and supporting one another.
                    </p>
                </div>
            </section>

            {/* ── Benefits ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>
                            Member Benefits
                        </p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em" }}>
                            Why join JMA
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="benefits-grid">
                        {benefits.map(({ icon: Icon, title, body }) => (
                            <div
                                key={title}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "1rem",
                                    border: "1px solid #E5E7EB",
                                    padding: "1.75rem",
                                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "0 8px 24px -4px rgba(13,92,107,0.1)";
                                    el.style.borderColor = "#A0CDD5";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "none";
                                    el.style.borderColor = "#E5E7EB";
                                }}
                            >
                                <div style={{ width: "44px", height: "44px", borderRadius: "0.75rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.125rem" }}>
                                    <Icon size={20} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "0.5rem" }}>
                                    {title}
                                </h3>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.7 }}>
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Eligibility + Form ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>

                    {submitted ? (
                        /* ── Success state ── */
                        <div
                            style={{
                                backgroundColor: "#F9FAFB",
                                borderRadius: "1.25rem",
                                border: "1px solid #E5E7EB",
                                padding: "3.5rem 2.5rem",
                                textAlign: "center" as const,
                            }}
                        >
                            <div
                                style={{
                                    width: "64px", height: "64px", borderRadius: "50%",
                                    backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 1.5rem",
                                }}
                            >
                                <CheckCircle size={30} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                            </div>
                            <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.75rem" }}>
                                Application received
                            </h2>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.7, maxWidth: "440px", margin: "0 auto 2rem" }}>
                                Thank you for applying for JMA membership. Our committee will review your application and contact you at <strong style={{ color: "#111827" }}>{form.email}</strong> within 5–7 working days.
                            </p>
                            <Link
                                href="/"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                    padding: "0.875rem 2rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff",
                                    fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none",
                                    transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#094955"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0D5C6B"; }}
                            >
                                Return to homepage
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Eligibility box */}
                            <div
                                style={{
                                    backgroundColor: "#E8F4F6",
                                    borderRadius: "1rem",
                                    padding: "1.75rem 2rem",
                                    marginBottom: "2.5rem",
                                }}
                            >
                                <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#0D5C6B", marginBottom: "1rem" }}>
                                    Eligibility Criteria
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                                    {eligibility.map((point) => (
                                        <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                                            <CheckCircle size={15} style={{ color: "#0D5C6B", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#0D5C6B", fontWeight: 500, lineHeight: 1.5 }}>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form */}
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "1.25rem",
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07)",
                                    padding: "2.25rem",
                                }}
                            >
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1.75rem" }}>
                                    Membership Application
                                </h2>

                                {/* Full name */}
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <FieldLabel required>Full Name</FieldLabel>
                                    <div style={{ position: "relative" }}>
                                        <User size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                        <input type="text" placeholder="Ahmed Abdullah" value={form.fullName}
                                            onChange={(e) => { set("fullName", e.target.value); clearError("fullName"); }}
                                            style={{ ...inputStyle(!!form.fullName, !!errors.fullName), paddingLeft: "2.5rem" }}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.fullName ? "#EF4444" : form.fullName ? "#0D5C6B" : "#E5E7EB"; }} />
                                    </div>
                                    {errors.fullName && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.fullName}</p>}
                                </div>

                                {/* Email + Phone */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                    <div>
                                        <FieldLabel required>Email Address</FieldLabel>
                                        <div style={{ position: "relative" }}>
                                            <Mail size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                            <input type="email" placeholder="ahmed@email.com" value={form.email}
                                                onChange={(e) => { set("email", e.target.value); clearError("email"); }}
                                                style={{ ...inputStyle(!!form.email, !!errors.email), paddingLeft: "2.5rem" }}
                                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.email ? "#EF4444" : form.email ? "#0D5C6B" : "#E5E7EB"; }} />
                                        </div>
                                        {errors.email && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.email}</p>}
                                    </div>

                                    <div>
                                        <FieldLabel required>Phone Number</FieldLabel>
                                        <div style={{ position: "relative" }}>
                                            <Phone size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                            <input type="tel" placeholder="+44 7700 000000" value={form.phone}
                                                onChange={(e) => { set("phone", e.target.value); clearError("phone"); }}
                                                style={{ ...inputStyle(!!form.phone, !!errors.phone), paddingLeft: "2.5rem" }}
                                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.phone ? "#EF4444" : form.phone ? "#0D5C6B" : "#E5E7EB"; }} />
                                        </div>
                                        {errors.phone && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* Address */}
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <FieldLabel>Address <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                                    <div style={{ position: "relative" }}>
                                        <MapPin size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                        <input type="text" placeholder="Street address" value={form.address}
                                            onChange={(e) => set("address", e.target.value)}
                                            style={{ ...inputStyle(!!form.address), paddingLeft: "2.5rem" }}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.address ? "#0D5C6B" : "#E5E7EB"; }} />
                                    </div>
                                </div>

                                {/* City + Postcode */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                    <div>
                                        <FieldLabel required>City</FieldLabel>
                                        <input type="text" placeholder="Manchester" value={form.city}
                                            onChange={(e) => { set("city", e.target.value); clearError("city"); }}
                                            style={inputStyle(!!form.city, !!errors.city)}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.city ? "#EF4444" : form.city ? "#0D5C6B" : "#E5E7EB"; }} />
                                        {errors.city && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.city}</p>}
                                    </div>
                                    <div>
                                        <FieldLabel>Postcode <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                                        <input type="text" placeholder="M1 1AE" value={form.postcode}
                                            onChange={(e) => set("postcode", e.target.value)}
                                            style={inputStyle(!!form.postcode)}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.postcode ? "#0D5C6B" : "#E5E7EB"; }} />
                                    </div>
                                </div>

                                {/* Connection to community */}
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <FieldLabel required>Your Connection to the Jaffna Muslim Community</FieldLabel>
                                    <textarea
                                        placeholder="Briefly describe your heritage, family ties, or connection to Jaffna..."
                                        value={form.connection}
                                        onChange={(e) => { set("connection", e.target.value); clearError("connection"); }}
                                        rows={3}
                                        style={{ ...inputStyle(!!form.connection, !!errors.connection), resize: "vertical" as const, lineHeight: 1.6, fontFamily: "var(--font-inter)" }}
                                        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = errors.connection ? "#EF4444" : form.connection ? "#0D5C6B" : "#E5E7EB"; }}
                                    />
                                    {errors.connection && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.connection}</p>}
                                </div>

                                {/* Reason for joining */}
                                <div style={{ marginBottom: "1.75rem" }}>
                                    <FieldLabel>Why do you want to join? <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                                    <textarea
                                        placeholder="Tell us a little about why you'd like to become a member..."
                                        value={form.reason}
                                        onChange={(e) => set("reason", e.target.value)}
                                        rows={3}
                                        style={{ ...inputStyle(!!form.reason), resize: "vertical" as const, lineHeight: 1.6, fontFamily: "var(--font-inter)" }}
                                        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = form.reason ? "#0D5C6B" : "#E5E7EB"; }}
                                    />
                                </div>

                                {/* Agreement checkbox */}
                                <div
                                    style={{
                                        backgroundColor: agreed ? "#E8F4F6" : "#F9FAFB",
                                        border: `1.5px solid ${agreed ? "#0D5C6B" : (errors.reason ? "#EF4444" : "#E5E7EB")}`,
                                        borderRadius: "0.875rem",
                                        padding: "1.125rem 1.25rem",
                                        marginBottom: "1.75rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                    onClick={() => { setAgreed(!agreed); if (errors.reason) clearError("reason"); }}
                                >
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                                        <div
                                            style={{
                                                width: "20px", height: "20px", borderRadius: "0.375rem",
                                                border: `2px solid ${agreed ? "#0D5C6B" : "#D1D5DB"}`,
                                                backgroundColor: agreed ? "#0D5C6B" : "#ffffff",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0, marginTop: "1px", transition: "all 0.2s ease",
                                            }}
                                        >
                                            {agreed && <CheckCircle size={12} style={{ color: "#ffffff" }} aria-hidden="true" />}
                                        </div>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#374151", lineHeight: 1.6 }}>
                                            I confirm that I meet the eligibility criteria above, and I agree to abide by JMA&apos;s constitution and code of conduct as a member.
                                        </p>
                                    </div>
                                </div>
                                {errors.reason && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "-1.25rem", marginBottom: "1.25rem" }}>{errors.reason}</p>}

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    style={{
                                        width: "100%",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                        padding: "0.9375rem", borderRadius: "0.5rem", border: "none",
                                        backgroundColor: submitting ? "#B08D35" : "#C9A84C", color: "#ffffff",
                                        fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem",
                                        cursor: submitting ? "not-allowed" : "pointer",
                                        transition: "background-color 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                    onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}
                                >
                                    {submitting ? "Submitting…" : (
                                        <>
                                            <Send size={16} aria-hidden="true" />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <style>{`
        @media (max-width: 1023px) {
          .benefits-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          .benefits-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}