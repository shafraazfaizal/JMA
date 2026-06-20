import { createClient } from "@/lib/supabase/server";
import type { DBBlogPost } from "@/types/database";

export { slugify, estimateReadTime } from "@/lib/admin/blog-utils";

// ============================================
// READ
// ============================================

export async function getAllBlogPosts(): Promise<DBBlogPost[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

    if (error) {
        console.error("[getAllBlogPosts]", error);
        return [];
    }
    return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<DBBlogPost | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("[getBlogPostBySlug]", error);
        return null;
    }
    return data;
}

export async function getBlogPostById(id: string): Promise<DBBlogPost | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getBlogPostById]", error);
        return null;
    }
    return data;
}

// ============================================
// WRITE (admin only — protected by RLS policies)
// ============================================

export interface BlogPostInput {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author_name: string;
    author_role: string | null;
    category: string;
    image_url: string | null;
    read_time: number;
    published_at: string;
}

export async function createBlogPost(input: BlogPostInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteBlogPost(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
}