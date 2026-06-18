"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
    ArrowRight, CheckCircle, Plus, Trash2,
    ChevronDown, Download, Users, User,
    Phone, Mail, MapPin, AlertCircle,
    FileText, Send,
} from "lucide-react";

// Dynamically import SignaturePad — canvas doesn't exist on server
const SignaturePad = dynamic(() => import("@/components/ui/SignaturePad"), {
    ssr: false,
    loading: () => (
        <div style={{ height: "130px", borderRadius: "0.625rem", border: "1.5px solid #E5E7EB", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF" }}>Loading signature pad…</p>
        </div>
    ),
});

// ─── T&C data ─────────────────────────────────

const tcSections = [
    {
        title: "General Details",
        clauses: [
            "Any Muslim adult can hold a membership in this project, either alone or as a family.",
            "Every applicant should pay an application fee as follows: Family Membership (husband, wife and any unmarried children) — £300 total (£100 to be paid with application form; balance £200 can be paid by standing order of £10/month within next 20 months). Individual Membership (adult over 18) — £200 total (£100 to be paid with application form; balance £100 can be paid by standing order of £10/month within next 10 months).",
            "All types of payment should be deposited in the JMA-UK Khardal Hasana bank account.",
            "The basic burial expenditures apply only for the registered individual or members within the family.",
            "Only the nuclear family (husband, wife and unmarried children) is eligible for membership. Visiting families from overseas are not included unless already listed in your family members.",
            "Sons or daughters who are married will be classed as a separate family and will need to apply for membership separately. They will be automatically removed from their previous membership 3 months after their marriage date.",
            "Any divorced children can rejoin their parents' membership (provided their parents hold membership).",
            "When a family loses a member, the rest of the family remain covered until their membership terminates. If a surviving parent remarries, the new step-parent is automatically included as goodwill.",
        ],
    },
    {
        title: "Burial Coverage",
        clauses: [
            "Burial expenditures are only applicable for a member who dies in the UK. This membership will NOT cover any expenses incurred while the person is abroad — however, if the body is brought to the UK, standard funeral expenses can be paid to the funeral agency.",
            "When a member dies overseas, the family can request a standard fixed sum (not exceeding £2,500 based on the registered address) for burial expenses. Any cost above this will not be covered.",
            "All funeral expenses are released to the funeral agency's account only (except overseas deaths as per above). No cash dealings are permitted.",
            "Khardal Hasana is run by volunteers. We only aim to provide financial support for registered members. We do not employ anyone to provide any other services.",
        ],
    },
    {
        title: "Structure of Funding",
        clauses: [
            "All membership fees collected will be held in the Khardal Hasana savings account.",
            "Account access is given to the JMA-UK President, JMA-UK Treasurer, and KH Treasurer.",
            "In case of a death of a member, the standard cost of the funeral incurred by the funeral agency can be requested by the member's immediate family. This should be in writing (letter, email, or text message) to maintain records.",
            "Funding requests must be approved by 3 Khardal Hasana Executive Members (KHEM) prior to releasing the fund.",
            "The cost of the funeral will be split equally among all other members (e.g. if the cost is £3,000 and there are 100 members, each will pay £3,000 ÷ 99 = £31, rounded to nearest pound, excluding the affected family).",
            "To maintain fairness, the funeral cost will always be split among members. If the family wishes to contribute all or part of the funeral expenses, any additional money collected will be kept in the Khardal Hasana savings account.",
        ],
    },
    {
        title: "Repayment Schedule",
        clauses: [
            "Members' shared cost should be paid within 4 weeks from the date the funeral shared cost is announced.",
            "Unpaid members will receive a reminder at week 4.",
            "A warning will be issued at week 6.",
            "A suspension notice will be issued at week 8.",
            "Membership will be terminated at week 12.",
            "Any special circumstances can be considered by the executive working committee at their discretion.",
        ],
    },
    {
        title: "Member Responsibilities",
        clauses: [
            "It is entirely the member's responsibility to inform the KH Executive Committee of any changes (address changes, new-born babies, family member marriages) by emailing kh@jaffnamuslimuk.org.",
            "An unmarried child currently under a family membership will have their membership terminated 3 months after their marriage date. The married couple must register a new membership and pay the appropriate fee.",
            "If registered as an individual member, you must upgrade to a family membership after marriage by paying an additional fee (currently £100).",
            "Becoming a member means you accept all the latest terms and conditions as defined by Khardal Hasana.",
            "In case of a funeral, request the charges from the funeral agency by writing to an executive committee member.",
            "Pay the appropriate membership fee within the allowed time, quoting your reference number.",
            "Pay the funeral shared cost within 4 weeks of the announced date.",
        ],
    },
    {
        title: "Other Terms",
        clauses: [
            "You can terminate your membership, but no refunds will be issued.",
            "Membership registration fees and other contributions cannot be withdrawn under any circumstance.",
            "This fund cannot be used for any purpose other than burial expenditures for registered members.",
            "Any changes or amendments to this project can only be made by the Khardal Hasana Executive Committee.",
        ],
    },
];

const contacts = [
    { area: "Eastham", name: "Sawjeer", phone: "07977 474647" },
    { area: "Harrow & Wembley", name: "Rozaan", phone: "07450 216219" },
    { area: "Slough", name: "Aslam", phone: "07428 632637" },
    { area: "Luton", name: "Jawsad", phone: "07846 150831" },
    { area: "Leicester", name: "Saroojan", phone: "07518 889886" },
    { area: "Rest of UK", name: "Jawsad", phone: "07846 150831" },
];

// ─── Types ────────────────────────────────────

interface FamilyMember {
    fullName: string;
    relationship: string;
    dob: string;
    sex: string;
}

interface FormData {
    firstName: string;
    lastName: string;
    address: string;
    postCode: string;
    mobile: string;
    email: string;
    emergencyContact: string;
    nextOfKin: string;
    additionalDetails: string;
    membershipType: "individual" | "family";
    familyMembers: FamilyMember[];
}

const defaultForm: FormData = {
    firstName: "", lastName: "", address: "", postCode: "",
    mobile: "", email: "", emergencyContact: "", nextOfKin: "",
    additionalDetails: "", membershipType: "individual",
    familyMembers: [],
};

const emptyMember: FamilyMember = { fullName: "", relationship: "", dob: "", sex: "" };

// ─── Style helpers ─────────────────────────────

function inputStyle(hasValue: boolean, hasError?: boolean): React.CSSProperties {
    return {
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        border: `1.5px solid ${hasError ? "#EF4444" : hasValue ? "#0D5C6B" : "#E5E7EB"}`,
        fontFamily: "var(--font-inter)",
        fontWeight: 500,
        fontSize: "0.9375rem",
        color: "#111827",
        backgroundColor: "#ffffff",
        outline: "none",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box" as const,
    };
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label style={{ display: "block", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: "0.5rem" }}>
            {children}
            {required && <span style={{ color: "#EF4444", marginLeft: "0.25rem" }}>*</span>}
        </label>
    );
}

// ─── Main page ────────────────────────────────

export default function KhardalHasanaPage() {
    const [form, setForm] = useState<FormData>(defaultForm);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
    const [agreed, setAgreed] = useState(false);
    const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [openTC, setOpenTC] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"about" | "apply" | "terms">("about");

    const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
        setForm((p) => ({ ...p, [k]: v }));

    const addMember = () =>
        setForm((p) => ({ ...p, familyMembers: [...p.familyMembers, { ...emptyMember }] }));

    const removeMember = (i: number) =>
        setForm((p) => ({ ...p, familyMembers: p.familyMembers.filter((_, idx) => idx !== i) }));

    const updateMember = (i: number, field: keyof FamilyMember, value: string) =>
        setForm((p) => {
            const members = [...p.familyMembers];
            members[i] = { ...members[i], [field]: value };
            return { ...p, familyMembers: members };
        });

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.firstName.trim()) e.firstName = "Required";
        if (!form.lastName.trim()) e.lastName = "Required";
        if (!form.address.trim()) e.address = "Required";
        if (!form.postCode.trim()) e.postCode = "Required";
        if (!form.mobile.trim()) e.mobile = "Required";
        if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
        if (!form.emergencyContact.trim()) e.emergencyContact = "Required";
        if (!form.nextOfKin.trim()) e.nextOfKin = "Required";
        if (form.membershipType === "family" && form.familyMembers.length === 0)
            e.familyMembers = "Please add at least one family member for a family membership.";
        if (!signatureDataUrl)
            e.signature = "Please draw your signature before submitting.";
        if (!agreed)
            e.agreed = "You must agree to the Terms & Conditions to submit.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        setSubmitting(true);
        setSubmitError("");

        try {
            const res = await fetch("/api/khardal-hasana/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, signatureDataUrl }),
            });

            if (!res.ok) {
                const data = await res.json();
                setSubmitError(data.error || "Something went wrong.");
                setSubmitting(false);
                return;
            }

            // Trigger PDF download
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `KH-Application-${form.firstName}-${form.lastName}.pdf`;
            a.click();
            URL.revokeObjectURL(url);

            setSubmitted(true);
        } catch {
            setSubmitError("Failed to submit. Please try again or contact JMA directly.");
            setSubmitting(false);
        }
    };

    // Client-side T&C PDF download
    const downloadTCPDF = async () => {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const margin = 20;
        const maxW = 210 - margin * 2;
        let y = margin;

        const addText = (
            text: string,
            size: number,
            bold: boolean,
            colour: [number, number, number],
            lineH: number,
        ) => {
            doc.setFontSize(size);
            doc.setFont("helvetica", bold ? "bold" : "normal");
            doc.setTextColor(...colour);
            const lines = doc.splitTextToSize(text, maxW);
            lines.forEach((line: string) => {
                if (y > 270) { doc.addPage(); y = margin; }
                doc.text(line, margin, y);
                y += lineH;
            });
        };

        // Teal header bar
        doc.setFillColor(13, 92, 107);
        doc.rect(0, 0, 210, 28, "F");
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("Khardal Hasana — Terms & Conditions", margin, 13);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Jaffna Muslim Association UK · Updated: June 2018", margin, 21);
        y = 36;

        tcSections.forEach((section) => {
            y += 4;
            // Section header background
            doc.setFillColor(232, 244, 246);
            doc.rect(margin - 2, y - 4, maxW + 4, 8, "F");
            addText(section.title, 11, true, [13, 92, 107], 6);
            y += 2;
            section.clauses.forEach((clause, i) => {
                addText(`${i + 1}.  ${clause}`, 9.5, false, [55, 65, 81], 5.5);
                y += 1.5;
            });
        });

        // Ensure signature block lands on a fresh page if < 50mm remain
        if (y > 237) { doc.addPage(); y = margin; }

        y += 8;
        // Declaration box
        doc.setFillColor(249, 250, 251);
        doc.setDrawColor(13, 92, 107);
        doc.setLineWidth(0.5);
        doc.rect(margin - 2, y - 2, maxW + 4, 32, "FD");

        doc.setFontSize(9.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 41, 55);
        const declLines = doc.splitTextToSize(
            "I HEREBY DECLARE THAT I UNDERSTAND AND AGREE TO THE ABOVE MENTIONED TERMS AND CONDITIONS OF THE JMA KARDHAL HASANA PROJECT TO THE BEST OF MY KNOWLEDGE.",
            maxW - 4,
        );
        declLines.forEach((line: string) => {
            doc.text(line, margin, y + 4);
            y += 5.5;
        });

        y += 10;
        // Signature lines
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.3);
        doc.line(margin, y, margin + 72, y);
        doc.line(margin + 100, y, margin + 172, y);
        y += 5;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        doc.text("Signature", margin, y);
        doc.text("Date", margin + 100, y);

        doc.save("Khardal-Hasana-Terms-and-Conditions.pdf");
    };

    const fee = form.membershipType === "family"
        ? { total: "£300", deposit: "£100", balance: "£200", monthly: "£10/month over 20 months" }
        : { total: "£200", deposit: "£100", balance: "£100", monthly: "£10/month over 10 months" };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>

            {/* ── Hero ── */}
            <section style={{ backgroundColor: "#073D47", padding: "8rem 1.5rem 5rem", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at 15% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)`, pointerEvents: "none" }} />
                <div style={{ maxWidth: "80rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.875rem" }}>
                        Khardal Hasana
                    </p>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(2rem, 4.5vw, 3.25rem)", color: "#ffffff", lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "700px", marginBottom: "1.25rem" }}>
                        JMA Janaza Fund —{" "}
                        <span style={{ color: "#C9A84C", fontStyle: "italic", fontFamily: "var(--font-noto)" }}>
                            no family faces this alone
                        </span>
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "1.0625rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: "600px", marginBottom: "2rem" }}>
                        A volunteer-run mutual fund that ensures every Jaffna Muslim family in the UK has the financial support needed to fulfil Janaza rites, without delay or hardship.
                    </p>
                    <div style={{ borderLeft: "3px solid #C9A84C", paddingLeft: "1.25rem", maxWidth: "580px" }}>
                        <p style={{ fontFamily: "var(--font-noto)", fontStyle: "italic", fontSize: "0.9375rem", lineHeight: 1.75, color: "rgba(255,255,255,0.8)", marginBottom: "0.375rem" }}>
                            &ldquo;When a person dies, all their deeds end except three: a continuing charity, beneficial knowledge and a child who prays for them.&rdquo;
                        </p>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "rgba(255,255,255,0.45)" }}>— Sahih Muslim 1631</p>
                    </div>
                </div>
            </section>

            {/* ── Tab nav ── */}
            <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: "62px", zIndex: 40 }}>
                <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", display: "flex" }}>
                    {([
                        { key: "about", label: "About the Fund" },
                        { key: "apply", label: "Register / Apply" },
                        { key: "terms", label: "Terms & Conditions" },
                    ] as const).map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            style={{
                                padding: "1rem 1.5rem",
                                border: "none",
                                borderBottom: `3px solid ${activeTab === key ? "#0D5C6B" : "transparent"}`,
                                backgroundColor: "transparent",
                                fontFamily: "var(--font-inter)",
                                fontWeight: activeTab === key ? 700 : 500,
                                fontSize: "0.9375rem",
                                color: activeTab === key ? "#0D5C6B" : "#6B7280",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                whiteSpace: "nowrap" as const,
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ══════════════════════════════════
          ABOUT TAB
      ══════════════════════════════════ */}
            {activeTab === "about" && (
                <section style={{ padding: "4rem 1.5rem 5rem" }}>
                    <div style={{ maxWidth: "80rem", margin: "0 auto" }}>

                        {/* What + How */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginBottom: "4rem", alignItems: "start" }} className="about-grid">
                            <div>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.75rem" }}>What is Khardal Hasana?</p>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                                    Immediate funds for Janaza when families need it most
                                </h2>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", lineHeight: 1.8, color: "#4B5563", marginBottom: "1rem" }}>
                                    No one can prepare for a loss. It comes like a swift wind. But we can prepare together — so that when a family faces bereavement, the financial burden of Janaza does not add to their grief.
                                </p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", lineHeight: 1.8, color: "#4B5563", marginBottom: "1rem" }}>
                                    Khardal Hasana is a mutual Janaza fund run entirely by JMA volunteers. Each area in the UK requires approximately £2,000–£4,000 to complete Janaza rituals. Sometimes families cannot immediately afford this in the event of sudden death.
                                </p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", lineHeight: 1.8, color: "#4B5563" }}>
                                    The JMA Khardal Hasana fund releases money immediately so Janaza formalities can be fulfilled without delay — and the cost is then shared equally among all members.
                                </p>
                            </div>

                            <div>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "1rem" }}>How it works</p>
                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                                    {[
                                        { step: "1", title: "You register", body: "Pay the membership fee (£200 individual / £300 family). Register your family members." },
                                        { step: "2", title: "Fund is maintained", body: "All fees are held in the dedicated Khardal Hasana savings account, accessible only to authorised JMA officers." },
                                        { step: "3", title: "A member passes away", body: "The fund is released immediately to the funeral agency upon written request from the family. No cash dealings." },
                                        { step: "4", title: "Cost is shared", body: "The funeral cost is divided equally among all other members. You pay your share within 4 weeks." },
                                    ].map(({ step, title, body }) => (
                                        <div key={step} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0D5C6B", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.875rem", flexShrink: 0 }}>
                                                {step}
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827", marginBottom: "0.2rem" }}>{title}</p>
                                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6 }}>{body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Example calculation */}
                        <div style={{ backgroundColor: "#E8F4F6", borderRadius: "1.25rem", padding: "2.25rem", marginBottom: "3rem" }}>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0D5C6B", marginBottom: "0.75rem" }}>Example Calculation</p>
                            <h3 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.125rem", color: "#0D5C6B", marginBottom: "1.25rem" }}>How the shared cost works in practice</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="example-grid">
                                {[
                                    { label: "Total members", value: "100", sub: "each paid £300 membership fee" },
                                    { label: "Fund total", value: "£30,000", sub: "held in Khardal Hasana account" },
                                    { label: "Funeral cost", value: "£3,000", sub: "paid immediately to funeral agency" },
                                ].map(({ label, value, sub }) => (
                                    <div key={label} style={{ backgroundColor: "#ffffff", borderRadius: "0.75rem", padding: "1.25rem", border: "1px solid rgba(13,92,107,0.15)" }}>
                                        <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#0D5C6B", marginBottom: "0.25rem" }}>{value}</div>
                                        <div style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#111827", marginBottom: "0.25rem" }}>{label}</div>
                                        <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#6B7280" }}>{sub}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                <CheckCircle size={18} style={{ color: "#0D5C6B", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#0D5C6B", lineHeight: 1.65 }}>
                                    After the £3,000 funeral, the fund has £27,000 remaining. Each of the 99 other members contributes <strong>£31</strong> (rounded to nearest pound), restoring the fund to its full amount.
                                </p>
                            </div>
                        </div>

                        {/* Membership fees */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }} className="fees-grid">
                            {[
                                { type: "Individual Membership", icon: User, total: "£200", deposit: "£100 on application", balance: "£100 remaining — £10/month over 10 months", note: "For single adult Muslims over 18" },
                                { type: "Family Membership", icon: Users, total: "£300", deposit: "£100 on application", balance: "£200 remaining — £10/month over 20 months", note: "Covers husband, wife and unmarried children" },
                            ].map(({ type, icon: Icon, total, deposit, balance, note }) => (
                                <div key={type} style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1.5px solid #E5E7EB", padding: "1.75rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                                        <div style={{ width: "44px", height: "44px", borderRadius: "0.75rem", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Icon size={20} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#111827" }}>{type}</p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>{note}</p>
                                        </div>
                                    </div>
                                    <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "2rem", color: "#0D5C6B", marginBottom: "0.875rem" }}>{total}</div>
                                    {[deposit, balance].map((item) => (
                                        <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                            <CheckCircle size={14} style={{ color: "#C9A84C", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#4B5563" }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Bank details */}
                        <div style={{ backgroundColor: "#F9FAFB", borderRadius: "1rem", border: "1px solid #E5E7EB", padding: "1.75rem 2rem", marginBottom: "3rem" }}>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "1rem" }}>
                                Bank Transfer Details — Khardal Hasana
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }} className="bank-grid">
                                {[
                                    { label: "Bank", value: "Lloyds" },
                                    { label: "Account Name", value: "JMA — Khardal Hasana" },
                                    { label: "Sort Code", value: "30-94-66" },
                                    { label: "Account No.", value: "2224 1760" },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{label}</div>
                                        <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Area contacts */}
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "1rem" }}>Local Contacts</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem" }} className="contacts-grid">
                                {contacts.map(({ area, name, phone }) => (
                                    <div key={area + name} style={{ backgroundColor: "#ffffff", borderRadius: "0.875rem", border: "1px solid #E5E7EB", padding: "1.125rem 1.25rem", display: "flex", alignItems: "center", gap: "0.875rem" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <Phone size={16} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9rem", color: "#111827", marginBottom: "0.125rem" }}>{area}</p>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>{name} — {phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════
          APPLY TAB
      ══════════════════════════════════ */}
            {activeTab === "apply" && (
                <section style={{ padding: "4rem 1.5rem 5rem" }}>
                    <div style={{ maxWidth: "860px", margin: "0 auto" }}>

                        {submitted ? (
                            <div style={{ backgroundColor: "#F9FAFB", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "3.5rem 2.5rem", textAlign: "center" as const }}>
                                <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#E8F4F6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                                    <CheckCircle size={30} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                                </div>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.75rem" }}>
                                    Application submitted — جزاك الله خيرا
                                </h2>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 0.75rem" }}>
                                    Your signed application has been sent to the Khardal Hasana committee and a copy has been downloaded to your device.
                                </p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 2rem" }}>
                                    Next step: transfer your initial deposit of <strong>£100</strong> to the Khardal Hasana bank account (Sort: 30-94-66 · Acc: 2224 1760), quoting your full name as reference.
                                </p>
                                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" as const }}>
                                    <button
                                        onClick={() => { setSubmitted(false); setForm(defaultForm); setAgreed(false); setSignatureDataUrl(null); }}
                                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", border: "none", cursor: "pointer" }}
                                    >
                                        Register another member
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("about")}
                                        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#ffffff", color: "#374151", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", border: "1.5px solid #E5E7EB", cursor: "pointer" }}
                                    >
                                        Back to fund info <ArrowRight size={15} aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Membership type selector */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }} className="type-selector">
                                    {(["individual", "family"] as const).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => { set("membershipType", type); if (type === "individual") set("familyMembers", []); }}
                                            style={{ padding: "1.5rem", borderRadius: "1rem", border: `2px solid ${form.membershipType === type ? "#0D5C6B" : "#E5E7EB"}`, backgroundColor: form.membershipType === type ? "#E8F4F6" : "#ffffff", cursor: "pointer", textAlign: "left" as const, transition: "all 0.2s ease" }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                                {type === "individual"
                                                    ? <User size={20} style={{ color: form.membershipType === type ? "#0D5C6B" : "#9CA3AF" }} aria-hidden="true" />
                                                    : <Users size={20} style={{ color: form.membershipType === type ? "#0D5C6B" : "#9CA3AF" }} aria-hidden="true" />}
                                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: form.membershipType === type ? "#0D5C6B" : "#111827" }}>
                                                    {type === "individual" ? "Individual" : "Family"} Membership
                                                </span>
                                            </div>
                                            <div style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.375rem", color: form.membershipType === type ? "#0D5C6B" : "#374151", marginBottom: "0.25rem" }}>
                                                {type === "individual" ? "£200" : "£300"}
                                            </div>
                                            <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                                                {type === "individual" ? "£100 now + £10/month × 10" : "£100 now + £10/month × 20"}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Error banner */}
                                {Object.keys(errors).length > 0 && (
                                    <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.75rem", padding: "0.875rem 1.125rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                        <AlertCircle size={16} style={{ color: "#DC2626", flexShrink: 0 }} aria-hidden="true" />
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#DC2626" }}>
                                            Please fix the errors below before submitting.
                                        </p>
                                    </div>
                                )}

                                {/* Form card */}
                                <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", boxShadow: "0 4px 24px -4px rgba(0,0,0,0.07)", padding: "2.25rem" }}>
                                    <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.25rem", color: "#111827", marginBottom: "1.75rem" }}>
                                        Registration Form
                                    </h2>

                                    {/* Name */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                        <div>
                                            <FieldLabel required>First Name</FieldLabel>
                                            <input type="text" placeholder="Ahmed" value={form.firstName} onChange={(e) => { set("firstName", e.target.value); setErrors((p) => { const n = { ...p }; delete n.firstName; return n; }); }} style={inputStyle(!!form.firstName, !!errors.firstName)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.firstName ? "#EF4444" : form.firstName ? "#0D5C6B" : "#E5E7EB"; }} />
                                            {errors.firstName && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <FieldLabel required>Last Name</FieldLabel>
                                            <input type="text" placeholder="Abdullah" value={form.lastName} onChange={(e) => { set("lastName", e.target.value); setErrors((p) => { const n = { ...p }; delete n.lastName; return n; }); }} style={inputStyle(!!form.lastName, !!errors.lastName)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.lastName ? "#EF4444" : form.lastName ? "#0D5C6B" : "#E5E7EB"; }} />
                                            {errors.lastName && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div style={{ marginBottom: "1.25rem" }}>
                                        <FieldLabel required>Address</FieldLabel>
                                        <div style={{ position: "relative" }}>
                                            <MapPin size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                            <input type="text" placeholder="123 Street Name, City" value={form.address} onChange={(e) => { set("address", e.target.value); setErrors((p) => { const n = { ...p }; delete n.address; return n; }); }} style={{ ...inputStyle(!!form.address, !!errors.address), paddingLeft: "2.5rem" }} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.address ? "#EF4444" : form.address ? "#0D5C6B" : "#E5E7EB"; }} />
                                        </div>
                                        {errors.address && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.address}</p>}
                                    </div>

                                    {/* Postcode + Mobile */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                        <div>
                                            <FieldLabel required>Post Code</FieldLabel>
                                            <input type="text" placeholder="M1 1AE" value={form.postCode} onChange={(e) => { set("postCode", e.target.value); setErrors((p) => { const n = { ...p }; delete n.postCode; return n; }); }} style={inputStyle(!!form.postCode, !!errors.postCode)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.postCode ? "#EF4444" : form.postCode ? "#0D5C6B" : "#E5E7EB"; }} />
                                            {errors.postCode && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.postCode}</p>}
                                        </div>
                                        <div>
                                            <FieldLabel required>Mobile</FieldLabel>
                                            <div style={{ position: "relative" }}>
                                                <Phone size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                                <input type="tel" placeholder="+44 7700 000000" value={form.mobile} onChange={(e) => { set("mobile", e.target.value); setErrors((p) => { const n = { ...p }; delete n.mobile; return n; }); }} style={{ ...inputStyle(!!form.mobile, !!errors.mobile), paddingLeft: "2.5rem" }} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.mobile ? "#EF4444" : form.mobile ? "#0D5C6B" : "#E5E7EB"; }} />
                                            </div>
                                            {errors.mobile && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.mobile}</p>}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div style={{ marginBottom: "1.25rem" }}>
                                        <FieldLabel required>Email Address</FieldLabel>
                                        <div style={{ position: "relative" }}>
                                            <Mail size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} aria-hidden="true" />
                                            <input type="email" placeholder="ahmed@email.com" value={form.email} onChange={(e) => { set("email", e.target.value); setErrors((p) => { const n = { ...p }; delete n.email; return n; }); }} style={{ ...inputStyle(!!form.email, !!errors.email), paddingLeft: "2.5rem" }} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.email ? "#EF4444" : form.email ? "#0D5C6B" : "#E5E7EB"; }} />
                                        </div>
                                        {errors.email && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.email}</p>}
                                    </div>

                                    {/* Emergency contact + Next of Kin */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }} className="form-row">
                                        <div>
                                            <FieldLabel required>Emergency Contact</FieldLabel>
                                            <input type="text" placeholder="Name & number" value={form.emergencyContact} onChange={(e) => { set("emergencyContact", e.target.value); setErrors((p) => { const n = { ...p }; delete n.emergencyContact; return n; }); }} style={inputStyle(!!form.emergencyContact, !!errors.emergencyContact)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.emergencyContact ? "#EF4444" : form.emergencyContact ? "#0D5C6B" : "#E5E7EB"; }} />
                                            {errors.emergencyContact && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.emergencyContact}</p>}
                                        </div>
                                        <div>
                                            <FieldLabel required>Next of Kin (Name & Contact)</FieldLabel>
                                            <input type="text" placeholder="Name & number" value={form.nextOfKin} onChange={(e) => { set("nextOfKin", e.target.value); setErrors((p) => { const n = { ...p }; delete n.nextOfKin; return n; }); }} style={inputStyle(!!form.nextOfKin, !!errors.nextOfKin)} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = errors.nextOfKin ? "#EF4444" : form.nextOfKin ? "#0D5C6B" : "#E5E7EB"; }} />
                                            {errors.nextOfKin && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.3rem" }}>{errors.nextOfKin}</p>}
                                        </div>
                                    </div>

                                    {/* Additional details */}
                                    <div style={{ marginBottom: "1.75rem" }}>
                                        <FieldLabel>Additional Details <span style={{ fontWeight: 400, color: "#9CA3AF", textTransform: "none" as const, letterSpacing: 0, fontSize: "0.8rem" }}>(optional)</span></FieldLabel>
                                        <textarea placeholder="Any additional information..." value={form.additionalDetails} onChange={(e) => set("additionalDetails", e.target.value)} rows={2} style={{ ...inputStyle(!!form.additionalDetails), resize: "vertical" as const, lineHeight: 1.6, fontFamily: "var(--font-inter)" }} onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = form.additionalDetails ? "#0D5C6B" : "#E5E7EB"; }} />
                                    </div>

                                    {/* Family members */}
                                    {form.membershipType === "family" && (
                                        <div style={{ marginBottom: "1.75rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                                <FieldLabel required>Family Members</FieldLabel>
                                                <button onClick={addMember} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.4375rem 0.875rem", borderRadius: "0.5rem", border: "1.5px solid #0D5C6B", backgroundColor: "#E8F4F6", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#0D5C6B", cursor: "pointer" }}>
                                                    <Plus size={14} aria-hidden="true" /> Add Member
                                                </button>
                                            </div>
                                            {errors.familyMembers && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginBottom: "0.75rem" }}>{errors.familyMembers}</p>}
                                            {form.familyMembers.length === 0 ? (
                                                <div style={{ border: "2px dashed #E5E7EB", borderRadius: "0.875rem", padding: "2rem", textAlign: "center" as const }}>
                                                    <Users size={24} style={{ color: "#D1D5DB", margin: "0 auto 0.625rem" }} aria-hidden="true" />
                                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#9CA3AF" }}>No family members added yet. Click &quot;Add Member&quot; above.</p>
                                                </div>
                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 40px", gap: "0.625rem" }} className="family-row">
                                                        {["Full Name", "Relationship", "Date of Birth", "Sex", ""].map((h) => (
                                                            <div key={h} style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.75rem", color: "#6B7280", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{h}</div>
                                                        ))}
                                                    </div>
                                                    {form.familyMembers.map((member, i) => (
                                                        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 40px", gap: "0.625rem", alignItems: "center" }} className="family-row">
                                                            <input type="text" placeholder="Full name" value={member.fullName} onChange={(e) => updateMember(i, "fullName", e.target.value)} style={{ ...inputStyle(!!member.fullName), padding: "0.625rem 0.75rem" }} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = member.fullName ? "#0D5C6B" : "#E5E7EB"; }} />
                                                            <input type="text" placeholder="e.g. Wife" value={member.relationship} onChange={(e) => updateMember(i, "relationship", e.target.value)} style={{ ...inputStyle(!!member.relationship), padding: "0.625rem 0.75rem" }} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = member.relationship ? "#0D5C6B" : "#E5E7EB"; }} />
                                                            <input type="date" value={member.dob} onChange={(e) => updateMember(i, "dob", e.target.value)} style={{ ...inputStyle(!!member.dob), padding: "0.625rem 0.75rem" }} onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#0D5C6B"; }} onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = member.dob ? "#0D5C6B" : "#E5E7EB"; }} />
                                                            <select value={member.sex} onChange={(e) => updateMember(i, "sex", e.target.value)} style={{ ...inputStyle(!!member.sex), padding: "0.625rem 0.75rem", cursor: "pointer" }}>
                                                                <option value="">—</option>
                                                                <option value="Male">M</option>
                                                                <option value="Female">F</option>
                                                            </select>
                                                            <button onClick={() => removeMember(i)} style={{ width: "36px", height: "36px", borderRadius: "0.5rem", border: "1.5px solid #FECACA", backgroundColor: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }} aria-label="Remove member">
                                                                <Trash2 size={15} aria-hidden="true" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Fee summary */}
                                    <div style={{ backgroundColor: "#FAF5E8", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "0.875rem", padding: "1.125rem 1.25rem", marginBottom: "1.75rem" }}>
                                        <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#92400E", marginBottom: "0.5rem" }}>Payment Summary</p>
                                        {[
                                            { label: "Total membership fee:", value: fee.total, colour: "#B08D35" },
                                            { label: "Pay now (bank transfer):", value: fee.deposit, colour: "#0D5C6B" },
                                            { label: `Remaining (${fee.monthly}):`, value: fee.balance, colour: "#78350F" },
                                        ].map(({ label, value, colour }) => (
                                            <div key={label} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "0.5rem" }}>
                                                <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#78350F" }}>{label}</span>
                                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", color: colour }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── Signature pad ── */}
                                    <div style={{ marginBottom: "1.5rem" }}>
                                        <FieldLabel required>Your Signature</FieldLabel>
                                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280", marginBottom: "0.625rem", lineHeight: 1.5 }}>
                                            By signing below you confirm you have read and agree to the Khardal Hasana Terms & Conditions. Your signature will be embedded in the downloaded PDF application.
                                        </p>
                                        <SignaturePad
                                            onSave={setSignatureDataUrl}
                                            error={!!errors.signature}
                                        />
                                        {errors.signature && (
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginTop: "0.375rem" }}>
                                                {errors.signature}
                                            </p>
                                        )}
                                    </div>

                                    {/* T&C agreement checkbox */}
                                    <div
                                        style={{ backgroundColor: agreed ? "#E8F4F6" : "#F9FAFB", border: `1.5px solid ${agreed ? "#0D5C6B" : errors.agreed ? "#EF4444" : "#E5E7EB"}`, borderRadius: "0.875rem", padding: "1.125rem 1.25rem", marginBottom: "1.5rem", cursor: "pointer", transition: "all 0.2s ease" }}
                                        onClick={() => { setAgreed(!agreed); setErrors((p) => { const n = { ...p }; delete n.agreed; return n; }); }}
                                    >
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                                            <div style={{ width: "20px", height: "20px", borderRadius: "0.375rem", border: `2px solid ${agreed ? "#0D5C6B" : "#D1D5DB"}`, backgroundColor: agreed ? "#0D5C6B" : "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", transition: "all 0.2s ease" }}>
                                                {agreed && <CheckCircle size={12} style={{ color: "#ffffff" }} aria-hidden="true" />}
                                            </div>
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#374151", lineHeight: 1.6 }}>
                                                I hereby agree to the{" "}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveTab("terms"); }}
                                                    style={{ color: "#0D5C6B", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textDecorationColor: "#C9A84C", padding: 0, fontFamily: "var(--font-inter)", fontSize: "0.875rem" }}
                                                >
                                                    Terms & Conditions
                                                </button>
                                                {" "}of the JMA Kardhal Hasana project to the best of my knowledge.
                                            </p>
                                        </div>
                                    </div>
                                    {errors.agreed && <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#EF4444", marginBottom: "1.25rem" }}>{errors.agreed}</p>}

                                    {/* Submit error */}
                                    {submitError && (
                                        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem", padding: "0.875rem 1rem", marginBottom: "1.25rem", display: "flex", gap: "0.5rem" }}>
                                            <AlertCircle size={16} style={{ color: "#DC2626", flexShrink: 0 }} aria-hidden="true" />
                                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#DC2626" }}>{submitError}</p>
                                        </div>
                                    )}

                                    {/* Submit button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.9375rem", borderRadius: "0.5rem", border: "none", backgroundColor: submitting ? "#B08D35" : "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", cursor: submitting ? "not-allowed" : "pointer", transition: "background-color 0.2s ease" }}
                                        onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                        onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}
                                    >
                                        {submitting
                                            ? "Generating signed PDF…"
                                            : <><Send size={16} aria-hidden="true" /> Submit Application &amp; Download Signed PDF</>
                                        }
                                    </button>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#9CA3AF", textAlign: "center" as const, marginTop: "0.75rem" }}>
                                        Your signed application will be emailed to the KH committee and downloaded to your device.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════
          TERMS TAB
      ══════════════════════════════════ */}
            {activeTab === "terms" && (
                <section style={{ padding: "4rem 1.5rem 5rem" }}>
                    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
                            <div>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "0.375rem" }}>Last updated: June 2018</p>
                                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827" }}>Terms & Conditions</h2>
                            </div>
                            <button
                                onClick={downloadTCPDF}
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "1.5px solid #0D5C6B", backgroundColor: "#E8F4F6", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#0D5C6B", cursor: "pointer", transition: "all 0.2s ease" }}
                                onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "#0D5C6B"; el.style.color = "#ffffff"; }}
                                onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = "#E8F4F6"; el.style.color = "#0D5C6B"; }}
                            >
                                <Download size={15} aria-hidden="true" />
                                Download PDF
                            </button>
                        </div>

                        {/* Intro */}
                        <div style={{ backgroundColor: "#E8F4F6", borderRadius: "1rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
                            <p style={{ fontFamily: "var(--font-noto)", fontStyle: "italic", fontSize: "0.9375rem", lineHeight: 1.75, color: "#0D5C6B" }}>
                                The aim of this noble service is not to build walls with too many terms and conditions. Our only objective is to get closer to the Almighty by uniting always, especially when another Muslim is in sorrow.
                            </p>
                        </div>

                        {/* Accordion */}
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                            {tcSections.map((section, i) => {
                                const isOpen = openTC === i;
                                return (
                                    <div key={section.title} style={{ backgroundColor: "#ffffff", borderRadius: "0.875rem", border: `1px solid ${isOpen ? "#0D5C6B" : "#E5E7EB"}`, overflow: "hidden", transition: "border-color 0.2s ease" }}>
                                        <button
                                            onClick={() => setOpenTC(isOpen ? null : i)}
                                            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.125rem 1.375rem", background: isOpen ? "#E8F4F6" : "none", border: "none", cursor: "pointer", textAlign: "left" as const }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div style={{ width: "24px", height: "24px", borderRadius: "0.375rem", backgroundColor: isOpen ? "#0D5C6B" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.75rem", color: isOpen ? "#ffffff" : "#6B7280", flexShrink: 0 }}>
                                                    {i + 1}
                                                </div>
                                                <span style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: isOpen ? "#0D5C6B" : "#111827" }}>{section.title}</span>
                                            </div>
                                            <ChevronDown size={18} style={{ color: isOpen ? "#0D5C6B" : "#9CA3AF", flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} aria-hidden="true" />
                                        </button>
                                        {isOpen && (
                                            <div style={{ padding: "0.25rem 1.375rem 1.375rem" }}>
                                                <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                                                    {section.clauses.map((clause, j) => (
                                                        <li key={j} style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", color: "#4B5563", lineHeight: 1.75 }}>{clause}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Declaration + CTAs */}
                        <div style={{ backgroundColor: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: "1rem", padding: "1.5rem", marginTop: "2rem", textAlign: "center" as const }}>
                            <FileText size={24} style={{ color: "#0D5C6B", margin: "0 auto 0.75rem" }} aria-hidden="true" />
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1rem", color: "#111827", marginBottom: "0.5rem" }}>
                                I HEREBY DECLARE THAT I UNDERSTAND THE ABOVE MENTIONED TERMS AND CONDITIONS OF THE JMA KARDHAL HASANA PROJECT TO THE BEST OF MY KNOWLEDGE.
                            </p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#6B7280", marginBottom: "1.25rem" }}>
                                By submitting an application and drawing your signature you are agreeing to these terms.
                            </p>
                            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" as const }}>
                                <button
                                    onClick={() => setActiveTab("apply")}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", border: "none", cursor: "pointer", transition: "background-color 0.2s ease" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B08D35"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A84C"; }}
                                >
                                    I agree — Register now
                                    <ArrowRight size={15} aria-hidden="true" />
                                </button>
                                <button
                                    onClick={downloadTCPDF}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.8125rem 1.75rem", borderRadius: "0.5rem", backgroundColor: "#ffffff", color: "#374151", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9375rem", border: "1.5px solid #E5E7EB", cursor: "pointer" }}
                                >
                                    <Download size={15} aria-hidden="true" />
                                    Download T&amp;C PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <style>{`
        @media (max-width: 767px) {
          .about-grid    { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .example-grid  { grid-template-columns: 1fr !important; }
          .fees-grid     { grid-template-columns: 1fr !important; }
          .bank-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .contacts-grid { grid-template-columns: 1fr !important; }
          .type-selector { grid-template-columns: 1fr !important; }
          .form-row      { grid-template-columns: 1fr !important; }
          .family-row    { grid-template-columns: 1fr 1fr 1fr 60px 36px !important; }
        }
      `}</style>
        </main>
    );
}