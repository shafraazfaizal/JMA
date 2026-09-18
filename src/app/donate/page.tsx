"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    ArrowRight, ArrowLeft, Shield, CheckCircle,
    User, Mail, Phone, Heart, AlertCircle,
    Building2, Upload, Clock, CreditCard,
} from "lucide-react";
import StepIndicator from "@/components/ui/StepIndicator";
import { campaigns } from "@/data/campaigns";
import { donationAmounts, impactEquivalents, siteConfig } from "@/data/site";
import { formatCurrency, calculateGiftAid } from "@/lib/utils";
import { submitBankTransferAction } from "./actions";

// ─── Types ────────────────────────────────────
type Frequency = "one-time" | "monthly";
type DonationType =
    | "General" | "Zakat" | "Sadaqah" | "Lillah"
    | "Qurbani" | "Fitrana" | "In Memory" | "On Behalf";

const donationTypes: { value: DonationType; label: string; description: string }[] = [
    { value: "General", label: "General", description: "Where most needed" },
    { value: "Zakat", label: "Zakat", description: "Obligatory purification" },
    { value: "Sadaqah", label: "Sadaqah", description: "Voluntary charity" },
    { value: "Lillah", label: "Lillah", description: "For the sake of Allah" },
    { value: "Qurbani", label: "Qurbani", description: "Sacrifice offering" },
    { value: "Fitrana", label: "Fitrana", description: "Zakat al-Fitr" },
    { value: "In Memory", label: "In Memory", description: "Honour a loved one" },
    { value: "On Behalf", label: "On Behalf", description: "Give for someone" },
];

interface DonateFormData {
    frequency: Frequency;
    amount: number;
    customAmount: string;
    donationType: DonationType;
    campaignId: string;
    fullName: string;
    email: string;
    phone: string;
    giftAid: boolean;
    isDedication: boolean;
    dedicationType: "In Memory of" | "On Behalf of";
    dedicationName: string;
    dedicationMessage: string;
}

const defaultForm: DonateFormData = {
    frequency: "one-time",
    amount: 50,
    customAmount: "",
    donationType: "General",
    campaignId: "",
    fullName: "",
    email: "",
    phone: "",
    giftAid: false,
    isDedication: false,
    dedicationType: "In Memory of",
    dedicationName: "",
    dedicationMessage: "",
};

function inputStyle(hasValue: boolean, hasError?: boolean): React.CSSProperties {
    return {
        width: "100%", padding: "0.8125rem 1rem", borderRadius: "0.5rem",
        border: `1.5px solid ${hasError ? "#EF4444" : hasValue ? "#0D5C6B" : "#E5E7EB"}`,
        fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.9375rem",
        color: "#111827", backgroundColor: "#ffffff", outline: "none",
        transition: "border-color 0.15s ease", boxSizing: "border-box" as const,
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

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid #F3F4F6" }}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>{value}</span>
        </div>
    );
}

// ─── Bank detail row ──────────────────────────
function BankRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", minWidth: "120px" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#ffffff", textAlign: "right" as const }}>{value}</span>
        </div>
    );
}

function card(children: React.ReactNode) {
    return (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)", padding: "2rem" }}>
            {children}
        </div>
    );
}

