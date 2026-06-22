import { getAllAnnouncements } from "@/lib/admin/announcements";
import AnnouncementsSection from "@/components/admin/AnnouncementsSection";

export default async function AdminAnnouncementsPage() {
    const announcements = await getAllAnnouncements();

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                    Announcements
                </h1>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                    Active announcements rotate in a ticker strip below the homepage hero. Changes appear live within 60 seconds.
                </p>
            </div>
            <AnnouncementsSection announcements={announcements} />
        </div>
    );
}