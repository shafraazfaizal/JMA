"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    createNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
    type NewsArticleInput,
} from "@/lib/admin/news";
import { slugify } from "@/lib/admin/news-utils";

export async function createNewsArticleAction(formData: FormData) {
    const title = formData.get("title") as string;

    const input: NewsArticleInput = {
        slug: slugify(title),
        title,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as NewsArticleInput["category"],
        author: (formData.get("author") as string) || "JMA Team",
        image_url: (formData.get("image_url") as string) || null,
        pdf_url: (formData.get("pdf_url") as string) || null,
        read_time: Number(formData.get("read_time")) || 3,
        published_at: (formData.get("published_at") as string) || new Date().toISOString(),
    };

    await createNewsArticle(input);

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/news");

    redirect("/admin/news");
}

export async function updateNewsArticleAction(id: string, formData: FormData) {
    const title = formData.get("title") as string;

    const input: Partial<NewsArticleInput> = {
        title,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as NewsArticleInput["category"],
        author: (formData.get("author") as string) || "JMA Team",
        image_url: (formData.get("image_url") as string) || null,
        pdf_url: (formData.get("pdf_url") as string) || null,
        read_time: Number(formData.get("read_time")) || 3,
        published_at: (formData.get("published_at") as string) || new Date().toISOString(),
    };

    await updateNewsArticle(id, input);

    revalidatePath("/news");
    revalidatePath(`/news/${formData.get("slug")}`);
    revalidatePath("/");
    revalidatePath("/admin/news");

    redirect("/admin/news");
}

export async function deleteNewsArticleAction(id: string) {
    await deleteNewsArticle(id);

    revalidatePath("/news");
    revalidatePath("/");
    revalidatePath("/admin/news");
}