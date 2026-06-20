import { createClient } from "@/lib/supabase/server";
import type { DBNewsArticle } from "@/types/database";

// Re-exported so existing imports of slugify/estimateReadTime from
// "@/lib/admin/news" keep working without changes elsewhere.
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
        console.error("[getAllNewsArticles]", error);
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
        .single();

    if (error) {
        console.error("[getNewsArticleBySlug]", error);
        return null;
    }
    return data;
}

export async function getNewsArticleById(id: string): Promise<DBNewsArticle | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getNewsArticleById]", error);
        return null;
    }
    return data;
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