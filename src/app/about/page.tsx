"use client";

import Link from "next/link";
import {
    ArrowRight, CheckCircle, Heart, Users,
    Globe, Shield, BookOpen, Building2,
    Stethoscope, GraduationCap, Droplets,
    HandHeart, Baby, AlertTriangle, Wheat, Star,
} from "lucide-react";

const projectCategories = [
    { icon: Stethoscope, label: "Medical & Healthcare" },
    { icon: Droplets, label: "Food & Water Solutions" },
    { icon: GraduationCap, label: "Education" },
    { icon: HandHeart, label: "Sustainable Livelihoods" },
    { icon: Baby, label: "Orphans & Children" },
    { icon: AlertTriangle, label: "Emergency Relief" },
    { icon: Star, label: "Zakat" },
    { icon: Wheat, label: "Fitra & Qurbani" },
];

const values = [
    {
        icon: Shield,
        title: "Full Transparency",
        body: "Every pound is accounted for. We publish annual reports, project outcomes, and financial breakdowns openly and without exception.",
    },
    {
        icon: Heart,
        title: "Dignity First",
        body: "We serve with humility. Every family we support is treated with the same dignity we would want for our own.",
    },
    {
        icon: Globe,
        title: "Diaspora-Powered",
        body: "JMA is built on the generosity of the UK Jaffna Muslim community — a bridge between two nations.",
    },
    {
        icon: Users,
        title: "Volunteer-Run",
        body: "All operating costs are covered by our committee. 100% of public donations go directly to beneficiaries on the ground.",
    },
    {
        icon: BookOpen,
        title: "Long-Term Thinking",
        body: "We fund projects that create lasting change — education, infrastructure, and healthcare — not just emergency relief.",
    },
    {
        icon: Building2,
        title: "UK Registered",
        body: "JMA is a fully registered UK charity (No. 1143032), subject to Charity Commission oversight, Gift Aid eligibility, and annual audits.",
    },
];

const timeline = [
    {
        year: "2002",
        title: "Founded in the UK",
        body: "A group of Jaffna Muslims resettled in Britain came together with one shared purpose — to give back to the community they had left behind. JMA was formally established.",
    },
    {
        year: "2011",
        title: "Registered as a UK Charity",
        body: "JMA became a registered non-profit charity organisation (No. 1143032) to further its goals, formally assigned by the Charity Commission for England and Wales.",
    },
    {
        year: "2015",
        title: "Healthcare programme begins",
        body: "A partnership with local clinics in Jaffna allowed JMA to begin funding medical treatment for elderly and vulnerable residents who could not afford care.",
    },
    {
        year: "2019",
        title: "£1 million milestone",
        body: "JMA crossed £1,000,000 in total funds raised — a landmark reflecting the growing confidence of the UK diaspora in the organisation's transparency and delivery.",
    },
    {
        year: "2023",
        title: "Digital transformation",
        body: "JMA launched its new digital platform, enabling online donations, Gift Aid processing, and real-time campaign tracking.",
    },
    {
        year: "2026",
        title: "Silver Jubilee — 25 years",
        body: "JMA marks 25 years of service with the launch of the Silver Jubilee programme, deepening its commitment to the Jaffna Muslim community across two nations.",
    },
];

const team = [
    { initials: "MF", name: "Mohamed Fazil Abdul Gaffoor", role: "President", bg: "#0D5C6B" },
    { initials: "AK", name: "Abul Kalam Abdul Hakkeem", role: "Vice President", bg: "#073D47" },
    { initials: "MF", name: "Mohamed Farzan Badurusaman", role: "Secretary", bg: "#1a7a8f" },
    { initials: "SM", name: "Salman Mohamed Shawjeer", role: "Asst. Secretary", bg: "#094955" },
    { initials: "MR", name: "Muhammathu Rozaan Faaruk", role: "Treasurer", bg: "#C9A84C" },
    { initials: "MI", name: "Mohamed Izmee Mahroof", role: "Asst. Treasurer", bg: "#B08D35" },
    { initials: "AJ", name: "Azankuthoos Jaeeros", role: "Board Member", bg: "#0D5C6B" },
    { initials: "MA", name: "Mohamed Azeez Mahroof", role: "Board Member", bg: "#073D47" },
    { initials: "MF", name: "Mohamed Faizal Farook", role: "Board Member", bg: "#1a7a8f" },
    { initials: "MS", name: "Mohamed Shihab Sulaiman", role: "Board Member", bg: "#094955" },
    { initials: "MH", name: "Mohamed Humaid Jawsad", role: "Board Member", bg: "#0D5C6B" },
    { initials: "RM", name: "Rashdin Mohamed Akbar", role: "Board Member", bg: "#073D47" },
    { initials: "FF", name: "Farraj Firthouse", role: "Board Member", bg: "#1a7a8f" },
    { initials: "AJ", name: "Aneerkhan Jabarullah", role: "Board Member", bg: "#094955" },
];

