import { notFound } from "next/navigation";
import { getNewsArticleBySlug, getAllNewsArticles } from "@/lib/admin/news";
import NewsArticleDetailClient from "@/components/news/NewsArticleDetailClient";

export const revalidate = 60;

export default async function NewsArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getNewsArticleBySlug(slug);

    if (!article) notFound();

    const allArticles = await getAllNewsArticles();
    const related = allArticles
        .filter((a) => a.id !== article.id && a.category === article.category)
        .slice(0, 3);

    return <NewsArticleDetailClient article={article} related={related} />;
}