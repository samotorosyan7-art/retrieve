/**
 * Centralized date formatting utility to prevent hydration errors
 * Ensures consistent date formatting across server and client
 */

export function formatDate(iso: string, lang: string = "en"): string {
    // Normalize language to ensure consistency between server and client
    const normalizedLang = lang?.toLowerCase() || "en";
    
    let locale: string;
    if (normalizedLang.startsWith("am")) {
        locale = "hy-AM";
    } else if (normalizedLang.startsWith("ru")) {
        locale = "ru-RU";
    } else {
        locale = "en-US";
    }
    
    return new Date(iso).toLocaleDateString(locale, {
        year: "numeric",
        month: "long", 
        day: "numeric",
    });
}
