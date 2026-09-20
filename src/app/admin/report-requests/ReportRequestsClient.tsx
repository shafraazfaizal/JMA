"use client";

import { useState, useTransition } from "react";
import {
    Clock, Send, XCircle, AlertTriangle,
    FileText, Mail, Building2, Trash2, ChevronDown, ChevronUp,
} from "lucide-react";
import { updateReportRequestStatusAction, deleteReportRequestAction } from "./actions";

type Status = "pending" | "sent" | "rejected";

interface ReportRequest {
    id: string;
    name: string;
    email: string;
    organisation: string | null;
    reason: string | null;
    report_year: string;
    status: Status;
    admin_notes: string | null;
    created_at: string;
}

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: typeof Clock }> = {
    pending: { label: "Pending", bg: "#FAF5E8", text: "#B08D35", icon: Clock },
    sent: { label: "Sent", bg: "#F0FDF4", text: "#15803D", icon: Send },
    rejected: { label: "Rejected", bg: "#FEF2F2", text: "#DC2626", icon: XCircle },
};

const filterOptions = [
    { value: "all", label: "All Requests" },
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
    { value: "rejected", label: "Rejected" },
];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function RequestCard({ req }: { req: ReportRequest }) {
    const [expanded, setExpanded] = useState(false);
    const [notes, setNotes] = useState(req.admin_notes ?? "");
    const [confirmDelete, setConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const cfg = statusConfig[req.status];
    const StatusIcon = cfg.icon;

    const handleStatus = (status: Status) => {
        startTransition(async () => {
            await updateReportRequestStatusAction(req.id, status, notes);
        });
    };

    const handleDelete = () => {
        if (!confirmDelete) { setConfirm(true); return; }
        startTransition(async () => {
            await deleteReportRequestAction(req.id);
        });
    };

    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "0.75rem",
                border: "1px solid #E5E7EB",
                overflow: "hidden",
                opacity: isPending ? 0.6 : 1,
                transition: "opacity 0.2s ease",
            }}
        >
            {/* Card header */}
            <div
                style={{
                    padding: "1.125rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                }}
                onClick={() => setExpanded(v => !v)}
            >
                {/* Icon */}
                <div
                    style={{
                        width: "38px", height: "38px", borderRadius: "0.5rem",
                        backgroundColor: "#F0FDF4",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <FileText size={18} style={{ color: "#073D47" }} />
                </div>

                {/* Name + year */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#111827", margin: 0, lineHeight: 1.3 }}>
                        {req.name}
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "#6B7280", margin: "0.125rem 0 0", lineHeight: 1.4 }}>
                        Report Year: <strong style={{ color: "#374151" }}>{req.report_year}</strong>
                        {req.organisation && <> · {req.organisation}</>}
                    </p>
                </div>

                {/* Status badge */}
                <span
                    style={{
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        padding: "0.25rem 0.625rem", borderRadius: "9999px",
                        fontSize: "0.75rem", fontWeight: 600,
                        backgroundColor: cfg.bg, color: cfg.text,
                        flexShrink: 0,
                    }}
                >
                    <StatusIcon size={11} />
                    {cfg.label}
                </span>

                {/* Date */}
                <span style={{ fontSize: "0.75rem", color: "#9CA3AF", flexShrink: 0, display: "none" as const }} className="hide-mobile">
                    {formatDate(req.created_at)}
                </span>

                {/* Expand toggle */}
                <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
                    style={{
                        width: "28px", height: "28px", borderRadius: "0.375rem",
                        border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", flexShrink: 0, color: "#6B7280",
                    }}
                >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            {/* Expanded details */}
            {expanded && (
                <div style={{ borderTop: "1px solid #F3F4F6", padding: "1.25rem" }}>

                    {/* Info grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                        <InfoItem icon={<Mail size={14} />} label="Email" value={req.email} />
                        <InfoItem icon={<Building2 size={14} />} label="Organisation" value={req.organisation ?? "—"} />
                        <InfoItem icon={<FileText size={14} />} label="Report Year" value={req.report_year} />
                        <InfoItem icon={<Clock size={14} />} label="Submitted" value={formatDate(req.created_at)} />
                    </div>

                    {/* Reason */}
                    {req.reason && (
                        <div style={{ marginBottom: "1.25rem" }}>
                            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
                                Reason for Request
                            </p>
                            <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.6, margin: 0 }}>
                                {req.reason}
                            </p>
                        </div>
                    )}

                    {/* Admin notes */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: "0.375rem" }}>
                            Admin Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Add internal notes (not visible to requester)..."
                            rows={3}
                            style={{
                                width: "100%", padding: "0.625rem 0.75rem",
                                border: "1px solid #E5E7EB", borderRadius: "0.5rem",
                                fontSize: "0.875rem", color: "#374151",
                                resize: "vertical" as const, fontFamily: "inherit",
                                backgroundColor: "#FAFAFA", outline: "none",
                                boxSizing: "border-box" as const,
                            }}
                        />
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.625rem", alignItems: "center" }}>

                        {req.status !== "sent" && (
                            <ActionButton
                                onClick={() => handleStatus("sent")}
                                bg="#F0FDF4" text="#15803D" border="#BBF7D0"
                                icon={<Send size={13} />}
                                label="Mark as Sent"
                            />
                        )}

                        {req.status !== "pending" && (
                            <ActionButton
                                onClick={() => handleStatus("pending")}
                                bg="#FAF5E8" text="#B08D35" border="#FDE68A"
                                icon={<Clock size={13} />}
                                label="Mark as Pending"
                            />
                        )}

                        {req.status !== "rejected" && (
                            <ActionButton
                                onClick={() => handleStatus("rejected")}
                                bg="#FEF2F2" text="#DC2626" border="#FECACA"
                                icon={<XCircle size={13} />}
                                label="Reject"
                            />
                        )}

                        <div style={{ marginLeft: "auto" }}>
                            <button
                                onClick={handleDelete}
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.375rem",
                                    padding: "0.4375rem 0.875rem", borderRadius: "0.5rem",
                                    border: `1px solid ${confirmDelete ? "#DC2626" : "#E5E7EB"}`,
                                    backgroundColor: confirmDelete ? "#FEF2F2" : "#ffffff",
                                    color: confirmDelete ? "#DC2626" : "#9CA3AF",
                                    fontSize: "0.8125rem", fontWeight: 500,
                                    cursor: "pointer", transition: "all 0.15s ease",
                                }}
                                onMouseLeave={() => setConfirm(false)}
                            >
                                <Trash2 size={13} />
                                {confirmDelete ? "Click again to confirm" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "0 0 0.25rem" }}>
                {label}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#374151", margin: 0, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span style={{ color: "#9CA3AF" }}>{icon}</span>
                {value}
            </p>
        </div>
    );
}

