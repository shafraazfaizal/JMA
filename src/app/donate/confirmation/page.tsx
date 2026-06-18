"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Heart, ArrowRight, Share2 } from "lucide-react";

function ConfirmationInner() {
    const params = useSearchParams();

    const name = params.get("name") || "Dear Donor";
    const amount = params.get("amount") || "0";
    const type = params.get("type") || "General";
    const freq = params.get("freq") || "one-time";
    const giftAid = params.get("giftaid") === "1";
    const campaign = params.get("campaign") || "General Fund";
    const ref = params.get("ref") || "—";

    const displayAmount = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
    }).format(parseFloat(amount));

    const giftAidBonus = (parseFloat(amount) * 0.25).toFixed(2);
    const firstName = name.split(" ")[0];

    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundColor: "#F9FAFB",
                paddingTop: "5rem",
                paddingBottom: "5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ maxWidth: "580px", width: "100%", padding: "0 1.5rem" }}>
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "1.25rem",
                        border: "1px solid #E5E7EB",
                        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                    }}
                >
                    {/* Top bar */}
                    <div
                        style={{
                            backgroundColor: "#0D5C6B",
                            padding: "2.5rem 2.25rem",
                            textAlign: "center" as const,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundImage: `radial-gradient(circle at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 55%)`,
                            }}
                        />

                        <div
                            style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(201,168,76,0.15)",
                                border: "2px solid rgba(201,168,76,0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1.25rem",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <CheckCircle size={36} style={{ color: "#C9A84C" }} aria-hidden="true" />
                        </div>

                        <h1
                            style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 800,
                                fontSize: "1.625rem",
                                color: "#ffffff",
                                marginBottom: "0.5rem",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Thank you, {firstName}
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.9375rem",
                                color: "rgba(255,255,255,0.7)",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Your donation has been received and confirmed.
                        </p>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "2rem 2.25rem" }}>

                        {/* Summary */}
                        <div
                            style={{
                                backgroundColor: "#F9FAFB",
                                borderRadius: "0.875rem",
                                border: "1px solid #E5E7EB",
                                overflow: "hidden",
                                marginBottom: "1.5rem",
                            }}
                        >
                            {[
                                { label: "Amount", value: `${displayAmount}${freq === "monthly" ? " / month" : ""}` },
                                { label: "Type", value: type },
                                { label: "Campaign", value: campaign },
                                { label: "Reference", value: ref },
                            ].map(({ label, value }, i, arr) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "0.875rem 1.25rem",
                                        borderBottom: i < arr.length - 1 ? "1px solid #E5E7EB" : "none",
                                    }}
                                >
                                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>
                                        {label}
                                    </span>
                                    <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Gift Aid */}
                        {giftAid && (
                            <div
                                style={{
                                    backgroundColor: "#E8F4F6",
                                    border: "1px solid rgba(13,92,107,0.2)",
                                    borderRadius: "0.875rem",
                                    padding: "1rem 1.25rem",
                                    marginBottom: "1.5rem",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.75rem",
                                }}
                            >
                                <CheckCircle size={18} style={{ color: "#0D5C6B", flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#0D5C6B", marginBottom: "0.2rem" }}>
                                        Gift Aid confirmed — JMA will claim an extra £{giftAidBonus}
                                    </p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#374151", opacity: 0.75, lineHeight: 1.5 }}>
                                        Your donation receipt has been sent to your email address.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Impact message */}
                        <div
                            style={{
                                borderLeft: "3px solid #C9A84C",
                                paddingLeft: "1.125rem",
                                marginBottom: "2rem",
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "var(--font-noto)",
                                    fontStyle: "italic",
                                    fontSize: "0.9375rem",
                                    lineHeight: 1.7,
                                    color: "#374151",
                                    marginBottom: "0.375rem",
                                }}
                            >
                                &ldquo;Your generosity reaches families in Jaffna who need it most. Every contribution — large or small — makes a lasting difference on the ground.&rdquo;
                            </p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>
                                — JMA Team
                            </p>
                        </div>

                        {/* Share */}
                        <div
                            style={{
                                backgroundColor: "#FAF5E8",
                                border: "1px solid rgba(201,168,76,0.25)",
                                borderRadius: "0.875rem",
                                padding: "1.125rem 1.25rem",
                                marginBottom: "1.75rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.875rem",
                            }}
                        >
                            <Share2 size={18} style={{ color: "#C9A84C", flexShrink: 0 }} aria-hidden="true" />
                            <div>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#92400E", marginBottom: "0.125rem" }}>
                                    Help us reach further
                                </p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#78350F", opacity: 0.8 }}>
                                    Share JMA with your network — every donation you inspire multiplies the impact on the ground in Jaffna.
                                </p>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                            <Link
                                href="/campaigns"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    padding: "0.875rem",
                                    borderRadius: "0.5rem",
                                    backgroundColor: "#0D5C6B",
                                    color: "#ffffff",
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 700,
                                    fontSize: "0.9375rem",
                                    textDecoration: "none",
                                    transition: "background-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#094955"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0D5C6B"; }}
                            >
                                <Heart size={16} aria-hidden="true" />
                                Support another campaign
                            </Link>

                            <Link
                                href="/"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                    padding: "0.875rem",
                                    borderRadius: "0.5rem",
                                    backgroundColor: "#ffffff",
                                    color: "#374151",
                                    border: "1.5px solid #E5E7EB",
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: 600,
                                    fontSize: "0.9375rem",
                                    textDecoration: "none",
                                    transition: "border-color 0.15s ease",
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#9CA3AF"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E5E7EB"; }}
                            >
                                Return to homepage
                                <ArrowRight size={15} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense>
            <ConfirmationInner />
        </Suspense>
    );
}