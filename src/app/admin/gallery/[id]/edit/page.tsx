import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAlbumById } from "@/lib/admin/gallery";
import GalleryAlbumEditForm from "@/components/admin/GalleryAlbumEditForm";

export default async function EditAlbumPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const album = await getAlbumById(id);

    if (!album) notFound();

    return (
        <div style={{ maxWidth: "720px" }}>
            <Link href="/admin/gallery" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "#6B7280", textDecoration: "none", marginBottom: "1.5rem" }}>
                <ArrowLeft size={15} aria-hidden="true" /> Back to Gallery
            </Link>

            <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.375rem" }}>
                Edit Album
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "2rem" }}>
                Changes are published to the live site immediately.
            </p>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "2rem" }}>
                <GalleryAlbumEditForm album={album} />
            </div>
        </div>
    );
}