// ============================================
// CLIENT-SAFE UTILITIES — no Supabase, no server-only imports
// ============================================
// These can be safely imported from "use client" components.
// Data-fetching functions that need the server Supabase client
// live separately in src/lib/admin/news.ts.

export function slugify(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Rough reading time estimate from word count (avg 200 wpm).
 * Used as a sensible default the admin can override.
 */
export function estimateReadTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}