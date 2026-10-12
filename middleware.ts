import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ru", "am"];
const defaultLocale = "en";

// Internal route that always calls notFound(), so the branded 404 page is rendered with a 404 status
const NOT_FOUND_PATH = "page-not-found";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if pathname starts with a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    let locale = defaultLocale;

    if (pathnameHasLocale) {
        locale = pathname.split("/")[1];
        const response = NextResponse.next();

        // Update cookie if needed
        const currentCookie = request.cookies.get("i18next")?.value;
        if (currentCookie !== locale) {
            response.cookies.set("i18next", locale);
        }
        return response;
    }

    // Default to cookie if present, otherwise default locale
    const localeMatch = request.cookies.get("i18next")?.value;
    if (locales.includes(localeMatch as string)) {
        locale = localeMatch as string;
    }

    // Only the bare root redirects to a localized homepage
    if (pathname === "/") {
        request.nextUrl.pathname = `/${locale}`;
        const response = NextResponse.redirect(request.nextUrl);
        response.cookies.set("i18next", locale);
        return response;
    }

    // Anything else without a locale prefix (/sitemap.xml, /foo.php, /about-us, ...) is a 404.
    // Without this, /[lang] would catch it as lang="sitemap.xml" and render a duplicate homepage.
    request.nextUrl.pathname = `/${locale}/${NOT_FOUND_PATH}`;
    return NextResponse.rewrite(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip internal paths, real files in /public, and metadata routes (robots.txt, /sitemap/<lang>.xml)
        "/((?!api|_next/static|_next/image|__nextjs|favicon\\.ico|favicon\\.png|logo\\.jpg|images/|logo-images/|legal-updates/.+\\.pdf|robots\\.txt|sitemap/).*)",
    ],
};