const governanceDetails = [
    { label: "Charity Name", value: "Jaffna Muslim Association" },
    { label: "Registered Address", value: "124 City Road, London, EC1V 2NX" },
    { label: "Charity Number", value: "1143032" },
    { label: "Established", value: "April 2002" },
    { label: "Constitution", value: "June 2011" },
    { label: "Registered in", value: "England & Wales" },
    { label: "Bank", value: "Metro Bank" },
    { label: "Account No.", value: "55646104" },
    { label: "Sort Code", value: "23-05-80" },
];

export default function AboutPage() {
    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
            <section
                style={{
                    backgroundColor: "#0D5C6B",
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
              radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
              radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)
            `,
                        pointerEvents: "none",
                    }}
                />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
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
                        About JMA
                    </p>
                    <h1
                        style={{
                            fontFamily: "var(--font-jakarta)",
                            fontWeight: 800,
                            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                            color: "#ffffff",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            maxWidth: "680px",
                            marginBottom: "1.25rem",
                        }}
                    >
                        Bringing our{" "}
                        <span
                            style={{
                                color: "#C9A84C",
                                fontStyle: "italic",
                                fontFamily: "var(--font-noto)",
                            }}
                        >
                            community
                        </span>{" "}
                        together
                    </h1>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "1.0625rem",
                            color: "rgba(255,255,255,0.7)",
                            lineHeight: 1.75,
                            maxWidth: "600px",
                            marginBottom: "2.25rem",
                        }}
                    >
                        Founded in 2002 and registered as a UK charity in 2011, the Jaffna Muslim
                        Association exists to support and uplift those in need — providing essential
                        health services, education, financial relief, and Islamic guidance so
                        communities can live with dignity, opportunity, and hope.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.875rem" }}>
                        <Link
                            href="/donate"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.8125rem 1.75rem",
                                borderRadius: "0.5rem",
                                backgroundColor: "#C9A84C",
                                color: "#ffffff",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.9375rem",
                                textDecoration: "none",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                        >
                            Support our work
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>

                        <a
                            href="#team"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.8125rem 1.75rem",
                                borderRadius: "0.5rem",
                                border: "2px solid rgba(255,255,255,0.35)",
                                color: "rgba(255,255,255,0.9)",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.9375rem",
                                textDecoration: "none",
                                transition: "border-color 0.2s ease, background 0.2s ease",
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
                            Meet the Committee
                        </a>

                        <Link
                            href="/reports"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.8125rem 1.75rem",
                                borderRadius: "0.5rem",
                                border: "2px solid rgba(255,255,255,0.2)",
                                color: "rgba(255,255,255,0.7)",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.9375rem",
                                textDecoration: "none",
                                transition: "border-color 0.2s ease",
                                backgroundColor: "transparent",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.5)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                        >
                            Annual Reports
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          VISION + MISSION
      ══════════════════════════════════════ */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div
                    style={{
                        maxWidth: "80rem",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "3rem",
                        alignItems: "start",
                    }}
                    className="vm-grid"
                >
                    {/* Vision */}
                    <div
                        style={{
                            backgroundColor: "#0D5C6B",
                            borderRadius: "1.25rem",
                            padding: "2.5rem",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: "-40px",
                                right: "-40px",
                                width: "180px",
                                height: "180px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
                            }}
                        />
                        <span
                            style={{
                                backgroundColor: "rgba(201,168,76,0.15)",
                                border: "1px solid rgba(201,168,76,0.4)",
                                color: "#C9A84C",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase" as const,
                                padding: "0.3rem 0.875rem",
                                borderRadius: "9999px",
                                marginBottom: "1.25rem",
                                position: "relative",
                                zIndex: 1,
                                display: "inline-block" as const,
                            }}
                        >
                            Our Vision
                        </span>
                        <p
                            style={{
                                fontFamily: "var(--font-noto)",
                                fontStyle: "italic",
                                fontSize: "1.0625rem",
                                lineHeight: 1.8,
                                color: "rgba(255,255,255,0.9)",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            A thriving Jaffna Muslim community where every person — regardless of
                            hardship, displacement, or background — has access to healthcare,
                            education, spiritual guidance, and the essential resources needed to live
                            with dignity, resilience, and purpose.
                        </p>
                    </div>

                    {/* Mission */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "1.25rem",
                            border: "1px solid #E5E7EB",
                            padding: "2.5rem",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                backgroundColor: "#E8F4F6",
                                color: "#0D5C6B",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase" as const,
                                padding: "0.3rem 0.875rem",
                                borderRadius: "9999px",
                                marginBottom: "1.25rem",
                            }}
                        >
                            Our Mission
                        </span>
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "1rem",
                                lineHeight: 1.8,
                                color: "#4B5563",
                            }}
                        >
                            To support and uplift those in need — including the poor,
                            underprivileged, refugees, widows, orphans and vulnerable individuals —
                            by providing essential health services, education, financial relief,
                            community development, and Islamic guidance, so they can live with
                            dignity, opportunity, and hope.
                        </p>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          WHAT WE DO
      ══════════════════════════════════════ */}
            <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "4rem",
                            alignItems: "center",
                        }}
                        className="what-grid"
                    >
                        {/* Left copy */}
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
                                What We Do
                            </p>
                            <h2
                                style={{
                                    fontFamily: "var(--font-jakarta)",
                                    fontWeight: 800,
                                    fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                                    color: "#111827",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.15,
                                    marginBottom: "1.25rem",
                                }}
                            >
                                Grassroots delivery — directly to those who need it most
                            </h2>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "1rem",
                                    lineHeight: 1.8,
                                    color: "#4B5563",
                                    marginBottom: "1rem",
                                }}
                            >
                                In more recent times, the community has been trying to re-build
                                their lives in Sri Lanka and re-settle into the area from which they
                                were displaced — with considerable help from JMA.
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "1rem",
                                    lineHeight: 1.8,
                                    color: "#4B5563",
                                    marginBottom: "1rem",
                                }}
                            >
                                When we involve and deliver projects, we always directly interact
                                with the beneficiaries at a grassroots level. This way we know your
                                donations and contributions are 100% utilised and delivered to the
                                poor and needy.
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "1rem",
                                    lineHeight: 1.8,
                                    color: "#4B5563",
                                    marginBottom: "2rem",
                                }}
                            >
                                As an organisation we also represent the voices of the Jaffna Muslim
                                community on international arenas — ensuring their human rights and
                                social welfare are heard on a global scale.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                                {[
                                    "100% of donations reach the ground",
                                    "All operating costs covered by volunteers",
                                    "Direct interaction with every beneficiary",
                                    "Annual reports published openly",
                                ].map((point) => (
                                    <div
                                        key={point}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.625rem",
                                            fontFamily: "var(--font-inter)",
                                            fontSize: "0.9375rem",
                                            color: "#374151",
                                            fontWeight: 500,
                                        }}
                                    >
                                        <CheckCircle size={16} style={{ color: "#0D5C6B", flexShrink: 0 }} aria-hidden="true" />
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — project category tiles */}
                        <div>
                            <p
                                style={{
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase" as const,
                                    color: "#C9A84C",
                                    marginBottom: "1rem",
                                }}
                            >
                                Our Project Areas
                            </p>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "0.75rem",
                                }}
                            >
                                {projectCategories.map(({ icon: Icon, label }) => (
                                    <div
                                        key={label}
                                        style={{
                                            backgroundColor: "#F9FAFB",
                                            borderRadius: "0.875rem",
                                            border: "1px solid #E5E7EB",
                                            padding: "1.125rem 1.25rem",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.75rem",
                                            transition: "border-color 0.2s ease, background 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.borderColor = "#A0CDD5";
                                            el.style.backgroundColor = "#E8F4F6";
                                        }}
                                        onMouseLeave={(e) => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.borderColor = "#E5E7EB";
                                            el.style.backgroundColor = "#F9FAFB";
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "0.5rem",
                                                backgroundColor: "#E8F4F6",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Icon size={17} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                        </div>
                                        <span
                                            style={{
                                                fontFamily: "var(--font-inter)",
                                                fontWeight: 600,
                                                fontSize: "0.875rem",
                                                color: "#374151",
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          VALUES
      ══════════════════════════════════════ */}
            <section style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
                            What We Stand For
                        </p>
                        <h2
                            style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 800,
                                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                                color: "#111827",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.15,
                            }}
                        >
                            Our values guide every decision
                        </h2>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1.5rem",
                        }}
                        className="values-grid"
                    >
                        {values.map(({ icon: Icon, title, body }) => (
                            <div
                                key={title}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "1rem",
                                    border: "1px solid #E5E7EB",
                                    padding: "1.75rem",
                                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "0 8px 24px -4px rgba(13,92,107,0.1)";
                                    el.style.borderColor = "#A0CDD5";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "none";
                                    el.style.borderColor = "#E5E7EB";
                                }}
                            >
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "0.75rem",
                                        backgroundColor: "#E8F4F6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "1.125rem",
                                    }}
                                >
                                    <Icon size={20} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 700,
                                        fontSize: "1rem",
                                        color: "#111827",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    {title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-inter)",
                                        fontSize: "0.875rem",
                                        color: "#6B7280",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════ */}
            <section id="history" style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
                            Our History
                        </p>
                        <h2
                            style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 800,
                                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                                color: "#111827",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.15,
                            }}
                        >
                            Over two decades of milestones
                        </h2>
                    </div>

                    <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto" }}>
                        {/* Vertical line */}
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                left: "79px",
                                top: 0,
                                bottom: 0,
                                width: "2px",
                                backgroundColor: "#E5E7EB",
                            }}
                        />

                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "2.5rem" }}>
                            {timeline.map(({ year, title, body }, i) => (
                                <div key={year} style={{ display: "flex", gap: "1.75rem", alignItems: "flex-start" }}>
                                    {/* Year */}
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            width: "80px",
                                            textAlign: "right" as const,
                                            paddingTop: "0.2rem",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "var(--font-jakarta)",
                                                fontWeight: 800,
                                                fontSize: "0.9375rem",
                                                color: i === timeline.length - 1 ? "#C9A84C" : "#0D5C6B",
                                            }}
                                        >
                                            {year}
                                        </span>
                                    </div>

                                    {/* Dot */}
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            width: "14px",
                                            height: "14px",
                                            borderRadius: "50%",
                                            backgroundColor: i === timeline.length - 1 ? "#C9A84C" : "#0D5C6B",
                                            border: "3px solid #ffffff",
                                            marginTop: "0.25rem",
                                            boxShadow: `0 0 0 2px ${i === timeline.length - 1 ? "#C9A84C" : "#0D5C6B"}`,
                                            zIndex: 1,
                                            position: "relative",
                                        }}
                                    />

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        <h3
                                            style={{
                                                fontFamily: "var(--font-jakarta)",
                                                fontWeight: 700,
                                                fontSize: "1rem",
                                                color: "#111827",
                                                marginBottom: "0.375rem",
                                            }}
                                        >
                                            {title}
                                        </h3>
                                        <p
                                            style={{
                                                fontFamily: "var(--font-inter)",
                                                fontSize: "0.9rem",
                                                color: "#6B7280",
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            {body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          TEAM
      ══════════════════════════════════════ */}
            <section id="team" style={{ backgroundColor: "#F9FAFB", padding: "5rem 1.5rem" }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
                            The Committee
                        </p>
                        <h2
                            style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 800,
                                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                                color: "#111827",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.15,
                                marginBottom: "0.75rem",
                            }}
                        >
                            The people behind JMA
                        </h2>
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.9375rem",
                                color: "#6B7280",
                                maxWidth: "480px",
                                margin: "0 auto",
                                lineHeight: 1.7,
                            }}
                        >
                            Every committee member is a volunteer. Not a single penny of your
                            donation pays for salaries or overheads.
                        </p>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "1rem",
                        }}
                        className="team-grid"
                    >
                        {team.map(({ initials, name, role, bg }) => (
                            <div
                                key={name + role}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "1rem",
                                    border: "1px solid #E5E7EB",
                                    padding: "1.5rem 1.25rem",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    alignItems: "center",
                                    textAlign: "center" as const,
                                    gap: "0.75rem",
                                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "0 8px 24px -4px rgba(13,92,107,0.1)";
                                    el.style.borderColor = "#A0CDD5";
                                }}
                                onMouseLeave={(e) => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.boxShadow = "none";
                                    el.style.borderColor = "#E5E7EB";
                                }}
                            >
                                <div
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        borderRadius: "50%",
                                        backgroundColor: bg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "var(--font-jakarta)",
                                        fontWeight: 800,
                                        fontSize: "1rem",
                                        color: "#ffffff",
                                        flexShrink: 0,
                                        letterSpacing: "0.02em",
                                    }}
                                >
                                    {initials}
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-jakarta)",
                                            fontWeight: 700,
                                            fontSize: "0.9rem",
                                            color: "#111827",
                                            marginBottom: "0.25rem",
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {name}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-inter)",
                                            fontSize: "0.8125rem",
                                            color: "#6B7280",
                                        }}
                                    >
                                        {role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          GOVERNANCE
      ══════════════════════════════════════ */}
            <section id="governance" style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
                <div
                    style={{
                        maxWidth: "80rem",
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "4rem",
                        alignItems: "center",
                    }}
                    className="governance-grid"
                >
                    {/* Left — details */}
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
                            Governance
                        </p>
                        <h2
                            style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 800,
                                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                                color: "#111827",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.15,
                                marginBottom: "1.25rem",
                            }}
                        >
                            Accountable by design
                        </h2>
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "1rem",
                                lineHeight: 1.8,
                                color: "#4B5563",
                                marginBottom: "1.5rem",
                            }}
                        >
                            JMA operates under the full oversight of the Charity Commission for
                            England and Wales. Our governance framework ensures donor funds are
                            managed responsibly and all activity aligns with our charitable
                            objectives.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                            {governanceDetails.map(({ label, value }) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "0.75rem 1rem",
                                        backgroundColor: "#F9FAFB",
                                        borderRadius: "0.625rem",
                                        border: "1px solid #E5E7EB",
                                        flexWrap: "wrap" as const,
                                        gap: "0.5rem",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "var(--font-inter)",
                                            fontSize: "0.875rem",
                                            color: "#6B7280",
                                        }}
                                    >
                                        {label}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-jakarta)",
                                            fontWeight: 700,
                                            fontSize: "0.875rem",
                                            color: "#111827",
                                        }}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — annual reports CTA card */}
                    <div
                        style={{
                            backgroundColor: "#0D5C6B",
                            borderRadius: "1.25rem",
                            padding: "2.5rem",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                top: "-40px",
                                right: "-40px",
                                width: "200px",
                                height: "200px",
                                borderRadius: "50%",
                                background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
                            }}
                        />
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase" as const,
                                color: "#C9A84C",
                                marginBottom: "0.875rem",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Full Transparency
                        </p>
                        <h3
                            style={{
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 800,
                                fontSize: "1.5rem",
                                color: "#ffffff",
                                lineHeight: 1.2,
                                marginBottom: "1rem",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Read our Annual Reports
                        </h3>
                        <p
                            style={{
                                fontFamily: "var(--font-inter)",
                                fontSize: "0.9375rem",
                                color: "rgba(255,255,255,0.65)",
                                lineHeight: 1.7,
                                marginBottom: "1.75rem",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            Every year we publish a full breakdown of funds raised, projects
                            completed, and how every penny was spent. No exceptions.
                        </p>
                        <Link
                            href="/reports"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.8125rem 1.5rem",
                                borderRadius: "0.5rem",
                                backgroundColor: "#C9A84C",
                                color: "#ffffff",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "0.9375rem",
                                textDecoration: "none",
                                transition: "background-color 0.2s ease",
                                position: "relative",
                                zIndex: 1,
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                        >
                            View Annual Reports
                            <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════ */}
            <section
                style={{
                    backgroundColor: "#0D5C6B",
                    padding: "5rem 1.5rem",
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
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)`,
                    }}
                />
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
                        Believe in what we do?
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "0.9375rem",
                            color: "rgba(255,255,255,0.65)",
                            lineHeight: 1.7,
                            marginBottom: "2rem",
                        }}
                    >
                        Join thousands of donors who trust JMA to deliver real change in Jaffna.
                        Your donation — however small — makes a difference.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.875rem",
                            justifyContent: "center",
                            flexWrap: "wrap" as const,
                        }}
                    >
                        <Link
                            href="/donate"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.875rem 2rem",
                                borderRadius: "0.5rem",
                                backgroundColor: "#C9A84C",
                                color: "#ffffff",
                                fontFamily: "var(--font-jakarta)",
                                fontWeight: 700,
                                fontSize: "1rem",
                                textDecoration: "none",
                                transition: "background-color 0.2s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B08D35"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A84C"; }}
                        >
                            Donate Now
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <Link
                            href="/membership"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.875rem 2rem",
                                borderRadius: "0.5rem",
                                border: "2px solid rgba(255,255,255,0.35)",
                                color: "rgba(255,255,255,0.9)",
                                fontFamily: "var(--font-inter)",
                                fontWeight: 600,
                                fontSize: "1rem",
                                textDecoration: "none",
                                transition: "border-color 0.2s ease, background 0.2s ease",
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
                            Become a Member
                        </Link>
                    </div>
                </div>
            </section>

            <style>{`
        @media (max-width: 767px) {
          .vm-grid         { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .what-grid       { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .values-grid     { grid-template-columns: 1fr !important; }
          .team-grid       { grid-template-columns: repeat(2, 1fr) !important; }
          .governance-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .team-grid   { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
        </main>
    );
}