"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ChevronDown } from "lucide-react";
import { donationAmounts, impactEquivalents } from "@/data/site";
import { formatCurrency, calculateGiftAid } from "@/lib/utils";

type Frequency = "one-time" | "monthly";
type DonationType =
    | "General"
    | "Zakat"
    | "Sadaqah"
    | "Qurbani"
    | "In Memory";

const donationTypes: DonationType[] = [
    "General",
    "Zakat",
    "Sadaqah",
    "Qurbani",
    "In Memory",
];

export default function DonationSection() {
    const [frequency, setFrequency] = useState<Frequency>("one-time");
    const [selectedAmount, setSelectedAmount] = useState<number>(50);
    const [customAmount, setCustomAmount] = useState("");
    const [donationType, setDonationType] = useState<DonationType>("General");
    const [giftAid, setGiftAid] = useState(false);

    const activeAmount = customAmount
        ? parseFloat(customAmount) || 0
        : selectedAmount;

    const giftAidBonus = calculateGiftAid(activeAmount);

    const impactText =
        impactEquivalents[selectedAmount] ||
        (activeAmount > 0
            ? `Your gift of ${formatCurrency(activeAmount)} makes a real difference`
            : "Select an amount to see your impact");

    return (
        <section
            style={{
                backgroundColor: "#ffffff",
                padding: "5rem 1.5rem",
            }}
        >
            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4rem",
                    alignItems: "start",
                }}
                className="donation-grid"
            >
                {/* Left — impact copy */}
                <div>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "#C9A84C",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Make a Difference
                    </p>

                    <h2
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                            color: "#111827",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            marginBottom: "1.25rem",
                        }}
                    >
                        Every pound you give changes lives in Jaffna
                    </h2>

                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1rem",
                            lineHeight: 1.75,
                            color: "#6B7280",
                            marginBottom: "2rem",
                        }}
                    >
                        100% of your donation reaches the ground. No admin fees deducted — our UK volunteers cover all operating costs so every penny goes directly to families in Jaffna.
                    </p>

                    {/* Impact equivalents */}
                    <div
                        style={{
                            backgroundColor: "#E8F4F6",
                            borderRadius: "0.875rem",
                            padding: "1.5rem",
                            borderLeft: "3px solid #0D5C6B",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase" as const,
                                color: "#0D5C6B",
                                marginBottom: "0.625rem",
                            }}
                        >
                            {formatCurrency(activeAmount || 0)} could
                        </p>
                        <p
                            style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 600,
                                fontSize: "1.0625rem",
                                color: "#0D5C6B",
                                lineHeight: 1.5,
                                transition: "opacity 0.2s ease",
                            }}
                        >
                            {impactText}
                        </p>
                    </div>

                    {/* Blockquote */}
                    <blockquote
                        style={{
                            marginTop: "2rem",
                            borderLeft: "none",
                            padding: 0,
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "var(--font-noto)",
                                fontStyle: "italic",
                                fontSize: "1.125rem",
                                lineHeight: 1.7,
                                color: "#374151",
                                marginBottom: "0.75rem",
                            }}
                        >
                            "The support from JMA donors rebuilt our masjid and gave our
                            children a safe place to learn. We make du&apos;a for every
                            donor."
                        </p>
                        <footer
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.8125rem",
                                color: "#9CA3AF",
                            }}
                        >
                            — Community elder, Mankumban, Jaffna
                        </footer>
                    </blockquote>
                </div>

                {/* Right — donation widget */}
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "1rem",
                        padding: "2rem",
                        boxShadow:
                            "0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                    }}
                >
                    {/* Frequency toggle */}
                    <div
                        style={{
                            display: "flex",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "0.5rem",
                            padding: "3px",
                            marginBottom: "1.5rem",
                        }}
                    >
                        {(["one-time", "monthly"] as Frequency[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFrequency(f)}
                                style={{
                                    flex: 1,
                                    padding: "0.5625rem",
                                    borderRadius: "0.375rem",
                                    border: "none",
                                    cursor: "pointer",
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: 600,
                                    fontSize: "0.875rem",
                                    transition: "all 0.2s ease",
                                    backgroundColor:
                                        frequency === f ? "#0D5C6B" : "transparent",
                                    color: frequency === f ? "#ffffff" : "#6B7280",
                                }}
                            >
                                {f === "one-time" ? "One-time" : "Monthly"}
                            </button>
                        ))}
                    </div>

                    {/* Amount grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "0.5rem",
                            marginBottom: "0.625rem",
                        }}
                    >
                        {donationAmounts.map((amount) => {
                            const isSelected = !customAmount && selectedAmount === amount;
                            return (
                                <button
                                    key={amount}
                                    onClick={() => {
                                        setSelectedAmount(amount);
                                        setCustomAmount("");
                                    }}
                                    style={{
                                        padding: "0.6875rem",
                                        borderRadius: "0.5rem",
                                        border: `2px solid ${isSelected ? "#C9A84C" : "#E5E7EB"}`,
                                        cursor: "pointer",
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 700,
                                        fontSize: "0.9375rem",
                                        backgroundColor: isSelected ? "#FAF5E8" : "#ffffff",
                                        color: isSelected ? "#B08D35" : "#374151",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    £{amount}
                                </button>
                            );
                        })}
                    </div>

                    {/* Custom amount */}
                    <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                        <span
                            style={{
                                position: "absolute",
                                left: "0.875rem",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 700,
                                fontSize: "0.9375rem",
                                color: "#9CA3AF",
                                pointerEvents: "none",
                            }}
                        >
                            £
                        </span>
                        <input
                            type="number"
                            min="1"
                            placeholder="Enter your own amount"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(0);
                            }}
                            style={{
                                width: "100%",
                                padding: "0.6875rem 0.875rem 0.6875rem 1.75rem",
                                borderRadius: "0.5rem",
                                border: `2px solid ${customAmount ? "#C9A84C" : "#E5E7EB"}`,
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 600,
                                fontSize: "0.9375rem",
                                color: "#111827",
                                outline: "none",
                                transition: "border-color 0.15s ease",
                            }}
                            onFocus={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = "#0D5C6B";
                            }}
                            onBlur={(e) => {
                                (e.target as HTMLInputElement).style.borderColor = customAmount
                                    ? "#C9A84C"
                                    : "#E5E7EB";
                            }}
                        />
                    </div>

                    {/* Donation type */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: "#6B7280",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase" as const,
                                marginBottom: "0.5rem",
                            }}
                        >
                            Donation type
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap" as const,
                                gap: "0.375rem",
                            }}
                        >
                            {donationTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setDonationType(type)}
                                    style={{
                                        padding: "0.375rem 0.875rem",
                                        borderRadius: "9999px",
                                        border: `1.5px solid ${donationType === type ? "#0D5C6B" : "#E5E7EB"
                                            }`,
                                        cursor: "pointer",
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 500,
                                        fontSize: "0.8125rem",
                                        backgroundColor:
                                            donationType === type ? "#E8F4F6" : "#ffffff",
                                        color: donationType === type ? "#0D5C6B" : "#6B7280",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gift Aid */}
                    <div
                        style={{
                            backgroundColor: "#F9FAFB",
                            borderRadius: "0.625rem",
                            padding: "0.875rem 1rem",
                            marginBottom: "1.5rem",
                            border: "1px solid #E5E7EB",
                        }}
                    >
                        <label
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.75rem",
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={giftAid}
                                onChange={(e) => setGiftAid(e.target.checked)}
                                style={{
                                    marginTop: "1px",
                                    width: "16px",
                                    height: "16px",
                                    accentColor: "#0D5C6B",
                                    flexShrink: 0,
                                    cursor: "pointer",
                                }}
                            />
                            <div>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                        color: "#111827",
                                        marginBottom: "0.125rem",
                                    }}
                                >
                                    Boost my donation with Gift Aid
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.8rem",
                                        color: "#6B7280",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    I am a UK taxpayer. JMA can claim an extra{" "}
                                    <strong style={{ color: "#0D5C6B" }}>
                                        {formatCurrency(giftAidBonus)}
                                    </strong>{" "}
                                    at no cost to you.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Donate CTA */}
                    <Link
                        href={`/donate?amount=${activeAmount}&type=${donationType}&freq=${frequency}${giftAid ? "&giftaid=1" : ""}`}
                        style={{
                            display: "block",
                            textAlign: "center" as const,
                            width: "100%",
                            padding: "0.9375rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "#C9A84C",
                            color: "#ffffff",
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 700,
                            fontSize: "1.0625rem",
                            textDecoration: "none",
                            transition: "background-color 0.2s ease",
                            marginBottom: "0.875rem",
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
                        Donate {activeAmount > 0 ? formatCurrency(activeAmount) : ""} Now
                        {frequency === "monthly" ? " / month" : ""}
                    </Link>

                    {/* Trust note */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.375rem",
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.75rem",
                            color: "#9CA3AF",
                        }}
                    >
                        <Shield size={12} aria-hidden="true" />
                        Secure payment via Stripe · SSL encrypted
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 767px) {
          .donation-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
        </section>
    );
}