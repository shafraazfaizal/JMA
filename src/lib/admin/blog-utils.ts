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