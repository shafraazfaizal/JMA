"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    ArrowRight, Info, ChevronDown, Coins,
    Gem, Briefcase, HandCoins, MinusCircle,
    CheckCircle, ScrollText,
} from "lucide-react";

// Nisab — based on silver, updated periodically. Fixed approximate for now.
const NISAB_GBP = 337;
const ZAKAT_RATE = 0.025;

interface ZakatInputs {
    cashSavings: string;
    goldSilver: string;
    businessAssets: string;
    moneyOwed: string;
    debts: string;
}

const fields: {
    key: keyof ZakatInputs;
    icon: typeof Coins;
    label: string;
    hint: string;
    deduction?: boolean;
}[] = [
        { key: "cashSavings", icon: Coins, label: "Cash & Bank Savings", hint: "All cash at home and in bank accounts, including savings accounts" },
        { key: "goldSilver", icon: Gem, label: "Gold & Silver Value", hint: "Current market value of gold and silver you own, including jewellery" },
        { key: "businessAssets", icon: Briefcase, label: "Business Assets & Stocks", hint: "Stock inventory, shares, investments, and receivables" },
        { key: "moneyOwed", icon: HandCoins, label: "Money Owed to You", hint: "Loans you have given out that you expect to be repaid" },
        { key: "debts", icon: MinusCircle, label: "Outstanding Debts", hint: "Debts you owe that are due within the year", deduction: true },
    ];

const faqs = [
    {
        q: "What is Zakat and why is it obligatory?",
        a: "Zakat is the third pillar of Islam — an obligatory annual payment of 2.5% on qualifying wealth held above the Nisab threshold for one lunar year. It purifies wealth and redistributes it to those in need.",
    },
    {
        q: "What is the Nisab threshold?",
        a: "Nisab is the minimum amount of wealth a Muslim must have before Zakat becomes obligatory. It is calculated using the value of either 87.48g of gold or 612.36g of silver — most scholars recommend using the silver value as it is generally lower, making Zakat accessible to more people in need.",
    },
    {
        q: "Do I need to hold the wealth for a full year?",
        a: "Yes. Zakat is due on wealth that has been in your possession for one full lunar year (Hawl) and remains above the Nisab threshold at the time of payment.",
    },
    {
        q: "What assets are NOT zakatable?",
        a: "Your primary residence, personal vehicle, clothing, furniture, and other items for personal use are not subject to Zakat. Zakat applies to wealth that is saved, invested, or held for growth — not items used for daily living.",
    },
    {
        q: "Can I pay Zakat in instalments?",
        a: "Yes, you may pay your Zakat in instalments throughout the year, as long as the full amount owed is paid before your next Zakat anniversary (Hawl date).",
    },
    {
        q: "How does JMA distribute Zakat?",
        a: "JMA distributes Zakat directly to eligible recipients in Jaffna across the categories defined in the Quran (Surah At-Tawbah 9:60) — primarily the poor, the needy, and those in debt. Every distribution is verified at a grassroots level.",
    },
    {
        q: "Is my Zakat payment eligible for Gift Aid?",
        a: "No. Gift Aid can only be claimed on donations, not on obligatory Zakat payments, as Zakat is a religious duty rather than a voluntary gift. However, your Zakat is still fully tax-deductible where applicable under UK charity law.",
    },
];

const eightCategories = [
    "The poor (Al-Fuqara)",
    "The needy (Al-Masakin)",
    "Zakat administrators",
    "Those whose hearts are to be reconciled",
    "Freeing those in bondage",
    "Those in debt (Al-Gharimin)",
    "In the cause of Allah (Fi Sabilillah)",
    "The stranded traveller (Ibn al-Sabil)",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
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
        </label>
    );
}

