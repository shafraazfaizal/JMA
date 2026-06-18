import HeroSection from "@/components/sections/HeroSection";
import CampaignBanner from "@/components/sections/CampaignBanner";
import DonationSection from "@/components/sections/DonationSection";
import CampaignsSection from "@/components/sections/CampaignsSection";
import AboutSection from "@/components/sections/AboutSection";
import ImpactSection from "@/components/sections/ImpactSection";
import DonorWall from "@/components/sections/DonorWall";
import ZakatSection from "@/components/sections/ZakatSection";
import StoriesSection from "@/components/sections/StoriesSection";
import NewsEventsSection from "@/components/sections/NewsEventsSection";
import NewsletterStrip from "@/components/sections/NewsletterStrip";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <div style={{ paddingTop: "20px" }} /> {/* spacer for stats overlap */}
      <CampaignBanner />
      <DonationSection />
      <CampaignsSection />
      <AboutSection />
      <ImpactSection />
      <DonorWall />
      <ZakatSection />
      <StoriesSection />
      <NewsEventsSection />
      <NewsletterStrip />
    </main>
  );
}