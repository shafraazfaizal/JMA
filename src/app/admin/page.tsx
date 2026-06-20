import { createClient } from "@/lib/supabase/server";
import DashboardStatCard, { type DashboardIconName } from "@/components/admin/DashboardStatCard";
import QuickActionLink from "@/components/admin/QuickActionLink";

const sections: {
    href: string;
    label: string;
    iconName: DashboardIconName;
    table: string;
    colour: string;
}[] = [
        { href: "/admin/campaigns", label: "Campaigns", iconName: "Megaphone", table: "campaigns", colour: "#0D5C6B" },
        { href: "/admin/news", label: "News & Newsletter", iconName: "Newspaper", table: "news_articles", colour: "#4338CA" },
        { href: "/admin/blog", label: "Blog Posts", iconName: "PenSquare", table: "blog_posts", colour: "#B08D35" },
        { href: "/admin/events", label: "Events", iconName: "Calendar", table: "events", colour: "#15803D" },
        { href: "/admin/impact", label: "Impact Page", iconName: "TrendingUp", table: "impact_stories", colour: "#0891B2" },
        { href: "/admin/gallery", label: "Gallery", iconName: "ImageIcon", table: "gallery_items", colour: "#DC2626" },
    ];

const quickActions = [
    { href: "/admin/campaigns/new", label: "New Campaign" },
    { href: "/admin/news/new", label: "New Article" },
    { href: "/admin/events/new", label: "New Event" },
    { href: "/admin/blog/new", label: "New Blog Post" },
];

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Pull live counts for each content type — gives the admin an at-a-glance overview
    const counts = await Promise.all(
        sections.map(async ({ table }) => {
            const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
            return count ?? 0;
        })
    );

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "1.625rem", color: "#111827", marginBottom: "0.375rem" }}>
                    Welcome back
                </h1>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.9375rem", color: "#6B7280" }}>
                    Manage everything on the JMA website from here. Changes go live immediately.
                </p>
            </div>

            {/* Content overview grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1.25rem",
                    marginBottom: "2.5rem",
                }}
            >
                {sections.map(({ href, label, iconName, colour }, i) => (
                    <DashboardStatCard
                        key={href}
                        href={href}
                        label={label}
                        iconName={iconName}
                        colour={colour}
                        count={counts[i]}
                    />
                ))}
            </div>

            {/* Quick actions */}
            <div>
                <h2 style={{ fontFamily: "var(--font-jakarta)", fontWeight: 700, fontSize: "1.0625rem", color: "#111827", marginBottom: "1rem" }}>
                    Quick Actions
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem" }}>
                    {quickActions.map(({ href, label }) => (
                        <QuickActionLink key={href} href={href} label={label} />
                    ))}
                </div>
            </div>
        </div>
    );
}