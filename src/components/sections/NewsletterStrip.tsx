"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function NewsletterStrip() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        const trimmed = email.trim();
        if (!trimmed || !trimmed.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setError("");

        // Placeholder — wire to Resend once /api/newsletter is built
        await new Promise((r) => setTimeout(r, 900));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <section
            style={{
                backgroundColor: "#0D5C6B",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                padding: "4rem 1.5rem",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Gold glow */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "-80px",
                    right: "-80px",
                    width: "320px",
                    height: "320px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    maxWidth: "80rem",
                    margin: "0 auto",
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "2.5rem",
                }}
            >
                {/* Left — copy */}
                <div style={{ maxWidth: "480px" }}>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase" as const,
                            color: "#C9A84C",
                            marginBottom: "0.625rem",
                        }}
                    >
                        Stay Connected
                    </p>
                    <h2
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                            color: "#ffffff",
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            marginBottom: "0.75rem",
                        }}
                    >
                        Get updates from Jaffna, direct to your inbox
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.9375rem",
                            lineHeight: 1.7,
                            color: "rgba(255,255,255,0.6)",
                        }}
                    >
                        Project updates, impact stories, event announcements, and Ramadan
                        appeals — no spam, unsubscribe any time.
                    </p>
                </div>

                {/* Right — form or success */}
                <div style={{ flex: 1, minWidth: "280px", maxWidth: "460px" }}>
                    {submitted ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                backgroundColor: "rgba(201,168,76,0.12)",
                                border: "1px solid rgba(201,168,76,0.35)",
                                borderRadius: "0.875rem",
                                padding: "1.375rem 1.5rem",
                            }}
                        >
                            <CheckCircle
                                size={28}
                                style={{ color: "#C9A84C", flexShrink: 0 }}
                                aria-hidden="true"
                            />
                            <div>
                                <p
                                    style={{
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        color: "#ffffff",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    You&apos;re subscribed — جزاك الله خيرا
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.875rem",
                                        color: "rgba(255,255,255,0.55)",
                                    }}
                                >
                                    Check your inbox for a confirmation email.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.625rem",
                                    flexWrap: "wrap" as const,
                                }}
                            >
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSubmit();
                                    }}
                                    style={{
                                        flex: 1,
                                        minWidth: "200px",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "0.5rem",
                                        border: `1.5px solid ${error
                                                ? "rgba(239,68,68,0.7)"
                                                : "rgba(255,255,255,0.15)"
                                            }`,
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.9375rem",
                                        color: "#ffffff",
                                        outline: "none",
                                        transition: "border-color 0.15s ease",
                                    }}
                                    onFocus={(e) => {
                                        if (!error)
                                            (e.target as HTMLInputElement).style.borderColor =
                                                "rgba(201,168,76,0.8)";
                                    }}
                                    onBlur={(e) => {
                                        if (!error)
                                            (e.target as HTMLInputElement).style.borderColor =
                                                "rgba(255,255,255,0.15)";
                                    }}
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "0.75rem 1.5rem",
                                        borderRadius: "0.5rem",
                                        border: "none",
                                        backgroundColor: loading ? "#B08D35" : "#C9A84C",
                                        color: "#ffffff",
                                        fontFamily: "var(--font-inter)",
                                        fontWeight: 600,
                                        fontSize: "0.9375rem",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        transition: "background-color 0.2s ease",
                                        flexShrink: 0,
                                        whiteSpace: "nowrap" as const,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading)
                                            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                                "#B08D35";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading)
                                            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                                "#C9A84C";
                                    }}
                                >
                                    <Send size={15} aria-hidden="true" />
                                    {loading ? "Subscribing…" : "Subscribe"}
                                </button>
                            </div>

                            {/* Error */}
                            {error && (
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.8125rem",
                                        color: "rgba(239,68,68,0.9)",
                                        marginTop: "0.5rem",
                                    }}
                                >
                                    {error}
                                </p>
                            )}

                            {/* Fine print */}
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.3)",
                                    marginTop: "0.75rem",
                                    lineHeight: 1.5,
                                }}
                            >
                                By subscribing you agree to receive emails from JMA. No spam —
                                unsubscribe any time.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}