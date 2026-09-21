"use client";

import { useState, useTransition } from "react";
import {
    Heart, GraduationCap, Building2, HandHeart,
    AlertTriangle, HelpCircle, MapPin, Users,
    PoundSterling, FileText, User, Mail, Phone,
    ChevronDown, Upload, CheckCircle,
} from "lucide-react";
import { submitProjectRequestAction } from "./actions";

const projectTypes = [
    { value: "Medical", label: "Medical & Healthcare", icon: Heart, colour: "#F87171" },
    { value: "Education", label: "Education & Training", icon: GraduationCap, colour: "#60A5FA" },
    { value: "Infrastructure", label: "Infrastructure & Construction", icon: Building2, colour: "#34D399" },
    { value: "Welfare", label: "Welfare & Social Support", icon: HandHeart, colour: "#C9A84C" },
    { value: "Emergency", label: "Emergency Relief", icon: AlertTriangle, colour: "#F87171" },
    { value: "Other", label: "Other", icon: HelpCircle, colour: "#A78BFA" },
];

const urgencyOptions = [
    { value: "Low", label: "Low — within 6 months", colour: "#34D399" },
    { value: "Medium", label: "Medium — within 1–2 months", colour: "#FBBF24" },
    { value: "Urgent", label: "Urgent — immediately needed", colour: "#F87171" },
];

const relationshipOptions = [
    "I am the beneficiary",
    "Family member",
    "Community member",
    "Organisation",
];

function Field({ label, required, children, hint }: {
    label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
            <label style={{
                fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#111827",
                display: "flex", alignItems: "center", gap: "0.25rem",
            }}>
                {label}
                {required && <span style={{ color: "#DC2626" }}>*</span>}
            </label>
            {hint && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "#6B7280", marginTop: "-0.25rem" }}>{hint}</p>}
            {children}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.8125rem 1rem",
    borderRadius: "0.5rem", border: "1.5px solid #E5E7EB",
    fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#111827",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
    backgroundColor: "#ffffff",
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none", backgroundImage: "none", cursor: "pointer",
};

