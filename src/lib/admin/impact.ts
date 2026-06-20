import { createClient } from "@/lib/supabase/server";
import type { DBImpactStory, DBAnnualHighlight, DBProjectCategory } from "@/types/database";

// ============================================
// IMPACT STORIES — full CRUD
// ============================================

export async function getAllImpactStories(): Promise<DBImpactStory[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("impact_stories")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("[getAllImpactStories]", error);
        return [];
    }
    return data ?? [];
}

export async function getImpactStoryById(id: string): Promise<DBImpactStory | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("impact_stories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getImpactStoryById]", error);
        return null;
    }
    return data;
}

export interface ImpactStoryInput {
    name: string;
    age: number | null;
    location: string;
    category: DBImpactStory["category"];
    quote: string;
    detail: string;
    image_url: string | null;
    display_order: number;
}

export async function createImpactStory(input: ImpactStoryInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("impact_stories")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateImpactStory(id: string, input: Partial<ImpactStoryInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("impact_stories")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteImpactStory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("impact_stories").delete().eq("id", id);
    if (error) throw new Error(error.message);
}

// ============================================
// ANNUAL HIGHLIGHTS — lightweight add/edit/delete
// ============================================

export async function getAllAnnualHighlights(): Promise<DBAnnualHighlight[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("annual_highlights")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("[getAllAnnualHighlights]", error);
        return [];
    }
    return data ?? [];
}

export interface AnnualHighlightInput {
    year_label: string;
    raised: number;
    projects_completed: number;
    families_supported: number;
    is_latest: boolean;
    display_order: number;
}

export async function createAnnualHighlight(input: AnnualHighlightInput) {
    const supabase = await createClient();

    // If this one is marked latest, un-mark all others first
    if (input.is_latest) {
        await supabase.from("annual_highlights").update({ is_latest: false }).neq("id", "");
    }

    const { data, error } = await supabase
        .from("annual_highlights")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateAnnualHighlight(id: string, input: Partial<AnnualHighlightInput>) {
    const supabase = await createClient();

    if (input.is_latest) {
        await supabase.from("annual_highlights").update({ is_latest: false }).neq("id", id);
    }

    const { data, error } = await supabase
        .from("annual_highlights")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteAnnualHighlight(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("annual_highlights").delete().eq("id", id);
    if (error) throw new Error(error.message);
}

// ============================================
// PROJECT CATEGORIES — fixed set, update only (seeded once)
// ============================================

export async function getAllProjectCategories(): Promise<DBProjectCategory[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("project_categories")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("[getAllProjectCategories]", error);
        return [];
    }
    return data ?? [];
}

export interface ProjectCategoryUpdateInput {
    count: number;
    percentage: number;
}

export async function updateProjectCategory(id: string, input: ProjectCategoryUpdateInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("project_categories")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}