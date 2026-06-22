export interface DBHeroAnnouncement {
    id: string;
    message: string;
    link_url: string | null;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}