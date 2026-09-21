// src/lib/admin/showcase.ts
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { DBShowcaseSubmission, ShowcaseCategory, ShowcaseStatus } from "@/types/database";

export interface ShowcaseInput {
    child_name: string;
    age_group: DBShowcaseSubmission["age_group"];
    parent_email: string;
    parent_name: string;
    category: ShowcaseCategory;
    title: string;
    description: string;
    file_url: string | null;
    file_type: DBShowcaseSubmission["file_type"];
    consent_publish: boolean;
    show_name: boolean;
}

export async function getAllShowcaseSubmissions(): Promise<DBShowcaseSubmission[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("student_showcase_submissions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getPublishedShowcaseSubmissions(
    category?: ShowcaseCategory
): Promise<DBShowcaseSubmission[]> {
    const supabase = await createClient();
    let query = supabase
        .from("student_showcase_submissions")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function createShowcaseSubmission(input: ShowcaseInput): Promise<DBShowcaseSubmission> {
    const supabase = await createServiceClient(); // service role — bypasses RLS for public submissions
    const { data, error } = await supabase
        .from("student_showcase_submissions")
        .insert({ ...input, status: "pending" })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateShowcaseStatus(
    id: string,
    status: ShowcaseStatus,
    admin_note?: string
): Promise<void> {
    const supabase = await createClient();
    const update: Record<string, unknown> = { status };
    if (status === "published") update.published_at = new Date().toISOString();
    if (admin_note !== undefined) update.admin_note = admin_note;

    const { error } = await supabase
        .from("student_showcase_submissions")
        .update(update)
        .eq("id", id);

    if (error) throw new Error(error.message);
}

export async function deleteShowcaseSubmission(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("student_showcase_submissions")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}