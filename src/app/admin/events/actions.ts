"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createEvent,
    updateEvent,
    deleteEvent,
    createRSVP,
    type EventInput,
} from "@/lib/admin/events";
import { slugify } from "@/lib/admin/events-utils";

export async function createEventAction(formData: FormData) {
    const title = formData.get("title") as string;

    const input: EventInput = {
        slug: slugify(title),
        title,
        description: formData.get("description") as string,
        event_date: formData.get("event_date") as string,
        event_time: formData.get("event_time") as string,
        location: formData.get("location") as string,
        address: (formData.get("address") as string) || null,
        image_url: (formData.get("image_url") as string) || null,
    };

    await createEvent(input);

    revalidatePath("/events");
    revalidatePath("/");
    revalidatePath("/admin/events");

    redirect("/admin/events");
}

export async function updateEventAction(id: string, formData: FormData) {
    const title = formData.get("title") as string;

    const input: Partial<EventInput> = {
        title,
        description: formData.get("description") as string,
        event_date: formData.get("event_date") as string,
        event_time: formData.get("event_time") as string,
        location: formData.get("location") as string,
        address: (formData.get("address") as string) || null,
        image_url: (formData.get("image_url") as string) || null,
    };

    await updateEvent(id, input);

    revalidatePath("/events");
    revalidatePath(`/events/${formData.get("slug")}`);
    revalidatePath("/");
    revalidatePath("/admin/events");

    redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
    await deleteEvent(id);

    revalidatePath("/events");
    revalidatePath("/");
    revalidatePath("/admin/events");
}

// ============================================
// Public RSVP submission
// ============================================

export async function submitRSVPAction(input: {
    eventId: string;
    name: string;
    email: string;
    guests: number;
}) {
    if (!input.name.trim() || !input.email.includes("@")) {
        return { success: false, error: "Please enter a valid name and email." };
    }

    try {
        await createRSVP({
            event_id: input.eventId,
            name: input.name.trim(),
            email: input.email.trim(),
            guests: input.guests,
        });
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        };
    }
}