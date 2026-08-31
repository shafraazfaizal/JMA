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
import { getActiveAnnouncements } from "@/lib/admin/announcements";
import { getAllNewsArticles } from "@/lib/admin/news";
import { getAllEvents } from "@/lib/admin/events";
import { getAllCampaigns } from "@/lib/admin/campaigns";

export const revalidate = 60;

export default async function HomePage() {
  const [announcements, articles, events, campaigns] = await Promise.all([
    getActiveAnnouncements(),
    getAllNewsArticles(),
    getAllEvents(),
    getAllCampaigns(),
  ]);

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active" || c.status === "urgent"
  );

  // Banner shows the most urgent campaign first, then falls back to first active
  const bannerCampaign =
    activeCampaigns.find((c) => c.status === "urgent") ??
    activeCampaigns[0] ??
    null;

  return (
    <main>
      <HeroSection announcements={announcements} />
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
  );
}