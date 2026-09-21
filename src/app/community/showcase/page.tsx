// src/app/community/showcase/page.tsx
import { getPublishedShowcaseSubmissions } from "@/lib/admin/showcase";
import ShowcaseClient from "@/components/community/ShowcaseClient";

export const revalidate = 60;

export default async function ShowcasePage() {
    const submissions = await getPublishedShowcaseSubmissions();
    return <ShowcaseClient submissions={submissions} />;
}