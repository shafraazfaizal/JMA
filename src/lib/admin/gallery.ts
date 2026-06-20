import { createClient } from "@/lib/supabase/server";
import type { DBGalleryAlbum, DBGalleryAlbumPhoto, GalleryAlbumWithPhotos } from "@/types/gallery-database";

export { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl, getYouTubeWatchUrl } from "@/lib/admin/gallery-utils";

// ============================================
// READ
// ============================================

export async function getAllAlbums(): Promise<GalleryAlbumWithPhotos[]> {
    const supabase = await createClient();

    const { data: albums, error } = await supabase
        .from("gallery_albums")
        .select("*")
        .order("album_date", { ascending: false });

    if (error) {
        console.error("[getAllAlbums]", error);
        return [];
    }

    const { data: photos } = await supabase
        .from("gallery_album_photos")
        .select("*")
        .order("display_order", { ascending: true });

    return (albums ?? []).map((album) => ({
        ...album,
        photos: (photos ?? []).filter((p) => p.album_id === album.id),
    }));
}

export async function getAlbumById(id: string): Promise<GalleryAlbumWithPhotos | null> {
    const supabase = await createClient();

    const { data: album, error } = await supabase
        .from("gallery_albums")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !album) {
        console.error("[getAlbumById]", error);
        return null;
    }

    const { data: photos } = await supabase
        .from("gallery_album_photos")
        .select("*")
        .eq("album_id", id)
        .order("display_order", { ascending: true });

    return { ...album, photos: photos ?? [] };
}

// ============================================
// WRITE — albums
// ============================================

export interface AlbumInput {
    title: string;
    caption: string;
    category: DBGalleryAlbum["category"];
    album_date: string;
    media_type: DBGalleryAlbum["media_type"];
    cover_image_url: string | null;
    youtube_url: string | null;
    youtube_thumbnail_url: string | null;
    display_order: number;
}

export async function createAlbum(input: AlbumInput) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("gallery_albums")
        .insert(input)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateAlbum(id: string, input: Partial<AlbumInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("gallery_albums")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteAlbum(id: string) {
    const supabase = await createClient();
    // gallery_album_photos cascade-deletes via FK constraint
    const { error } = await supabase.from("gallery_albums").delete().eq("id", id);
    if (error) throw new Error(error.message);
}

// ============================================
// WRITE — album photos
// ============================================

export async function addAlbumPhoto(albumId: string, imageUrl: string, displayOrder: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("gallery_album_photos")
        .insert({ album_id: albumId, image_url: imageUrl, display_order: displayOrder })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteAlbumPhoto(photoId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("gallery_album_photos").delete().eq("id", photoId);
    if (error) throw new Error(error.message);
}