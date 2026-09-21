export function slugify(title: string): string {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // Fallback for non-Latin titles (e.g. Tamil) that produce an empty slug
    if (!slug) {
        return `post-${Date.now()}`;
    }

    return slug;
}

/**
 * Rough reading time estimate from word count (avg 200 wpm).
 * Used as a sensible default the admin can override.
 */
export function estimateReadTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}