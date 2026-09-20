// The LaunchReveal is a fixed overlay on top of the homepage.
// No navigation happens — the reveal just fades away revealing
// the homepage underneath. After the gathering, delete LaunchReveal
// import and the <LaunchReveal /> line.

import HeroSection from "@/components/sections/HeroSection";
import CampaignBanner from "@/components/sections/CampaignBanner";
import DonationSection from "@/components/sections/DonationSection";
import CampaignsSection from "@/components/sections/CampaignsSection";
import AboutSection from "@/components/sections/AboutSection";
import PresidentMessage from "@/components/sections/PresidentMessage";
import ImpactSection from "@/components/sections/ImpactSection";
import DonorWall from "@/components/sections/DonorWall";
import ZakatSection from "@/components/sections/ZakatSection";
import StoriesSection from "@/components/sections/StoriesSection";
import NewsEventsSection from "@/components/sections/NewsEventsSection";
import NewsletterStrip from "@/components/sections/NewsletterStrip";
// import LaunchReveal from "@/components/launch-reveal/LaunchReveal";
import { getAnnouncementFeed } from "@/lib/announcements-feed";
import { getAllNewsArticles } from "@/lib/admin/news";
import { getAllEvents } from "@/lib/admin/events";
import { getAllCampaigns } from "@/lib/admin/campaigns";
import { getFeaturedMedia } from "@/lib/admin/featured-media";

export const revalidate = 60;

export default async function HomePage() {
    const [announcements, articles, events, campaigns, featuredMedia] = await Promise.all([
        getAnnouncementFeed(),
        getAllNewsArticles(),
        getAllEvents(),
        getAllCampaigns(),
        getFeaturedMedia(),
    ]);

    const activeCampaigns = campaigns.filter(
        (c) => c.status === "active" || c.status === "urgent"
    );

    const bannerCampaign =
        activeCampaigns.find((c) => c.status === "urgent") ??
        activeCampaigns[0] ??
        null;

    return (
        <>
            {/* Reveal overlay — sits on top, fades away on button click */}
            {/* <LaunchReveal /> */}

            {/* Full homepage underneath — already at top, no navigation needed */}
            <main>
                <HeroSection announcements={announcements} featuredMedia={featuredMedia} />
                <div style={{ paddingTop: "20px" }} />
                <CampaignBanner campaign={bannerCampaign} />
                <DonationSection />
                <CampaignsSection campaigns={activeCampaigns} />
                <AboutSection />
                <PresidentMessage />
                <ImpactSection />
                <DonorWall />
                <ZakatSection />
                <StoriesSection />
                <NewsEventsSection articles={articles} events={events} />
                <NewsletterStrip />
            </main>
        </>
    );
}