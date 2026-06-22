import { createClient } from "@/lib/supabase/server";
import type { DBHeroAnnouncement } from "@/types/announcement-types";

export async function getActiveAnnouncements(): Promise<DBHeroAnnouncement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("hero_announcements")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

    if (error) {
        console.error("[getActiveAnnouncements]", error);
        return [];
    }
    return data ?? [];
}

export async function getAllAnnouncements(): Promise<DBHeroAnnouncement[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("hero_announcements")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("[getAllAnnouncements]", error);
        return [];
    }
    return data ?? [];
}

export interface AnnouncementInput {
    message: string;
    link_url: string | null;
    is_active: boolean;
    display_order: number;
}

export async function createAnnouncement(input: AnnouncementInput) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("hero_announcements").insert(input).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export async function updateAnnouncement(id: string, input: Partial<AnnouncementInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("hero_announcements").update(input).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data;
}

export async function deleteAnnouncement(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("hero_announcements").delete().eq("id", id);
    if (error) throw new Error(error.message);
}