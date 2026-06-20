import { createClient } from "@/lib/supabase/server";
import type { DBCampaign, DBCampaignUpdate } from "@/types/database";

// ============================================
// READ (used by both admin and public pages)
// ============================================

export async function getAllCampaigns(): Promise<DBCampaign[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[getAllCampaigns]", error);
        return [];
    }
    return data ?? [];
}

export async function getCampaignBySlug(slug: string): Promise<DBCampaign | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("[getCampaignBySlug]", error);
        return null;
    }
    return data;
}

export async function getCampaignById(id: string): Promise<DBCampaign | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getCampaignById]", error);
        return null;
    }
    return data;
}

export async function getCampaignUpdates(campaignId: string): Promise<DBCampaignUpdate[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaign_updates")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("date", { ascending: false });

    if (error) {
        console.error("[getCampaignUpdates]", error);
        return [];
    }
    return data ?? [];
}

// ============================================
// WRITE (admin only — protected by RLS policies)
// ============================================

export interface CampaignInput {
    slug: string;
    title: string;
    short_description: string;
    description: string;
    category: DBCampaign["category"];
    status: DBCampaign["status"];
    goal: number;
    raised: number;
    donor_count: number;
    days_remaining: number | null;
    image_url: string | null;
}

export async function createCampaign(input: CampaignInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateCampaign(id: string, input: Partial<CampaignInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("campaigns")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteCampaign(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (error) throw new Error(error.message);
}

/**
 * Generates a URL-safe slug from a title, e.g.
 * "Mankumban Masjid Reconstruction" -> "mankumban-masjid-reconstruction"
 */
export function slugify(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}