export default function ZakatPage() {
    const [inputs, setInputs] = useState<ZakatInputs>({
        cashSavings: "", goldSilver: "", businessAssets: "", moneyOwed: "", debts: "",
    });
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const result = useMemo(() => {
        const parse = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
        const total =
            parse(inputs.cashSavings) + parse(inputs.goldSilver) +
            parse(inputs.businessAssets) + parse(inputs.moneyOwed) - parse(inputs.debts);
        const zakatable = Math.max(total, 0);
        const isAbove = zakatable >= NISAB_GBP;
        const zakat = isAbove ? zakatable * ZAKAT_RATE : 0;
        return { zakatable, isAbove, zakat };
    }, [inputs]);

    const hasAnyInput = Object.values(inputs).some((v) => v !== "");

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section
                style={{
                    backgroundColor: "#073D47",
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
              radial-gradient(circle at 95% 10%, rgba(201,168,76,0.08) 0%, transparent 45%),
              radial-gradient(circle at 5% 90%, rgba(201,168,76,0.05) 0%, transparent 40%)
            `,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Pay Your Zakat
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
                        Calculate & fulfil your{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>Zakat</span>
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
                        Use our calculator below to determine your Zakat obligation, then pay directly — distributed to verified families in Jaffna.
                    </p>
                </div>
            </section>

            {/* ── Calculator ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "1.25rem",
                            border: "1px solid #E5E7EB",
                            boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)",
                            padding: "2.5rem",
                        }}
                        className="calc-wrapper"
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2.5rem" }} className="calc-grid">

                            {/* Inputs */}
                            <div>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1.5rem" }}>
                                    Enter your assets
                                </h2>

                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                                    {fields.map(({ key, icon: Icon, label, hint, deduction }) => (
                                        <div key={key}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <Icon size={15} style={{ color: deduction ? "#DC2626" : "#0D5C6B" }} aria-hidden="true" />
                                                    <FieldLabel>
                                                        <span style={{ color: deduction ? "#DC2626" : "#374151" }}>{label}</span>
                                                        {deduction && <span style={{ marginLeft: "0.375rem", fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const }}>(deducted)</span>}
                                                    </FieldLabel>
                                                </div>
                                                <div title={hint} style={{ cursor: "help", color: "#D1D5DB" }}>
                                                    <Info size={14} aria-hidden="true" />
                                                </div>
                                            </div>
                                            <div style={{ position: "relative" }}>
                                                <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9rem", color: "#9CA3AF", pointerEvents: "none" }}>£</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0.00"
                                                    value={inputs[key]}
                                                    onChange={(e) => setInputs((p) => ({ ...p, [key]: e.target.value }))}
                                                    style={{
                                                        width: "100%",
                                                        padding: "0.75rem 1rem 0.75rem 1.75rem",
                                                        borderRadius: "0.5rem",
                                                        border: `1.5px solid ${inputs[key] ? (deduction ? "#FECACA" : "#0D5C6B") : "#E5E7EB"}`,
                                                        fontFamily: "var(--font-jakarta)",
                                                        fontWeight: 600,
                                                        fontSize: "0.9375rem",
                                                        color: "#111827",
                                                        outline: "none",
                                                        transition: "border-color 0.15s ease",
                                                        boxSizing: "border-box" as const,
                                                    }}
                                                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = deduction ? "#DC2626" : "#0D5C6B"; }}
                                                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = inputs[key] ? (deduction ? "#FECACA" : "#0D5C6B") : "#E5E7EB"; }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", marginTop: "1.25rem", lineHeight: 1.6 }}>
                                    Nisab threshold (silver standard): <strong style={{ color: "#6B7280" }}>{fmt(NISAB_GBP)}</strong>. This figure is approximate — for precise Nisab on the day of payment, consult current silver spot prices.
                                </p>
                            </div>

                            {/* Result panel */}
                            <div>
                                <div
                                    style={{
                                        backgroundColor: hasAnyInput ? (result.isAbove ? "#FAF5E8" : "#F9FAFB") : "#F9FAFB",
                                        border: `1.5px solid ${hasAnyInput ? (result.isAbove ? "rgba(201,168,76,0.4)" : "#E5E7EB") : "#E5E7EB"}`,
                                        borderRadius: "1rem",
                                        padding: "1.75rem",
                                        textAlign: "center" as const,
                                        transition: "all 0.3s ease",
                                        position: "sticky",
                                        top: "90px",
                                    }}
                                >
                                    {!hasAnyInput ? (
                                        <>
                                            <Coins size={32} style={{ color: "#D1D5DB", margin: "0 auto 0.875rem" }} aria-hidden="true" />
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#9CA3AF", lineHeight: 1.6 }}>
                                                Enter your assets to calculate your Zakat obligation
                                            </p>
                                        </>
                                    ) : !result.isAbove ? (
                                        <>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#374151", marginBottom: "0.5rem" }}>
                                                Below Nisab threshold
                                            </p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", lineHeight: 1.6 }}>
                                                Your zakatable wealth ({fmt(result.zakatable)}) is below the Nisab of {fmt(NISAB_GBP)}. Zakat is not yet obligatory for you.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#B08D35", marginBottom: "0.625rem" }}>
                                                Your Zakat is
                                            </p>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "2.5rem", color: "#B08D35", lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
                                                {fmt(result.zakat)}
                                            </p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#92400E", opacity: 0.75, marginBottom: "1.5rem" }}>
                                                2.5% of {fmt(result.zakatable)} zakatable wealth
                                            </p>

                                            <Link
                                                href={`/donate?amount=${result.zakat.toFixed(2)}&type=Zakat`}
                                                style={{
                                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                                    padding: "0.875rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff",
                                                    fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none",
                                                    transition: "background-color 0.2s ease",
                                                }}
                                                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                                                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                                            >
                                                Pay {fmt(result.zakat)} Zakat
                                                <ArrowRight size={16} aria-hidden="true" />
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── What is Zakat / 8 categories ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div
                    style={{ maxWidth: "80rem", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}
                    className="education-grid"
                >
                    {/* Left */}
                    <div>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.75rem" }}>
                            Understanding Zakat
                        </p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1.25rem" }}>
                            The third pillar of Islam
                        </h2>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", lineHeight: 1.8, color: "#4B5563", marginBottom: "1.125rem" }}>
                            Zakat is not charity in the voluntary sense — it is an obligation upon every Muslim whose wealth exceeds the Nisab threshold for a full lunar year. It represents 2.5% of qualifying wealth, given annually to purify what remains.
                        </p>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", lineHeight: 1.8, color: "#4B5563", marginBottom: "2rem" }}>
                            JMA ensures every pound of Zakat is distributed strictly within the eight categories defined in the Quran, with full verification at a grassroots level in Jaffna.
                        </p>

                        {/* Quranic verse */}
                        <div style={{ borderLeft: "3px solid #C9A84C", paddingLeft: "1.25rem", marginBottom: "2rem" }}>
                            <p style={{ fontFamily: "var(--font-noto)", fontStyle: "italic", fontSize: "1rem", lineHeight: 1.75, color: "#374151", marginBottom: "0.5rem" }}>
                                &ldquo;Take from their wealth a charity by which you purify them and cause them increase.&rdquo;
                            </p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "#9CA3AF" }}>— Surah At-Tawbah, 9:103</p>
                        </div>
                    </div>

                    {/* Right — 8 categories */}
                    <div>
                        <div
                            style={{
                                backgroundColor: "#E8F4F6",
                                borderRadius: "1.25rem",
                                padding: "2rem",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
                                <ScrollText size={18} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#0D5C6B" }}>
                                    The Eight Categories
                                </h3>
                            </div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#0D5C6B", opacity: 0.7, marginBottom: "1.25rem", lineHeight: 1.6 }}>
                                Defined in Surah At-Tawbah (9:60), Zakat may only be given to these recipients:
                            </p>
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                                {eightCategories.map((cat, i) => (
                                    <div key={cat} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div
                                            style={{
                                                width: "24px", height: "24px", borderRadius: "0.375rem",
                                                backgroundColor: "#0D5C6B", color: "#ffffff",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.7rem",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#0D5C6B", fontWeight: 500 }}>{cat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>
                            Common Questions
                        </p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em" }}>
                            Zakat FAQs
                        </h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                        {faqs.map(({ q, a }, i) => {
                            const isOpen = openFaq === i;
                            return (
                                <div
                                    key={q}
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "0.875rem",
                                        border: `1px solid ${isOpen ? "#0D5C6B" : "#E5E7EB"}`,
                                        overflow: "hidden",
                                        transition: "border-color 0.2s ease",
                                    }}
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : i)}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "1rem",
                                            padding: "1.125rem 1.375rem",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            textAlign: "left" as const,
                                        }}
                                    >
                                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: isOpen ? "#0D5C6B" : "#111827" }}>
                                            {q}
                                        </span>
                                        <ChevronDown
                                            size={18}
                                            style={{
                                                color: isOpen ? "#0D5C6B" : "#9CA3AF",
                                                flexShrink: 0,
                                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s ease",
                                            }}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    {isOpen && (
                                        <div style={{ padding: "0 1.375rem 1.25rem" }}>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.75 }}>
                                                {a}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section style={{ backgroundColor: "#073D47", padding: "5rem 1.5rem", textAlign: "center" as const, position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)` }} />
                <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <CheckCircle size={36} style={{ color: "#C9A84C", margin: "0 auto 1.25rem" }} aria-hidden="true" />
                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem" }}>
                        Fulfil your obligation today
                    </h2>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "2rem" }}>
                        Calculate above, or pay a known amount directly. Every pound reaches verified recipients in Jaffna.
                    </p>
                    <Link
                        href="/donate?type=Zakat"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                    >
                        Pay Zakat Now
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </section>

            <style>{`
        @media (max-width: 767px) {
          .calc-grid       { grid-template-columns: 1fr !important; }
          .education-grid  { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
        @media (max-width: 639px) {
          .calc-wrapper { padding: 1.5rem !important; }
        }
      `}</style>
        </main>
    );
}