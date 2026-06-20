import { getAllBlogPosts } from "@/lib/admin/blog";
import BlogPageClient from "@/components/blog/BlogPageClient";

export const revalidate = 60;

export default async function BlogPage() {
    const posts = await getAllBlogPosts();

    return <BlogPageClient posts={posts} />;
}