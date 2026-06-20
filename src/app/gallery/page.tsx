import { getAllAlbums } from "@/lib/admin/gallery";
import GalleryPageClient from "@/components/gallery/GalleryPageClient";

export const revalidate = 60;

export default async function GalleryPage() {
    const albums = await getAllAlbums();

    return <GalleryPageClient albums={albums} />;
}