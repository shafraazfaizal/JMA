import { getAllNewsArticles } from "@/lib/admin/news";
import NewsPageClient from "@/components/news/NewsPageClient";

export const revalidate = 60;

export default async function NewsPage() {
    const articles = await getAllNewsArticles();

    return <NewsPageClient articles={articles} />;
}