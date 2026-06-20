import { createClient } from "@/lib/supabase/server";
import type { DBEvent, DBEventRSVP } from "@/types/database";

export { slugify, isEventPast } from "@/lib/admin/events-utils";

// ============================================
// READ
// ============================================

export async function getAllEvents(): Promise<DBEvent[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

    if (error) {
        console.error("[getAllEvents]", error);
        return [];
    }
    return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<DBEvent | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("[getEventBySlug]", error);
        return null;
    }
    return data;
}

export async function getEventById(id: string): Promise<DBEvent | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getEventById]", error);
        return null;
    }
    return data;
}

export async function getRSVPsForEvent(eventId: string): Promise<DBEventRSVP[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_rsvps")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[getRSVPsForEvent]", error);
        return [];
    }
    return data ?? [];
}

export async function getAllRSVPCounts(): Promise<Record<string, number>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("event_rsvps").select("event_id");

    if (error) {
        console.error("[getAllRSVPCounts]", error);
        return {};
    }

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row) => {
        counts[row.event_id] = (counts[row.event_id] ?? 0) + 1;
    });
    return counts;
}

// ============================================
// WRITE — events (admin only — protected by RLS)
// ============================================

export interface EventInput {
    slug: string;
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    address: string | null;
    image_url: string | null;
}

export async function createEvent(input: EventInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("events")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteEvent(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw new Error(error.message);
}

// ============================================
// WRITE — RSVPs (public can insert; see RLS policy)
// ============================================

export interface RSVPInput {
    event_id: string;
    name: string;
    email: string;
    guests: number;
}

export async function createRSVP(input: RSVPInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("event_rsvps")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}