// src/lib/announcements-feed.ts
// Merges manual announcements with auto-generated ones from
// recent content (news, blog, campaigns, events).
// Adds a `feed_type` field so the AnnouncementPanel can render
// the correct Lucide icon per entry.

import { createClient } from "@/lib/supabase/server";
import type { DBHeroAnnouncement } from "@/types/announcement-types";

export type FeedType = "manual" | "news" | "blog" | "campaign" | "urgent" | "event";

export interface FeedAnnouncement extends DBHeroAnnouncement {
    feed_type: FeedType;
}

function makeAuto(
    id: string,
    message: string,
    link_url: string,
    order: number,
    feed_type: FeedType
): FeedAnnouncement {
    return {
        id,
        message,
        link_url,
        is_active: true,
        display_order: order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        feed_type,
    };
}

export async function getAnnouncementFeed(): Promise<FeedAnnouncement[]> {
    const supabase = await createClient();

    const [
        { data: manualAnnouncements },
        { data: latestNews },
        { data: latestBlog },
        { data: latestCampaign },
        { data: upcomingEvents },
    ] = await Promise.all([
        supabase
            .from("hero_announcements")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true }),

        supabase
            .from("news_articles")
            .select("id, title, slug, category, published_at")
            .gte("published_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .order("published_at", { ascending: false })
            .limit(1),

        supabase
            .from("blog_posts")
            .select("id, title, slug, published_at")
            .gte("published_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .order("published_at", { ascending: false })
            .limit(1),

        supabase
            .from("campaigns")
            .select("id, title, slug, status, created_at")
            .in("status", ["active", "urgent"])
            .gte("created_at", new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
            .order("created_at", { ascending: false })
            .limit(1),

        supabase
            .from("events")
            .select("id, title, slug, event_date, location")
            .eq("is_past", false)
            .lte("event_date", new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString())
            .order("event_date", { ascending: true })
            .limit(1),
    ]);

    // Manual announcements first — tagged as "manual"
    const feed: FeedAnnouncement[] = (manualAnnouncements ?? []).map((a) => ({
        ...a,
        feed_type: "manual" as FeedType,
    }));

    let autoOrder = 100;

    // Latest news
    if (latestNews && latestNews.length > 0) {
        const article = latestNews[0];
        const label = article.category === "Newsletter"
            ? "New Newsletter published"
            : `New: ${article.title}`;
        feed.push(makeAuto(`auto-news-${article.id}`, label, `/news/${article.slug}`, autoOrder++, "news"));
    }

    // Latest blog post
    if (latestBlog && latestBlog.length > 0) {
        const post = latestBlog[0];
        feed.push(makeAuto(`auto-blog-${post.id}`, `New blog post: ${post.title}`, `/blog/${post.slug}`, autoOrder++, "blog"));
    }

    // Latest campaign
    if (latestCampaign && latestCampaign.length > 0) {
        const campaign = latestCampaign[0];
        const type: FeedType = campaign.status === "urgent" ? "urgent" : "campaign";
        const label = campaign.status === "urgent"
            ? `Urgent: ${campaign.title} — donate now`
            : `New campaign: ${campaign.title}`;
        feed.push(makeAuto(`auto-campaign-${campaign.id}`, label, `/campaigns/${campaign.slug}`, autoOrder++, type));
    }

    // Upcoming event
    if (upcomingEvents && upcomingEvents.length > 0) {
        const event = upcomingEvents[0];
        const eventDate = new Date(event.event_date).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
        });
        const location = event.location ? ` · ${event.location}` : "";
        feed.push(makeAuto(
            `auto-event-${event.id}`,
            `Upcoming: ${event.title} — ${eventDate}${location}`,
            `/events/${event.slug}`,
            autoOrder++,
            "event"
        ));
    }

    return feed;
}