function ActionButton({ onClick, bg, text, border, icon, label }: {
    onClick: () => void; bg: string; text: string; border: string;
    icon: React.ReactNode; label: string;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.4375rem 0.875rem", borderRadius: "0.5rem",
                border: `1px solid ${border}`, backgroundColor: bg, color: text,
                fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                transition: "filter 0.15s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(0.96)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; }}
        >
            {icon}
            {label}
        </button>
    );
}

export default function ReportRequestsClient({ requests }: { requests: ReportRequest[] }) {
    const [filter, setFilter] = useState<string>("all");

    const counts = {
        all: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        sent: requests.filter(r => r.status === "sent").length,
        rejected: requests.filter(r => r.status === "rejected").length,
    };

    const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.75rem", color: "#073D47", margin: "0 0 0.375rem" }}>
                    Report Requests
                </h1>
                <p style={{ color: "#6B7280", fontSize: "0.9375rem", margin: 0 }}>
                    Manage annual report requests submitted through the website.
                </p>
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "1.5rem", flexWrap: "wrap" as const }}>
                {filterOptions.map(opt => {
                    const count = counts[opt.value as keyof typeof counts];
                    const isActive = filter === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                padding: "0.4375rem 0.875rem", borderRadius: "0.5rem",
                                border: `1px solid ${isActive ? "#073D47" : "#E5E7EB"}`,
                                backgroundColor: isActive ? "#073D47" : "#ffffff",
                                color: isActive ? "#ffffff" : "#374151",
                                fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {opt.label}
                            <span
                                style={{
                                    padding: "0.1rem 0.45rem", borderRadius: "9999px",
                                    fontSize: "0.6875rem", fontWeight: 700,
                                    backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "#F3F4F6",
                                    color: isActive ? "#ffffff" : "#6B7280",
                                }}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Cards list */}
            {filtered.length === 0 ? (
                <div
                    style={{
                        border: "2px dashed #E5E7EB", borderRadius: "0.75rem",
                        padding: "3rem 2rem", textAlign: "center" as const,
                        color: "#9CA3AF",
                    }}
                >
                    <AlertTriangle size={32} style={{ margin: "0 auto 0.75rem", opacity: 0.4 }} />
                    <p style={{ fontWeight: 600, margin: "0 0 0.25rem" }}>No requests found</p>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>
                        {filter === "all" ? "No report requests have been submitted yet." : `No ${filter} requests at the moment.`}
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                    {filtered.map(req => (
                        <RequestCard key={req.id} req={req} />
                    ))}
                </div>
            )}
        </div>
    );
}