export default function ProjectSubmitPage() {
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);
    const [refNumber, setRefNumber] = useState("");
    const [error, setError] = useState("");
    const [docFile, setDocFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        const form = e.currentTarget;
        const data = new FormData(form);
        if (docFile) data.set("document", docFile);

        startTransition(async () => {
            const result = await submitProjectRequestAction(data);
            if (result.success && result.reference) {
                setRefNumber(result.reference);
                setSubmitted(true);
            } else {
                setError(result.error ?? "Something went wrong. Please try again.");
            }
        });
    };

    if (submitted) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" as const }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <CheckCircle size={32} style={{ color: "#15803D" }} aria-hidden="true" />
                    </div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.75rem", color: "#111827", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                        Request Submitted
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "#6B7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                        JazakAllah Khair for submitting your project request. The JMA committee will review it and get back to you.
                    </p>
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", border: "1px solid #E5E7EB", padding: "1.25rem", marginBottom: "2rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: "0.375rem" }}>Your Reference Number</p>
                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.375rem", color: "#0D5C6B", letterSpacing: "0.04em" }}>{refNumber}</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF", lineHeight: 1.6 }}>
                        A confirmation email has been sent to you. Please keep your reference number safe for future correspondence.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>

            {/* Header */}
            <div style={{ backgroundColor: "#073D47", padding: "8rem 1.5rem 3rem" }}>
                <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.75rem" }}>
                        Project Request
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.875rem, 4vw, 2.75rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "1rem" }}>
                        Submit a Project Request
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "520px" }}>
                        If you know of a family, individual, or community in genuine need — tell us about it. The JMA committee reviews every request and will get back to you Insha Allah
                    </p>
                </div>
            </div>

            {/* Form */}
            <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
                <form onSubmit={handleSubmit}>

                    {/* Project Type */}
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "2rem", marginBottom: "1.25rem" }}>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827", marginBottom: "1.5rem" }}>
                            About the Project
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                            <Field label="Project Type" required>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }} className="project-type-grid">
                                    {projectTypes.map(({ value, label, icon: Icon, colour }) => (
                                        <label key={value} style={{ cursor: "pointer" }}>
                                            <input type="radio" name="project_type" value={value} required style={{ display: "none" }}
                                                onChange={(e) => {
                                                    document.querySelectorAll(".type-card").forEach((el) => {
                                                        (el as HTMLElement).style.borderColor = "#E5E7EB";
                                                        (el as HTMLElement).style.backgroundColor = "#ffffff";
                                                    });
                                                    const card = e.currentTarget.parentElement?.querySelector(".type-card") as HTMLElement;
                                                    if (card) { card.style.borderColor = colour; card.style.backgroundColor = `${colour}10`; }
                                                }}
                                            />
                                            <div className="type-card" style={{
                                                padding: "0.875rem 0.75rem", borderRadius: "0.625rem",
                                                border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff",
                                                display: "flex", flexDirection: "column" as const, alignItems: "center",
                                                gap: "0.5rem", textAlign: "center" as const, transition: "all 0.15s ease",
                                            }}>
                                                <Icon size={20} style={{ color: colour }} aria-hidden="true" />
                                                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.75rem", color: "#374151", lineHeight: 1.3 }}>{label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Project Title" required hint="A short, clear title. e.g. 'Surgery funding for Ahmed, 45, Jaffna'">
                                <input name="title" type="text" required placeholder="e.g. Help rebuild the Kondavil community well" style={inputStyle}
                                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                />
                            </Field>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="two-col">
                                <Field label="Country" required>
                                    <div style={{ position: "relative" }}>
                                        <MapPin size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                        <input name="location_country" type="text" required placeholder="e.g. Sri Lanka" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                        />
                                    </div>
                                </Field>
                                <Field label="City / Town" required>
                                    <input name="location_city" type="text" required placeholder="e.g. Jaffna" style={inputStyle}
                                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                    />
                                </Field>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="two-col">
                                <Field label="Number of Beneficiaries" required hint="How many people will this help?">
                                    <div style={{ position: "relative" }}>
                                        <Users size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                        <input name="beneficiary_count" type="number" min="1" required placeholder="e.g. 1" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                        />
                                    </div>
                                </Field>
                                <Field label="Estimated Cost (£)" required>
                                    <div style={{ position: "relative" }}>
                                        <PoundSterling size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                        <input name="estimated_cost" type="number" min="1" required placeholder="e.g. 5000" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                        />
                                    </div>
                                </Field>
                            </div>

                            <Field label="Urgency" required>
                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
                                    {urgencyOptions.map(({ value, label, colour }) => (
                                        <label key={value} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", transition: "all 0.15s ease" }}
                                            onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = colour; }}
                                            onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#E5E7EB"; }}
                                        >
                                            <input type="radio" name="urgency" value={value} required style={{ accentColor: colour, width: "16px", height: "16px" }} />
                                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#374151", fontWeight: 500 }}>{label}</span>
                                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colour, marginLeft: "auto", flexShrink: 0 }} />
                                        </label>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Who will benefit?" required hint="Briefly describe the people this project will help.">
                                <textarea name="beneficiary_description" required rows={2} placeholder="e.g. A widow and her three children who lost their home in the 2024 floods" style={{ ...inputStyle, resize: "vertical" as const, minHeight: "80px" }}
                                    onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }}
                                    onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#E5E7EB"; }}
                                />
                            </Field>

                            <Field label="Full Description" required hint="Tell us everything — the background, what is needed, and why JMA's support would make a difference.">
                                <textarea name="description" required rows={6} placeholder="Please describe the situation in as much detail as possible..." style={{ ...inputStyle, resize: "vertical" as const, minHeight: "140px" }}
                                    onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }}
                                    onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#E5E7EB"; }}
                                />
                            </Field>

                            <Field label="Supporting Document" hint="Optional — upload a medical letter, quote, or any supporting evidence (PDF, max 5MB)">
                                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.5rem", border: "1.5px dashed #D1D5DB", cursor: "pointer", backgroundColor: "#F9FAFB", transition: "border-color 0.15s ease" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#0D5C6B"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#D1D5DB"; }}
                                >
                                    <Upload size={16} style={{ color: "#6B7280", flexShrink: 0 }} aria-hidden="true" />
                                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: docFile ? "#0D5C6B" : "#6B7280", fontWeight: docFile ? 600 : 400 }}>
                                        {docFile ? docFile.name : "Click to upload a PDF"}
                                    </span>
                                    <input type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />
                                </label>
                            </Field>
                        </div>
                    </div>

                    {/* Applicant details */}
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "2rem", marginBottom: "1.25rem" }}>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827", marginBottom: "1.5rem" }}>
                            Your Details
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                            <Field label="Full Name" required>
                                <div style={{ position: "relative" }}>
                                    <User size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                    <input name="applicant_name" type="text" required placeholder="Your full name" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                    />
                                </div>
                            </Field>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="two-col">
                                <Field label="Email Address" required>
                                    <div style={{ position: "relative" }}>
                                        <Mail size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                        <input name="applicant_email" type="email" required placeholder="you@example.com" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                        />
                                    </div>
                                </Field>
                                <Field label="Phone Number" required>
                                    <div style={{ position: "relative" }}>
                                        <Phone size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                        <input name="applicant_phone" type="tel" required placeholder="+44 7700 000000" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = "#E5E7EB"; }}
                                        />
                                    </div>
                                </Field>
                            </div>

                            <Field label="Your relationship to the beneficiary" required>
                                <div style={{ position: "relative" }}>
                                    <select name="relationship_to_beneficiary" required style={selectStyle}
                                        onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = "#E5E7EB"; }}
                                    >
                                        <option value="">Select your relationship</option>
                                        {relationshipOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <ChevronDown size={15} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                </div>
                            </Field>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div style={{ backgroundColor: "#FAF5E8", borderRadius: "0.75rem", border: "1px solid rgba(201,168,76,0.3)", padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#92400E", lineHeight: 1.7 }}>
                            <strong>Please note:</strong> Submitting this form does not guarantee funding. All requests are reviewed by the JMA committee on a case-by-case basis. We treat all submissions with full confidentiality.
                        </p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem", padding: "1rem", marginBottom: "1rem" }}>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#DC2626" }}>{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        style={{
                            width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "none",
                            backgroundColor: isPending ? "#094955" : "#0D5C6B",
                            color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700,
                            fontSize: "1rem", cursor: isPending ? "not-allowed" : "pointer",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#094955"; }}
                        onMouseLeave={(e) => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D5C6B"; }}
                    >
                        {isPending ? "Submitting…" : "Submit Project Request"}
                    </button>
                </form>
            </div>

            <style>{`
        @media (max-width: 639px) {
          .two-col { grid-template-columns: 1fr !important; }
          .project-type-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
        </div>
    );
}