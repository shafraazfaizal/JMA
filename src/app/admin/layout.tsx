"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
    LayoutDashboard, Megaphone, Flag, Newspaper, PenSquare,
    Calendar, TrendingUp, Image as ImageIcon, LogOut,
    ExternalLink, ChevronLeft, ChevronRight,
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
    const [collapsed, setCollapsed] = useState(false);

    if (pathname === "/admin/login") return <>{children}</>;

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    const sidebarWidth = collapsed ? "68px" : "260px";

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB", display: "flex", fontFamily: "var(--font-inter)" }}>

            {/* ── Sidebar ── */}
            <aside
                style={{
                    width: sidebarWidth,
                    flexShrink: 0,
                    backgroundColor: "#073D47",
                    display: "flex",
                    flexDirection: "column" as const,
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                }}
            >
                {/* Brand */}
                <div
                    style={{
                        padding: collapsed ? "1.25rem 0" : "1.25rem 1.25rem 1rem",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "space-between",
                        gap: "0.625rem",
                        minHeight: "72px",
                        transition: "padding 0.25s ease",
                    }}
                >
                    {!collapsed && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
                            <Image
                                src="/logo/logo.svg"
                                alt="JMA"
                                width={100}
                                height={26}
                                style={{ height: "26px", width: "auto", flexShrink: 0 }}
                            />
                            <div style={{ overflow: "hidden" }}>
                                <p style={{ fontFamily: "var(--font-jakarta)", fontWeight: 800, fontSize: "0.875rem", color: "#ffffff", lineHeight: 1.2, whiteSpace: "nowrap" as const }}>
                                    JMA Admin
                                </p>
                                <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" as const }}>
                                    Content Dashboard
                                </p>
                            </div>
                        </div>
                    )}

                    {collapsed && (
                        <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Image
                                src="/logo/logo-white.svg"
                                alt="JMA"
                                width={28}
                                height={28}
                                style={{ height: "28px", width: "auto" }}
                            />
                        </div>
                    )}

                    {/* Collapse toggle — only visible when expanded */}
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            aria-label="Collapse sidebar"
                            style={{
                                width: "28px", height: "28px", borderRadius: "0.375rem",
                                border: "1px solid rgba(255,255,255,0.15)",
                                backgroundColor: "rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", flexShrink: 0, transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.12)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                        >
                            <ChevronLeft size={14} aria-hidden="true" />
                        </button>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: collapsed ? "1rem 0.5rem" : "1rem 0.875rem", display: "flex", flexDirection: "column" as const, gap: "0.25rem", transition: "padding 0.25s ease" }}>
                    {navItems.map(({ href, label, icon: Icon, exact }) => {
                        const isActive = exact ? pathname === href : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                title={collapsed ? label : undefined}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: collapsed ? 0 : "0.75rem",
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    padding: collapsed ? "0.7rem 0" : "0.625rem 0.875rem",
                                    borderRadius: "0.5rem",
                                    fontFamily: "var(--font-inter)",
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
                                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.6)",
                                    backgroundColor: isActive ? "rgba(201,168,76,0.18)" : "transparent",
                                    textDecoration: "none",
                                    transition: "all 0.15s ease",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap" as const,
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
                                <Icon
                                    size={17}
                                    style={{ color: isActive ? "#C9A84C" : "rgba(255,255,255,0.5)", flexShrink: 0 }}
                                    aria-hidden="true"
                                />
                                {!collapsed && (
                                    <span style={{ opacity: collapsed ? 0 : 1, transition: "opacity 0.2s ease" }}>
                                        {label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer actions */}
                <div style={{ padding: collapsed ? "0.875rem 0.5rem" : "0.875rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column" as const, gap: "0.25rem", transition: "padding 0.25s ease" }}>

                    {/* Expand button — only in collapsed state */}
                    {collapsed && (
                        <button
                            onClick={() => setCollapsed(false)}
                            aria-label="Expand sidebar"
                            title="Expand sidebar"
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                padding: "0.7rem 0", borderRadius: "0.5rem",
                                border: "none", background: "none", cursor: "pointer",
                                color: "rgba(255,255,255,0.5)", transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                        >
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    )}

                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={collapsed ? "View Live Site" : undefined}
                        style={{
                            display: "flex", alignItems: "center",
                            justifyContent: collapsed ? "center" : "flex-start",
                            gap: collapsed ? 0 : "0.75rem",
                            padding: collapsed ? "0.7rem 0" : "0.625rem 0.875rem",
                            borderRadius: "0.5rem",
                            fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "0.875rem",
                            color: "rgba(255,255,255,0.6)", textDecoration: "none",
                            transition: "background-color 0.15s ease", whiteSpace: "nowrap" as const,
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
                    >
                        <ExternalLink size={16} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} aria-hidden="true" />
                        {!collapsed && "View Live Site"}
                    </a>

                    <button
                        onClick={handleLogout}
                        title={collapsed ? "Sign Out" : undefined}
                        style={{
                            display: "flex", alignItems: "center",
                            justifyContent: collapsed ? "center" : "flex-start",
                            gap: collapsed ? 0 : "0.75rem",
                            padding: collapsed ? "0.7rem 0" : "0.625rem 0.875rem",
                            borderRadius: "0.5rem", border: "none", background: "none",
                            cursor: "pointer", fontFamily: "var(--font-inter)", fontWeight: 500,
                            fontSize: "0.875rem", color: "rgba(255,255,255,0.6)",
                            textAlign: "left" as const, transition: "background-color 0.15s ease",
                            whiteSpace: "nowrap" as const, width: "100%",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                    >
                        <LogOut size={16} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }} aria-hidden="true" />
                        {!collapsed && "Sign Out"}
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main style={{ flex: 1, minWidth: 0, padding: "2.5rem", transition: "all 0.25s ease" }}>
                {children}
            </main>
        </div>
    );
}