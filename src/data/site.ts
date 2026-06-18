// ============================================
// JMA SITE-WIDE DATA
// ============================================

import type { NavLink, StatItem, DonorWallItem } from "@/types";

export const siteConfig = {
  name: "Jaffna Muslim Association",
  shortName: "JMA",
  tagline: "Serving the Jaffna Muslim community across two nations",
  charityNumber: "XXXXXX",
  founded: 2002,
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://jaffnamuslims.org.uk",
  email: "info@jaffnamuslims.org.uk",
  phone: "+44 XXXX XXXXXX",
  address: "United Kingdom",
  bankDetails: {
    bank: "Lloyds Bank",
    accountName: "Jaffna Muslim Association",
    sortCode: "30-94-66",
    accountNumber: "00980043",
  },
  social: {
    facebook: "https://facebook.com/jaffnamuslimassociation",
    instagram: "https://instagram.com/jaffnamuslimassociation",
    whatsapp: "https://wa.me/44XXXXXXXXXX",
  },
};

export const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Impact", href: "/impact" },
  { label: "Zakat", href: "/zakat" },
  { label: "Khardal Hasana", href: "/khardal-hasana" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Membership", href: "/membership" },
];

export const heroStats: StatItem[] = [
  {
    icon: "Calendar",
    value: "20+",
    numericValue: 20,
    suffix: "+",
    label: "Years of Service",
  },
  {
    icon: "Users",
    value: "3,000+",
    numericValue: 3000,
    suffix: "+",
    label: "Families Helped",
  },
  {
    icon: "FolderOpen",
    value: "200+",
    numericValue: 200,
    suffix: "+",
    label: "Projects Delivered",
  },
  {
    icon: "CheckCircle",
    value: "100%",
    numericValue: 100,
    suffix: "%",
    label: "Donations to Ground",
  },
];

export const impactStats: StatItem[] = [
  {
    icon: "PoundSterling",
    value: "£2,450,000+",
    numericValue: 2450000,
    suffix: "+",
    label: "Total Funds Raised",
  },
  {
    icon: "Users",
    value: "12,500+",
    numericValue: 12500,
    suffix: "+",
    label: "Families Supported",
  },
  {
    icon: "FolderOpen",
    value: "85+",
    numericValue: 85,
    suffix: "+",
    label: "Active Projects",
  },
  {
    icon: "Heart",
    value: "650+",
    numericValue: 650,
    suffix: "+",
    label: "Volunteers Worldwide",
  },
];

export const donorWallItems: DonorWallItem[] = [
  { id: "1", donorName: "Ahmed", location: "London", amount: 50, campaign: "Education Fund", timeAgo: "2 min ago" },
  { id: "2", donorName: "Fatima", location: "Manchester", amount: 100, campaign: "Masjid Reconstruction", timeAgo: "5 min ago" },
  { id: "3", donorName: "Ibrahim", location: "Birmingham", amount: 25, campaign: "Orphan Support", timeAgo: "8 min ago" },
  { id: "4", donorName: "Amina", location: "Leicester", amount: 250, campaign: "General Fund", timeAgo: "12 min ago" },
  { id: "5", donorName: "Yusuf", location: "Coventry", amount: 50, campaign: "Education Fund", timeAgo: "15 min ago" },
  { id: "6", donorName: "Khadijah", location: "Glasgow", amount: 75, campaign: "Healthcare Project", timeAgo: "19 min ago" },
  { id: "7", donorName: "Omar", location: "Sheffield", amount: 100, campaign: "Masjid Reconstruction", timeAgo: "24 min ago" },
  { id: "8", donorName: "Zainab", location: "Bristol", amount: 30, campaign: "Welfare Fund", timeAgo: "28 min ago" },
];

export const donationAmounts = [10, 25, 50, 100, 250, 500];

export const donationTypes = [
  "General",
  "Zakat",
  "Sadaqah",
  "Lillah",
  "Qurbani",
  "Fitrana",
  "In Memory",
  "On Behalf",
] as const;

export const impactEquivalents: Record<number, string> = {
  10: "Provides school supplies for one child for a term",
  25: "Feeds a family of four for a week",
  50: "Covers one month's medical treatment for an elderly person",
  100: "Provides uniforms and books for two children for a year",
  250: "Funds a water pump repair serving 50 families",
  500: "Sponsors a full scholarship for a student for one year",
};
