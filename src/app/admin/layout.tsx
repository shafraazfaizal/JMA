"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, Megaphone, Flag, Newspaper, PenSquare,
    Calendar, TrendingUp, Image as ImageIcon, LogOut, ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/campaigns", label: "Campaigns", icon: Flag },
    { href: "/admin/news", label: "News & Newsletter", icon: Newspaper },
    { href: "/admin/blog", label: "Blog", icon: PenSquare },
    { href: "/admin/events", label: "Events", icon: Calendar },
    { href: "/admin/impact", label: "Impact Page", icon: TrendingUp },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Login page renders its own full-screen layout — skip the shell
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", display: "flex", fontFamily: "var(--font-inter)" }}>

            {/* ── Sidebar ── */}
            <aside
                style={{
                    width: "260px",
                    flexShrink: 0,
                    backgroundColor: "#073D47",
                    display: "flex",
                    flexDirection: "column" as const,
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                }}
            >
                {/* Brand */}
                <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <div>
                            <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.9375rem", color: "#ffffff", lineHeight: 1.2 }}>
                                JMA Admin
                            </p>
                            <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Content Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "1rem 0.875rem", display: "flex", flexDirection: "column" as const, gap: "0.25rem" }}>
                    {navItems.map(({ href, label, icon: Icon, exact }) => {
                        const isActive = exact ? pathname === href : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "0.625rem 0.875rem",
                                    borderRadius: "0.5rem",
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
                                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                                    backgroundColor: isActive ? "rgba(201,168,76,0.18)" : "transparent",
                                    textDecoration: "none",
                                    transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (isActive) return;
                                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    if (isActive) return;
                                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                                }}
                            >
                                <Icon size={17} style={{ color: isActive ? "#C9A84C" : "rgba(255,255,255,0.5)", flexShrink: 0 }} aria-hidden="true" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer actions */}
                <div style={{ padding: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column" as const, gap: "0.25rem" }}>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.625rem 0.875rem",
                            borderRadius: "0.5rem",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            transition: "background-color 0.15s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
                    >
                        <ExternalLink size={16} style={{ color: "rgba(255,255,255,0.5)" }} aria-hidden="true" />
                        View Live Site
                    </a>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.625rem 0.875rem",
                            borderRadius: "0.5rem",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            fontFamily: "var(--font-inter)",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            color: "rgba(255,255,255,0.6)",
                            textAlign: "left" as const,
                            transition: "background-color 0.15s ease",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                    >
                        <LogOut size={16} style={{ color: "rgba(255,255,255,0.5)" }} aria-hidden="true" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main style={{ flex: 1, minWidth: 0, padding: "2.5rem" }}>
                {children}
            </main>
        </div>
    );
}