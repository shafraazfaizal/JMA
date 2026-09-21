// ============================================
// DATABASE TYPES — mirrors supabase-schema.sql
// ============================================
// Regenerate properly later with: npx supabase gen types typescript
// This hand-written version unblocks development now.

export interface DBCampaign {
    id: string;
    slug: string;
    title: string;
    short_description: string;
    description: string;
    category: "Infrastructure" | "Education" | "Healthcare" | "Emergency" | "Welfare";
    status: "active" | "urgent" | "completed";
    goal: number;
    raised: number;
    donor_count: number;
    days_remaining: number | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface DBCampaignUpdate {
    id: string;
    campaign_id: string;
    title: string;
    body: string;
    date: string;
    created_at: string;
}

export interface DBNewsArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: "Project Updates" | "Community News" | "Charity Education" | "Event News" | "Newsletter";
    author: string;
    image_url: string | null;
    pdf_url: string | null;
    read_time: number;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface DBBlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author_name: string;
    author_role: string | null;
    category: string;
    image_url: string | null;
    read_time: number;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface DBEvent {
    id: string;
    slug: string;
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    location: string;
    address: string | null;
    image_url: string | null;
    is_past: boolean;
    created_at: string;
    updated_at: string;
}

export interface DBEventRSVP {
    id: string;
    event_id: string;
    name: string;
    email: string;
    guests: number;
    created_at: string;
}

export interface DBImpactStory {
    id: string;
    name: string;
    age: number | null;
    location: string;
    category: "Infrastructure" | "Education" | "Healthcare" | "Emergency" | "Welfare";
    quote: string;
    detail: string;
    image_url: string | null;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface DBAnnualHighlight {
    id: string;
    year_label: string;
    raised: number;
    projects_completed: number;
    families_supported: number;
    is_latest: boolean;
    display_order: number;
    created_at: string;
}

export interface DBProjectCategory {
    id: string;
    label: string;
    icon_name: string;
    count: number;
    percentage: number;
    colour_hex: string;
    display_order: number;
    updated_at: string;
}

export interface DBGalleryItem {
    id: string;
    image_url: string | null;
    alt_text: string;
    caption: string;
    category: "Projects" | "Events" | "Community" | "Distributions";
    item_date: string;
    aspect: "wide" | "tall" | "square";
    created_at: string;
}

export type ShowcaseCategory =
    | "Written Word"
    | "Creative Arts"
    | "Spoken Word"
    | "Islamic Achievement"
    | "Academic"
    | "Sport & Fitness";

export type AgeGroup = "Junior (5–10)" | "Teen (11–15)" | "Young Adult (16–18)";

export type ShowcaseStatus = "pending" | "published" | "rejected";

export interface DBShowcaseSubmission {
    id: string;
    child_name: string;
    age_group: AgeGroup;
    parent_email: string;
    parent_name: string;
    category: ShowcaseCategory;
    title: string;
    description: string;
    file_url: string | null;
    file_type: "image" | "video" | "pdf" | null;
    consent_publish: boolean;
    show_name: boolean;
    status: ShowcaseStatus;
    admin_note: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export type QuizRegistrationStatus = "registered" | "attended" | "winner" | "no_show";

export interface DBQuizRegistration {
    id: string;
    child_name: string;
    age_group: AgeGroup;
    parent_name: string;
    parent_email: string;
    parent_phone: string | null;
    quiz_month: string; // YYYY-MM
    status: QuizRegistrationStatus;
    link_sent: boolean;
    created_at: string;
}

export interface DBQuizSession {
    id: string;
    quiz_month: string; // YYYY-MM
    title: string;
    topic: string | null;
    scheduled_at: string | null;
    registration_open: boolean;
    zoom_link: string | null;
    winner_name: string | null;
    winner_age_group: AgeGroup | null;
    winner_prize: string | null;
    results_published: boolean;
    created_at: string;
    updated_at: string;
}