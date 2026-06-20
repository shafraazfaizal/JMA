"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    ArrowRight, CheckCircle, Minus, Plus,
    Calendar, MapPin, Users, Heart, Info,
    ChevronDown, Bell, TrendingUp, Sparkles,
} from "lucide-react";
import {
    getRelevantEidDate, isQurbaniWindowOpen,
    daysUntil, lastQurbaniImpact,
} from "@/data/qurbani-dates";

// ─── Data ─────────────────────────────────────

const shareOptions = [
    { id: "goat", animal: "Goat / Sheep", pricePerShare: 65, description: "A full goat or sheep — one share covers the whole animal" },
    { id: "cow", animal: "Cow / Bull", pricePerShare: 55, description: "One share of a cow — shared between 7 households as per Sunnah" },
];

const faqs = [
    { q: "What is Qurbani and why is it performed?", a: "Qurbani is the ritual sacrifice of livestock performed during the days of Eid al-Adha, commemorating Prophet Ibrahim's (AS) willingness to sacrifice his son Ismail (AS) in obedience to Allah. It is obligatory upon every Muslim adult who meets the Nisab threshold." },
    { q: "How does JMA distribute Qurbani meat?", a: "JMA arranges Qurbani to be performed in Jaffna by verified local partners, with meat distributed directly to families identified through our grassroots welfare network — ensuring it reaches those most in need during Eid." },
    { q: "What is a 'share' in a cow Qurbani?", a: "Following the Sunnah, a cow or bull can be shared between up to 7 people, each share representing an equal portion of the sacrifice. A goat or sheep counts as one complete Qurbani and cannot be shared." },
    { q: "Can I do Qurbani on behalf of a deceased relative?", a: "Yes. You can dedicate a Qurbani share in memory of a deceased family member. Please note this in the additional details field when ordering." },
    { q: "When is the deadline to order?", a: "Orders must be placed before the 10th of Dhul Hijjah to ensure your Qurbani is performed within the valid days of Eid al-Adha. We recommend ordering at least one week in advance." },
    { q: "Is Qurbani the same as Sadaqah or Zakat?", a: "No. Qurbani is a distinct obligation tied specifically to Eid al-Adha and cannot be substituted for Zakat. However, like Zakat, it is given to those eligible to receive it according to Islamic guidelines." },
];

interface OrderForm {
    shareType: "goat" | "cow";
    quantity: number;
    donorName: string;
    email: string;
    dedication: string;
}

const defaultOrder: OrderForm = { shareType: "goat", quantity: 1, donorName: "", email: "", dedication: "" };

const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// ─── Page ─────────────────────────────────────

