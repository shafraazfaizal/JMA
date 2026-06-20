export function slugify(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Computes whether an event is in the past based on its date,
 * rather than relying on a manually-toggled admin field.
 * An event is "past" once the day after its event_date has begun
 * (so events remain "upcoming" through their entire scheduled day).
 */
export function isEventPast(eventDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(eventDate);
    date.setHours(0, 0, 0, 0);

    return date.getTime() < today.getTime();
}