// ─── Inner page ───────────────────────────────
function DonatePageInner() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Partial<Record<keyof DonateFormData, string>>>({});
    const [form, setForm] = useState<DonateFormData>({
        ...defaultForm,
        campaignId: searchParams.get("campaign") ?? "",
        amount: Number(searchParams.get("amount")) || defaultForm.amount,
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptError, setReceiptError] = useState("");
    const [paymentRef, setPaymentRef] = useState("");
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const selectedCampaign = campaigns.find((c) => c.id === form.campaignId);
    const activeAmount = form.customAmount ? parseFloat(form.customAmount) || 0 : form.amount;
    const giftAidBonus = calculateGiftAid(activeAmount);

    const update = (key: keyof DonateFormData, value: unknown) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const validateStep1 = () => {
        const e: typeof errors = {};
        if (activeAmount < 1) e.amount = "Please enter a valid amount";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        const e: typeof errors = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
        if (form.isDedication && !form.dedicationName.trim()) e.dedicationName = "Please enter a name";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        setReceiptError("");
        setSubmitError("");
        if (!receiptFile) { setReceiptError("Please upload your bank transfer receipt to proceed."); return; }
        if (!paymentRef.trim()) { setSubmitError("Please enter your payment reference."); return; }

        const data = new FormData();
        data.set("receipt", receiptFile);
        data.set("payment_ref", paymentRef);
        data.set("amount", String(activeAmount));
        data.set("donation_type", form.donationType);
        data.set("frequency", form.frequency);
        data.set("campaign", selectedCampaign?.title ?? "General Fund");
        data.set("full_name", form.fullName);
        data.set("email", form.email);
        data.set("phone", form.phone);
        data.set("gift_aid", String(form.giftAid));
        data.set("is_dedication", String(form.isDedication));
        data.set("dedication_type", form.dedicationType);
        data.set("dedication_name", form.dedicationName);
        data.set("dedication_message", form.dedicationMessage);

        startTransition(async () => {
            const result = await submitBankTransferAction(data);
            if (result.success) {
                setSubmitted(true);
            } else {
                setSubmitError(result.error ?? "Something went wrong. Please try again.");
            }
        });
    };

    // ── Success screen ────────────────────────────
    if (submitted) {
        return (
            <main style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" as const }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <CheckCircle size={32} style={{ color: "#15803D" }} aria-hidden="true" />
                    </div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.75rem", color: "#111827", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                        JazakAllah Khair
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", color: "#6B7280", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                        Your donation of <strong style={{ color: "#0D5C6B" }}>{formatCurrency(activeAmount)}</strong> has been received. A confirmation email is on its way.
                    </p>
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", border: "1px solid #E5E7EB", padding: "1.25rem", marginBottom: "1.5rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: "0.5rem" }}>Your donation</p>
                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#0D5C6B" }}>{formatCurrency(activeAmount)}</p>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF", marginTop: "0.25rem" }}>{form.donationType} · {selectedCampaign?.title ?? "General Fund"}</p>
                    </div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF", lineHeight: 1.6 }}>
                        The JMA team will verify your transfer and confirm within 24–48 hours. May Allah accept your donation and reward you abundantly. Ameen.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#073D47", padding: "7rem 1.5rem 2.5rem" }}>
                <div style={{ maxWidth: "36rem", margin: "0 auto", textAlign: "center" as const }}>
                    {/* <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.5rem" }}>
                        Jaffna Muslim Association UK
                    </p> */}
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
                        Make a Donation
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                        100% of your donation reaches those in genuine need. No admin fees deducted.
                    </p>

                    {/* Coming soon strip */}
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "9999px", padding: "0.5rem 1rem", marginTop: "1.25rem" }}>
                        <CreditCard size={13} style={{ color: "#C9A84C" }} aria-hidden="true" />
                        <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", color: "#C9A84C" }}>
                            Online card payments via Stripe & PayPal — coming soon
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "36rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
                <StepIndicator step={step} totalSteps={3} labels={["Amount", "Your Details", "Bank Transfer"]} />
                <div style={{ marginBottom: "1.5rem" }} />

                {/* ═══════════════ STEP 1 ═══════════════ */}
                {step === 1 && card(
                    <>
                        {/* Frequency toggle */}
                        <div style={{ display: "flex", gap: "0", marginBottom: "1.75rem", backgroundColor: "#F3F4F6", borderRadius: "0.5rem", padding: "0.25rem" }}>
                            {(["one-time", "monthly"] as Frequency[]).map((f) => (
                                <button key={f} onClick={() => update("frequency", f)}
                                    style={{ flex: 1, padding: "0.625rem", borderRadius: "0.375rem", border: "none", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "all 0.15s ease", backgroundColor: form.frequency === f ? "#ffffff" : "transparent", color: form.frequency === f ? "#0D5C6B" : "#6B7280", boxShadow: form.frequency === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                                    {f === "one-time" ? "One-time" : "Monthly"}
                                </button>
                            ))}
                        </div>

                        {/* Donation type */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <FieldLabel required>Donation Type</FieldLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem" }} className="type-grid">
                                {donationTypes.map((t) => (
                                    <button key={t.value} onClick={() => update("donationType", t.value)}
                                        style={{ padding: "0.625rem 0.5rem", borderRadius: "0.5rem", border: `1.5px solid ${form.donationType === t.value ? "#0D5C6B" : "#E5E7EB"}`, backgroundColor: form.donationType === t.value ? "#E8F4F6" : "#ffffff", cursor: "pointer", textAlign: "center" as const, transition: "all 0.15s ease" }}>
                                        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "0.8125rem", color: form.donationType === t.value ? "#0D5C6B" : "#374151", marginBottom: "0.125rem" }}>{t.label}</p>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6875rem", color: "#9CA3AF", lineHeight: 1.2 }}>{t.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amount presets */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <FieldLabel required>Amount</FieldLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.625rem", marginBottom: "0.75rem" }}>
                                {donationAmounts.map((a) => (
                                    <button key={a} onClick={() => { update("amount", a); update("customAmount", ""); }}
                                        style={{ padding: "0.75rem 0.5rem", borderRadius: "0.5rem", border: `1.5px solid ${form.amount === a && !form.customAmount ? "#0D5C6B" : "#E5E7EB"}`, backgroundColor: form.amount === a && !form.customAmount ? "#E8F4F6" : "#ffffff", cursor: "pointer", transition: "all 0.15s ease" }}>
                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: form.amount === a && !form.customAmount ? "#0D5C6B" : "#111827", marginBottom: "0.125rem" }}>{formatCurrency(a)}</p>
                                        {impactEquivalents[a] && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6875rem", color: "#9CA3AF", lineHeight: 1.2 }}>{impactEquivalents[a]}</p>}
                                    </button>
                                ))}
                            </div>
                            <input type="number" min="1" placeholder="Or enter custom amount (£)" value={form.customAmount}
                                onChange={(e) => update("customAmount", e.target.value)}
                                style={inputStyle(!!form.customAmount, !!errors.amount)}
                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.customAmount ? "#0D5C6B" : "#E5E7EB"; }}
                            />
                            {errors.amount && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.amount}</p>}
                        </div>

                        {/* Gift Aid */}
                        <div style={{ backgroundColor: "#F9FAFB", borderRadius: "0.75rem", border: "1px solid #E5E7EB", padding: "1rem 1.25rem", marginBottom: "1.75rem" }}>
                            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                                <input type="checkbox" checked={form.giftAid} onChange={(e) => update("giftAid", e.target.checked)} style={{ marginTop: "2px", accentColor: "#0D5C6B", width: "16px", height: "16px", flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9rem", color: "#111827", marginBottom: "0.25rem" }}>
                                        Add Gift Aid — boost your donation by 25% at no extra cost
                                    </p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.5 }}>
                                        I am a UK taxpayer and understand that if I pay less Income Tax / Capital Gains Tax than the amount of Gift Aid claimed on all my donations it is my responsibility to pay any difference.
                                    </p>
                                    {form.giftAid && activeAmount > 0 && (
                                        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#0D5C6B", marginTop: "0.5rem" }}>
                                            ✓ JMA will reclaim {formatCurrency(giftAidBonus)} from HMRC — total value: {formatCurrency(activeAmount + giftAidBonus)}
                                        </p>
                                    )}
                                </div>
                            </label>
                        </div>

                        <button onClick={() => { if (validateStep1()) setStep(2); }}
                            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "background-color 0.2s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}>
                            Continue <ArrowRight size={17} aria-hidden="true" />
                        </button>
                    </>
                )}

                {/* ═══════════════ STEP 2 ═══════════════ */}
                {step === 2 && card(
                    <>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem", marginBottom: "1.75rem" }}>
                            <div>
                                <FieldLabel required>Full Name</FieldLabel>
                                <div style={{ position: "relative" }}>
                                    <User size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                    <input type="text" placeholder="Your full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
                                        style={{ ...inputStyle(!!form.fullName, !!errors.fullName), paddingLeft: "2.5rem" }}
                                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.fullName ? "#0D5C6B" : "#E5E7EB"; }} />
                                </div>
                                {errors.fullName && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.fullName}</p>}
                            </div>
                            <div>
                                <FieldLabel required>Email Address</FieldLabel>
                                <div style={{ position: "relative" }}>
                                    <Mail size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                    <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)}
                                        style={{ ...inputStyle(!!form.email, !!errors.email), paddingLeft: "2.5rem" }}
                                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.email ? "#0D5C6B" : "#E5E7EB"; }} />
                                </div>
                                {errors.email && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.email}</p>}
                            </div>
                            <div>
                                <FieldLabel>Phone Number</FieldLabel>
                                <div style={{ position: "relative" }}>
                                    <Phone size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} aria-hidden="true" />
                                    <input type="tel" placeholder="+44 7700 000000" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                                        style={{ ...inputStyle(!!form.phone), paddingLeft: "2.5rem" }}
                                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.phone ? "#0D5C6B" : "#E5E7EB"; }} />
                                </div>
                            </div>

                            {/* Dedication */}
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
                                    <input type="checkbox" checked={form.isDedication} onChange={(e) => update("isDedication", e.target.checked)} style={{ accentColor: "#0D5C6B", width: "16px", height: "16px" }} />
                                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}>
                                        <Heart size={14} style={{ display: "inline", marginRight: "0.375rem", color: "#DC2626" }} aria-hidden="true" />
                                        This donation is In Memory of / On Behalf of someone
                                    </span>
                                </label>
                                {form.isDedication && (
                                    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column" as const, gap: "0.875rem", paddingLeft: "1.5rem", borderLeft: "2px solid #E5E7EB" }}>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            {(["In Memory of", "On Behalf of"] as const).map((t) => (
                                                <button key={t} onClick={() => update("dedicationType", t)}
                                                    style={{ flex: 1, padding: "0.625rem", borderRadius: "0.5rem", border: `1.5px solid ${form.dedicationType === t ? "#0D5C6B" : "#E5E7EB"}`, backgroundColor: form.dedicationType === t ? "#E8F4F6" : "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: form.dedicationType === t ? "#0D5C6B" : "#374151", cursor: "pointer", transition: "all 0.15s ease" }}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                        <input type="text" placeholder="Name" value={form.dedicationName} onChange={(e) => update("dedicationName", e.target.value)}
                                            style={inputStyle(!!form.dedicationName, !!errors.dedicationName)}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.dedicationName ? "#0D5C6B" : "#E5E7EB"; }} />
                                        {errors.dedicationName && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444" }}>{errors.dedicationName}</p>}
                                        <textarea placeholder="Message (optional)" value={form.dedicationMessage} onChange={(e) => update("dedicationMessage", e.target.value)} rows={3}
                                            style={{ ...inputStyle(!!form.dedicationMessage), resize: "vertical" as const, lineHeight: 1.6, fontFamily: "var(--font-inter)" }}
                                            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = form.dedicationMessage ? "#0D5C6B" : "#E5E7EB"; }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={() => setStep(1)}
                                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.9375rem 1.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: "pointer", flexShrink: 0 }}>
                                <ArrowLeft size={16} aria-hidden="true" /> Back
                            </button>
                            <button onClick={() => { if (validateStep2()) setStep(3); }}
                                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "background-color 0.2s ease" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}>
                                Continue <ArrowRight size={17} aria-hidden="true" />
                            </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "1rem" }}>
                            <Shield size={12} aria-hidden="true" /> SSL encrypted · UK Registered Charity No. {siteConfig.charityNumber}
                        </div>
                    </>
                )}

                {/* ═══════════════ STEP 3 — BANK TRANSFER ═══════════════ */}
                {step === 3 && card(
                    <>
                        {/* Donation summary */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.75rem" }}>
                                Donation Summary
                            </p>
                            <div style={{ backgroundColor: "#F9FAFB", borderRadius: "0.875rem", border: "1px solid #E5E7EB", padding: "0 1.25rem" }}>
                                <SummaryRow label="Amount" value={`${formatCurrency(activeAmount)}${form.frequency === "monthly" ? " / month" : ""}`} />
                                <SummaryRow label="Type" value={form.donationType} />
                                <SummaryRow label="Campaign" value={selectedCampaign?.title || "General Fund"} />
                                <SummaryRow label="Donor" value={form.fullName} />
                                {form.giftAid && <SummaryRow label="Gift Aid" value={`+${formatCurrency(giftAidBonus)} claimed by JMA`} />}
                                {form.isDedication && <SummaryRow label={form.dedicationType} value={form.dedicationName} />}
                            </div>
                        </div>

                        {/* Bank details */}
                        <div style={{ backgroundColor: "#073D47", borderRadius: "0.875rem", padding: "1.5rem", marginBottom: "1.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                                <Building2 size={18} style={{ color: "#C9A84C" }} aria-hidden="true" />
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#ffffff" }}>
                                    Bank Transfer Details
                                </p>
                            </div>
                            <BankRow label="Bank" value={siteConfig.bankDetails.bank} />
                            <BankRow label="Account Name" value={siteConfig.bankDetails.accountName} />
                            <BankRow label="Sort Code" value={siteConfig.bankDetails.sortCode} />
                            <BankRow label="Account No." value={siteConfig.bankDetails.accountNumber} />
                            <div style={{ marginTop: "1rem", backgroundColor: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "0.5rem", padding: "0.75rem 1rem" }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#C9A84C", lineHeight: 1.6 }}>
                                    <strong>Reference:</strong> Please use your name + donation type as your payment reference so we can match your transfer. e.g. <em>"{form.fullName} {form.donationType}"</em>
                                </p>
                            </div>
                        </div>

                        {/* Steps */}
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem", marginBottom: "1.75rem" }}>
                            {[
                                { n: 1, text: "Transfer the amount above to the JMA bank account using your banking app or online banking" },
                                { n: 2, text: "Enter the reference you used and upload your payment receipt below" },
                                { n: 3, text: "We will verify your transfer and send you a confirmation email within 24–48 hours" },
                            ].map(({ n, text }) => (
                                <div key={n} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#E8F4F6", border: "1.5px solid #0D5C6B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <span style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "0.75rem", color: "#0D5C6B" }}>{n}</span>
                                    </div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#374151", lineHeight: 1.6, paddingTop: "2px" }}>{text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Payment reference */}
                        <div style={{ marginBottom: "1.25rem" }}>
                            <FieldLabel required>Payment Reference Used</FieldLabel>
                            <input type="text" placeholder={`e.g. ${form.fullName} ${form.donationType}`} value={paymentRef}
                                onChange={(e) => setPaymentRef(e.target.value)}
                                style={inputStyle(!!paymentRef)}
                                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = paymentRef ? "#0D5C6B" : "#E5E7EB"; }}
                            />
                        </div>

                        {/* Receipt upload — required */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <FieldLabel required>Upload Payment Receipt</FieldLabel>
                            <label style={{
                                display: "flex", alignItems: "center", gap: "0.875rem",
                                padding: "1rem 1.25rem", borderRadius: "0.625rem",
                                border: `1.5px dashed ${receiptError ? "#EF4444" : receiptFile ? "#0D5C6B" : "#D1D5DB"}`,
                                backgroundColor: receiptFile ? "#E8F4F6" : "#F9FAFB",
                                cursor: "pointer", transition: "all 0.15s ease",
                            }}>
                                <Upload size={18} style={{ color: receiptFile ? "#0D5C6B" : "#9CA3AF", flexShrink: 0 }} aria-hidden="true" />
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: receiptFile ? "#0D5C6B" : "#374151" }}>
                                        {receiptFile ? receiptFile.name : "Click to upload receipt"}
                                    </p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "0.125rem" }}>
                                        PDF, JPG, or PNG — max 5MB
                                    </p>
                                </div>
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }}
                                    onChange={(e) => { setReceiptFile(e.target.files?.[0] ?? null); setReceiptError(""); }} />
                            </label>
                            {receiptError && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                    <AlertCircle size={13} aria-hidden="true" /> {receiptError}
                                </p>
                            )}
                        </div>

                        {submitError && (
                            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem", padding: "0.875rem 1rem", marginBottom: "1.25rem" }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#DC2626" }}>{submitError}</p>
                            </div>
                        )}

                        {/* Nav */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={() => setStep(2)} disabled={isPending}
                                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.9375rem 1.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: isPending ? "not-allowed" : "pointer", flexShrink: 0, opacity: isPending ? 0.5 : 1 }}>
                                <ArrowLeft size={16} aria-hidden="true" /> Back
                            </button>
                            <button onClick={handleSubmit} disabled={isPending}
                                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: isPending ? "#B08D35" : "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: isPending ? "not-allowed" : "pointer", transition: "background-color 0.2s ease" }}
                                onMouseEnter={(e) => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#094955"; }}
                                onMouseLeave={(e) => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D5C6B"; }}>
                                {isPending ? (
                                    <><Clock size={15} aria-hidden="true" /> Submitting…</>
                                ) : (
                                    <><CheckCircle size={15} aria-hidden="true" /> Confirm Donation</>
                                )}
                            </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "1rem" }}>
                            <Shield size={12} aria-hidden="true" /> SSL encrypted · UK Registered Charity No. {siteConfig.charityNumber}
                        </div>
                    </>
                )}
            </div>

            <style>{`
                @media (max-width: 480px) {
                    .type-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </main>
    );
}

export default function DonatePage() {
    return (
        <Suspense>
            <DonatePageInner />
        </Suspense>
    );
}