export default function QurbaniPage() {
    const [order, setOrder] = useState<OrderForm>(defaultOrder);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [notifyEmail, setNotifyEmail] = useState("");
    const [notifySubmitted, setNotifySubmitted] = useState(false);

    // Date logic — computed once on mount, server and client agree since both use real "now"
    const windowOpen = useMemo(() => isQurbaniWindowOpen(), []);
    const relevantEid = useMemo(() => getRelevantEidDate(), []);

    const selected = shareOptions.find((s) => s.id === order.shareType)!;
    const total = selected.pricePerShare * order.quantity;

    const set = <K extends keyof OrderForm>(k: K, v: OrderForm[K]) =>
        setOrder((p) => ({ ...p, [k]: v }));

    const handleNotify = () => {
        if (!notifyEmail.includes("@")) return;
        // Placeholder — wire to Resend/list once /api/qurbani-notify is built
        setNotifySubmitted(true);
    };

    const daysToOpen = relevantEid ? daysUntil(relevantEid.windowOpensDate) : null;
    const monthsToOpen = daysToOpen !== null ? Math.max(1, Math.round(daysToOpen / 30)) : null;

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero — changes copy based on season ── */}
            <section style={{ backgroundColor: "#0D5C6B", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem", alignItems: "center" }} className="hero-grid">
                    <div>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                            {windowOpen ? "Eid al-Adha — Now Open" : "Qurbani Programme"}
                        </p>
                        <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.25rem)", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
                            {windowOpen ? (
                                <>Perform your <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>Qurbani</span> in Jaffna</>
                            ) : (
                                <>Feeding Jaffna families every <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>Eid al-Adha</span></>
                            )}
                        </h1>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: "1.75rem", maxWidth: "520px" }}>
                            {windowOpen
                                ? "Fulfil your Qurbani obligation while directly feeding families in Jaffna this Eid. JMA arranges the sacrifice locally and distributes meat to those most in need."
                                : "Each year, JMA arranges Qurbani sacrifice locally in Jaffna and distributes meat directly to families most in need. Ordering opens annually ahead of Eid al-Adha."}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "1.25rem" }}>
                            {["Sacrificed locally in Jaffna", "Distributed directly to families", "Verified by JMA volunteers"].map((label) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <CheckCircle size={15} style={{ color: "#C9A84C" }} aria-hidden="true" />
                                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.75)" }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right card — deadline (open) or countdown (closed) */}
                    {windowOpen && relevantEid ? (
                        <div style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "1.25rem", padding: "2rem", backdropFilter: "blur(8px)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
                                <Calendar size={18} style={{ color: "#C9A84C" }} aria-hidden="true" />
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#ffffff" }}>Order Deadline</p>
                            </div>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#C9A84C", marginBottom: "0.5rem" }}>
                                {fmtDate(relevantEid.windowClosesDate)}
                            </p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                                Order soon to guarantee your Qurbani is performed within the valid days of Eid al-Adha {relevantEid.year}.
                            </p>
                            <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "1.5rem" }} />
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)" }}>Goat / Sheep share</span>
                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#ffffff" }}>£65</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)" }}>Cow share (1 of 7)</span>
                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: "#ffffff" }}>£55</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "1.25rem", padding: "2rem", backdropFilter: "blur(8px)", textAlign: "center" as const }}>
                            <Sparkles size={28} style={{ color: "#C9A84C", margin: "0 auto 1rem" }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>
                                {relevantEid?.isConfirmed ? "Eid al-Adha" : "Estimated date for"} {relevantEid?.year}
                            </p>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.75rem", color: "#ffffff", marginBottom: "0.375rem" }}>
                                {monthsToOpen !== null ? `Opens in ~${monthsToOpen} month${monthsToOpen === 1 ? "" : "s"}` : "Opening soon"}
                            </p>
                            {relevantEid && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>
                                    Eid al-Adha: {fmtDate(relevantEid.eidDate)}
                                </p>
                            )}
                            {relevantEid && !relevantEid.isConfirmed && (
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontStyle: "italic" as const }}>
                                    Subject to moon sighting confirmation
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════
          OPEN SEASON — Order calculator
      ══════════════════════════════════════ */}
            {windowOpen && (
                <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                        <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)", padding: "2.5rem" }}>
                            <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1.75rem" }}>
                                Order Your Qurbani
                            </h2>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.75rem" }} className="share-grid">
                                {shareOptions.map((opt) => {
                                    const isSelected = order.shareType === opt.id;
                                    return (
                                        <button key={opt.id} onClick={() => set("shareType", opt.id as "goat" | "cow")}
                                            style={{ padding: "1.5rem", borderRadius: "1rem", border: `2px solid ${isSelected ? "#0D5C6B" : "#E5E7EB"}`, backgroundColor: isSelected ? "#E8F4F6" : "#ffffff", cursor: "pointer", textAlign: "left" as const, transition: "all 0.2s ease" }}>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: isSelected ? "#0D5C6B" : "#111827", marginBottom: "0.375rem" }}>{opt.animal}</p>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.75rem", color: isSelected ? "#0D5C6B" : "#374151", marginBottom: "0.5rem" }}>
                                                £{opt.pricePerShare}<span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "0.8125rem", color: "#9CA3AF" }}> / share</span>
                                            </p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: isSelected ? "#0D5C6B" : "#6B7280", opacity: isSelected ? 0.8 : 1, lineHeight: 1.5 }}>{opt.description}</p>
                                        </button>
                                    );
                                })}
                            </div>

                            <div style={{ marginBottom: "1.75rem" }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.75rem" }}>Number of Shares</p>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <button onClick={() => set("quantity", Math.max(1, order.quantity - 1))} style={{ width: "44px", height: "44px", borderRadius: "0.625rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Decrease quantity">
                                        <Minus size={16} aria-hidden="true" />
                                    </button>
                                    <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#0D5C6B", minWidth: "48px", textAlign: "center" as const }}>{order.quantity}</span>
                                    <button onClick={() => set("quantity", order.quantity + 1)} style={{ width: "44px", height: "44px", borderRadius: "0.625rem", border: "1.5px solid #0D5C6B", backgroundColor: "#0D5C6B", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Increase quantity">
                                        <Plus size={16} aria-hidden="true" />
                                    </button>
                                    <div style={{ marginLeft: "auto", textAlign: "right" as const }}>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF", marginBottom: "0.125rem" }}>Total</p>
                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.75rem", color: "#0D5C6B" }}>{fmt(total)}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.5rem" }}>Full Name</p>
                                    <input type="text" placeholder="Ahmed Abdullah" value={order.donorName} onChange={(e) => set("donorName", e.target.value)}
                                        style={{ width: "100%", padding: "0.8125rem 1rem", borderRadius: "0.5rem", border: `1.5px solid ${order.donorName ? "#0D5C6B" : "#E5E7EB"}`, fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.9375rem", color: "#111827", outline: "none", boxSizing: "border-box" as const }}
                                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = order.donorName ? "#0D5C6B" : "#E5E7EB"; }} />
                                </div>
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.5rem" }}>Email</p>
                                    <input type="email" placeholder="ahmed@email.com" value={order.email} onChange={(e) => set("email", e.target.value)}
                                        style={{ width: "100%", padding: "0.8125rem 1rem", borderRadius: "0.5rem", border: `1.5px solid ${order.email ? "#0D5C6B" : "#E5E7EB"}`, fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.9375rem", color: "#111827", outline: "none", boxSizing: "border-box" as const }}
                                        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = order.email ? "#0D5C6B" : "#E5E7EB"; }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.5rem" }}>
                                    Dedication <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span>
                                </p>
                                <input type="text" placeholder="In memory of... / On behalf of..." value={order.dedication} onChange={(e) => set("dedication", e.target.value)}
                                    style={{ width: "100%", padding: "0.8125rem 1rem", borderRadius: "0.5rem", border: `1.5px solid ${order.dedication ? "#0D5C6B" : "#E5E7EB"}`, fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.9375rem", color: "#111827", outline: "none", boxSizing: "border-box" as const }}
                                    onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }}
                                    onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = order.dedication ? "#0D5C6B" : "#E5E7EB"; }} />
                            </div>

                            <Link href={`/donate?amount=${total}&type=Qurbani`}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.9375rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                            >
                                Proceed to Pay {fmt(total)}
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════
          CLOSED SEASON — Last year's impact + notify me
      ══════════════════════════════════════ */}
            {!windowOpen && (
                <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

                        {/* Last year's impact */}
                        <div style={{ marginBottom: "3rem" }}>
                            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>
                                    <TrendingUp size={13} style={{ display: "inline", marginRight: "0.375rem", verticalAlign: "-2px" }} aria-hidden="true" />
                                    Last Year&apos;s Impact
                                </p>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em" }}>
                                    Eid al-Adha {lastQurbaniImpact.year} in numbers
                                </h2>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="impact-grid">
                                {[
                                    { value: lastQurbaniImpact.sharesCompleted, label: "Shares completed" },
                                    { value: lastQurbaniImpact.animalsSlaughtered, label: "Animals sacrificed" },
                                    { value: lastQurbaniImpact.familiesFed, label: "Families fed" },
                                ].map(({ value, label }) => (
                                    <div key={label} style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.75rem", textAlign: "center" as const }}>
                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "2rem", color: "#0D5C6B", marginBottom: "0.375rem" }}>
                                            {value.toLocaleString("en-GB")}+
                                        </p>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280" }}>{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notify me */}
                        <div style={{ backgroundColor: "#0D5C6B", borderRadius: "1.25rem", padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                            <div aria-hidden="true" style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)" }} />

                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center", position: "relative", zIndex: 1 }} className="notify-grid">
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.75rem" }}>
                                        <Bell size={18} style={{ color: "#C9A84C" }} aria-hidden="true" />
                                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#ffffff" }}>
                                            Be the first to know
                                        </p>
                                    </div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "440px" }}>
                                        Get notified the moment Qurbani ordering opens for {relevantEid?.year ?? "next year"} — so you never miss the window.
                                    </p>
                                </div>

                                <div style={{ minWidth: "280px" }}>
                                    {notifySubmitted ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: "0.625rem", padding: "0.875rem 1rem" }}>
                                            <CheckCircle size={18} style={{ color: "#C9A84C", flexShrink: 0 }} aria-hidden="true" />
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#ffffff" }}>You&apos;re on the list!</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={notifyEmail}
                                                onChange={(e) => setNotifyEmail(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === "Enter") handleNotify(); }}
                                                style={{ flex: 1, minWidth: "160px", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1.5px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.08)", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#ffffff", outline: "none" }}
                                            />
                                            <button onClick={handleNotify} style={{ padding: "0.75rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", whiteSpace: "nowrap" as const }}>
                                                Notify Me
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── How it works (always shown) ── */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>How It Works</p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em" }}>
                            From your order to a family&apos;s table
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="steps-grid">
                        {[
                            { icon: Heart, title: "You order", body: "Choose your share and complete payment securely once ordering opens for the year." },
                            { icon: MapPin, title: "We arrange locally", body: "JMA's verified partners in Jaffna perform the sacrifice according to Islamic guidelines." },
                            { icon: Users, title: "Meat is distributed", body: "Fresh meat is distributed directly to families identified through our welfare network." },
                            { icon: CheckCircle, title: "You're notified", body: "We confirm your Qurbani has been completed, often with photos from the distribution." },
                        ].map(({ icon: Icon, title, body }, i) => (
                            <div key={title} style={{ textAlign: "center" as const }}>
                                <div style={{ width: "56px", height: "56px", borderRadius: "1rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                                    <Icon size={24} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.5rem" }}>{i + 1}. {title}</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ (always shown) ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.625rem" }}>Common Questions</p>
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#111827", letterSpacing: "-0.02em" }}>Qurbani FAQs</h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                        {faqs.map(({ q, a }, i) => {
                            const isOpen = openFaq === i;
                            return (
                                <div key={q} style={{ backgroundColor: "#ffffff", borderRadius: "0.875rem", border: `1px solid ${isOpen ? "#0D5C6B" : "#E5E7EB"}`, overflow: "hidden", transition: "border-color 0.2s ease" }}>
                                    <button onClick={() => setOpenFaq(isOpen ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.125rem 1.375rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" as const }}>
                                        <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: isOpen ? "#0D5C6B" : "#111827" }}>{q}</span>
                                        <ChevronDown size={18} style={{ color: isOpen ? "#0D5C6B" : "#9CA3AF", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} aria-hidden="true" />
                                    </button>
                                    {isOpen && (
                                        <div style={{ padding: "0 1.375rem 1.25rem" }}>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#6B7280", lineHeight: 1.75 }}>{a}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA — only during open season ── */}
            {windowOpen && (
                <section style={{ backgroundColor: "#073D47", padding: "5rem 1.5rem", textAlign: "center" as const, position: "relative", overflow: "hidden" }}>
                    <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)` }} />
                    <div style={{ maxWidth: "540px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                        <Info size={32} style={{ color: "#C9A84C", margin: "0 auto 1.25rem" }} aria-hidden="true" />
                        <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "1rem" }}>
                            Don&apos;t miss the deadline
                        </h2>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: "2rem" }}>
                            Secure your Qurbani share today so families in Jaffna can celebrate Eid al-Adha with a meal to remember.
                        </p>
                        <Link href="/donate?type=Qurbani" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", textDecoration: "none", transition: "background-color 0.2s ease" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                        >
                            Order Qurbani Now
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            )}

            <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .notify-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 767px) {
          .share-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .impact-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </main>
    );
}