"use client";

import { useState, useTransition } from "react";
import {
    Clock, Eye, CheckCircle, XCircle, RefreshCw,
    MapPin, Users, PoundSterling, AlertTriangle,
    FileText, Mail, Phone, ExternalLink,
} from "lucide-react";
import { updateProjectRequestStatusAction } from "./actions";

type Status = "pending" | "under_review" | "approved" | "declined";

interface ProjectRequest {
    id: string;
    reference_number: string;
    project_type: string;
    title: string;
    location_country: string;
    location_city: string;
    beneficiary_count: number;
    beneficiary_description: string;
    estimated_cost: number;
    urgency: string;
    description: string;
    document_url: string | null;
    applicant_name: string;
    applicant_email: string;
    applicant_phone: string;
    relationship_to_beneficiary: string;
    status: Status;
    admin_notes: string | null;
    created_at: string;
}

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: typeof Clock }> = {
    pending: { label: "Pending", bg: "#FAF5E8", text: "#B08D35", icon: Clock },
    under_review: { label: "Under Review", bg: "#EEF2FF", text: "#4338CA", icon: Eye },
    approved: { label: "Approved", bg: "#F0FDF4", text: "#15803D", icon: CheckCircle },
    declined: { label: "Declined", bg: "#FEF2F2", text: "#DC2626", icon: XCircle },
};

const urgencyColour: Record<string, string> = {
    Low: "#34D399", Medium: "#FBBF24", Urgent: "#F87171",
};

