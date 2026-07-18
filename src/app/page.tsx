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
import AnnouncementTicker from "@/components/layout/AnnouncementTicker";
import { getActiveAnnouncements } from "@/lib/admin/announcements";

export const revalidate = 60;

export default async function HomePage() {
  const announcements = await getActiveAnnouncements();

  return (
    <main>
      <HeroSection />
      <AnnouncementTicker announcements={announcements} />
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

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Jaffna Muslim Association — Coming Soon",
//   description: "The Jaffna Muslim Association website is currently being upgraded. We'll be back soon.",
// };

// export default function ComingSoonPage() {
//   return (
//     <div
//       style={{
//         margin: 0,
//         padding: 0,
//         backgroundColor: "#073D47",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       <div style={{ textAlign: "center" as const, padding: "2rem 1.5rem", maxWidth: "560px", width: "100%" }}>

//         {/* Org name */}
//         <p style={{
//           fontFamily: "'Plus Jakarta Sans', sans-serif",
//           fontWeight: 600,
//           fontSize: "0.8125rem",
//           letterSpacing: "0.12em",
//           textTransform: "uppercase" as const,
//           color: "#C9A84C",
//           marginBottom: "1rem",
//         }}>
//           Jaffna Muslim Association
//         </p>

//         {/* Headline */}
//         <h1 style={{
//           fontFamily: "'Plus Jakarta Sans', sans-serif",
//           fontWeight: 800,
//           fontSize: "clamp(1.875rem, 5vw, 2.75rem)",
//           color: "#ffffff",
//           lineHeight: 1.15,
//           letterSpacing: "-0.02em",
//           marginBottom: "1.25rem",
//         }}>
//           We&apos;re upgrading our website
//         </h1>

//         {/* Subtext */}
//         <p style={{
//           fontFamily: "'Inter', sans-serif",
//           fontSize: "1.0625rem",
//           color: "rgba(255,255,255,0.65)",
//           lineHeight: 1.75,
//           marginBottom: "2.5rem",
//         }}>
//           Our new site is on its way — built to better serve the Jaffna Muslim community across the UK and beyond. We&apos;ll be back very soon إن شاء الله.
//         </p>

//         {/* Divider */}
//         <div style={{
//           width: "48px",
//           height: "2px",
//           backgroundColor: "#C9A84C",
//           margin: "0 auto 2.5rem",
//           borderRadius: "9999px",
//         }} />

//         {/* Contact line */}
//         <p style={{
//           fontFamily: "'Inter', sans-serif",
//           fontSize: "0.9375rem",
//           color: "rgba(255,255,255,0.5)",
//           lineHeight: 1.6,
//         }}>
//           For urgent enquiries, please contact us at{" "}
//           <a
//             href="mailto:info@jaffnamuslimuk.org"
//             style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}
//           >
//             info@jaffnamuslimuk.org
//           </a>
//         </p>

//         {/* Charity number */}
//         <p style={{
//           fontFamily: "'Inter', sans-serif",
//           fontSize: "0.75rem",
//           color: "rgba(255,255,255,0.25)",
//           marginTop: "3rem",
//         }}>
//           UK Registered Charity · Jaffna Muslim Association
//         </p>
//       </div>
//     </div>
//   );
// }