import type { Metadata } from "next";

export const SITE_URL = "https://www.retrieve.am";
export const LOCALES = ["en", "ru", "am"] as const;

// URLs use "/am/" for Armenian, but the ISO 639-1 code is "hy" ("am" is Amharic).
export function toLangCode(lang: string): string {
    return lang === "am" ? "hy" : lang;
}

/**
 * Canonical + hreflang for a page, built from the route (not from WordPress).
 * `available` limits hreflang to the languages the page really exists in
 * (e.g. an untranslated blog post); x-default prefers English among them.
 */
export function buildAlternates(
    lang: string,
    path: string,
    available: readonly string[] = LOCALES,
): Metadata["alternates"] {
    const suffix = `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "");
    const url = (l: string) => `${SITE_URL}/${l}${suffix}`;
    const locales = LOCALES.filter((l) => available.includes(l));
    const defaultLang = locales.includes("en") ? "en" : locales[0] ?? "en";
    return {
        canonical: url(lang),
        languages: {
            ...Object.fromEntries(locales.map((l) => [toLangCode(l), url(l)])),
            "x-default": url(defaultLang),
        },
    };
}
