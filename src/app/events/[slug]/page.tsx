import { notFound } from "next/navigation";
import { getEventBySlug, getAllEvents } from "@/lib/admin/events";
import { isEventPast } from "@/lib/admin/events-utils";
import EventDetailClient from "@/components/events/EventDetailClient";

export const revalidate = 60;

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) notFound();

    const allEvents = await getAllEvents();
    const eventIsPast = isEventPast(event.event_date);

    const related = allEvents
        .filter((e) => e.id !== event.id && isEventPast(e.event_date) === eventIsPast)
        .slice(0, 2);

    return <EventDetailClient event={event} isPast={eventIsPast} related={related} />;
}