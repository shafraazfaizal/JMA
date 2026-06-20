import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllAlbums } from "@/lib/admin/gallery";
import AlbumRow from "@/components/admin/AlbumRow";

export default async function AdminGalleryPage() {
    const albums = await getAllAlbums();
    const photoCount = albums.filter((a) => a.media_type === "photo").length;
    const videoCount = albums.filter((a) => a.media_type === "video").length;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap" as const, gap: "1rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                        Gallery
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                        {albums.length} album{albums.length === 1 ? "" : "s"} · {photoCount} photo album{photoCount === 1 ? "" : "s"} · {videoCount} video{videoCount === 1 ? "" : "s"}
                    </p>
                </div>
                <Link
                    href="/admin/gallery/new"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                >
                    <Plus size={16} aria-hidden="true" />
                    New Album
                </Link>
            </div>

            {albums.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "1.25rem" }}>
                        No albums yet. Add photos from a recent event, or link a YouTube video.
                    </p>
                    <Link href="/admin/gallery/new" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
                        <Plus size={16} aria-hidden="true" /> New Album
                    </Link>
                </div>
            ) : (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                    {albums.map((album, i) => (
                        <AlbumRow key={album.id} album={album} isLast={i === albums.length - 1} />
                    ))}
                </div>
            )}
        </div>
    );
}