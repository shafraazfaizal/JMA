import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow the homepage (coming soon page) through
    if (pathname === "/") return NextResponse.next();

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

    // Everything else — including /admin — redirects to the coming soon homepage
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};