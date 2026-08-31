import { createClient } from "@/lib/supabase/server";
import type { DBNewsArticle } from "@/types/database";

export { slugify, estimateReadTime } from "@/lib/admin/news-utils";

// ============================================
// READ
// ============================================

export async function getAllNewsArticles(): Promise<DBNewsArticle[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false });

    if (error) {
        console.error("[getAllNewsArticles]", error.message);
        return [];
    }
    return data ?? [];
}

export async function getNewsArticleBySlug(slug: string): Promise<DBNewsArticle | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle(); // ← was .single() which throws when no row found

    if (error) {
        console.error("[getNewsArticleBySlug]", error.message);
        return null;
    }
    return data ?? null;
}

export async function getNewsArticleById(id: string): Promise<DBNewsArticle | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", id)
        .maybeSingle(); // ← same fix for consistency

    if (error) {
        console.error("[getNewsArticleById]", error.message);
        return null;
    }
    return data ?? null;
}

// ============================================
// WRITE (admin only — protected by RLS policies)
// ============================================

export interface NewsArticleInput {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: DBNewsArticle["category"];
    author: string;
    image_url: string | null;
    pdf_url: string | null;
    read_time: number;
    published_at: string;
}

export async function createNewsArticle(input: NewsArticleInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("news_articles")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateNewsArticle(id: string, input: Partial<NewsArticleInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("news_articles")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteNewsArticle(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("news_articles").delete().eq("id", id);
    if (error) throw new Error(error.message);
}