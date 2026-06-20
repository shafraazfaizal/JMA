import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

/**
 * Uploads a file to Supabase Storage and returns its public URL.
 * Used by admin forms for campaign images, story photos, gallery images,
 * news/blog cover images, and newsletter PDFs.
 *
 * @param file - The File object from an <input type="file">
 * @param folder - Subfolder to organise uploads, e.g. "campaigns", "news", "gallery"
 */
export async function uploadMedia(file: File, folder: string): Promise<string> {
    const supabase = createClient();

    // Explicitly verify we have an authenticated session before attempting
    // the upload. If this fails, the RLS policy error below becomes much
    // clearer to diagnose.
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error(
            "You're not signed in (or your session expired). Please log out and log back in to /admin/login, then try uploading again."
        );
    }

    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
    });

    if (error) {
        // Surface the raw Supabase error message for easier debugging
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
}

/**
 * Deletes a file from Supabase Storage given its public URL.
 * Used when an admin removes/replaces an image.
 */
export async function deleteMedia(publicUrl: string): Promise<void> {
    const supabase = createClient();

    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;

    const path = publicUrl.slice(idx + marker.length);
    await supabase.storage.from(BUCKET).remove([path]);
}