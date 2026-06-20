"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    // Admin routes render their own sidebar shell (src/app/admin/layout.tsx) —
    // skip the public Navbar/Footer entirely so they don't double up.
    if (isAdmin) {
        return <>{children}</>;
    }

    // No paddingTop here — the Navbar is a floating pill (fixed, top: 0.875rem)
    // that overlays the page content/hero rather than pushing it down.
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}