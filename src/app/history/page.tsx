"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const timelineEras = [
    {
        id: "origins",
        period: "7th – 15th Century",
        title: "Origins of the Jaffna Muslim Community",
        content: [
            "The Muslim presence in Jaffna traces its origins to the earliest centuries of Arab maritime trade along the Indian Ocean. Arab merchants — known as the Moors — settled along the northern coast of Ceylon, drawn by the island's strategic position on the spice routes connecting the Arabian Peninsula to Southeast Asia.",
            "These early settlers intermarried with local communities and established themselves as traders, scholars, and craftsmen. Over generations, a distinct identity emerged: Tamil-speaking Muslims who maintained their Islamic faith and practice while embedding themselves deeply into the social and economic fabric of the Jaffna peninsula.",
            "By the 15th century, the Jaffna Muslim community had developed its own mosques, schools, and cultural traditions — a community defined by its twin heritage of Islamic faith and Tamil language.",
        ],
    },
    {
        id: "colonial",
        period: "16th – 19th Century",
        title: "The Colonial Era",
        content: [
            "The arrival of the Portuguese in the early 16th century brought significant disruption to Muslim communities across Ceylon. As elsewhere in their empire, the Portuguese pursued aggressive policies against Muslim traders, targeting their commercial networks and in some cases forcibly displacing communities from coastal settlements.",
            "Under the Dutch and later the British, conditions stabilised and Jaffna Muslims were able to rebuild their commercial and community institutions. The British period saw the growth of education and civic participation, with Jaffna Muslims establishing schools and charitable organisations that would form the foundations of community life for generations.",
            "Through each colonial transition, the Jaffna Muslim community maintained its distinct identity — preserving its mosques, its language, and its traditions across centuries of external pressure.",
        ],
    },
    {
        id: "independence",
        period: "1948 – 1983",
        title: "Independence and Community Life",
        content: [
            "With Ceylon's independence in 1948, the Jaffna Muslim community entered a period of civic participation and institution-building. Mosques, schools, and welfare organisations flourished across the peninsula. The community maintained close ties with their Tamil neighbours while preserving their distinct Muslim identity.",
            "The decades following independence saw Jaffna Muslims participate actively in commerce, education, and public life. Families put down deep roots across the peninsula — in Jaffna town, Mannar, and the villages of the north. The community's charitable traditions strengthened, with established families supporting mosques, orphanages, and educational endowments.",
            "This period represents, in many ways, the height of a way of life that had been built over centuries — a community at home in its land, confident in its identity, connected to its neighbours.",
        ],
    },
    {
        id: "expulsion",
        period: "1990",
        title: "The Expulsion",
        content: [
            "In October 1990, the Liberation Tigers of Tamil Eelam (LTTE) issued an ultimatum to the Muslim communities of the Northern Province: leave within 48 hours, taking only what they could carry. Within two days, approximately 75,000 Muslims — the entire Muslim population of the Jaffna peninsula — were expelled from their homes, their land, and the communities their families had inhabited for centuries.",
            "Families left behind homes, businesses, farms, mosques, and graveyards. They carried what little they could — sometimes only the clothes on their backs. The expulsion was total, systematic, and devastating. It is one of the largest forced displacements in South Asian history.",
            "The displaced community scattered across the south of Sri Lanka, settling primarily in temporary camps in Puttalam district. Many families spent years — and some, decades — in these camps, holding onto the hope of return.",
        ],
        isSignificant: true,
    },
    {
        id: "diaspora",
        period: "1990 – 2000s",
        title: "Diaspora, Displacement, and the UK Community",
        content: [
            "In the wake of the expulsion, many Jaffna Muslim families sought refuge overseas — in the United Kingdom, Canada, France, Germany, and the Gulf states. The UK became home to one of the largest Jaffna Muslim diaspora communities, with significant populations settling across London, Manchester, Birmingham, and Leicester.",
            "In 2002, the Jaffna Muslim Association was established in the United Kingdom by members of this diaspora community. Its founding purpose was to maintain the bonds of a scattered community, to support those who remained in Sri Lanka, and to work toward the rebuilding of what had been lost.",
            "Even in displacement, the community preserved its traditions — its mosques, its language, its food, its music, its weddings. The annual Jaffna Day celebrations became a focal point for diaspora families to gather, reconnect, and remember.",
        ],
    },
    {
        id: "return",
        period: "2009 – Present",
        title: "Return and Rebuilding",
        content: [
            "Following the end of the civil war in 2009, the path gradually opened for displaced Jaffna Muslims to return to the north. The return has been slow, complicated, and in many cases incomplete. Homes had been occupied or destroyed. Mosques had fallen into disrepair. Land ownership had become contested.",
            "JMA's work has been shaped profoundly by this context of return. Every masjid reconstruction, every scholarship, every well and water project is part of a larger act of rebuilding — not just physical infrastructure, but the fabric of a community that was forcibly uprooted and is, slowly, coming home.",
            "Today, Jaffna's Muslim community is rebuilding. New mosques stand where old ones collapsed. Children are back in schools. Families have returned, though many have not. The work continues — and the diaspora in the UK continues to play an active role in supporting that return, through charity, advocacy, and connection.",
        ],
    },
    {
        id: "jma",
        period: "2002 – Today",
        title: "The Role of JMA",
        content: [
            "The Jaffna Muslim Association was established in 2002 by UK-based members of the Jaffna Muslim diaspora, with a simple but profound mission: to serve the Jaffna Muslim community across two nations.",
            "Over two decades, JMA has delivered more than 200 projects across infrastructure, education, healthcare, welfare, and emergency relief. Over £2.4 million has been raised and spent directly on the ground in Jaffna — through the generosity of donors across the UK and beyond.",
            "JMA's work is not simply charitable. It is an act of solidarity with a community that lost almost everything and is rebuilding with resilience, dignity, and faith. Every donation made through JMA is a small part of a much larger story — the story of a people returning home.",
        ],
    },
];

