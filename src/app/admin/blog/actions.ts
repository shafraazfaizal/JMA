"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    type BlogPostInput,
} from "@/lib/admin/blog";
import { slugify } from "@/lib/admin/blog-utils";

export async function createBlogPostAction(formData: FormData) {
    const title = formData.get("title") as string;

    const input: BlogPostInput = {
        slug: slugify(title),
        title,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        author_name: formData.get("author_name") as string,
        author_role: (formData.get("author_role") as string) || null,
        category: (formData.get("category") as string) || "Reflections",
        image_url: (formData.get("image_url") as string) || null,
        read_time: Number(formData.get("read_time")) || 4,
        published_at: (formData.get("published_at") as string) || new Date().toISOString(),
    };

    await createBlogPost(input);

    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath("/admin/blog");

    redirect("/admin/blog");
}

export async function updateBlogPostAction(id: string, formData: FormData) {
    const title = formData.get("title") as string;

    const input: Partial<BlogPostInput> = {
        title,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        author_name: formData.get("author_name") as string,
        author_role: (formData.get("author_role") as string) || null,
        category: (formData.get("category") as string) || "Reflections",
        image_url: (formData.get("image_url") as string) || null,
        read_time: Number(formData.get("read_time")) || 4,
        published_at: (formData.get("published_at") as string) || new Date().toISOString(),
    };

    await updateBlogPost(id, input);

    revalidatePath("/blog");
    revalidatePath(`/blog/${formData.get("slug")}`);
    revalidatePath("/");
    revalidatePath("/admin/blog");

    redirect("/admin/blog");
}

export async function deleteBlogPostAction(id: string) {
    await deleteBlogPost(id);

    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath("/admin/blog");
}