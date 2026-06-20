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