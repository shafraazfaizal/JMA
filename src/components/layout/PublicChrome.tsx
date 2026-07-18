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

// "use client";

// import { usePathname } from "next/navigation";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";

// // Set this to true when deploying the coming soon page.
// // Set back to false when the full site is ready.
// const COMING_SOON_MODE = true;

// export default function PublicChrome({ children }: { children: React.ReactNode }) {
//     const pathname = usePathname();
//     const isAdmin = pathname?.startsWith("/admin");

//     // Skip Navbar/Footer entirely on admin routes
//     if (isAdmin) {
//         return <>{children}</>;
//     }

//     // Skip Navbar/Footer when in coming soon mode
//     if (COMING_SOON_MODE) {
//         return <>{children}</>;
//     }

//     return (
//         <>
//             <Navbar />
//             {children}
//             <Footer />
//         </>
//     );
// }