const filterOptions: { value: string; label: string }[] = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
];

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function RequestCard({ req, onStatusChange }: { req: ProjectRequest; onStatusChange: (id: string, status: Status, notes: string) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [notes, setNotes] = useState(req.admin_notes ?? "");
    const [isPending, startTransition] = useTransition();
    const cfg = statusConfig[req.status];
    const StatusIcon = cfg.icon;

    const handleStatus = (newStatus: Status) => {
        startTransition(async () => {
            await updateProjectRequestStatusAction(req.id, newStatus, notes);
            onStatusChange(req.id, newStatus, notes);
        });
    };

    return (
        <div style={{
            backgroundColor: "#ffffff", borderRadius: "0.875rem",
            border: "1px solid #E5E7EB", overflow: "hidden",
            opacity: isPending ? 0.6 : 1, transition: "opacity 0.2s ease",
        }}>
            {/* Card header */}
            <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" as const }}>
                {/* Urgency dot */}
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: urgencyColour[req.urgency] ?? "#9CA3AF", flexShrink: 0, marginTop: "5px" }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" as const, marginBottom: "0.375rem" }}>
                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#111827" }}>{req.title}</p>
                        <span style={{ backgroundColor: cfg.bg, color: cfg.text, fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "0.2rem 0.625rem", borderRadius: "9999px", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                            <StatusIcon size={10} aria-hidden="true" /> {cfg.label}
                        </span>
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>{req.reference_number}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.25rem 1rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><MapPin size={11} aria-hidden="true" />{req.location_city}, {req.location_country}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Users size={11} aria-hidden="true" />{req.beneficiary_count} beneficiar{req.beneficiary_count === 1 ? "y" : "ies"}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><PoundSterling size={11} aria-hidden="true" />£{req.estimated_cost.toLocaleString()}</span>
                        <span>{req.project_type} · {fmtDate(req.created_at)}</span>
                    </div>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{ padding: "0.5rem 0.875rem", borderRadius: "0.375rem", border: "1.5px solid #E5E7EB", backgroundColor: "#ffffff", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", cursor: "pointer", flexShrink: 0 }}
                >
                    {expanded ? "Close" : "View Details"}
                </button>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div style={{ borderTop: "1px solid #F3F4F6", padding: "1.5rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }} className="req-detail-grid">

                        {/* Left */}
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
                            <div>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: "0.375rem" }}>Applicant</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.9rem", color: "#111827", marginBottom: "0.25rem" }}>{req.applicant_name}</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#6B7280" }}>{req.relationship_to_beneficiary}</p>
                                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.25rem", marginTop: "0.5rem" }}>
                                    <a href={`mailto:${req.applicant_email}`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#0D5C6B", textDecoration: "none" }}>
                                        <Mail size={12} aria-hidden="true" /> {req.applicant_email}
                                    </a>
                                    <a href={`tel:${req.applicant_phone}`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontSize: "0.8125rem", color: "#0D5C6B", textDecoration: "none" }}>
                                        <Phone size={12} aria-hidden="true" /> {req.applicant_phone}
                                    </a>
                                </div>
                            </div>

                            <div>
                                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: "0.375rem" }}>Beneficiaries</p>
                                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#374151", lineHeight: 1.6 }}>{req.beneficiary_description}</p>
                            </div>

                            {req.document_url && (
                                <a href={req.document_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#0D5C6B", textDecoration: "none" }}>
                                    <FileText size={14} aria-hidden="true" /> View Document <ExternalLink size={12} aria-hidden="true" />
                                </a>
                            )}
                        </div>

                        {/* Right */}
                        <div>
                            <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9CA3AF", marginBottom: "0.375rem" }}>Description</p>
                            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" as const }}>{req.description}</p>
                        </div>
                    </div>

                    {/* Admin notes + status actions */}
                    <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "1.25rem", display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                        <div>
                            <label style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#374151", display: "block", marginBottom: "0.375rem" }}>Admin Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                placeholder="Add internal notes for the committee…"
                                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1.5px solid #E5E7EB", fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#111827", resize: "vertical" as const, boxSizing: "border-box" as const, outline: "none" }}
                            />
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.625rem" }}>
                            {([
                                { status: "under_review" as Status, label: "Mark Under Review", bg: "#EEF2FF", text: "#4338CA", icon: RefreshCw },
                                { status: "approved" as Status, label: "Approve", bg: "#F0FDF4", text: "#15803D", icon: CheckCircle },
                                { status: "declined" as Status, label: "Decline", bg: "#FEF2F2", text: "#DC2626", icon: XCircle },
                            ]).map(({ status, label, bg, text, icon: Icon }) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatus(status)}
                                    disabled={req.status === status || isPending}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "0.375rem",
                                        padding: "0.5625rem 1rem", borderRadius: "0.5rem",
                                        border: "none", backgroundColor: req.status === status ? bg : "#F3F4F6",
                                        color: req.status === status ? text : "#6B7280",
                                        fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem",
                                        cursor: req.status === status || isPending ? "default" : "pointer",
                                        opacity: req.status === status ? 1 : 0.8,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <Icon size={13} aria-hidden="true" /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProjectRequestsClient({ requests: initial }: { requests: ProjectRequest[] }) {
    const [requests, setRequests] = useState(initial);
    const [filter, setFilter] = useState("all");

    const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

    const counts = {
        all: requests.length,
        pending: requests.filter((r) => r.status === "pending").length,
        under_review: requests.filter((r) => r.status === "under_review").length,
        approved: requests.filter((r) => r.status === "approved").length,
        declined: requests.filter((r) => r.status === "declined").length,
    };

    const handleStatusChange = (id: string, status: Status, notes: string) => {
        setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status, admin_notes: notes } : r));
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                    Project Requests
                </h1>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                    {requests.length} total · {counts.pending} pending review
                </p>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem", flexWrap: "wrap" as const }}>
                {filterOptions.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        style={{
                            padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "1.5px solid",
                            borderColor: filter === value ? "#0D5C6B" : "#E5E7EB",
                            backgroundColor: filter === value ? "#0D5C6B" : "#ffffff",
                            color: filter === value ? "#ffffff" : "#374151",
                            fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem",
                            cursor: "pointer", transition: "all 0.15s ease",
                            display: "flex", alignItems: "center", gap: "0.375rem",
                        }}
                    >
                        {label}
                        <span style={{
                            backgroundColor: filter === value ? "rgba(255,255,255,0.2)" : "#F3F4F6",
                            color: filter === value ? "#ffffff" : "#6B7280",
                            fontWeight: 700, fontSize: "0.7rem", padding: "0.1rem 0.5rem",
                            borderRadius: "9999px",
                        }}>
                            {counts[value as keyof typeof counts]}
                        </span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                    <AlertTriangle size={28} style={{ color: "#D1D5DB", margin: "0 auto 0.75rem" }} aria-hidden="true" />
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#9CA3AF" }}>
                        No {filter === "all" ? "" : filter.replace("_", " ")} requests yet.
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                    {filtered.map((req) => (
                        <RequestCard key={req.id} req={req} onStatusChange={handleStatusChange} />
                    ))}
                </div>
            )}

            <style>{`
        @media (max-width: 639px) { .req-detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </div>
    );
}