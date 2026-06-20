import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { getEventById, getRSVPsForEvent } from "@/lib/admin/events";
import EventForm from "@/components/admin/EventForm";

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) notFound();

    const rsvps = await getRSVPsForEvent(id);

    return (
        <div style={{ maxWidth: "720px" }}>
            <Link href="/admin/events" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "#6B7280", textDecoration: "none", marginBottom: "1.5rem" }}>
                <ArrowLeft size={15} aria-hidden="true" /> Back to Events
            </Link>

            <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.375rem" }}>
                Edit Event
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "2rem" }}>
                Changes are published to the live site immediately upon saving.
            </p>

            {/* RSVP list */}
            {rsvps.length > 0 && (
                <div style={{ backgroundColor: "#E8F4F6", borderRadius: "1rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
                        <Users size={18} style={{ color: "#0D5C6B" }} aria-hidden="true" />
                        <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.9375rem", color: "#0D5C6B" }}>
                            {rsvps.length} {rsvps.length === 1 ? "Person Has" : "People Have"} RSVP&apos;d
                        </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
                        {rsvps.map((r) => (
                            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", borderRadius: "0.5rem", padding: "0.625rem 0.875rem" }}>
                                <div>
                                    <p style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.875rem", color: "#111827" }}>{r.name}</p>
                                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "#9CA3AF" }}>{r.email}</p>
                                </div>
                                <span style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "0.8125rem", color: "#0D5C6B" }}>
                                    {r.guests} {r.guests === 1 ? "guest" : "guests"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "2rem" }}>
                <EventForm event={event} />
            </div>
        </div>
    );
}