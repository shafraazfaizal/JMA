"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    ArrowRight, ArrowLeft, Shield, CheckCircle,
    User, Mail, Phone, Heart, AlertCircle, Lock,
} from "lucide-react";
import StepIndicator from "@/components/ui/StepIndicator";
import { campaigns } from "@/data/campaigns";
import { donationAmounts, impactEquivalents } from "@/data/site";
import { formatCurrency, calculateGiftAid } from "@/lib/utils";
import {
    loadStripe,
    StripeCardElement,
    Stripe,
} from "@stripe/stripe-js";

// ─── Stripe ───────────────────────────────────
let stripePromise: ReturnType<typeof loadStripe> | null = null;
function getStripe() {
    if (!stripePromise) {
        stripePromise = loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
    }
    return stripePromise;
}

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

// ─── Shared helpers ───────────────────────────
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

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 0",
                borderBottom: "1px solid #F3F4F6",
            }}
        >
            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>
                {label}
            </span>
            <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>
                {value}
            </span>
        </div>
    );
}

// ─── Inner page ───────────────────────────────
function DonatePageInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Partial<Record<keyof DonateFormData, string>>>({});

    // Stripe state
    const [stripeReady, setStripeReady] = useState(false);
    const [cardMounted, setCardMounted] = useState(false);
    const [cardError, setCardError] = useState("");
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState("");
    const [stripeObj, setStripeObj] = useState<Stripe | null>(null);
    const [cardEl, setCardEl] = useState<StripeCardElement | null>(null);

    const [form, setForm] = useState<DonateFormData>(() => {
        const amount = parseFloat(searchParams.get("amount") || "") || 50;
        const type = (searchParams.get("type") as DonationType) || "General";
        const freq = (searchParams.get("freq") as Frequency) || "one-time";
        const campaignId = searchParams.get("campaign") || "";
        return { ...defaultForm, amount, donationType: type, frequency: freq, campaignId };
    });

    const set = <K extends keyof DonateFormData>(k: K, v: DonateFormData[K]) =>
        setForm((p) => ({ ...p, [k]: v }));
    const clearError = (k: keyof DonateFormData) =>
        setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

    const activeAmount = form.customAmount ? parseFloat(form.customAmount) || 0 : form.amount;
    const giftAidBonus = calculateGiftAid(activeAmount);
    const impactText = impactEquivalents[form.amount] || null;
    const selectedCampaign = campaigns.find((c) => c.id === form.campaignId);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    // Mount Stripe card element when step 3 is reached
    useEffect(() => {
        if (step !== 3 || cardMounted) return;

        let mounted = true;

        getStripe().then((stripe) => {
            if (!stripe || !mounted) return;
            setStripeObj(stripe);

            const elements = stripe.elements({
                fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" }],
            });

            const card = elements.create("card", {
                style: {
                    base: {
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        color: "#111827",
                        "::placeholder": { color: "#9CA3AF" },
                    },
                    invalid: { color: "#EF4444" },
                },
                hidePostalCode: true,
            });

            const container = document.getElementById("card-element");
            if (container && mounted) {
                card.mount("#card-element");
                card.on("ready", () => setStripeReady(true));
                card.on("change", (e) => setCardError(e.error?.message || ""));
                setCardEl(card);
                setCardMounted(true);
            }
        });

        return () => { mounted = false; };
    }, [step, cardMounted]);

    // ── Step 2 validation ──────────────────────
    const validateStep2 = () => {
        const e: Partial<Record<keyof DonateFormData, string>> = {};
        if (!form.fullName.trim()) e.fullName = "Please enter your full name.";
        if (!form.email.trim() || !form.email.includes("@")) e.email = "Please enter a valid email address.";
        if (form.isDedication && !form.dedicationName.trim()) e.dedicationName = "Please enter a name for the dedication.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Step 3 pay ─────────────────────────────
    const handlePay = async () => {
        if (!stripeObj || !cardEl || paying) return;

        setPaying(true);
        setPayError("");

        try {
            // 1 — Create PaymentIntent on server
            const res = await fetch("/api/donate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: activeAmount,
                    frequency: form.frequency,
                    donationType: form.donationType,
                    campaignId: form.campaignId,
                    campaignTitle: selectedCampaign?.title || "General Fund",
                    donorName: form.fullName,
                    donorEmail: form.email,
                    giftAid: form.giftAid,
                    isDedication: form.isDedication,
                    dedicationType: form.dedicationType,
                    dedicationName: form.dedicationName,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.clientSecret) {
                setPayError(data.error || "Payment initialisation failed.");
                setPaying(false);
                return;
            }

            // 2 — Confirm card payment with Stripe
            const { error: stripeError, paymentIntent } = await stripeObj.confirmCardPayment(
                data.clientSecret,
                {
                    payment_method: {
                        card: cardEl,
                        billing_details: {
                            name: form.fullName,
                            email: form.email,
                            phone: form.phone || undefined,
                        },
                    },
                }
            );

            if (stripeError) {
                setPayError(stripeError.message || "Payment failed. Please try again.");
                setPaying(false);
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                // 3 — Redirect to confirmation
                const params = new URLSearchParams({
                    name: form.fullName,
                    amount: activeAmount.toString(),
                    type: form.donationType,
                    freq: form.frequency,
                    giftaid: form.giftAid ? "1" : "0",
                    campaign: selectedCampaign?.title || "General Fund",
                    ref: paymentIntent.id.slice(-8).toUpperCase(),
                });
                router.push(`/donate/confirmation?${params.toString()}`);
            }
        } catch {
            setPayError("Something went wrong. Please try again.");
            setPaying(false);
        }
    };

    // ── Shared card wrapper ────────────────────
    const card = (children: React.ReactNode) => (
        <div
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "1.25rem",
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07)",
                padding: "2.25rem",
            }}
        >
            {children}
        </div>
    );

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#F9FAFB",
                paddingTop: "5rem",
                paddingBottom: "5rem",
            }}
        >
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.5rem" }}>

                {/* Page header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>
                        Jaffna Muslim Association
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "0.75rem" }}>
                        Make a donation
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.6 }}>
                        100% of your donation reaches the ground in Jaffna.
                    </p>
                </div>

                <StepIndicator current={step} />

                {/* ═══════════════ STEP 1 ═══════════════ */}
                {step === 1 && card(
                    <>
                        {/* Frequency */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <FieldLabel>Frequency</FieldLabel>
                            <div style={{ display: "flex", backgroundColor: "#F3F4F6", borderRadius: "0.625rem", padding: "3px" }}>
                                {(["one-time", "monthly"] as Frequency[]).map((f) => (
                                    <button key={f} onClick={() => set("frequency", f)}
                                        style={{ flex: 1, padding: "0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", transition: "all 0.2s ease", backgroundColor: form.frequency === f ? "#0D5C6B" : "transparent", color: form.frequency === f ? "#ffffff" : "#6B7280", boxShadow: form.frequency === f ? "0 1px 4px rgba(0,0,0,0.12)" : "none" }}>
                                        {f === "one-time" ? "Give Once" : "Give Monthly"}
                                    </button>
                                ))}
                            </div>
                            {form.frequency === "monthly" && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#0D5C6B", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                    <CheckCircle size={13} aria-hidden="true" /> Monthly giving maximises long-term impact.
                                </p>
                            )}
                        </div>

                        {/* Amount */}
                        <div style={{ marginBottom: "1.25rem" }}>
                            <FieldLabel>Amount</FieldLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem", marginBottom: "0.625rem" }}>
                                {donationAmounts.map((amt) => {
                                    const sel = !form.customAmount && form.amount === amt;
                                    return (
                                        <button key={amt} onClick={() => { set("amount", amt); set("customAmount", ""); }}
                                            style={{ padding: "0.75rem", borderRadius: "0.5rem", border: `2px solid ${sel ? "#C9A84C" : "#E5E7EB"}`, cursor: "pointer", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", backgroundColor: sel ? "#FAF5E8" : "#ffffff", color: sel ? "#B08D35" : "#374151", transition: "all 0.15s ease", boxShadow: sel ? "0 0 0 3px rgba(201,168,76,0.12)" : "none" }}>
                                            £{amt}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#9CA3AF", pointerEvents: "none" }}>£</span>
                                <input type="number" min="1" placeholder="Enter your own amount" value={form.customAmount}
                                    onChange={(e) => { set("customAmount", e.target.value); set("amount", 0); }}
                                    style={{ ...inputStyle(!!form.customAmount), paddingLeft: "1.875rem" }}
                                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.customAmount ? "#C9A84C" : "#E5E7EB"; }} />
                            </div>
                        </div>

                        {impactText && (
                            <div style={{ backgroundColor: "#E8F4F6", borderRadius: "0.625rem", padding: "0.875rem 1rem", marginBottom: "1.75rem", borderLeft: "3px solid #0D5C6B" }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#0D5C6B", fontWeight: 500, lineHeight: 1.5 }}>{impactText}</p>
                            </div>
                        )}

                        {/* Donation type */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <FieldLabel>Donation Type</FieldLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }} className="type-grid">
                                {donationTypes.map(({ value, label, description }) => {
                                    const sel = form.donationType === value;
                                    return (
                                        <button key={value} onClick={() => set("donationType", value)}
                                            style={{ padding: "0.75rem 1rem", borderRadius: "0.625rem", border: `1.5px solid ${sel ? "#0D5C6B" : "#E5E7EB"}`, cursor: "pointer", backgroundColor: sel ? "#E8F4F6" : "#ffffff", textAlign: "left" as const, transition: "all 0.15s ease", boxShadow: sel ? "0 0 0 3px rgba(13,92,107,0.08)" : "none" }}>
                                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: sel ? "#0D5C6B" : "#374151", marginBottom: "0.125rem" }}>{label}</p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: sel ? "#0D5C6B" : "#9CA3AF", opacity: sel ? 0.8 : 1 }}>{description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Campaign */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <FieldLabel>Allocate to Campaign <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                            <select value={form.campaignId} onChange={(e) => set("campaignId", e.target.value)}
                                style={{ ...inputStyle(!!form.campaignId), appearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.875rem center", paddingRight: "2.5rem", cursor: "pointer", color: form.campaignId ? "#111827" : "#9CA3AF" }}>
                                <option value="">Where most needed (General Fund)</option>
                                {campaigns.filter((c) => c.status !== "completed").map((c) => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        {activeAmount >= 1 && (
                            <div style={{ backgroundColor: "#FAF5E8", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.75rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                <CheckCircle size={16} style={{ color: "#C9A84C", marginTop: "2px", flexShrink: 0 }} aria-hidden="true" />
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#92400E", marginBottom: "0.2rem" }}>Gift Aid could add {formatCurrency(giftAidBonus)} at no extra cost</p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#78350F", opacity: 0.75, lineHeight: 1.5 }}>If you&apos;re a UK taxpayer, JMA can reclaim 25% from HMRC. Confirm on the next step.</p>
                                </div>
                            </div>
                        )}

                        <button onClick={() => { if (activeAmount >= 1) setStep(2); }} disabled={activeAmount < 1}
                            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: activeAmount >= 1 ? "#C9A84C" : "#E5E7EB", color: activeAmount >= 1 ? "#ffffff" : "#9CA3AF", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: activeAmount >= 1 ? "pointer" : "not-allowed", transition: "background-color 0.2s ease" }}
                            onMouseEnter={(e) => { if (activeAmount >= 1) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { if (activeAmount >= 1) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}>
                            Continue to Your Details <ArrowRight size={17} aria-hidden="true" />
                        </button>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "1rem" }}>
                            <Shield size={12} aria-hidden="true" /> Secure payment via Stripe · SSL encrypted · UK Registered Charity
                        </div>
                    </>
                )}

                {/* ═══════════════ STEP 2 ═══════════════ */}
                {step === 2 && card(
                    <>
                        {/* Summary pill */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#E8F4F6", borderRadius: "0.75rem", padding: "0.875rem 1.125rem", marginBottom: "2rem" }}>
                            <div>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#0D5C6B", fontWeight: 600, marginBottom: "0.125rem" }}>Donating</p>
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.375rem", color: "#0D5C6B", lineHeight: 1 }}>
                                    {formatCurrency(activeAmount)}
                                    {form.frequency === "monthly" && <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "0.875rem", opacity: 0.7 }}> / month</span>}
                                </p>
                            </div>
                            <div style={{ textAlign: "right" as const }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#0D5C6B", opacity: 0.7, marginBottom: "0.125rem" }}>Type</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#0D5C6B" }}>{form.donationType}</p>
                            </div>
                            <button onClick={() => setStep(1)} style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#0D5C6B", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textDecorationColor: "#C9A84C", padding: 0 }}>Edit</button>
                        </div>

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

                        {/* Email */}
                        <div style={{ marginBottom: "1.25rem" }}>
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
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "#9CA3AF", marginTop: "0.375rem" }}>Your donation receipt will be sent to this address.</p>
                        </div>

                        {/* Phone */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <FieldLabel>Phone Number <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                            <div style={{ position: "relative" }}>
                                <Phone size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                <input type="tel" placeholder="+44 7700 000000" value={form.phone}
                                    onChange={(e) => set("phone", e.target.value)}
                                    style={{ ...inputStyle(!!form.phone), paddingLeft: "2.5rem" }}
                                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = form.phone ? "#0D5C6B" : "#E5E7EB"; }} />
                            </div>
                        </div>

                        {/* Gift Aid */}
                        <div style={{ backgroundColor: form.giftAid ? "#E8F4F6" : "#F9FAFB", border: `1.5px solid ${form.giftAid ? "#0D5C6B" : "#E5E7EB"}`, borderRadius: "0.875rem", padding: "1.25rem", marginBottom: "1.5rem", transition: "all 0.2s ease", cursor: "pointer" }}
                            onClick={() => set("giftAid", !form.giftAid)}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                                <div style={{ width: "20px", height: "20px", borderRadius: "0.375rem", border: `2px solid ${form.giftAid ? "#0D5C6B" : "#D1D5DB"}`, backgroundColor: form.giftAid ? "#0D5C6B" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", transition: "all 0.2s ease" }}>
                                    {form.giftAid && <CheckCircle size={12} style={{ color: "#ffffff" }} aria-hidden="true" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.375rem" }}>
                                        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>Boost with Gift Aid</p>
                                        {form.giftAid && <span style={{ backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", padding: "0.2rem 0.625rem", borderRadius: "9999px" }}>+{formatCurrency(giftAidBonus)} added</span>}
                                    </div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.6 }}>
                                        I am a UK taxpayer and understand that if I pay less Income Tax or Capital Gains Tax than the amount of Gift Aid claimed on all my donations, it is my responsibility to pay any difference. JMA will reclaim <strong style={{ color: "#0D5C6B" }}>{formatCurrency(giftAidBonus)}</strong> at no cost to you.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Dedication */}
                        <div style={{ marginBottom: "1.75rem" }}>
                            <div style={{ backgroundColor: form.isDedication ? "#FAF5E8" : "#F9FAFB", border: `1.5px solid ${form.isDedication ? "#C9A84C" : "#E5E7EB"}`, borderRadius: form.isDedication ? "0.875rem 0.875rem 0 0" : "0.875rem", padding: "1.125rem 1.25rem", cursor: "pointer", transition: "all 0.2s ease" }}
                                onClick={() => set("isDedication", !form.isDedication)}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: form.isDedication ? "rgba(201,168,76,0.15)" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s ease" }}>
                                        <Heart size={16} style={{ color: form.isDedication ? "#C9A84C" : "#9CA3AF" }} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.125rem" }}>Dedicate this donation</p>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>In memory of or on behalf of a loved one</p>
                                    </div>
                                    <div style={{ marginLeft: "auto", width: "20px", height: "20px", borderRadius: "0.375rem", border: `2px solid ${form.isDedication ? "#C9A84C" : "#D1D5DB"}`, backgroundColor: form.isDedication ? "#C9A84C" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s ease" }}>
                                        {form.isDedication && <CheckCircle size={12} style={{ color: "#ffffff" }} aria-hidden="true" />}
                                    </div>
                                </div>
                            </div>

                            {form.isDedication && (
                                <div style={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderTop: "none", borderRadius: "0 0 0.875rem 0.875rem", padding: "1.25rem", display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        {(["In Memory of", "On Behalf of"] as const).map((t) => (
                                            <button key={t} onClick={(e) => { e.stopPropagation(); set("dedicationType", t); }}
                                                style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: `1.5px solid ${form.dedicationType === t ? "#C9A84C" : "#E5E7EB"}`, backgroundColor: form.dedicationType === t ? "#FAF5E8" : "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: form.dedicationType === t ? "#B08D35" : "#6B7280", cursor: "pointer", transition: "all 0.15s ease" }}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                    <div>
                                        <FieldLabel required>{form.dedicationType === "In Memory of" ? "Name of the deceased" : "Name of the person"}</FieldLabel>
                                        <input type="text" placeholder="Full name" value={form.dedicationName}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => { set("dedicationName", e.target.value); clearError("dedicationName"); }}
                                            style={inputStyle(!!form.dedicationName, !!errors.dedicationName)}
                                            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.dedicationName ? "#EF4444" : form.dedicationName ? "#0D5C6B" : "#E5E7EB"; }} />
                                        {errors.dedicationName && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>{errors.dedicationName}</p>}
                                    </div>
                                    <div>
                                        <FieldLabel>Message <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                                        <textarea placeholder="A short message or du'a..." value={form.dedicationMessage}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => set("dedicationMessage", e.target.value)}
                                            rows={3}
                                            style={{ ...inputStyle(!!form.dedicationMessage), resize: "vertical" as const, lineHeight: 1.6, fontFamily: "var(--font-inter)" }}
                                            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }}
                                            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = form.dedicationMessage ? "#0D5C6B" : "#E5E7EB"; }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Nav */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={() => setStep(1)}
                                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.9375rem 1.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: "pointer", transition: "border-color 0.15s ease", flexShrink: 0 }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#9CA3AF"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB"; }}>
                                <ArrowLeft size={16} aria-hidden="true" /> Back
                            </button>
                            <button onClick={() => { if (validateStep2()) setStep(3); }}
                                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: "pointer", transition: "background-color 0.2s ease" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}>
                                Review Donation <ArrowRight size={17} aria-hidden="true" />
                            </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "1rem" }}>
                            <Shield size={12} aria-hidden="true" /> Secure payment via Stripe · SSL encrypted · UK Registered Charity
                        </div>
                    </>
                )}

                {/* ═══════════════ STEP 3 ═══════════════ */}
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

                        {/* Gift Aid confirmation banner */}
                        {form.giftAid && (
                            <div style={{ backgroundColor: "#E8F4F6", border: "1px solid rgba(13,92,107,0.2)", borderRadius: "0.75rem", padding: "0.875rem 1.125rem", marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                <CheckCircle size={16} style={{ color: "#0D5C6B", flexShrink: 0 }} aria-hidden="true" />
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#0D5C6B", fontWeight: 500 }}>
                                    Gift Aid confirmed — JMA will reclaim <strong>{formatCurrency(giftAidBonus)}</strong> from HMRC on your behalf.
                                </p>
                            </div>
                        )}

                        {/* Card element */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <FieldLabel required>Card Details</FieldLabel>
                            <div
                                id="card-element"
                                style={{
                                    padding: "0.875rem 1rem",
                                    borderRadius: "0.5rem",
                                    border: `1.5px solid ${cardError ? "#EF4444" : "#E5E7EB"}`,
                                    backgroundColor: "#ffffff",
                                    transition: "border-color 0.15s ease",
                                    minHeight: "48px",
                                }}
                            />
                            {!stripeReady && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", marginTop: "0.375rem" }}>
                                    Loading secure card form…
                                </p>
                            )}
                            {cardError && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                    <AlertCircle size={13} aria-hidden="true" /> {cardError}
                                </p>
                            )}
                        </div>

                        {/* Stripe trust note */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "0.625rem", padding: "0.75rem 1rem", marginBottom: "1.75rem" }}>
                            <Lock size={14} style={{ color: "#6B7280", flexShrink: 0 }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.5 }}>
                                Your payment is processed securely by <strong>Stripe</strong>. JMA never sees or stores your card details.
                            </p>
                        </div>

                        {/* Pay error */}
                        {payError && (
                            <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem", padding: "0.875rem 1rem", marginBottom: "1.25rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                                <AlertCircle size={16} style={{ color: "#DC2626", flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#DC2626" }}>{payError}</p>
                            </div>
                        )}

                        {/* Nav */}
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button onClick={() => setStep(2)} disabled={paying}
                                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.9375rem 1.25rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", color: "#374151", cursor: paying ? "not-allowed" : "pointer", flexShrink: 0, opacity: paying ? 0.5 : 1 }}>
                                <ArrowLeft size={16} aria-hidden="true" /> Back
                            </button>

                            <button onClick={handlePay} disabled={paying || !stripeReady}
                                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: paying || !stripeReady ? "#B08D35" : "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: paying || !stripeReady ? "not-allowed" : "pointer", transition: "background-color 0.2s ease" }}
                                onMouseEnter={(e) => { if (!paying && stripeReady) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                onMouseLeave={(e) => { if (!paying && stripeReady) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}>
                                {paying ? (
                                    <>Processing…</>
                                ) : (
                                    <>
                                        <Lock size={15} aria-hidden="true" />
                                        Pay {formatCurrency(activeAmount)}{form.frequency === "monthly" ? " / month" : ""} securely
                                    </>
                                )}
                            </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginTop: "1rem" }}>
                            <Shield size={12} aria-hidden="true" /> Stripe secured · 256-bit SSL · UK Registered Charity No. XXXXXX
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