import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ru", "am"];
const defaultLocale = "en";

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

    // Rewrite or Redirect? The standard approach is to redirect to the URL with locale
    request.nextUrl.pathname = `/${locale}${pathname}`;
    const response = NextResponse.redirect(request.nextUrl);
    response.cookies.set("i18next", locale);
    return response;
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api, images, favicon)
        "/((?!api|_next/static|_next/image|favicon.ico|logo.jpg|.*\\..*|images/).*)",
    ],
};
