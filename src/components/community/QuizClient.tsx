// src/components/community/QuizClient.tsx
"use client";

import { useState, useTransition } from "react";
import { Trophy, CheckCircle, AlertCircle, Zap, Calendar, Monitor } from "lucide-react";
import type { DBQuizSession } from "@/types/database";
import { registerForQuizAction } from "@/app/community/quiz/actions";

const AGE_GROUPS = ["Junior (5–10)", "Teen (11–15)", "Young Adult (16–18)"] as const;

const emptyForm = {
    child_name: "", age_group: "" as typeof AGE_GROUPS[number] | "",
    parent_name: "", parent_email: "", parent_phone: "",
};

export default function QuizClient({
    activeSession,
    latestWinner,
}: {
    activeSession: DBQuizSession | null;
    latestWinner: DBQuizSession | null;
}) {
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [isPending, startTransition] = useTransition();

    const validate = () => {
        if (!form.child_name.trim()) return "Child's name is required.";
        if (!form.age_group) return "Please select an age group.";
        if (!form.parent_name.trim()) return "Parent / guardian name is required.";
        if (!form.parent_email.trim() || !form.parent_email.includes("@")) return "A valid parent email is required.";
        return "";
    };

    const handleSubmit = () => {
        const err = validate();
        if (err) { setFormError(err); return; }
        setFormError("");
        startTransition(async () => {
            const result = await registerForQuizAction({
                child_name: form.child_name,
                age_group: form.age_group as typeof AGE_GROUPS[number],
                parent_name: form.parent_name,
                parent_email: form.parent_email,
                parent_phone: form.parent_phone || undefined,
            });
            if (result.success) {
                setSubmitted(true);
            } else if (result.alreadyRegistered) {
                setAlreadyRegistered(true);
                setSubmitted(true);
            } else {
                setFormError(result.error ?? "Something went wrong. Please try again.");
            }
        });
    };

    const quizDate = activeSession?.scheduled_at
        ? new Date(activeSession.scheduled_at).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        })
        : null;

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
            {/* Hero */}
            <section style={{
                background: "linear-gradient(135deg, #073D47 0%, #0D5C6B 60%, #1a7a8f 100%)",
                padding: "8rem 1.5rem 4rem",
            }}>
                <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" as const }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "9999px", padding: "0.375rem 1rem", marginBottom: "1.5rem" }}>
                        <Zap size={14} style={{ color: "#C9A84C" }} />
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#C9A84C" }}>
                            Monthly Online Event
                        </span>
                    </div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "#ffffff", lineHeight: 1.1, marginBottom: "1rem" }}>
                        JMA Monthly Quiz
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto" }}>
                        Test your knowledge, compete with peers, and win prizes every month. Open to all young community members.
                    </p>
                </div>
            </section>

            <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "3rem 1.5rem" }}>

                {/* Latest winner banner */}
                {latestWinner?.winner_name && (
                    <div style={{
                        background: "linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)",
                        border: "1px solid #FDE68A", borderRadius: "1rem",
                        padding: "1.5rem 2rem", marginBottom: "2rem",
                        display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" as const,
                    }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Trophy size={22} style={{ color: "#ffffff" }} />
                        </div>
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 600, color: "#92400E", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                                {latestWinner.title} Winner
                            </p>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.25rem", color: "#78350F" }}>
                                🏆 {latestWinner.winner_name}
                                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.9375rem", color: "#92400E", marginLeft: "0.5rem" }}>
                                    · {latestWinner.winner_age_group}
                                </span>
                            </p>
                            {latestWinner.winner_prize && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#92400E" }}>
                                    Prize: {latestWinner.winner_prize}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {activeSession ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "2rem", alignItems: "start" }}>
                        {/* Left: quiz info */}
                        <div>
                            <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.75rem", marginBottom: "1rem" }}>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", backgroundColor: "#D1FAE5", borderRadius: "9999px", padding: "0.3rem 0.875rem", marginBottom: "1rem" }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#059669", display: "inline-block" }} />
                                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", fontWeight: 700, color: "#065F46" }}>Registration Open</span>
                                </div>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.25rem", color: "#111827", marginBottom: "0.5rem" }}>
                                    {activeSession.title}
                                </h2>
                                {activeSession.topic && (
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "1.25rem" }}>
                                        Topic: <strong style={{ color: "#374151" }}>{activeSession.topic}</strong>
                                    </p>
                                )}

                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                                    {quizDate && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "0.5rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <Calendar size={15} style={{ color: "#0D5C6B" }} />
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Date</p>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#111827", fontWeight: 600 }}>{quizDate}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "0.5rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Monitor size={15} style={{ color: "#0D5C6B" }} />
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Format</p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#111827", fontWeight: 600 }}>Online via Zoom</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "0.5rem", backgroundColor: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Trophy size={15} style={{ color: "#D97706" }} />
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Prize</p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#111827", fontWeight: 600 }}>Prize for the winner Insha Allah</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "0.75rem", border: "1px solid #BFDBFE", padding: "1rem 1.25rem" }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#1D4ED8", lineHeight: 1.6, margin: 0 }}>
                                    <strong>How it works:</strong> Register below, receive a confirmation email, and we'll send you the Zoom link 24–48 hours before the quiz. The quiz is hosted live on Zoom using Kahoot — fun and interactive for all ages!
                                </p>
                            </div>
                        </div>

                        {/* Right: registration form */}
                        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.75rem" }}>
                            {submitted ? (
                                <div style={{ textAlign: "center" as const, padding: "1.5rem 0" }}>
                                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: alreadyRegistered ? "#FEF3C7" : "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                                        <CheckCircle size={26} style={{ color: alreadyRegistered ? "#D97706" : "#059669" }} />
                                    </div>
                                    <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.25rem", color: "#111827", marginBottom: "0.625rem" }}>
                                        {alreadyRegistered ? "Already Registered!" : "You're In! 🎉"}
                                    </h3>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.6 }}>
                                        {alreadyRegistered
                                            ? `${form.child_name} is already registered for this quiz. We'll send the Zoom link closer to the date Insha Allah.`
                                            : `Jazakallahu Khayran! We've sent a confirmation to ${form.parent_email}. The Zoom link will arrive 24–48 hours before the quiz Insha Allah.`}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.125rem", color: "#111827", marginBottom: "1.25rem" }}>
                                        Register Now
                                    </h3>

                                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
                                        {[
                                            { label: "Child's First Name *", key: "child_name", placeholder: "e.g. Ibrahim", type: "text" },
                                            { label: "Parent / Guardian Name *", key: "parent_name", placeholder: "Your full name", type: "text" },
                                            { label: "Parent Email *", key: "parent_email", placeholder: "your@email.com", type: "email" },
                                            { label: "Parent Phone (optional)", key: "parent_phone", placeholder: "+44 7700 000000", type: "tel" },
                                        ].map(({ label, key, placeholder, type }) => (
                                            <div key={key}>
                                                <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "0.375rem" }}>{label}</label>
                                                <input
                                                    type={type}
                                                    value={form[key as keyof typeof form] as string}
                                                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #D1D5DB", fontFamily: "var(--font-inter)", fontSize: "0.9375rem", boxSizing: "border-box" as const }}
                                                />
                                            </div>
                                        ))}

                                        {/* Age group */}
                                        <div>
                                            <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#374151", marginBottom: "0.375rem" }}>Age Group *</label>
                                            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" as const }}>
                                                {AGE_GROUPS.map((ag) => (
                                                    <button
                                                        key={ag}
                                                        type="button"
                                                        onClick={() => setForm((p) => ({ ...p, age_group: ag }))}
                                                        style={{
                                                            padding: "0.5rem 1rem", borderRadius: "9999px", border: "2px solid",
                                                            borderColor: form.age_group === ag ? "#0D5C6B" : "#E5E7EB",
                                                            backgroundColor: form.age_group === ag ? "#0D5C6B" : "#ffffff",
                                                            color: form.age_group === ag ? "#ffffff" : "#374151",
                                                            fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem",
                                                            cursor: "pointer", transition: "all 0.15s ease",
                                                        }}
                                                    >
                                                        {ag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {formError && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.5rem", padding: "0.75rem 1rem", margin: "1rem 0 0" }}>
                                            <AlertCircle size={15} style={{ color: "#DC2626", flexShrink: 0 }} />
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#991B1B", margin: 0 }}>{formError}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isPending}
                                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.9375rem", borderRadius: "0.625rem", backgroundColor: "#C9A84C", color: "#ffffff", border: "none", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1, marginTop: "1.25rem" }}
                                    >
                                        {isPending ? "Registering…" : "Register for the Quiz"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    /* No active session */
                    <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "4rem 2rem", textAlign: "center" as const }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                            <Trophy size={24} style={{ color: "#9CA3AF" }} />
                        </div>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.375rem", color: "#111827", marginBottom: "0.75rem" }}>
                            Registration Coming Soon
                        </h2>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto" }}>
                            The next quiz registration window isn't open yet. Check back soon or follow our announcements to be the first to know Insha Allah.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}