export default function HistoryPage() {
    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section
                style={{
                    background: "linear-gradient(160deg, #073D47 0%, #0D5C6B 60%, #094955 100%)",
                    padding: "8rem 1.5rem 6rem",
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
              radial-gradient(circle at 85% 20%, rgba(201,168,76,0.07) 0%, transparent 50%),
              radial-gradient(circle at 10% 80%, rgba(255,255,255,0.02) 0%, transparent 40%)
            `,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "1.25rem" }}>
                        Our Heritage
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                            color: "#ffffff",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            marginBottom: "1.5rem",
                        }}
                    >
                        The History of the{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>
                            Jaffna Muslim Community
                        </span>
                    </h1>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1.0625rem",
                            color: "rgba(255,255,255,0.65)",
                            lineHeight: 1.8,
                            maxWidth: "600px",
                        }}
                    >
                        Centuries of faith, trade, culture, and community — and a story of displacement, survival, and return that continues to this day.
                    </p>
                </div>
            </section>

            {/* ── Quranic verse ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "4rem 1.5rem", borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center" as const }}>
                    <p
                        style={{
                            fontFamily: "var(--font-noto)",
                            fontStyle: "italic",
                            fontSize: "clamp(1.125rem, 2.5vw, 1.375rem)",
                            color: "#1F2937",
                            lineHeight: 1.8,
                            marginBottom: "1rem",
                        }}
                    >
                        &ldquo;O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.&rdquo;
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#C9A84C", letterSpacing: "0.04em" }}>
                        Surah Al-Hujurat, 49:13
                    </p>
                </div>
            </section>

            {/* ── Timeline ── */}
            <section style={{ padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>

                    <div style={{ position: "relative" }}>
                        {/* Vertical line */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                left: "0",
                                top: "0.5rem",
                                bottom: 0,
                                width: "2px",
                                backgroundColor: "#E5E7EB",
                            }}
                        />

                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "4rem" }}>
                            {timelineEras.map((era) => (
                                <div
                                    key={era.id}
                                    style={{
                                        paddingLeft: "2.5rem",
                                        position: "relative",
                                    }}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            position: "absolute",
                                            left: "-7px",
                                            top: "0.4rem",
                                            width: "16px",
                                            height: "16px",
                                            borderRadius: "50%",
                                            backgroundColor: era.isSignificant ? "#DC2626" : "#C9A84C",
                                            border: `3px solid ${era.isSignificant ? "#FEE2E2" : "#FAF5E8"}`,
                                            boxShadow: era.isSignificant ? "0 0 0 4px rgba(220,38,38,0.1)" : "0 0 0 4px rgba(201,168,76,0.1)",
                                        }}
                                    />

                                    {/* Era label */}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            fontFamily: "var(--font-inter)",
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase" as const,
                                            color: era.isSignificant ? "#DC2626" : "#C9A84C",
                                            backgroundColor: era.isSignificant ? "#FEF2F2" : "#FAF5E8",
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "9999px",
                                            marginBottom: "0.875rem",
                                        }}
                                    >
                                        {era.period}
                                    </span>

                                    {/* Era title */}
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-jakarta)",
                                            fontWeight: 700,
                                            fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)",
                                            color: "#111827",
                                            lineHeight: 1.25,
                                            letterSpacing: "-0.01em",
                                            marginBottom: "1.5rem",
                                        }}
                                    >
                                        {era.title}
                                    </h2>

                                    {/* Era content */}
                                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
                                        {era.content.map((paragraph, i) => (
                                            <p
                                                key={i}
                                                style={{
                                                    fontFamily: "var(--font-inter)",
                                                    fontSize: "1.0625rem",
                                                    lineHeight: 1.85,
                                                    color: era.isSignificant ? "#374151" : "#4B5563",
                                                    fontWeight: era.isSignificant && i === 0 ? 500 : 400,
                                                }}
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Divider after significant era */}
                                    {era.isSignificant && (
                                        <div
                                            style={{
                                                marginTop: "2rem",
                                                padding: "1.25rem 1.5rem",
                                                backgroundColor: "#FEF2F2",
                                                border: "1px solid #FECACA",
                                                borderRadius: "0.875rem",
                                                fontFamily: "var(--font-inter)",
                                                fontSize: "0.875rem",
                                                color: "#B91C1C",
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            The expulsion of 1990 is recognised as one of the most significant forced displacements of a Muslim community in modern South Asian history. JMA was founded, in part, to ensure this history is not forgotten.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Editorial note ── */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "3rem 1.5rem", borderTop: "1px solid #E5E7EB" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", lineHeight: 1.7 }}>
                        <strong style={{ color: "#6B7280" }}>Editorial note:</strong> This page reflects JMA&apos;s understanding of the history of the Jaffna Muslim community, compiled from community sources, academic research, and the lived experience of our founding members. We welcome corrections, additions, and personal testimonies. If you have historical material to contribute, please{" "}
                        <Link href="/contact" style={{ color: "#0D5C6B", textDecoration: "underline" }}>
                            get in touch
                        </Link>
                        .
                    </p>
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section
                style={{
                    backgroundColor: "#073D47",
                    padding: "5rem 1.5rem",
                    textAlign: "center" as const,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)` }} />
                <div style={{ maxWidth: "560px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <h2
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                            color: "#ffffff",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            marginBottom: "1rem",
                        }}
                    >
                        Be part of the next chapter
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1rem",
                            color: "rgba(255,255,255,0.65)",
                            lineHeight: 1.75,
                            marginBottom: "2.25rem",
                        }}
                    >
                        The story of the Jaffna Muslim community is still being written. JMA exists to ensure the next chapter is one of return, rebuilding, and dignity. Your support makes that possible.
                    </p>
                    <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" as const }}>
                        <Link
                            href="/donate"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                padding: "0.875rem 2rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C",
                                color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700,
                                fontSize: "1rem", textDecoration: "none", transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                        >
                            Support JMA <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <Link
                            href="/about"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                padding: "0.875rem 2rem", borderRadius: "0.5rem",
                                border: "2px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.9)",
                                fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "1rem",
                                textDecoration: "none", transition: "border-color 0.2s ease, background 0.2s ease",
                                backgroundColor: "transparent",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.borderColor = "rgba(255,255,255,0.7)";
                                el.style.backgroundColor = "rgba(255,255,255,0.08)";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.borderColor = "rgba(255,255,255,0.35)";
                                el.style.backgroundColor = "transparent";
                            }}
                        >
                            About JMA
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}