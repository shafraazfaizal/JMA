import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
    return (
        <div style={{ maxWidth: "720px" }}>
            <Link href="/admin/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem", color: "#6B7280", textDecoration: "none", marginBottom: "1.5rem" }}>
                <ArrowLeft size={15} aria-hidden="true" /> Back to Blog
            </Link>

            <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.5rem", color: "#111827", marginBottom: "0.375rem" }}>
                New Blog Post
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "2rem" }}>
                This will be published to the live Blog page immediately.
            </p>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", border: "1px solid #E5E7EB", padding: "2rem" }}>
                <BlogPostForm />
            </div>
        </div>
    );
}