import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GalleryAlbumForm from "@/components/admin/GalleryAlbumForm";

export default function NewAlbumPage() {
    return (
        <div style={{ maxWidth: "720px" }}>
            <Link href="/admin/gallery" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "#6B7280", textDecoration: "none", marginBottom: "1.5rem" }}>
                <ArrowLeft size={15} aria-hidden="true" /> Back to Gallery
            </Link>

            <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.375rem" }}>
                New Gallery Album
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "2rem" }}>
                Upload photos from an event or project, or link a YouTube video. This appears on the live Gallery page immediately.
            </p>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "2rem" }}>
                <GalleryAlbumForm />
            </div>
        </div>
    );
}