import { WPPost, WPTeamMember, MenuItem, WPTag, LegalUpdate, WPPage } from "@/types/wordpress";
import * as cheerio from "cheerio";

import enCommon from '../locales/en/common.json';
import ruCommon from '../locales/ru/common.json';
import amCommon from '../locales/am/common.json';

const dictionaries: Record<string, any> = {
    en: enCommon,
    ru: ruCommon,
    am: amCommon,
};

const SCRAPER_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";

function getMetaKey(path: string): string {
    const cleanPath = path.trim().replace(/^\/+|\/+$/g, "");
    if (!cleanPath) return "home";
    
    if (cleanPath === "about-us") return "about_us";
    if (cleanPath === "legal-services") return "legal_services";
    if (cleanPath === "tax-and-business-advisory-services") return "tax_and_business_advisory_services";
    if (cleanPath === "blog") return "blog";
    if (cleanPath === "legal-updates") return "legal_updates";
    
    const segments = cleanPath.split("/");
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-/g, "_");
}

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://wp.retrieve.am/wp-json/wp/v2";
const WP_BASE_URL = WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, "");

const LANGUAGE_AUTHOR_MAP: Record<string, number> = {
    en: 2, // Samvel Torosyan
    am: 1, // arman.torosyan
    ru: 3, // Lilya Zalinyan
};

function fixHttps(url: string | null | undefined): string {
    if (!url) return "";
    let fixedUrl = url;
    if (fixedUrl.startsWith("http://")) {
        fixedUrl = fixedUrl.replace("http://", "https://");
    }
    // Route wp-content images through wp.retrieve.am to avoid 403 from the main site.
    // Only replace if the host is www.retrieve.am or retrieve.am (not already wp.retrieve.am).
    if (fixedUrl.includes("/wp-content/uploads/")) {
        fixedUrl = fixedUrl.replace(/^(https?:\/\/)(www\.)?retrieve\.am\//, "$1wp.retrieve.am/");
    }
    return fixedUrl;
}

/**
 * Pick the highest-resolution image URL from an <img>, accounting for lazy-loading
 * plugins (data-src) and responsive srcset attributes.
 */
function pickBestImage($img: cheerio.Cheerio<any>): string {
    const dataSrc = $img.attr("data-src");
    const srcset = $img.attr("srcset") || $img.attr("data-srcset");
    let rawImage = dataSrc || $img.attr("src") || "";
    if (srcset) {
        const candidates = srcset.split(",").map((s) => s.trim());
        let bestUrl = "";
        let bestWidth = 0;
        for (const candidate of candidates) {
            const parts = candidate.split(/\s+/);
            const url = parts[0];
            const width = parseInt((parts[1] || "").replace("w", ""), 10) || 0;
            if (width > bestWidth || !bestUrl) {
                bestWidth = width;
                bestUrl = url;
            }
        }
        if (bestUrl) rawImage = bestUrl;
    }
    return rawImage;
}

/**
 * Fetch the slugs of every PUBLISHED personnel from the WordPress personnel sitemap.
 * This is the source of truth for who is published, independent of the curated
 * our-team page (which may omit some published members).
 */
async function getPublishedPersonnelSlugs(): Promise<string[]> {
    try {
        const res = await fetch(`${WP_BASE_URL}/personnel-sitemap.xml`, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });
        if (!res.ok) return [];

        const xml = await res.text();
        const slugs: string[] = [];
        const seen = new Set<string>();
        const regex = /\/personnel\/([a-z0-9-]+)\/?/gi;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(xml)) !== null) {
            const slug = match[1];
            if (slug && !seen.has(slug)) {
                seen.add(slug);
                slugs.push(slug);
            }
        }
        return slugs;
    } catch (error) {
        console.error("Error fetching personnel sitemap:", error);
        return [];
    }
}


/**
 * Scrape the WordPress page <head> for Yoast SEO data and convert it to Next.js Metadata.
 * Falls back to {} gracefully if WP is slow or unavailable.
 */
export async function getYoastMetadata(path: string, lang: string = "en", overridePath?: string): Promise<import("next").Metadata> {
    try {
        const baseUrl = lang === "en" ? WP_BASE_URL : `${WP_BASE_URL}/${lang}`;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const url = `${baseUrl}${cleanPath === "/" ? "" : cleanPath}/`;

        // 5-second timeout to avoid hanging Vercel serverless functions
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        let html: string;
        try {
            let response = await fetch(url, {
                signal: controller.signal,
                cache: "no-store",
                headers: { "User-Agent": SCRAPER_USER_AGENT },
            });

            // Fallback 1: If 404 and path has a subdirectory (like /practice-areas/slug), try the root slug (/slug)
            if (!response.ok && cleanPath.split("/").filter(Boolean).length > 1) {
                const slug = cleanPath.split("/").filter(Boolean).pop();
                const fallbackRootUrl = `${baseUrl}/${slug}/`;
                const fallbackResponse = await fetch(fallbackRootUrl, {
                    signal: controller.signal,
                    cache: "no-store",
                    headers: { "User-Agent": SCRAPER_USER_AGENT },
                });
                if (fallbackResponse.ok) {
                    response = fallbackResponse;
                }
            }

            // Fallback 2: If still not OK and lang !== "en", try the English version
            if (!response.ok && lang !== "en") {
                const englishBaseUrl = WP_BASE_URL;
                const fallbackUrl = `${englishBaseUrl}${cleanPath === "/" ? "" : cleanPath}/`;
                const fallbackResponse = await fetch(fallbackUrl, {
                    signal: controller.signal,
                    cache: "no-store",
                    headers: { "User-Agent": SCRAPER_USER_AGENT },
                });

                if (fallbackResponse.ok) {
                    response = fallbackResponse;
                } else if (cleanPath.split("/").filter(Boolean).length > 1) {
                    // Also try the root slug in English
                    const slug = cleanPath.split("/").filter(Boolean).pop();
                    const engRootUrl = `${englishBaseUrl}/${slug}/`;
                    const engRootResponse = await fetch(engRootUrl, {
                        signal: controller.signal,
                        cache: "no-store",
                        headers: { "User-Agent": SCRAPER_USER_AGENT },
                    });
                    if (engRootResponse.ok) response = engRootResponse;
                }
            }

            clearTimeout(timeout);
            if (!response.ok) return {};
            html = await response.text();
        } catch (err) {
            clearTimeout(timeout);
            console.error(`Fetch error in getYoastMetadata for ${url}:`, err);
            return {};
        }

        const $ = cheerio.load(html);

        // Resolve translated title and description from common.json
        const dict = dictionaries[lang] || enCommon;
        const metaKey = getMetaKey(path);
        
        let title = dict.meta_titles?.[metaKey] || "";
        let description = dict.meta_descriptions?.[metaKey] || "";

        // Fallback to scraped titles if localized title not found
        if (!title) {
            title = $("title").text() ||
                $("meta[property='og:title']").attr("content") ||
                $("meta[name='twitter:title']").attr("content") ||
                $("h1").first().text();
        }
        if (!description) {
            description = $("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content") || "";
        }
        const ogImage = $("meta[property='og:image']").attr("content");
        const finalOgImage = ogImage ? fixHttps(ogImage) : "https://www.retrieve.am/logo.png";

        const BASE_URL = "https://www.retrieve.am";
        const nextPath = overridePath || path;
        const normalizedPath = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
        // Ensure path ends without slash for consistent concatenation, then add it where needed
        const pathSuffix = normalizedPath.replace(/\/$/, "");
        const finalCanonical = `${BASE_URL}/${lang}${pathSuffix}`.replace(/\/+$/, "");

        return {
            title: title ? { absolute: title } : undefined,
            description: description || undefined,
            alternates: {
                canonical: finalCanonical,
                languages: {
                    "en": `${BASE_URL}/en${pathSuffix}`.replace(/\/+$/, ""),
                    "am": `${BASE_URL}/am${pathSuffix}`.replace(/\/+$/, ""),
                    "ru": `${BASE_URL}/ru${pathSuffix}`.replace(/\/+$/, ""),
                    "x-default": `${BASE_URL}/en${pathSuffix}`.replace(/\/+$/, ""),
                },
            },
            openGraph: {
                siteName: "Retrieve Legal & Tax",
                type: "website",
                title: title || undefined,
                description: description || undefined,
                images: [finalOgImage],
                url: finalCanonical,
            },
            twitter: {
                card: "summary_large_image",
                title: title || undefined,
                description: description || undefined,
                images: [finalOgImage],
            },
        };
    } catch (e) {
        console.error(`Error scraping Yoast metadata for ${path}:`, e);
        return {};
    }
}


