import type { Metadata } from "next";

export const SITE_URL = "https://www.retrieve.am";
export const LOCALES = ["en", "ru", "am"] as const;

// URLs use "/am/" for Armenian, but the ISO 639-1 code is "hy" ("am" is Amharic).
export function toLangCode(lang: string): string {
    return lang === "am" ? "hy" : lang;
}

/** Canonical + hreflang for a page, built from the route (not from WordPress). */
export function buildAlternates(lang: string, path: string): Metadata["alternates"] {
    const suffix = `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "");
    const url = (l: string) => `${SITE_URL}/${l}${suffix}`;
    return {
        canonical: url(lang),
        languages: {
            en: url("en"),
            ru: url("ru"),
            hy: url("am"),
            "x-default": url("en"),
        },
    };
}
