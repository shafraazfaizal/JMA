"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

// Nisab threshold based on silver (612.36g × ~£0.55/g ≈ £337)
// Using a fixed approximate — live price fetched on /zakat page
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
    label: string;
    hint: string;
    deduction?: boolean;
}[] = [
        {
            key: "cashSavings",
            label: "Cash & Bank Savings",
            hint: "All cash at home and in bank accounts",
        },
        {
            key: "goldSilver",
            label: "Gold & Silver Value",
            hint: "Current market value of gold and silver you own",
        },
        {
            key: "businessAssets",
            label: "Business Assets & Stocks",
            hint: "Stock inventory, investments, and receivables",
        },
        {
            key: "moneyOwed",
            label: "Money Owed to You",
            hint: "Loans given out that you expect to be repaid",
        },
        {
            key: "debts",
            label: "Outstanding Debts",
            hint: "Debts you owe that are due within the year",
            deduction: true,
        },
    ];

export default function ZakatSection() {
    const [inputs, setInputs] = useState<ZakatInputs>({
        cashSavings: "",
        goldSilver: "",
        businessAssets: "",
        moneyOwed: "",
        debts: "",
    });

    const result = useMemo(() => {
        const parse = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
        const total =
            parse(inputs.cashSavings) +
            parse(inputs.goldSilver) +
            parse(inputs.businessAssets) +
            parse(inputs.moneyOwed) -
            parse(inputs.debts);

        const zakatable = Math.max(total, 0);
        const isAbove = zakatable >= NISAB_GBP;
        const zakat = isAbove ? zakatable * ZAKAT_RATE : 0;

        return { zakatable, isAbove, zakat };
    }, [inputs]);

    const hasAnyInput = Object.values(inputs).some((v) => v !== "");

    const fmt = (n: number) =>
        new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(n);

    return (
        <section
            style={{
                backgroundColor: "#073D47",
                padding: "6rem 1.5rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle background accents */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
            radial-gradient(circle at 95% 10%, rgba(201,168,76,0.08) 0%, transparent 45%),
            radial-gradient(circle at 5% 90%,  rgba(201,168,76,0.05) 0%, transparent 40%)
          `,
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "5rem",
                    alignItems: "start",
                }}
                className="zakat-grid"
            >
                {/* ── Left — explanation ── */}
                <div>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "#C9A84C",
                            marginBottom: "0.875rem",
                        }}
                    >
                        Zakat Calculator
                    </p>

                    <h2
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                            color: "#ffffff",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            marginBottom: "1.375rem",
                        }}
                    >
                        Calculate & pay your{" "}
                        <span
                            style={{
                                color: "#C9A84C",
                                fontStyle: "italic",
                                fontFamily: "var(--font-noto)",
                            }}
                        >
                            Zakat
                        </span>
                    </h2>

                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1rem",
                            lineHeight: 1.8,
                            color: "rgba(255,255,255,0.65)",
                            marginBottom: "2rem",
                        }}
                    >
                        Zakat is one of the five pillars of Islam — an obligation to give
                        2.5% of your eligible wealth to those in need. JMA distributes
                        Zakat directly to eligible families in Jaffna with full
                        transparency.
                    </p>

                    {/* 3 bullet points */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: "1rem",
                            marginBottom: "2.5rem",
                        }}
                    >
                        {[
                            {
                                title: "What qualifies",
                                body: "Cash, gold, silver, business stock, investments, and money owed to you — held for one lunar year (Hawl).",
                            },
                            {
                                title: "Nisab threshold",
                                body: `Your total zakatable wealth must reach the Nisab (currently approx. £${NISAB_GBP}) before Zakat becomes obligatory.`,
                            },
                            {
                                title: "Who receives it",
                                body: "The eight categories defined in Surah At-Tawbah (9:60) — JMA focuses on the poor, the needy, and those in debt.",
                            },
                        ].map(({ title, body }) => (
                            <div
                                key={title}
                                style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}
                            >
                                <div
                                    style={{
                                        width: "6px",
                                        height: "6px",
                                        borderRadius: "50%",
                                        backgroundColor: "#C9A84C",
                                        flexShrink: 0,
                                        marginTop: "0.45rem",
                                    }}
                                />
                                <div>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-inter)",
                                            fontWeight: 600,
                                            fontSize: "0.9rem",
                                            color: "#ffffff",
                                            marginBottom: "0.2rem",
                                        }}
                                    >
                                        {title}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-inter)",
                                            fontSize: "0.875rem",
                                            color: "rgba(255,255,255,0.55)",
                                            lineHeight: 1.65,
                                        }}
                                    >
                                        {body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quranic verse */}
                    <div
                        style={{
                            borderLeft: "2px solid rgba(201,168,76,0.5)",
                            paddingLeft: "1.25rem",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "var(--font-noto)",
                                fontStyle: "italic",
                                fontSize: "1rem",
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.7)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            "Take from their wealth a charity by which you purify them and
                            cause them increase."
                        </p>
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.8rem",
                                color: "rgba(255,255,255,0.35)",
                            }}
                        >
                            — Surah At-Tawbah, 9:103
                        </p>
                    </div>
                </div>

                {/* ── Right — calculator ── */}
                <div
                    style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "1.25rem",
                        padding: "2.25rem",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 700,
                            fontSize: "1.0625rem",
                            color: "#ffffff",
                            marginBottom: "1.75rem",
                        }}
                    >
                        Enter your assets
                    </p>

                    {/* Input fields */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: "1rem",
                            marginBottom: "1.75rem",
                        }}
                    >
                        {fields.map(({ key, label, hint, deduction }) => (
                            <div key={key}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: "0.375rem",
                                    }}
                                >
                                    <label
                                        htmlFor={key}
                                        style={{
                                            fontFamily: "var(--font-inter)",
                                            fontWeight: 500,
                                            fontSize: "0.875rem",
                                            color: deduction
                                                ? "rgba(255,150,150,0.85)"
                                                : "rgba(255,255,255,0.8)",
                                        }}
                                    >
                                        {label}
                                        {deduction && (
                                            <span
                                                style={{
                                                    marginLeft: "0.375rem",
                                                    fontSize: "0.75rem",
                                                    color: "rgba(255,150,150,0.6)",
                                                }}
                                            >
                                                (deducted)
                                            </span>
                                        )}
                                    </label>
                                    <div
                                        title={hint}
                                        style={{ cursor: "help", color: "rgba(255,255,255,0.25)" }}
                                    >
                                        <Info size={13} aria-hidden="true" />
                                    </div>
                                </div>

                                <div style={{ position: "relative" }}>
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "0.875rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            fontFamily: "var(--font-jakarta)",
                                            fontWeight: 700,
                                            fontSize: "0.9rem",
                                            color: "rgba(255,255,255,0.4)",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        £
                                    </span>
                                    <input
                                        id={key}
                                        type="number"
                                        min="0"
                                        placeholder="0.00"
                                        value={inputs[key]}
                                        onChange={(e) =>
                                            setInputs((prev) => ({ ...prev, [key]: e.target.value }))
                                        }
                                        style={{
                                            width: "100%",
                                            padding: "0.6875rem 0.875rem 0.6875rem 1.75rem",
                                            borderRadius: "0.5rem",
                                            border: `1.5px solid ${inputs[key]
                                                    ? "rgba(201,168,76,0.6)"
                                                    : "rgba(255,255,255,0.12)"
                                                }`,
                                            backgroundColor: "rgba(255,255,255,0.06)",
                                            fontFamily: "var(--font-jakarta)",
                                            fontWeight: 600,
                                            fontSize: "0.9375rem",
                                            color: "#ffffff",
                                            outline: "none",
                                            transition: "border-color 0.15s ease",
                                        }}
                                        onFocus={(e) => {
                                            (e.target as HTMLInputElement).style.borderColor =
                                                "rgba(201,168,76,0.9)";
                                        }}
                                        onBlur={(e) => {
                                            (e.target as HTMLInputElement).style.borderColor = inputs[
                                                key
                                            ]
                                                ? "rgba(201,168,76,0.6)"
                                                : "rgba(255,255,255,0.12)";
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            height: "1px",
                            backgroundColor: "rgba(255,255,255,0.08)",
                            marginBottom: "1.5rem",
                        }}
                    />

                    {/* Result */}
                    <div
                        style={{
                            backgroundColor: hasAnyInput
                                ? result.isAbove
                                    ? "rgba(201,168,76,0.12)"
                                    : "rgba(255,255,255,0.05)"
                                : "rgba(255,255,255,0.03)",
                            border: `1.5px solid ${hasAnyInput
                                    ? result.isAbove
                                        ? "rgba(201,168,76,0.4)"
                                        : "rgba(255,255,255,0.1)"
                                    : "rgba(255,255,255,0.07)"
                                }`,
                            borderRadius: "0.75rem",
                            padding: "1.375rem",
                            marginBottom: "1.25rem",
                            textAlign: "center" as const,
                            transition: "all 0.3s ease",
                        }}
                    >
                        {!hasAnyInput ? (
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.875rem",
                                    color: "rgba(255,255,255,0.35)",
                                }}
                            >
                                Enter your assets above to calculate
                            </p>
                        ) : !result.isAbove ? (
                            <>
                                <p
                                    style={{
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        color: "rgba(255,255,255,0.75)",
                                        marginBottom: "0.375rem",
                                    }}
                                >
                                    Below Nisab threshold
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.8125rem",
                                        color: "rgba(255,255,255,0.4)",
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Your zakatable wealth ({fmt(result.zakatable)}) is below the
                                    Nisab of {fmt(NISAB_GBP)}. Zakat is not yet obligatory.
                                </p>
                            </>
                        ) : (
                            <>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase" as const,
                                        color: "#C9A84C",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Your Zakat is
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 800,
                                        fontSize: "2.5rem",
                                        color: "#C9A84C",
                                        lineHeight: 1,
                                        letterSpacing: "-0.02em",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    {fmt(result.zakat)}
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.8125rem",
                                        color: "rgba(255,255,255,0.4)",
                                    }}
                                >
                                    2.5% of {fmt(result.zakatable)} zakatable wealth
                                </p>
                            </>
                        )}
                    </div>

                    {/* CTA */}
                    <Link
                        href={
                            result.isAbove && hasAnyInput
                                ? `/donate?amount=${result.zakat.toFixed(2)}&type=Zakat`
                                : "/zakat"
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            padding: "0.875rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#C9A84C",
                            color: "#ffffff",
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            textDecoration: "none",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                                "#B08D35";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                                "#C9A84C";
                        }}
                    >
                        {result.isAbove && hasAnyInput
                            ? `Pay ${fmt(result.zakat)} Zakat through JMA`
                            : "Learn more about Zakat"}
                        <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                </div>
            </div>

            <style>{`
        @media (max-width: 767px) {
          .zakat-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
        </section>
    );
}