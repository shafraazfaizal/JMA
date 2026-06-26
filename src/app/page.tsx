// import HeroSection from "@/components/sections/HeroSection";
// import CampaignBanner from "@/components/sections/CampaignBanner";
// import DonationSection from "@/components/sections/DonationSection";
// import CampaignsSection from "@/components/sections/CampaignsSection";
// import AboutSection from "@/components/sections/AboutSection";
// import ImpactSection from "@/components/sections/ImpactSection";
// import DonorWall from "@/components/sections/DonorWall";
// import ZakatSection from "@/components/sections/ZakatSection";
// import StoriesSection from "@/components/sections/StoriesSection";
// import NewsEventsSection from "@/components/sections/NewsEventsSection";
// import NewsletterStrip from "@/components/sections/NewsletterStrip";
// import AnnouncementTicker from "@/components/layout/AnnouncementTicker";
// import { getActiveAnnouncements } from "@/lib/admin/announcements";

// export const revalidate = 60;

// export default async function HomePage() {
//   const announcements = await getActiveAnnouncements();

//   return (
//     <main>
//       <HeroSection />
//       <AnnouncementTicker announcements={announcements} />
//       <div style={{ paddingTop: "20px" }} /> {/* spacer for stats overlap */}
//       <CampaignBanner />
//       <DonationSection />
//       <CampaignsSection />
//       <AboutSection />
//       <ImpactSection />
//       <DonorWall />
//       <ZakatSection />
//       <StoriesSection />
//       <NewsEventsSection />
//       <NewsletterStrip />
//     </main>
//   );
// }

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaffna Muslim Association — Coming Soon",
  description: "The Jaffna Muslim Association website is currently being upgraded. We'll be back soon.",
};

export default function ComingSoonPage() {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#073D47", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center", padding: "2rem 1.5rem", maxWidth: "560px", width: "100%" }}>

          {/* Logo mark */}
          <div style={{ marginBottom: "2.5rem" }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto", display: "block" }}>
              <rect width="64" height="64" rx="16" fill="rgba(201,168,76,0.15)" />
              <path d="M32 12C24.268 12 18 18.268 18 26C18 33.732 24.268 40 32 40C27.582 40 24 36.418 24 32C24 27.582 27.582 24 32 24C36.418 24 40 27.582 40 32C40 28.686 37.314 26 34 26C31.791 26 32 12 32 12Z" fill="#C9A84C" />
              <circle cx="44" cy="22" r="4" fill="#C9A84C" opacity="0.7" />
            </svg>
          </div>

          {/* Org name */}
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.8125rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1rem" }}>
            Jaffna Muslim Association
          </p>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.875rem, 5vw, 2.75rem)", color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: "1.25rem" }}>
            We&apos;re upgrading our website
          </h1>

          {/* Subtext */}
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.0625rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: "2.5rem" }}>
            Our new site is on its way — built to better serve the Jaffna Muslim community across the UK and beyond. We&apos;ll be back very soon إن شاء الله.
          </p>

          {/* Divider */}
          <div style={{ width: "48px", height: "2px", backgroundColor: "#C9A84C", margin: "0 auto 2.5rem", borderRadius: "9999px" }} />

          {/* Contact line */}
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
            For urgent enquiries, please contact us at{" "}
            <a
              href="mailto:info@jaffnamuslimuk.org"
              style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}
            >
              info@jaffnamuslimuk.org
            </a>
          </p>

          {/* Charity number */}
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "3rem" }}>
            UK Registered Charity · Jaffna Muslim Association
          </p>
        </div>

        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; }
        `}</style>
      </body>
    </html>
  );
}