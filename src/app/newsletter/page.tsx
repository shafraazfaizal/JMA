import { redirect } from "next/navigation";

// The newsletter lives inside /news as a category (monthly issues are
// published as regular articles tagged "Newsletter"). This route exists
// only so old links/bookmarks to /newsletter keep working.
export default function NewsletterRedirect() {
    redirect("/news?category=Newsletter");
}