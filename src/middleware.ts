// import { createServerClient, type CookieOptions } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//     let supabaseResponse = NextResponse.next({ request });

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll() {
//                     return request.cookies.getAll();
//                 },
//                 setAll(
//                     cookiesToSet: { name: string; value: string; options: CookieOptions }[]
//                 ) {
//                     cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
//                     supabaseResponse = NextResponse.next({ request });
//                     cookiesToSet.forEach(({ name, value, options }) =>
//                         supabaseResponse.cookies.set(name, value, options)
//                     );
//                 },
//             },
//         }
//     );

//     const {
//         data: { user },
//     } = await supabase.auth.getUser();

//     const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
//     const isLoginRoute = request.nextUrl.pathname === "/admin/login";

//     // Protect every /admin route except the login page itself
//     if (isAdminRoute && !isLoginRoute && !user) {
//         const url = request.nextUrl.clone();
//         url.pathname = "/admin/login";
//         return NextResponse.redirect(url);
//     }

//     // Already logged in — skip the login page, go straight to dashboard
//     if (isLoginRoute && user) {
//         const url = request.nextUrl.clone();
//         url.pathname = "/admin";
//         return NextResponse.redirect(url);
//     }

//     return supabaseResponse;
// }

// export const config = {
//     matcher: ["/admin/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow the homepage (coming soon page) through
    if (pathname === "/") return NextResponse.next();

    // Allow admin routes through so you can still manage content
    if (pathname.startsWith("/admin")) return NextResponse.next();

    // Allow Next.js internals and static files through
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/logo") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Redirect everything else to the coming soon homepage
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};