export async function getLatestPosts(limit = 3, lang?: string): Promise<WPPost[]> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("categories_exclude", "3");
        url.searchParams.append("per_page", limit.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", Date.now().toString());

        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        }

        const response = await fetch(url.toString(), {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error("Failed to fetch posts:", response.statusText);
            return [];
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error(`WordPress API returned non-JSON response: ${contentType}. Body: ${text.substring(0, 500)}`);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

/**
 * Fetch blog posts from retrieve.am, excluding legal-updates (category 2)
 */
export async function getBlogPosts(
    limit = 9,
    page = 1,
    lang?: string
): Promise<{ posts: LegalUpdate[]; total: number; totalPages: number }> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("categories_exclude", "3");
        url.searchParams.append("per_page", limit.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", Date.now().toString());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        } else if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { cache: "no-store" });

        if (!response.ok) return { posts: [], total: 0, totalPages: 0 };

        const total = parseInt(response.headers.get("X-WP-Total") || "0");
        const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");
        const data = await response.json();

        const posts: LegalUpdate[] = data.map((p: any) => {
            const wordCount =
                p.content?.rendered?.replace(/<[^>]+>/g, "").split(/\s+/).length ?? 0;
            const rawImage =
                p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large
                    ?.source_url ||
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                null;
            const image = rawImage ? fixHttps(rawImage) : null;
            const rawExcerpt =
                p.excerpt?.rendered
                    ?.replace(/<[^>]+>/g, "")
                    .replace(/\[&hellip;\]/, "…")
                    .trim() ?? "";

            // Extract tags
            const tags = p._embedded?.["wp:term"]?.[1]?.map((tag: any) => ({
                id: tag.id,
                name: tag.name.replace(/&amp;/g, "&"),
                slug: tag.slug,
            })) || [];

            const imageAlt = p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

            return {
                id: p.id,
                slug: p.slug,
                title: p.title?.rendered?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8211;/g, "–") ?? "",
                excerpt: rawExcerpt.replace(/&nbsp;/g, " "),
                content: p.content?.rendered ?? "",
                date: p.date,
                modified: p.modified,
                image,
                imageAlt,
                author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
                readTime: Math.max(1, Math.ceil(wordCount / 200)),
                link: p.link ?? "",
                tags,
            };
        });

        return { posts, total, totalPages };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

/**
 * Fetch masonry posts from retrieve.am
 */
export async function getMasonryPosts(
    limit = 6,
    lang?: string
): Promise<{ posts: LegalUpdate[] }> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("categories", "3"); // Masonry category ID
        url.searchParams.append("per_page", limit.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", Date.now().toString());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");

        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        }

        let data = [];
        const response = await fetch(url.toString(), { cache: "no-store" });

        if (response.ok) {
            data = await response.json();
            
            // Fallback: If no posts found with author filter, try without it
            if (data.length === 0 && lang && LANGUAGE_AUTHOR_MAP[lang]) {
                const fallbackUrl = new URL(`${WP_API_URL}/posts`);
                fallbackUrl.searchParams.append("categories", "3");
                fallbackUrl.searchParams.append("per_page", limit.toString());
                fallbackUrl.searchParams.append("_embed", "1");
                fallbackUrl.searchParams.append("v", Date.now().toString());
                const fallbackRes = await fetch(fallbackUrl.toString(), { cache: "no-store" });
                if (fallbackRes.ok) {
                    data = await fallbackRes.json();
                }
            }
        } else {
            return { posts: [] };
        }

        const posts: LegalUpdate[] = data.map((p: any) => {
            const rawImage =
                p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large
                    ?.source_url ||
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                null;
            const image = rawImage ? fixHttps(rawImage) : null;
            const rawExcerpt =
                p.excerpt?.rendered
                    ?.replace(/<[^>]+>/g, "")
                    .replace(/\[&hellip;\]/, "…")
                    .trim() ?? "";

            return {
                id: p.id,
                slug: p.slug,
                title: p.title?.rendered?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8211;/g, "–") ?? "",
                excerpt: rawExcerpt.replace(/&nbsp;/g, " "),
                content: p.content?.rendered ?? "",
                date: p.date,
                modified: p.modified,
                image,
                imageAlt: p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "",
                author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
                readTime: 1, // Optional for masonry
                link: p.link ?? "",
                tags: []
            };
        });

        return { posts };
    } catch (error) {
        console.error("Error fetching masonry posts:", error);
        return { posts: [] };
    }
}

