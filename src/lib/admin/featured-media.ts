// src/lib/admin/featured-media.ts
import { createClient } from "@/lib/supabase/server";
import type { FeaturedMediaItem } from "@/components/sections/MediaShowcase";

export async function getFeaturedMedia(): Promise<FeaturedMediaItem[]> {
    const supabase = await createClient();

    // Fetch featured albums with their photos as fallback for cover
    const { data: albums, error } = await supabase
        .from("gallery_albums")
        .select(`
      id,
      title,
      caption,
      media_type,
      cover_image_url,
      youtube_url,
      youtube_thumbnail_url,
      album_date,
      gallery_album_photos (
        image_url,
        display_order
      )
    `)
        .eq("is_featured", true)
        .order("album_date", { ascending: false })
        .limit(12);

    if (error) {
        console.error("[getFeaturedMedia]", error.message);
        return [];
    }

    return (albums ?? []).map((album) => {
        let cover_url: string | null = null;

        if (album.media_type === "photo" || album.media_type === "photos") {
            // Prefer explicit cover_image_url, fall back to first photo in album
            if (album.cover_image_url) {
                cover_url = album.cover_image_url;
            } else {
                const photos = (album.gallery_album_photos ?? []) as { image_url: string; display_order: number }[];
                const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);
                cover_url = sorted[0]?.image_url ?? null;
            }
        } else if (album.media_type === "video") {
            // Prefer stored thumbnail, fall back to YouTube API thumbnail
            cover_url = album.youtube_thumbnail_url ?? null;
            if (!cover_url && album.youtube_url) {
                const match = album.youtube_url.match(/([a-zA-Z0-9_-]{11})$/);
                if (match) cover_url = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
            }
        }

        // Extract YouTube video ID for play button logic
        let youtube_video_id: string | null = null;
        if (album.youtube_url) {
            const match = album.youtube_url.match(
                /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|^)([a-zA-Z0-9_-]{11})/
            );
            youtube_video_id = match?.[1] ?? null;
        }

        return {
            id: album.id,
            title: album.title,
            caption: album.caption ?? null,
            cover_url,
            youtube_video_id,
            album_type: (album.media_type === "photos" ? "photos" : album.media_type) as "photos" | "video",
            item_date: album.album_date,
        };
    });
}