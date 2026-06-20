import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllBlogPosts } from "@/lib/admin/blog";
import BlogPostRow from "@/components/admin/BlogPostRow";

export default async function AdminBlogPage() {
    const posts = await getAllBlogPosts();

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap" as const, gap: "1rem" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                        Blog
                    </h1>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                        {posts.length} post{posts.length === 1 ? "" : "s"} · changes appear live immediately
                    </p>
                </div>
                <Link
                    href="/admin/blog/new"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", backgroundColor: "#C9A84C", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}
                >
                    <Plus size={16} aria-hidden="true" />
                    New Blog Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px dashed #D1D5DB", padding: "4rem 1.5rem", textAlign: "center" as const }}>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280", marginBottom: "1.25rem" }}>
                        No blog posts yet. Share a reflection, opinion, or community story.
                    </p>
                    <Link href="/admin/blog/new" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", backgroundColor: "#0D5C6B", color: "#ffffff", fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>
                        <Plus size={16} aria-hidden="true" /> New Blog Post
                    </Link>
                </div>
            ) : (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                    {posts.map((post, i) => (
                        <BlogPostRow key={post.id} post={post} isLast={i === posts.length - 1} />
                    ))}
                </div>
            )}
        </div>
    );
}