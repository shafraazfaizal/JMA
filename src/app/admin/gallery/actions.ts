"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addAlbumPhoto,
    deleteAlbumPhoto,
    extractYouTubeId,
    getYouTubeThumbnail,
    type AlbumInput,
} from "@/lib/admin/gallery";

// ============================================
// Create album — photo type (with 1+ photo URLs already uploaded)
// or video type (YouTube URL, thumbnail auto-fetched)
// ============================================

export async function createPhotoAlbumAction(input: {
    title: string;
    caption: string;
    category: AlbumInput["category"];
    album_date: string;
    photoUrls: string[]; // already uploaded to Storage by the client
}) {
    if (input.photoUrls.length === 0) {
        return { success: false, error: "Please upload at least one photo." };
    }

    const albumInput: AlbumInput = {
        title: input.title,
        caption: input.caption,
        category: input.category,
        album_date: input.album_date,
        media_type: "photo",
        cover_image_url: input.photoUrls[0],
        youtube_url: null,
        youtube_thumbnail_url: null,
        display_order: 0,
    };

    const album = await createAlbum(albumInput);

    await Promise.all(
        input.photoUrls.map((url, i) => addAlbumPhoto(album.id, url, i))
    );

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    redirect("/admin/gallery");
}

export async function createVideoAlbumAction(input: {
    title: string;
    caption: string;
    category: AlbumInput["category"];
    album_date: string;
    youtubeUrlRaw: string;
}) {
    const videoId = extractYouTubeId(input.youtubeUrlRaw);
    if (!videoId) {
        return { success: false, error: "Couldn't recognise that as a YouTube link. Please check the URL and try again." };
    }

    const albumInput: AlbumInput = {
        title: input.title,
        caption: input.caption,
        category: input.category,
        album_date: input.album_date,
        media_type: "video",
        cover_image_url: null,
        youtube_url: videoId,
        youtube_thumbnail_url: getYouTubeThumbnail(videoId, "max"),
        display_order: 0,
    };

    await createAlbum(albumInput);

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    redirect("/admin/gallery");
}

// ============================================
// Update album (shared fields)
// ============================================

export async function updateAlbumDetailsAction(
    id: string,
    input: { title: string; caption: string; category: AlbumInput["category"]; album_date: string }
) {
    await updateAlbum(id, input);
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
}

export async function updateAlbumVideoAction(id: string, youtubeUrlRaw: string) {
    const videoId = extractYouTubeId(youtubeUrlRaw);
    if (!videoId) {
        return { success: false, error: "Couldn't recognise that as a YouTube link." };
    }

    await updateAlbum(id, {
        youtube_url: videoId,
        youtube_thumbnail_url: getYouTubeThumbnail(videoId, "max"),
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { success: true };
}

export async function addPhotoToAlbumAction(albumId: string, imageUrl: string, displayOrder: number) {
    await addAlbumPhoto(albumId, imageUrl, displayOrder);

    // If this album had no cover image yet, set it
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
}

export async function setAlbumCoverAction(albumId: string, imageUrl: string) {
    await updateAlbum(albumId, { cover_image_url: imageUrl });
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
}

export async function removePhotoFromAlbumAction(photoId: string) {
    await deleteAlbumPhoto(photoId);
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
}

export async function deleteAlbumAction(id: string) {
    await deleteAlbum(id);
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
}