import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllEvents, getAllRSVPCounts } from "@/lib/admin/events";
import EventRow from "@/components/admin/EventRow";

export default async function AdminEventsPage() {
    const [events, rsvpCounts] = await Promise.all([
        getAllEvents(),
        getAllRSVPCounts(),
    ]);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap" as const, gap: "1rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                        Events
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                        {events.length} event{events.length === 1 ? "" : "s"} · Past/Upcoming is calculated automatically from the event date
                    </p>
                </div>
                <Link
                    href="/admin/events/new"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                >
                    <Plus size={16} aria-hidden="true" />
                    New Event
                </Link>
            </div>

            {events.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "1.25rem" }}>
                        No events yet. Create your first one to get started.
                    </p>
                    <Link href="/admin/events/new" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
                        <Plus size={16} aria-hidden="true" /> New Event
                    </Link>
                </div>
            ) : (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                    {events.map((event, i) => (
                        <EventRow key={event.id} event={event} rsvpCount={rsvpCounts[event.id] ?? 0} isLast={i === events.length - 1} />
                    ))}
                </div>
            )}
        </div>
    );
}