// src/app/admin/newsletter/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Mail, Users, UserCheck } from "lucide-react";
import SubscriberRow from "./SubscriberRow";

export const revalidate = 0;

export default async function AdminNewsletterPage() {
    const supabase = await createClient();

    const { data: subscribers } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

    const all = subscribers ?? [];
    const active = all.filter((s) => s.status === "active");

    function fmtDate(iso: string) {
        return new Date(iso).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
        });
    }

    const csv = [
        "Email,Status,Subscribed",
        ...all.map((s) => `${s.email},${s.status},${fmtDate(s.created_at)}`),
    ].join("\n");

    const csvDataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap" as const, gap: "1rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                        Newsletter Subscribers
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                        {active.length} active · {all.length} total
                    </p>
                </div>
                <a
                    href={csvDataUrl}
                    download="jma-newsletter-subscribers.csv"
                    style={{
                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        padding: "0.75rem 1.25rem", borderRadius: "0.5rem",
                        backgroundColor: "#0D5C6B", color: "#ffffff",
                        fontFamily: "var(--font-jakarta)", fontWeight: 700,
                        fontSize: "0.875rem", textDecoration: "none",
                    }}
                >
                    <Mail size={15} aria-hidden="true" />
                    Export CSV
                </a>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem", maxWidth: "480px" }}>
                {[
                    { label: "Active Subscribers", value: active.length, icon: UserCheck, colour: "#0D5C6B", bg: "#E8F4F6" },
                    { label: "Total Signups", value: all.length, icon: Users, colour: "#C9A84C", bg: "#FAF5E8" },
                ].map(({ label, value, icon: Icon, colour, bg }) => (
                    <div key={label} style={{ backgroundColor: "#ffffff", borderRadius: "0.875rem", border: "1px solid #E5E7EB", padding: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "0.625rem", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={18} style={{ color: colour }} aria-hidden="true" />
                            </div>
                            <div>
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", lineHeight: 1 }}>{value}</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", marginTop: "0.25rem" }}>{label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            {all.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                    <Mail size={28} style={{ color: "#D1D5DB", margin: "0 auto 0.75rem" }} aria-hidden="true" />
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#9CA3AF" }}>
                        No subscribers yet.
                    </p>
                </div>
            ) : (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                    {/* Header */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 140px 80px", gap: "1rem", padding: "0.875rem 1.5rem", borderBottom: "1px solid #F3F4F6", backgroundColor: "#F9FAFB" }}>
                        {["Email", "Status", "Subscribed", ""].map((h) => (
                            <span key={h} style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#6B7280" }}>{h}</span>
                        ))}
                    </div>

                    {/* Rows */}
                    {all.map((sub, i) => (
                        <SubscriberRow
                            key={sub.id}
                            id={sub.id}
                            email={sub.email}
                            status={sub.status}
                            date={fmtDate(sub.created_at)}
                            isLast={i === all.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}