"use client";

import { useState } from "react";
import {
    Mail, Phone, MapPin, Send, CheckCircle,
    AlertCircle, Clock, MessageSquare,
} from "lucide-react";
import { siteConfig } from "@/data/site";

const enquiryTypes = [
    "General Enquiry",
    "Donation Question",
    "Volunteer Interest",
    "Membership",
    "Khardal Hasana",
    "Media / Press",
    "Other",
];

interface FormData {
    name: string;
    email: string;
    phone: string;
    enquiryType: string;
    message: string;
}

const defaultForm: FormData = {
    name: "", email: "", phone: "", enquiryType: "General Enquiry", message: "",
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
        <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.5rem" }}>
            {children}
            {required && <span style={{ color: "#EF4444", marginLeft: "0.25rem" }}>*</span>}
        </label>
    );
}

export default function ContactPage() {
    const [form, setForm] = useState<FormData>(defaultForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
        setForm((p) => ({ ...p, [k]: v }));
    const clearError = (k: keyof FormData) =>
        setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

    const validate = () => {
        const e: Partial<Record<keyof FormData, string>> = {};
        if (!form.name.trim()) e.name = "Please enter your name.";
        if (!form.email.trim() || !form.email.includes("@")) e.email = "Please enter a valid email.";
        if (!form.message.trim()) e.message = "Please enter your message.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        // Placeholder — wire to Resend once /api/contact is built
        await new Promise((r) => setTimeout(r, 900));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Get in Touch
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.25rem)", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "560px", margin: "0 auto 1.25rem" }}>
                        We&apos;d love to{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>hear from you</span>
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto" }}>
                        Whether you have a question, want to volunteer, or need support — our team typically responds within 1-2 working days.
                    </p>
                </div>
            </section>

            {/* ── Contact grid ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "3rem", alignItems: "start" }} className="contact-grid">

                    {/* ── Left — info cards ── */}
                    <div>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem", marginBottom: "2rem" }}>
                            {[
                                { icon: Mail, label: "Email Us", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
                                { icon: Phone, label: "Call Us", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
                                { icon: MapPin, label: "Based In", value: siteConfig.address, href: null },
                            ].map(({ icon: Icon, label, value, href }) => {
                                const content = (
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{ width: "44px", height: "44px", borderRadius: "0.75rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Icon size={20} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: "0.2rem" }}>{label}</p>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>{value}</p>
                                        </div>
                                    </div>
                                );
                                return href ? (
                                    <a key={label} href={href} style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.25rem 1.5rem", textDecoration: "none", transition: "border-color 0.2s ease, box-shadow 0.2s ease", display: "block" }}
                                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#A0CDD5"; el.style.boxShadow = "0 4px 16px -4px rgba(13,92,107,0.1)"; }}
                                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#E5E7EB"; el.style.boxShadow = "none"; }}
                                    >
                                        {content}
                                    </a>
                                ) : (
                                    <div key={label} style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.25rem 1.5rem" }}>
                                        {content}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Response time */}
                        <div style={{ backgroundColor: "#E8F4F6", borderRadius: "1rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
                                <Clock size={16} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#0D5C6B" }}>Response Time</p>
                            </div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#0D5C6B", opacity: 0.8, lineHeight: 1.6 }}>
                                JMA is run entirely by volunteers. We aim to respond to all enquiries within 1-2 working days, though urgent Khardal Hasana matters are prioritised immediately.
                            </p>
                        </div>

                        {/* Specific enquiries */}
                        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.5rem" }}>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.875rem" }}>
                                Specific Enquiries
                            </p>
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                                {[
                                    { label: "Khardal Hasana", email: "kh@jaffnamuslimuk.org" },
                                    { label: "General Donations", email: siteConfig.email },
                                ].map(({ label, email }) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: "0.375rem" }}>
                                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>{label}</span>
                                        <a href={`mailto:${email}`} style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#0D5C6B", textDecoration: "none" }}>{email}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Right — form ── */}
                    <div>
                        {submitted ? (
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "3.5rem 2.5rem", textAlign: "center" as const, boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07)" }}>
                                <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                                    <CheckCircle size={30} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.375rem", color: "#111827", marginBottom: "0.75rem" }}>
                                    Message sent — جزاك الله خيرا
                                </h2>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 2rem" }}>
                                    Thank you for reaching out. We&apos;ll get back to you at <strong style={{ color: "#111827" }}>{form.email}</strong> as soon as possible.
                                </p>
                                <button onClick={() => { setSubmitted(false); setForm(defaultForm); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", border: "none", cursor: "pointer" }}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07)", padding: "2.25rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.75rem" }}>
                                    <MessageSquare size={20} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827" }}>Send a Message</h2>
                                </div>

                                {/* Name + Email */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                    <div>
                                        <FieldLabel required>Full Name</FieldLabel>
                                        <input type="text" placeholder="Ahmed Abdullah" value={form.name} onChange={(e) => { set("name", e.target.value); clearError("name"); }} style={inputStyle(!!form.name, !!errors.name)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.name ? "#EF4444" : form.name ? "#0D5C6B" : "#E5E7EB"; }} />
                                        {errors.name && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.name}</p>}
                                    </div>
                                    <div>
                                        <FieldLabel required>Email</FieldLabel>
                                        <input type="email" placeholder="ahmed@email.com" value={form.email} onChange={(e) => { set("email", e.target.value); clearError("email"); }} style={inputStyle(!!form.email, !!errors.email)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.email ? "#EF4444" : form.email ? "#0D5C6B" : "#E5E7EB"; }} />
                                        {errors.email && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Phone + Type */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                    <div>
                                        <FieldLabel>Phone <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                                        <input type="tel" placeholder="+44 7700 000000" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={inputStyle(!!form.phone)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.phone ? "#0D5C6B" : "#E5E7EB"; }} />
                                    </div>
                                    <div>
                                        <FieldLabel>Enquiry Type</FieldLabel>
                                        <select value={form.enquiryType} onChange={(e) => set("enquiryType", e.target.value)} style={{ ...inputStyle(true), appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.875rem center", paddingRight: "2.5rem", cursor: "pointer" }}>
                                            {enquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div style={{ marginBottom: "1.75rem" }}>
                                    <FieldLabel required>Message</FieldLabel>
                                    <textarea placeholder="Tell us how we can help..." value={form.message} onChange={(e) => { set("message", e.target.value); clearError("message"); }} rows={6} style={{ ...inputStyle(!!form.message, !!errors.message), resize: "vertical" as const, lineHeight: 1.6, fontFamily: "var(--font-inter)" }} onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = errors.message ? "#EF4444" : form.message ? "#0D5C6B" : "#E5E7EB"; }} />
                                    {errors.message && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.message}</p>}
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: submitting ? "#B08D35" : "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: submitting ? "not-allowed" : "pointer", transition: "background-color 0.2s ease" }}
                                    onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                    onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}
                                >
                                    {submitting ? "Sending…" : (<><Send size={16} aria-hidden="true" /> Send Message</>)}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}