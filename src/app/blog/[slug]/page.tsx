import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/admin/blog";
import BlogPostDetailClient from "@/components/blog/BlogPostDetailClient";

export const revalidate = 60;

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) notFound();

    const allPosts = await getAllBlogPosts();
    const related = allPosts
        .filter((p) => p.id !== post.id && p.category === post.category)
        .slice(0, 3);

    return <BlogPostDetailClient post={post} related={related} />;
}