import { getAllEvents } from "@/lib/admin/events";
import EventsPageClient from "@/components/events/EventsPageClient";

export const revalidate = 60;

export default async function EventsPage() {
    const events = await getAllEvents();

    return <EventsPageClient events={events} />;
}