// Explicit display order for the team. Published members not listed here are
// appended afterwards (in sitemap order).
const PERSONNEL_ORDER = [
    "feliks-hovakimyan",     // Feliks
    "michael-hovhannesyan",  // Maykl (Michael)
    "vache-simonyan",        // Vache
    "aleksandr-harutyunyan", // Aleksander Harutyunyan
    "lia-nikoghosyan",       // Lia
    "anahit-petrosyan",      // Anahit
    "larisa-petrosyan",      // Larisa
    "lilit-petrosyan",       // Lilit
    "renata-martirosyan",    // Renata
    "levon-aghbalyan",       // Levon
    "mikayel-sargsyan",      // Mikayel
    "yeghishe-manukyan",     // Yeghishe
    "iren-aghasyan",         // Iren
    "nanar-siravyan",        // Nanar
];

/**
 * Build a team card for a single personnel by scraping their profile page.
 * The position comes from the profile's title caption (e.g. "Tax Specialist"),
 * which is where the caption is set in WordPress — the our-team list card does
 * not render it for most members.
 *
 * Cached for an hour: getTeamMembers runs on the home page, about-us page and
 * the sitemap, so we avoid re-fetching every profile on every request.
 */
async function getTeamMemberCard(slug: string, lang?: string): Promise<WPTeamMember | null> {
    try {
        const fetchUrl =
            lang === "am"
                ? `${WP_BASE_URL}/personnel/${slug}/?lang=hy`
                : lang && lang !== "en"
                    ? `${WP_BASE_URL}/${lang}/personnel/${slug}/`
                    : `${WP_BASE_URL}/personnel/${slug}/`;

        const fetchOpts = {
            next: { revalidate: 3600 },
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        } as const;

        let response = await fetch(fetchUrl, fetchOpts);

        // Fall back to the English profile if the translated one is missing.
        if (!response.ok && lang && lang !== "en") {
            response = await fetch(`${WP_BASE_URL}/personnel/${slug}/`, fetchOpts);
        }

        if (!response.ok) return null;

        const $ = cheerio.load(await response.text());

        const name =
            $(".gdlr-core-title-item-title").first().text().trim() ||
            $("h1").first().text().trim();
        if (!name) return null;

        // Caption / position set on the profile page.
        const position = $(".gdlr-core-title-item-caption").first().text().trim();

        const $img = $(".gdlr-core-column-20 img").first().length
            ? $(".gdlr-core-column-20 img").first()
            : $("img[src*='wp-content/uploads']").first();
        const rawImage = pickBestImage($img);

        const link =
            lang && lang !== "en"
                ? `${WP_BASE_URL}/${lang}/personnel/${slug}/`
                : `${WP_BASE_URL}/personnel/${slug}/`;

        return {
            id: `team-${slug}`,
            name,
            position,
            image: rawImage ? fixHttps(rawImage) : "",
            imageAlt: $img.attr("alt") || "",
            link,
        };
    } catch (error) {
        console.error(`Error fetching team member card for ${slug}:`, error);
        return null;
    }
}

/**
 * Fallback: scrape the curated our-team page for team members. Used only when the
 * personnel sitemap is unavailable. Does not include the profile-page caption.
 */
async function scrapeOurTeamPage(lang?: string): Promise<WPTeamMember[]> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const response = await fetch(`${baseUrl}our-team/`, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });
        if (!response.ok) return [];

        const $ = cheerio.load(await response.text());
        const members: WPTeamMember[] = [];
        const seen = new Set<string>();

        $(".gdlr-core-personnel-list-column, .gdlr-core-personnel-grid-column, .gdlr-core-personnel-item").each((_, el) => {
            const name = $(el).find("[class*='-title'] a, [class*='-title']").first().text().trim();
            const position = $(el).find("[class*='-position']").first().text().trim();
            const $img = $(el).find("img");
            const rawImage = pickBestImage($img);
            const link = fixHttps($(el).find("a").attr("href") || "");
            const slug = link.split("/personnel/")[1]?.replace(/\//g, "") || "";

            if (name && slug && !seen.has(slug)) {
                seen.add(slug);
                members.push({
                    id: `team-${slug}`,
                    name,
                    position,
                    image: rawImage ? fixHttps(rawImage) : "",
                    imageAlt: $img.attr("alt") || "",
                    link,
                });
            }
        });

        return members;
    } catch (error) {
        console.error("Error scraping our-team page:", error);
        return [];
    }
}

export async function getTeamMembers(lang?: string): Promise<WPTeamMember[]> {
    try {
        // Authoritative list of every PUBLISHED personnel, regardless of whether they
        // were placed on the curated our-team page.
        const publishedSlugs = await getPublishedPersonnelSlugs();

        // If the sitemap is unavailable, fall back to scraping the our-team page.
        if (publishedSlugs.length === 0) {
            return scrapeOurTeamPage(lang);
        }

        const orderIndex = (slug: string) => {
            const i = PERSONNEL_ORDER.indexOf(slug);
            return i === -1 ? Number.MAX_SAFE_INTEGER : i;
        };
        const orderedSlugs = [...publishedSlugs].sort((a, b) => orderIndex(a) - orderIndex(b));

        // Build each card from the member's profile page so the caption/position shows
        // for everyone (not just those whose position appears on the our-team list).
        const members = await Promise.all(
            orderedSlugs.map((slug) => getTeamMemberCard(slug, lang))
        );

        return members.filter((m): m is WPTeamMember => m !== null);
    } catch (error) {
        console.error("Error fetching team members:", error);
        return [];
    }
}

/**
 * Get portfolio categories and sub-categories by scraping the main menu
 */
