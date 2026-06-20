export interface DBGalleryAlbum {
    id: string;
    title: string;
    caption: string;
    category: "Projects" | "Events" | "Community" | "Distributions";
    album_date: string;
    media_type: "photo" | "video";
    cover_image_url: string | null;
    youtube_url: string | null;
    youtube_thumbnail_url: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface DBGalleryAlbumPhoto {
    id: string;
    album_id: string;
    image_url: string;
    display_order: number;
    created_at: string;
}

// An album with its photos loaded together — what the public page
// and admin edit screen both work with.
export interface GalleryAlbumWithPhotos extends DBGalleryAlbum {
    photos: DBGalleryAlbumPhoto[];
}