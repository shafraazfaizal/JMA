// ============================================
// JMA WEBSITE — TypeScript Interfaces
// Jaffna Muslim Association | SKAYL Studio
// ============================================

// --- CAMPAIGNS ---

export type CampaignCategory =
  | "Infrastructure"
  | "Education"
  | "Healthcare"
  | "Emergency"
  | "Welfare";

export type CampaignStatus = "active" | "completed" | "urgent";

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: CampaignCategory;
  status: CampaignStatus;
  goal: number;
  raised: number;
  donorCount: number;
  daysRemaining: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  updates?: CampaignUpdate[];
}

export interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  body: string;
}

// --- DONATIONS ---

export type DonationType =
  | "General"
  | "Zakat"
  | "Sadaqah"
  | "Lillah"
  | "Qurbani"
  | "Fitrana"
  | "In Memory"
  | "On Behalf";

export type DonationFrequency = "one-time" | "monthly";

export interface DonationPayload {
  amount: number;
  frequency: DonationFrequency;
  type: DonationType;
  campaignId?: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  giftAid: boolean;
  dedicationMessage?: string;
  dedicationType?: "In Memory of" | "On Behalf of";
  dedicationName?: string;
}

// --- NEWS ---

export type NewsCategory =
  | "Project Updates"
  | "Community News"
  | "Charity Education"
  | "Event News";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  author: string;
  publishedAt: string;
  readTime: number;
  imageUrl: string | null;
}

// --- EVENTS ---

export interface JMAEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  imageUrl: string | null;
  registrationUrl?: string;
  isPast: boolean;
}

// --- TEAM ---

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string | null;
}

// --- IMPACT STORY ---

export interface ImpactStory {
  id: string;
  name: string;
  age: number;
  location: string;
  category: CampaignCategory;
  quote: string;
  fullStory: string;
  imageUrl: string | null;
}

// --- DONOR WALL ---

export interface DonorWallItem {
  id: string;
  donorName: string;
  location: string;
  amount: number;
  campaign: string;
  timeAgo: string;
}

// --- NAVBAR ---

export interface NavLink {
  label: string;
  href: string;
}

// --- STATS ---

export interface StatItem {
  icon: string; // Lucide icon name
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
}

// --- ZAKAT CALCULATOR ---

export interface ZakatInputs {
  cashSavings: number;
  goldSilverValue: number;
  businessAssets: number;
  moneyOwed: number;
  outstandingDebts: number;
}

export interface ZakatResult {
  totalWealth: number;
  nisabThreshold: number;
  isAboveNisab: boolean;
  zakatAmount: number;
}

// --- ANNUAL REPORTS ---

export interface AnnualReport {
  year: number;
  title: string;
  pdfUrl: string;
  highlights: string[];
  totalRaised: number;
  projectsCompleted: number;
}