export async function getPortfolioCategories(): Promise<MenuItem[]> {
    try {
        const response = await fetch(`${WP_BASE_URL}/`, {
            cache: "no-store",
            headers: {
                "User-Agent": SCRAPER_USER_AGENT,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch menu");
            return [];
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const menuItems: MenuItem[] = [];

        // Find the Practice Areas menu item
        let practiceAreasLi: any = null;

        $(".sf-menu > li").each((_, el) => {
            if ($(el).children("a").text().trim().includes("Practice Areas")) {
                practiceAreasLi = el;
            }
        });

        if (practiceAreasLi) {
            $(practiceAreasLi).find("> ul.sub-menu > li").each((_, subEl) => {
                const catName = $(subEl).children("a").text().trim();
                const children: MenuItem[] = [];

                $(subEl).find("> ul.sub-menu > li").each((_, childEl) => {
                    const childName = $(childEl).children("a").text().trim();
                    const childUrl = $(childEl).children("a").attr("href");

                    // Convert full URLs to relative
                    let relativeUrl = childUrl ? childUrl.replace(/^https?:\/\/(www\.|wp\.)?retrieve\.am/, "") : "#";
                    if (!relativeUrl.startsWith("/")) relativeUrl = "/" + relativeUrl;

                    children.push({
                        label: childName,
                        url: relativeUrl
                    });
                });

                if (catName) {
                    let sortedChildren = [...children];

                    if (catName.includes("Legal")) {
                        const orderSlugs = [
                            "corporate-business-law",
                            "immigration-residence-services",
                            "employment-law",
                            "intellectual-property-law",
                            "real-estate-construction-law",
                            "investment-law",
                            "arbitration-ligitation"
                        ];

                        sortedChildren.sort((a, b) => {
                            const aSlug = a.url.split('/').filter(Boolean).pop() || "";
                            const bSlug = b.url.split('/').filter(Boolean).pop() || "";

                            const aIdx = orderSlugs.indexOf(aSlug);
                            const bIdx = orderSlugs.indexOf(bSlug);

                            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                            if (aIdx !== -1) return -1;
                            if (bIdx !== -1) return 1;
                            return 0;
                        });
                    }

                    menuItems.push({
                        label: catName,
                        url: "#", // Top level categories usually don't have deep links in header themselves
                        children: sortedChildren
                    });
                }
            });
        }

        return menuItems;
    } catch (error) {
        console.error("Error scraping portfolio categories:", error);
        return [];
    }
}

/**
 * Build the Practice Areas navigation (Header + Footer) from the full listing
 * pages instead of the curated WP nav menu, so EVERY service is shown and the
 * navigation stays in sync with the /legal-services and
 * /tax-and-business-advisory-services pages.
 *
 * Always uses the English listing pages so the labels match the i18n keys
 * (practice_categories / practice_titles); display translation happens client side.
 */
export async function getPracticeAreasNav(): Promise<MenuItem[]> {
    const items = await getPortfolioItems();
    if (items.length === 0) return [];

    const legalOrder = [
        "corporate-business-law",
        "immigration-residence-services",
        "employment-law",
        "intellectual-property-law",
        "real-estate-construction-law",
        "investment-law",
        "arbitration-ligitation",
    ];

    const buildChildren = (category: string, order?: string[]): MenuItem[] => {
        const children = items.filter((item) => item.category === category);
        if (order) {
            children.sort((a, b) => {
                const aIdx = order.indexOf(a.slug);
                const bIdx = order.indexOf(b.slug);
                if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                if (aIdx !== -1) return -1;
                if (bIdx !== -1) return 1;
                return 0;
            });
        }
        return children.map((item) => ({ label: item.title, url: `/${item.slug}` }));
    };

    const menu: MenuItem[] = [];
    const legal = buildChildren("Legal services", legalOrder);
    const tax = buildChildren("Tax & Business advisory services");
    if (legal.length > 0) menu.push({ label: "Legal services", url: "#", children: legal });
    if (tax.length > 0) menu.push({ label: "Tax & Business advisory services", url: "#", children: tax });
    return menu;
}

/**
 * Get all portfolio items (practice areas) - Scraped from Live WP HTML
 */
export async function getPortfolioItems(lang?: string): Promise<PortfolioItem[]> {
    try {
        const fetchItemsFromUrl = async (scrapeUrl: string, category: string): Promise<PortfolioItem[]> => {
            const res = await fetch(scrapeUrl, {
                cache: "no-store",
                headers: { "User-Agent": SCRAPER_USER_AGENT }
            });
            if (!res.ok) return [];
            const html = await res.text();
            const $ = cheerio.load(html);
            const items: PortfolioItem[] = [];

            $(".gdlr-core-portfolio-item, .gdlr-core-column-service-item, .gdlr-core-item-list").each((i, el) => {
                const title = $(el).find("h3, .gdlr-core-portfolio-title, .gdlr-core-column-service-title").text().trim();
                const $img = $(el).find("img");
                const image = $img.attr("src") || null;
                const image_alt = $img.attr("alt") || "";
                const link = $(el).find("a").attr("href");

                if (title && link && link !== "#") {
                    // Extract slug from link: https://wp.retrieve.am/practice-areas/corporate-business-law/ => corporate-business-law
                    const slug = link.replace(/\/$/, "").split("/").pop() || "";
                    if (slug && !items.find(t => t.slug === slug)) {
                        items.push({
                            id: i + (category === "Legal services" ? 1000 : 2000),
                            slug: slug,
                            title: title,
                            image: image,
                            imageAlt: image_alt,
                            category: category,
                            categories: [],
                            tags: []
                        });
                    }
                }
            });
            return items;
        };

        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}` : WP_BASE_URL;

        const legalItems = await fetchItemsFromUrl(`${baseUrl}/legal-services/`, "Legal services");
        const taxItems = await fetchItemsFromUrl(`${baseUrl}/tax-and-business-advisory-services/`, "Tax & Business advisory services");

        return [...legalItems, ...taxItems];
    } catch (error) {
        console.error("Error scraping portfolio data:", error);
        return [];
    }
}

/**
 * Get portfolio items by category
 * @param category - "Legal services" or "Tax & Business advisory services"
 */
export async function getPortfolioByCategory(category: string): Promise<PortfolioItem[]> {
    try {
        const allItems = await getPortfolioItems();
        return allItems.filter(item => item.category === category);
    } catch (error) {
        console.error("Error filtering portfolio by category:", error);
        return [];
    }
}

/**
 * Get detailed information for a single personnel member
 * @param slug - Personnel slug (e.g., "feliks-hovakimyan")
 */
export async function getPersonnelDetails(slug: string, lang?: string): Promise<import("@/types/wordpress").PersonnelDetails | null> {
    try {
        // am uses TranslatePress ?lang=hy, ru uses subdirectory, en uses base
        let fetchUrl: string;
        if (lang === "am") {
            fetchUrl = `${WP_BASE_URL}/personnel/${slug}/?lang=hy`;
        } else if (lang && lang !== "en") {
            fetchUrl = `${WP_BASE_URL}/${lang}/personnel/${slug}/`;
        } else {
            fetchUrl = `${WP_BASE_URL}/personnel/${slug}/`;
        }

        let response = await fetch(fetchUrl, {
            cache: "no-store",
            headers: {
                "User-Agent": SCRAPER_USER_AGENT,
            },
        });

        // Fallback to English if the translated path doesn't exist
        if (!response.ok && lang && lang !== "en") {
            response = await fetch(`${WP_BASE_URL}/personnel/${slug}/`, {
                cache: "no-store",
                headers: {
                    "User-Agent": SCRAPER_USER_AGENT,
                },
            });
        }

        if (!response.ok) {
            console.error(`Failed to fetch personnel page for ${slug}`);
            return null;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract basic info - using correct Goodlayers selectors
        const name = $(".gdlr-core-title-item-title").first().text().trim() ||
            $("h1").first().text().trim();
        const position = $(".gdlr-core-title-item-caption").first().text().trim();

        // Extract image from the left column (gdlr-core-column-20)
        const $img = $(".gdlr-core-column-20 img").first().length
            ? $(".gdlr-core-column-20 img").first()
            : $("img[src*='wp-content/uploads']").first();

        // Prefer data-src (lazy-loading plugins), then srcset highest-res, then src
        let image = pickBestImage($img);
        const image_alt = $img.attr("alt") || "";

        if (image.startsWith("http://")) {
            image = image.replace("http://", "https://");
        }

        // Extract biography. Each personnel bio is authored as TWO (or more) separate
        // text blocks in WordPress, which may live in different columns, so collect
        // every paragraph text block on the page rather than scoping to one column.
        // List blocks (the practice areas) and empty blocks are skipped, and identical
        // blocks are de-duplicated.
        let biography = "";
        const bioSeen = new Set<string>();
        $(".gdlr-core-text-box-item-content").each((_, el) => {
            const $el = $(el);
            if ($el.find("ul, ol").length > 0) return;       // practice-area lists, not bio
            // Skip contact blocks — the email / phone belong in the sidebar, not the bio.
            if ($el.find("a[href^='mailto:'], a[href^='tel:']").length > 0) return;
            const text = $el.text().trim();
            if (!text) return;                                // skip empty blocks
            if (text.includes("@") || /\+\d[\d\s.\-()]{6,}\d/.test(text)) return; // email / phone
            const html = ($el.html() || "").trim();
            if (!html || bioSeen.has(html)) return;           // de-duplicate
            bioSeen.add(html);
            biography += html;
        });

        // Extract practice areas from icon list or text box
        const practiceAreas: string[] = [];

        // Try finding practice areas in the dedicated section
        $(".gdlr-core-text-box-item-content ul li").each((_, el) => {
            const area = $(el).text().trim();
            if (area && area.length < 100) {
                practiceAreas.push(area);
            }
        });

        // If no list found, try alternate selectors
        if (practiceAreas.length === 0) {
            $(".practice-area-item, .gdlr-core-icon-list-content").each((_, el) => {
                const area = $(el).text().trim();
                if (area && area.length < 100 && !area.includes('@') && !area.includes('+')) {
                    practiceAreas.push(area);
                }
            });
        }

        // Extract contact info. Personnel pages publish the email / phone inside the
        // bio content blocks (as plain text or mailto/tel links), not always in an icon
        // list — so read the content first, then the icon list, then any page-wide link.
        let email = "";
        let phone = "";

        const $contactContent = $(".gdlr-core-text-box-item-content");
        email = $contactContent.find("a[href^='mailto:']").first().attr("href")?.replace("mailto:", "").trim()
            || $contactContent.text().match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/)?.[0]
            || "";
        // Prefer the tel link's visible (formatted) text over the raw href so the
        // displayed number keeps its spacing (e.g. "+374 41 777 332", not "+37441777332").
        const $tel = $contactContent.find("a[href^='tel:']").first();
        phone = ($tel.text().trim()
            || $contactContent.text().match(/\+\d[\d\s().\-]{6,}\d/)?.[0]?.trim()
            || $tel.attr("href")?.replace("tel:", "").trim()
            || "").replace(/\s+/g, " ").trim();

        $(".gdlr-core-icon-list-content").each((_, el) => {
            const text = $(el).text().trim();
            if (!email && text.includes('@')) {
                email = text;
            } else if (!phone && (text.includes('+') || text.match(/\d{2,}/))) {
                phone = text;
            }
        });

        // Final fallback: any mailto / tel link anywhere on the page
        if (!email) {
            email = $("a[href^='mailto:']").attr("href")?.replace("mailto:", "").trim() || "";
        }
        if (!phone) {
            phone = $("a[href^='tel:']").attr("href")?.replace("tel:", "").replace(/\s/g, "") || "";
        }

        // The firm has a single public phone number: +374 41 777 332. Normalize any
        // scraped variant of the firm line (e.g. the incorrect +374 44 777 332) to it.
        if (phone && phone.replace(/\D/g, "").endsWith("777332")) {
            phone = "+374 41 777 332";
        }

        const linkedin = $("a[href*='linkedin.com']").attr("href") || "";

        // Extract education
        const education: import("@/types/wordpress").EducationEntry[] = [];
        $(".gdlr-core-personnel-education-item, .education-item, .timeline-item").each((_, el) => {
            const year = $(el).find(".year, .date").text().trim();
            const degree = $(el).find(".degree, .title").text().trim();
            const institution = $(el).find(".institution, .school").text().trim();

            if (year || degree || institution) {
                education.push({ year, degree, institution });
            }
        });

        return {
            name,
            position,
            image,
            imageAlt: image_alt,
            biography,
            practiceAreas,
            email,
            phone,
            linkedin,
            education,
        };
    } catch (error) {
        console.error(`Error scraping personnel details for ${slug}:`, error);
        return null;
    }
}

/**
 * Scrape Testimonials directly from the retrieve.am homepage
 */
export async function getTestimonials(lang?: string): Promise<{ text: string; author: string; role: string; initial: string }[]> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const response = await fetch(baseUrl, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const testimonials: { text: string; author: string; role: string; initial: string }[] = [];

        $(".gdlr-core-testimonial").each((_, el) => {
            const text = $(el).find(".gdlr-core-testimonial-content p").text().trim();
            const author = $(el).find(".gdlr-core-testimonial-title").text().trim();
            const role = $(el).find(".gdlr-core-testimonial-position").text().trim();

            if (text && author) {
                testimonials.push({
                    text,
                    author,
                    role,
                    initial: author.charAt(0).toUpperCase()
                });
            }
        });

        return testimonials;
    } catch (error) {
        console.error("Error scraping testimonials:", error);
        return [];
    }
}

/**
 * Scrape Client Logos directly from the retrieve.am homepage
 */
export async function getClientLogos(lang?: string): Promise<{ id: string; url: string; alt: string }[]> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const response = await fetch(baseUrl, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const logos: { id: string; url: string; alt: string }[] = [];

        // Look specifically for the gallery list items that hold the client logos
        $(".gdlr-core-gallery-list.gdlr-core-media-image img").each((i, el) => {
            const url = $(el).attr("src");
            const alt = $(el).attr("alt") || $(el).attr("title") || `Client Logo ${i + 1}`;

            if (url) {
                logos.push({
                    id: `client-${i}`,
                    url,
                    alt
                });
            }
        });

        return logos;
    } catch (error) {
        console.error("Error scraping client logos:", error);
        return [];
    }
}

/**
 * Scrape "Why Clients Choose Us" section from retrieve.am
 */
export async function getWhyChooseUs(lang?: string): Promise<{ title: string; description: string }[]> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const response = await fetch(baseUrl, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const reasons: { title: string; description: string }[] = [];

        // Find the "Why Clients Choose Us" section text boxes
        // They are generally inside gdlr-core-text-box-item where the text starts with a strong phrase followed by colon
        $(".gdlr-core-text-box-item-content p.p1").each((_, el) => {
            const text = $(el).text().trim();
            // Look for pattern "Title: Description"
            if (text && text.includes(":")) {
                const [title, ...descParts] = text.split(":");
                const description = descParts.join(":").trim();

                if (title && description && title.length < 50) {
                    reasons.push({
                        title: title.trim(),
                        description: description
                    });
                }
            }
        });

        // Filter out irrelevant short ones or mismatched
        return reasons.filter(r => r.title.length > 5 && r.description.length > 10).slice(0, 4); // Take exact 4
    } catch (error) {
        console.error("Error scraping why choose us:", error);
        return [];
    }
}

/**
 * Scrape "Legal Practise Areas" from retrieve.am/legal-services/
 */
export async function getLegalPracticeAreas(lang?: string): Promise<{ label: string; url: string }[]> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const response = await fetch(`${baseUrl}legal-services/`, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const areas: { label: string; url: string }[] = [];

        // In the footer or sidebar widgets, the list is typically inside #menu-legal-practise-areas
        $("#menu-legal-practise-areas li a").each((_, el) => {
            const label = $(el).text().trim();
            const url = $(el).attr("href") || "#";
            if (label) {
                areas.push({ label, url });
            }
        });

        return areas;
    } catch (error) {
        console.error("Error scraping legal practice areas:", error);
        return [];
    }
}

/**
 * Scrape "Tax & Business advisory services" from retrieve.am/legal-services/
 */
export async function getTaxAdvisoryServices(lang?: string): Promise<{ label: string; url: string }[]> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const response = await fetch(`${baseUrl}legal-services/`, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const services: { label: string; url: string }[] = [];

        $("#menu-business-areas li a").each((_, el) => {
            const label = $(el).text().trim();
            const url = $(el).attr("href") || "#";
            if (label) {
                services.push({ label, url });
            }
        });

        return services;
    } catch (error) {
        console.error("Error scraping tax advisory services:", error);
        return [];
    }
}

export interface PortfolioItem {
    id?: number;
    title: string;
    slug: string;
    image: string | null;
    imageAlt?: string;
    category?: string;
    categories?: number[];
    tags?: string[];
    translatedTitle?: string;
}



/**
 * Fetch legal updates (Category 2 posts) from the WordPress REST API
 */
export async function getLegalUpdates(
    page = 1,
    perPage = 9,
    lang?: string
): Promise<{ posts: LegalUpdate[]; total: number; totalPages: number }> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("categories", "2");
        url.searchParams.append("categories_exclude", "3");
        url.searchParams.append("per_page", perPage.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", Date.now().toString());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        } else if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { cache: "no-store" });

        if (!response.ok) return { posts: [], total: 0, totalPages: 0 };

        const total = parseInt(response.headers.get("X-WP-Total") || "0");
        const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");
        const data = await response.json();

        const posts: LegalUpdate[] = data.map((p: any) => {
            const wordCount = p.content?.rendered?.replace(/<[^>]+>/g, "").split(/\s+/).length ?? 0;
            const image =
                p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url ||
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                null;

            // Strip HTML from excerpt
            const rawExcerpt = p.excerpt?.rendered?.replace(/<[^>]+>/g, "").replace(/\[&hellip;\]/, "…").trim() ?? "";

            // Extract tags
            const tags = p._embedded?.["wp:term"]?.[1]?.map((tag: any) => ({
                id: tag.id,
                name: tag.name.replace(/&amp;/g, "&"),
                slug: tag.slug,
            })) || [];

            const imageAlt = p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

            return {
                id: p.id,
                slug: p.slug,
                title: p.title?.rendered ?? "",
                excerpt: rawExcerpt,
                content: p.content?.rendered ?? "",
                date: p.date,
                image,
                imageAlt,
                author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
                readTime: Math.max(1, Math.ceil(wordCount / 200)),
                tags,
            };
        });

        return { posts, total, totalPages };
    } catch (error) {
        console.error("Error fetching legal updates:", error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

/**
 * Fetch a single legal update post by slug
 */
export async function getLegalUpdateBySlug(slug: string, lang?: string): Promise<LegalUpdate | null> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("slug", slug);
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", Date.now().toString());
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        } else if (lang) {
            url.searchParams.append("lang", lang);
        }

        console.log("url", url);
        const response = await fetch(url.toString(), { cache: "no-store" });

        if (!response.ok) {
            console.error(`WordPress API error: ${response.status} ${response.statusText}`);
            return null;
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error(`WordPress API returned non-JSON response: ${contentType}. Body: ${text.substring(0, 500)}`);
            return null;
        }

        let data = await response.json();

        // Fallback: If no post is found with the author filter, query again without the author filter
        if (!data.length && lang && LANGUAGE_AUTHOR_MAP[lang]) {
            const fallbackUrl = new URL(`${WP_API_URL}/posts`);
            fallbackUrl.searchParams.append("slug", slug);
            fallbackUrl.searchParams.append("_embed", "1");
            fallbackUrl.searchParams.append("v", Date.now().toString());
            const fallbackResponse = await fetch(fallbackUrl.toString(), { cache: "no-store" });
            if (fallbackResponse.ok) {
                const fallbackContentType = fallbackResponse.headers.get("content-type");
                if (fallbackContentType && fallbackContentType.includes("application/json")) {
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.length) {
                        data = fallbackData;
                    }
                }
            }
        }

        if (!data.length) return null;

        const p = data[0];
        const wordCount = p.content?.rendered?.replace(/<[^>]+>/g, "").split(/\s+/).length ?? 0;
        const image =
            p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url ||
            p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            null;
        const rawExcerpt = p.excerpt?.rendered?.replace(/<[^>]+>/g, "").replace(/\[&hellip;\]/, "…").trim() ?? "";

        // Extract tags
        const tags = p._embedded?.["wp:term"]?.[1]?.map((tag: any) => ({
            id: tag.id,
            name: tag.name.replace(/&amp;/g, "&"),
            slug: tag.slug,
        })) || [];

        const imageAlt = p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

        return {
            id: p.id,
            slug: p.slug,
            title: p.title?.rendered?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8211;/g, "–") ?? "",
            excerpt: rawExcerpt.replace(/&nbsp;/g, " "),
            content: p.content?.rendered ?? "",
            date: p.date,
            modified: p.modified,
            image,
            imageAlt,
            author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
            readTime: Math.max(1, Math.ceil(wordCount / 200)),
            tags,
        };
    } catch (error) {
        console.error("Error fetching legal update by slug:", error);
        return null;
    }
}

/**
 * Fetch a tag by its slug
 */
export async function getTagBySlug(slug: string, lang?: string): Promise<WPTag | null> {
    try {
        const url = new URL(`${WP_API_URL}/tags`);
        url.searchParams.append("slug", slug);
        if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { cache: "no-store" });
        if (!response.ok) return null;

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error(`WordPress API returned non-JSON response for tag: ${contentType}. Body: ${text.substring(0, 500)}`);
            return null;
        }

        const data = await response.json();
        if (!data.length) return null;

        return {
            id: data[0].id,
            name: data[0].name.replace(/&amp;/g, "&"),
            slug: data[0].slug,
        };
    } catch (error) {
        console.error(`Error fetching tag by slug ${slug}:`, error);
        return null;
    }
}

/**
 * Fetch posts filtered by tag
 */
export async function getPostsByTag(
    tagId: number,
    page = 1,
    perPage = 9,
    lang?: string
): Promise<{ posts: LegalUpdate[]; total: number; totalPages: number }> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("tags", tagId.toString());
        url.searchParams.append("per_page", perPage.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", Date.now().toString());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        } else if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { cache: "no-store" });

        if (!response.ok) return { posts: [], total: 0, totalPages: 0 };

        const total = parseInt(response.headers.get("X-WP-Total") || "0");
        const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");
        const data = await response.json();

        const posts: LegalUpdate[] = data.map((p: any) => {
            const wordCount = p.content?.rendered?.replace(/<[^>]+>/g, "").split(/\s+/).length ?? 0;
            const image =
                p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url ||
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                null;

            const rawExcerpt = p.excerpt?.rendered?.replace(/<[^>]+>/g, "").replace(/\[&hellip;\]/, "…").trim() ?? "";

            const tags = p._embedded?.["wp:term"]?.[1]?.map((tag: any) => ({
                id: tag.id,
                name: tag.name.replace(/&amp;/g, "&"),
                slug: tag.slug,
            })) || [];

            const imageAlt = p._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "";

            return {
                id: p.id,
                slug: p.slug,
                title: p.title?.rendered ?? "",
                excerpt: rawExcerpt,
                content: p.content?.rendered ?? "",
                date: p.date,
                image,
                imageAlt,
                author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
                readTime: Math.max(1, Math.ceil(wordCount / 200)),
                tags,
            };
        });

        return { posts, total, totalPages };
    } catch (error) {
        console.error("Error fetching posts by tag:", error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

export interface PracticeAreaContent {
    title: string;
    overview: string;
    howWeCanHelp: string[];
    whyChooseUs: string[];
    faqs: { question: string; answer: string }[];
    image?: string;
    imageAlt?: string;
    isFallback?: boolean;
}

/**
 * Scrape detailed content for a Practice Area single page
 */
export async function getPracticeAreaContent(slug: string, lang?: string): Promise<PracticeAreaContent | null> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const url = `${baseUrl}practice-areas/${slug}/`;

        // Add ?lang=hy for TranslatePress if needed, though they usually use subdirectories
        const fetchUrl = lang === "am" ? `${WP_BASE_URL}/practice-areas/${slug}/?lang=hy` : url;

        let response = await fetch(fetchUrl, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });

        let isFallback = false;

        // Try root slug if practice-areas path fails
        if (!response.ok) {
            const rootUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/${slug}/` : `${WP_BASE_URL}/${slug}/`;
            const rootResponse = await fetch(rootUrl, {
                cache: "no-store",
                headers: { "User-Agent": SCRAPER_USER_AGENT },
            });
            if (rootResponse.ok) {
                response = rootResponse;
            }
        }

        if (!response.ok && lang && lang !== "en") {
            isFallback = true;
            // Try English version
            let engResponse = await fetch(`${WP_BASE_URL}/practice-areas/${slug}/`, {
                cache: "no-store",
                headers: { "User-Agent": SCRAPER_USER_AGENT },
            });

            if (!engResponse.ok) {
                // Try English root
                engResponse = await fetch(`${WP_BASE_URL}/${slug}/`, {
                    cache: "no-store",
                    headers: { "User-Agent": SCRAPER_USER_AGENT },
                });
            }

            if (engResponse.ok) {
                response = engResponse;
            }
        }

        if (!response.ok) return null;

        const html = await response.text();
        const $ = cheerio.load(html);

        const data: PracticeAreaContent = {
            title: $("h1.attorna-page-title").text().trim(),
            overview: $(".gdlr-core-title-item-caption").first().html()?.trim() || "",
            howWeCanHelp: [],
            whyChooseUs: [],
            faqs: [],
            isFallback: isFallback
        };

        // If it's a fallback page (English content on AM route) and it's Armenian, 
        // we check if we can partially translate it via the local amCommon dictionary.
        // This is handled in the Page component now, but we prepare the data.

        // Lists for How we can help / Why choose us
        const lists = $(".gdlr-core-icon-list-item ul");
        if (lists.length >= 1) {
            $(lists[0]).find("li").each((_, el) => {
                data.howWeCanHelp.push($(el).text().trim());
            });
        }
        if (lists.length >= 2) {
            $(lists[1]).find("li").each((_, el) => {
                data.whyChooseUs.push($(el).text().trim());
            });
        }

        // FAQs
        $(".gdlr-core-accordion-item-tab").each((_, el) => {
            const q = $(el).find(".gdlr-core-accordion-item-title").text().trim();
            const a = $(el).find(".gdlr-core-accordion-item-content").text().trim();
            if (q && a) data.faqs.push({ question: q, answer: a });
        });

        // Find header image directly from the page
        const $img = $(".gdlr-core-portfolio-thumbnail img").length
            ? $(".gdlr-core-portfolio-thumbnail img").first()
            : $(".gdlr-core-media-image img").length
                ? $(".gdlr-core-media-image img").first()
                : $(".gdlr-core-image-item img").first();

        const img = $img.attr("src") || $("meta[property=\"og:image\"]").attr("content");

        if (img) {
            data.image = img;
            data.imageAlt = $img.attr("alt") || "";
        }

        return data;
    } catch (error) {
        console.error(`Error scraping practice area content for ${slug}:`, error);
        return null;
    }
}

export interface LegalUpdatePDF {
    title: string;
    image: string;
    pdfLink: string;
}

/**
 * Fetch legal updates (PDFs) by scraping https://retrieve.am/legal-updates/
 */
export async function getLegalUpdatesPDFs(): Promise<LegalUpdatePDF[]> {
    try {
        const response = await fetch(`${WP_BASE_URL}/legal-updates/`, {
            cache: "no-store",
            headers: { "User-Agent": SCRAPER_USER_AGENT },
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const pdfs: LegalUpdatePDF[] = [];

        $(".gdlr-core-column-service-item").each((_, el) => {
            const title = $(el).find(".gdlr-core-column-service-title").text().trim();
            const pdfLink = $(el).find("a[href$='.pdf']").attr("href");
            const image = $(el).find("img").attr("src");

            if (title && pdfLink) {
                // To fix the 403 Forbidden / 404 error, we will ensure that the PDF link
                // ALWAYS points directly to the headless CMS (wp.retrieve.am) instead of the Next.js app (www.retrieve.am).
                let correctLink = pdfLink;
                if (pdfLink.includes("/wp-content/uploads/")) {
                    correctLink = pdfLink.replace(/^https?:\/\/(?:[a-z0-9-]+\.)?retrieve\.am\/wp-content\/uploads\//i, "https://wp.retrieve.am/wp-content/uploads/");
                }

                pdfs.push({
                    title,
                    pdfLink: correctLink,
                    image: image || "",
                });
            }
        });

        return pdfs;
    } catch (error) {
        console.error("Error scraping legal updates PDFs:", error);
        return [];
    }
}


export async function getTags(lang?: string): Promise<WPTag[]> {
    try {
        const url = new URL(`${WP_API_URL}/tags`);
        url.searchParams.append("per_page", "100");
        url.searchParams.append("hide_empty", "true");
        if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { cache: "no-store" });
        if (!response.ok) return [];

        const data = await response.json();
        return data.map((t: any) => ({
            id: t.id,
            name: t.name.replace(/&amp;/g, "&"),
            slug: t.slug,
        }));
    } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
    }
}
/**
 * Resolves a slug to its content type (post or portfolio)
 */
export async function getContentTypeBySlug(slug: string): Promise<"post" | "portfolio" | null> {
    try {
        // 1. Try fetching as a post
        const postRes = await fetch(`${WP_API_URL}/posts?slug=${slug}`, { cache: "no-store" });
        if (postRes.ok) {
            const posts = await postRes.json();
            if (posts.length > 0) return "post";
        }

        // 2. Try fetching as a portfolio item (practice area)
        const portfolioRes = await fetch(`${WP_API_URL}/portfolio?slug=${slug}`, { cache: "no-store" });
        if (portfolioRes.ok) {
            const items = await portfolioRes.json();
            if (items.length > 0) return "portfolio";
        }

        return null;
    } catch (error) {
        console.error("Error resolving content type:", error);
        return null;
    }
}

/**
 * Fetch a generic WordPress page by its slug
 */
export async function getWPPageBySlug(slug: string, lang?: string): Promise<WPPage | null> {
    try {
        const url = new URL(`${WP_API_URL}/pages`);
        url.searchParams.append("slug", slug);
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        }

        const response = await fetch(url.toString(), { cache: "no-store" });
        if (!response.ok) return null;

        let data = await response.json();

        // Fallback 1: Try without author filter
        if (!data.length && lang && LANGUAGE_AUTHOR_MAP[lang]) {
            const fallbackUrl = new URL(`${WP_API_URL}/pages`);
            fallbackUrl.searchParams.append("slug", slug);
            const fallbackRes = await fetch(fallbackUrl.toString(), { cache: "no-store" });
            if (fallbackRes.ok) data = await fallbackRes.json();
        }

        if (!data.length) return null;

        const p = data[0];
        return {
            id: p.id,
            slug: p.slug,
            title: p.title?.rendered?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&") ?? "",
            content: p.content?.rendered ?? "",
        };
    } catch (error) {
        console.error(`Error fetching page by slug ${slug}:`, error);
        return null;
    }
}
