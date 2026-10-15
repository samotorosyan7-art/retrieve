import { WPPost, WPTeamMember, MenuItem, WPTag, LegalUpdate, WPPage } from "@/types/wordpress";
import { buildAlternates } from "./seo";
import personnelData from "../data/personnel.json";
import practiceAreaData from "../data/practice-areas.json";
import tagsData from "../data/tags.json";
import pagesData from "../data/pages.json";
import seoData from "../data/seo.json";

import enCommon from '../locales/en/common.json';
import ruCommon from '../locales/ru/common.json';
import amCommon from '../locales/am/common.json';

const dictionaries: Record<string, any> = {
    en: enCommon,
    ru: ruCommon,
    am: amCommon,
};

const WP_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";

/**
 * Next.js throws an internal error (digest "DYNAMIC_SERVER_USAGE") out of a
 * no-store fetch when it's attempting to statically render a route (e.g. the
 * sitemap's generateSitemaps output) and needs to bail to dynamic rendering.
 * That error must propagate to Next's render boundary — catching it here and
 * returning an empty result instead hides the bailout signal, so Next never
 * switches the route to dynamic and it can ship with empty WP data baked in.
 */
function isDynamicServerUsageError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { digest?: unknown }).digest === "DYNAMIC_SERVER_USAGE";
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// wp.retrieve.am's firewall intermittently 403s (or times out) requests even
// with a browser UA. These are the statuses worth a short retry for — a 404
// means the resource genuinely isn't there, so retrying it is pointless.
const RETRYABLE_STATUSES = new Set([403, 429, 500, 502, 503, 504]);

// Every one of these functions used to fetch with cache: "no-store", meaning
// EVERY visitor page-load re-scraped wp.retrieve.am live with no caching
// anywhere — on a page like the homepage that fans out into ~5+ WP requests
// (testimonials, logos, why-choose-us, latest posts, ~16 team member profile
// pages), real traffic produces bursty, uncached request volume that looks
// like bot activity to SiteGround's Anti-Bot AI and trips its 403 protection,
// even from the production IP. A short revalidate window lets concurrent
// requests share one cached fetch instead of each hitting WP directly.
const WP_REVALIDATE_SECONDS = 120;

/**
 * A cache-busting value for the "v" query param used to defeat wp.retrieve.am's
 * hosting-level proxy cache (see getPublishedPersonnelSlugs). Bucketed to the
 * same window as WP_REVALIDATE_SECONDS, rather than a raw Date.now(), so the
 * URL — and therefore Next's own fetch cache key — stays stable within a
 * window instead of being unique on every call, which would silently defeat
 * the `next: { revalidate }` option below (a fresh URL every millisecond
 * means every request is a "cache miss" and hits the origin regardless of
 * revalidate). It still forces a fresh origin fetch once per window.
 */
function cacheBuster(): string {
    return Math.floor(Date.now() / (WP_REVALIDATE_SECONDS * 1000)).toString();
}

/**
 * fetch() wrapper for the WP REST API (/wp-json/wp/v2/*) that always sends a
 * browser User-Agent and retries a couple of times on a transient failure,
 * so a one-off block from WP's firewall doesn't surface as an empty result
 * (e.g. the blog page flashing "No articles found") — it gets absorbed here
 * instead of requiring the visitor to reload the page.
 */
async function wpFetch(url: string, options: RequestInit = {}, attempts = 3): Promise<Response> {
    const headers = { "User-Agent": WP_USER_AGENT, ...(options.headers || {}) };
    let lastResponse: Response | undefined;

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            const response = await fetch(url, { ...options, headers });
            if (response.ok || !RETRYABLE_STATUSES.has(response.status)) {
                return response;
            }
            lastResponse = response;
        } catch (error) {
            if (isDynamicServerUsageError(error) || attempt === attempts) throw error;
        }
        if (attempt < attempts) await sleep(250 * attempt);
    }

    return lastResponse!;
}

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

/**
 * wp.retrieve.am runs the WPGlobus plugin, which stores each translation on
 * the SAME post (one post id, one slug across languages) and serves the
 * translated title/content/excerpt by prefixing the REST base with a language
 * segment before /wp-json — e.g. https://wp.retrieve.am/ru/wp-json/wp/v2/...
 * or .../hy/wp-json/wp/v2/... (WPGlobus's code for Armenian is "hy", not our
 * app's "am"). No prefix serves the primary language (English). A language
 * whose title/content hasn't been filled in yet gracefully falls back to the
 * English text rather than erroring or returning blank.
 */
const WPGLOBUS_LANG_SEGMENT: Partial<Record<string, string>> = {
    ru: "ru",
    am: "hy",
};

function wpGlobusApiUrl(lang?: string): string {
    const segment = lang ? WPGLOBUS_LANG_SEGMENT[lang] : undefined;
    return segment ? `${WP_BASE_URL}/${segment}/wp-json/wp/v2` : WP_API_URL;
}

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

/** Decode the HTML entities Yoast's REST API leaves in its strings (e.g. "&amp;"). */
function decodeEntities(text: string): string {
    const named: Record<string, string> = { amp: "&", quot: "\"", apos: "'", lt: "<", gt: ">", nbsp: " " };
    return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
        if (code[0] !== "#") return named[code.toLowerCase()] ?? entity;
        const point = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isNaN(point) ? entity : String.fromCodePoint(point);
    });
}

/** decodeURIComponent that leaves malformed input as-is instead of throwing. */
function safeDecodeURIComponent(text: string): string {
    try {
        return decodeURIComponent(text);
    } catch {
        return text;
    }
}

type SeoHead = { title?: string; description?: string; ogImage?: string };

/**
 * Yoast SEO data for a blog post / legal update, from the post's own
 * yoast_head_json in the WordPress posts API. Returns null if there's no such post.
 */
async function getPostSeoHead(slug: string, signal: AbortSignal): Promise<SeoHead | null> {
    const response = await wpFetch(
        `${WP_API_URL}/posts?slug=${encodeURIComponent(slug)}&_fields=yoast_head_json`,
        { signal, next: { revalidate: WP_REVALIDATE_SECONDS } },
        1
    );
    if (!response.ok) return null;
    const yoast = (await response.json())?.[0]?.yoast_head_json;
    if (!yoast) return null;
    return {
        title: decodeEntities(yoast.title || yoast.og_title || yoast.twitter_title || ""),
        description: decodeEntities(yoast.description || yoast.og_description || ""),
        ogImage: yoast.og_image?.[0]?.url,
    };
}

/**
 * Build Next.js Metadata for a route. Title/description come from local
 * common.json first, then from Yoast SEO data: kept locally in
 * src/data/seo.json for site pages (practice areas, personnel, tags, ...) and
 * read from the WordPress posts API for blog posts / legal updates.
 * Falls back to {} gracefully if WP is slow or unavailable.
 */
export async function getYoastMetadata(path: string, lang: string = "en", overridePath?: string): Promise<import("next").Metadata> {
    // Canonical/hreflang come from the route, so they stay correct even if the WordPress fetch fails.
    const alternates = buildAlternates(lang, overridePath || path);

    try {
        // Route params arrive percent-encoded (e.g. Cyrillic/Armenian blog slugs).
        const decodedPath = safeDecodeURIComponent(path);
        const cleanPath = decodedPath.startsWith("/") ? decodedPath : `/${decodedPath}`;
        const segments = cleanPath.split("/").filter(Boolean);

        let head: SeoHead | null = (seoData as Record<string, Record<string, SeoHead>>)[lang]?.[cleanPath] ?? null;

        // Blog posts and legal updates are routed as "/<slug>" and aren't in the
        // local SEO file — new ones are published in WordPress at any time.
        if (!head && segments.length === 1) {
            // 5-second timeout to avoid hanging Vercel serverless functions
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            try {
                head = await getPostSeoHead(segments[0], controller.signal);
            } catch (err) {
                if (isDynamicServerUsageError(err)) throw err;
                console.error(`Fetch error in getYoastMetadata for ${cleanPath}:`, err);
            } finally {
                clearTimeout(timeout);
            }
        }

        // Resolve translated title and description from common.json
        const dict = dictionaries[lang] || enCommon;
        const metaKey = getMetaKey(path);

        const title: string = dict.meta_titles?.[metaKey] || head?.title || "";
        const description: string = dict.meta_descriptions?.[metaKey] || head?.description || "";

        if (!head && !title) return { alternates };

        const ogImage = head?.ogImage;
        const finalOgImage = ogImage ? fixHttps(ogImage) : "https://www.retrieve.am/logo.jpg";

        const finalCanonical = alternates?.canonical as string;

        return {
            title: title ? { absolute: title } : undefined,
            description: description || undefined,
            alternates,
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
        if (isDynamicServerUsageError(e)) throw e;
        console.error(`Error fetching Yoast metadata for ${path}:`, e);
        return { alternates };
    }
}


export async function getLatestPosts(limit = 3, lang?: string): Promise<WPPost[]> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("categories_exclude", "3");
        url.searchParams.append("per_page", limit.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", cacheBuster());

        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        }

        const response = await wpFetch(url.toString(), {
            next: { revalidate: WP_REVALIDATE_SECONDS },
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
        if (isDynamicServerUsageError(error)) throw error;
        console.error("Error fetching posts:", error);
        return [];
    }
}

/**
 * Last-known-good result per (lang, page, limit), used as a fallback when a
 * live WP fetch fails so a transient error doesn't blank the blog page.
 * In-memory only: helps on warm server instances, reset on cold start.
 */
const blogPostsFallbackCache = new Map<string, { posts: LegalUpdate[]; total: number; totalPages: number }>();

/**
 * Fetch blog posts from retrieve.am, excluding legal-updates (category 2)
 */
export async function getBlogPosts(
    limit = 9,
    page = 1,
    lang?: string
): Promise<{ posts: LegalUpdate[]; total: number; totalPages: number }> {
    const cacheKey = `${lang ?? "all"}:${page}:${limit}`;
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("categories_exclude", "3");
        url.searchParams.append("per_page", limit.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("v", cacheBuster());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        } else if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await wpFetch(url.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });

        if (!response.ok) {
            console.error(`Failed to fetch blog posts: ${response.status} ${response.statusText}`);
            return blogPostsFallbackCache.get(cacheKey) ?? { posts: [], total: 0, totalPages: 0 };
        }

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
                p.yoast_head_json?.og_image?.[0]?.url ||
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

        const result = { posts, total, totalPages };
        blogPostsFallbackCache.set(cacheKey, result);
        return result;
    } catch (error) {
        if (isDynamicServerUsageError(error)) throw error;
        console.error("Error fetching blog posts:", error);
        return blogPostsFallbackCache.get(cacheKey) ?? { posts: [], total: 0, totalPages: 0 };
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
        url.searchParams.append("v", cacheBuster());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");

        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        }

        let data = [];
        const response = await wpFetch(url.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });

        if (response.ok) {
            data = await response.json();

            // Fallback: If no posts found with author filter, try without it
            if (data.length === 0 && lang && LANGUAGE_AUTHOR_MAP[lang]) {
                const fallbackUrl = new URL(`${WP_API_URL}/posts`);
                fallbackUrl.searchParams.append("categories", "3");
                fallbackUrl.searchParams.append("per_page", limit.toString());
                fallbackUrl.searchParams.append("_embed", "1");
                fallbackUrl.searchParams.append("v", cacheBuster());
                const fallbackRes = await wpFetch(fallbackUrl.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });
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
                p.yoast_head_json?.og_image?.[0]?.url ||
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
        if (isDynamicServerUsageError(error)) throw error;
        console.error("Error fetching masonry posts:", error);
        return { posts: [] };
    }
}

type Lang = "en" | "ru" | "am";

/** Pick the entry for `lang` from a per-language record, falling back to English. */
function forLang<T>(byLang: Record<Lang, T>, lang?: string): T {
    return byLang[(lang as Lang)] ?? byLang.en;
}

/**
 * Team members and personnel profiles are maintained locally in
 * src/data/personnel.json (WordPress doesn't expose the personnel post type
 * through its REST API). The team list there is already in display order.
 */
export async function getTeamMembers(lang?: string): Promise<WPTeamMember[]> {
    return forLang(personnelData.team as Record<Lang, WPTeamMember[]>, lang);
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
 * Get all portfolio items (practice areas), maintained locally in
 * src/data/practice-areas.json (WordPress doesn't expose the portfolio post
 * type through its REST API).
 */
export async function getPortfolioItems(lang?: string): Promise<PortfolioItem[]> {
    return forLang(practiceAreaData.listing as Record<Lang, PortfolioItem[]>, lang);
}

/**
 * Get detailed information for a single personnel member
 * @param slug - Personnel slug (e.g., "feliks-hovakimyan")
 */
export async function getPersonnelDetails(slug: string, lang?: string): Promise<import("@/types/wordpress").PersonnelDetails | null> {
    const profiles = personnelData.profiles as Record<Lang, Record<string, import("@/types/wordpress").PersonnelDetails>>;
    return forLang(profiles, lang)[slug] ?? profiles.en[slug] ?? null;
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
        url.searchParams.append("v", cacheBuster());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        } else if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await wpFetch(url.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });

        if (!response.ok) return { posts: [], total: 0, totalPages: 0 };

        const total = parseInt(response.headers.get("X-WP-Total") || "0");
        const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");
        const data = await response.json();

        const posts: LegalUpdate[] = data.map((p: any) => {
            const wordCount = p.content?.rendered?.replace(/<[^>]+>/g, "").split(/\s+/).length ?? 0;
            const image =
                p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url ||
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                p.yoast_head_json?.og_image?.[0]?.url ||
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
        if (isDynamicServerUsageError(error)) throw error;
        console.error("Error fetching legal updates:", error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

/**
 * Fetch a single legal update post by slug.
 *
 * Priority: 1) fetch the English (WPGlobus primary-language) post as the
 * baseline, 2) for a non-English lang, prefer WPGlobus's translation of that
 * SAME post/slug (which itself falls back to English text if untranslated),
 * 3) if WPGlobus has no such post at all, fall back to the legacy
 * per-language author account, 4) if nothing matched anywhere, return null so
 * the caller can redirect to /blog.
 */
export async function getLegalUpdateBySlug(slug: string, lang?: string): Promise<LegalUpdate | null> {
    try {
        const englishUrl = new URL(`${WP_API_URL}/posts`);
        englishUrl.searchParams.append("slug", slug);
        englishUrl.searchParams.append("_embed", "1");
        englishUrl.searchParams.append("v", cacheBuster());

        const englishResponse = await wpFetch(englishUrl.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });
        if (!englishResponse.ok) {
            console.error(`WordPress API error: ${englishResponse.status} ${englishResponse.statusText}`);
            return null;
        }

        const englishContentType = englishResponse.headers.get("content-type");
        if (!englishContentType || !englishContentType.includes("application/json")) {
            const text = await englishResponse.text();
            console.error(`WordPress API returned non-JSON response: ${englishContentType}. Body: ${text.substring(0, 500)}`);
            return null;
        }

        let data = await englishResponse.json();

        // Non-English: prefer WPGlobus's translation of this same post/slug.
        if (lang && WPGLOBUS_LANG_SEGMENT[lang]) {
            const translationUrl = new URL(`${wpGlobusApiUrl(lang)}/posts`);
            translationUrl.searchParams.append("slug", slug);
            translationUrl.searchParams.append("_embed", "1");
            translationUrl.searchParams.append("v", cacheBuster());

            const translationResponse = await wpFetch(translationUrl.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });
            if (translationResponse.ok) {
                const translationContentType = translationResponse.headers.get("content-type");
                if (translationContentType && translationContentType.includes("application/json")) {
                    const translationData = await translationResponse.json();
                    if (translationData.length) {
                        data = translationData;
                    }
                }
            }
        }

        // Not a WPGlobus post: fall back to the legacy per-language author account.
        if (!data.length && lang && LANGUAGE_AUTHOR_MAP[lang]) {
            const authorUrl = new URL(`${WP_API_URL}/posts`);
            authorUrl.searchParams.append("slug", slug);
            authorUrl.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
            authorUrl.searchParams.append("_embed", "1");
            authorUrl.searchParams.append("v", cacheBuster());

            const authorResponse = await wpFetch(authorUrl.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });
            if (authorResponse.ok) {
                const authorContentType = authorResponse.headers.get("content-type");
                if (authorContentType && authorContentType.includes("application/json")) {
                    const authorData = await authorResponse.json();
                    if (authorData.length) {
                        data = authorData;
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
            p.yoast_head_json?.og_image?.[0]?.url ||
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
        if (isDynamicServerUsageError(error)) throw error;
        console.error("Error fetching legal update by slug:", error);
        return null;
    }
}

/**
 * Languages a blog post can be opened in under the same slug.
 *
 * A WPGlobus post serves every language from one slug, but an untranslated
 * language just echoes the English title, so a language only counts when its
 * title differs from English. English counts when the post has any
 * translation, or when it isn't a legacy post written by the ru/am author
 * accounts (those exist in one language only, under their own slug).
 */
export async function getBlogPostLanguages(slug: string): Promise<string[]> {
    const fetchPost = async (lang?: string): Promise<{ title?: { rendered?: string }; author?: number } | null> => {
        try {
            const url = new URL(`${wpGlobusApiUrl(lang)}/posts`);
            url.searchParams.append("slug", slug);
            url.searchParams.append("_fields", "title,author");
            url.searchParams.append("v", cacheBuster());
            const response = await wpFetch(url.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });
            if (!response.ok) return null;
            const data = await response.json();
            return Array.isArray(data) && data.length ? data[0] : null;
        } catch (error) {
            if (isDynamicServerUsageError(error)) throw error;
            return null;
        }
    };

    const translatedLangs = Object.keys(WPGLOBUS_LANG_SEGMENT);
    const [english, ...translations] = await Promise.all([undefined, ...translatedLangs].map(fetchPost));
    if (!english) return [];

    const englishTitle = english.title?.rendered ?? "";
    const langs = translatedLangs.filter((lang, i) => {
        const title = translations[i]?.title?.rendered;
        return !!title && title !== englishTitle;
    });

    const isLegacyNonEnglish = Object.entries(LANGUAGE_AUTHOR_MAP)
        .some(([lang, author]) => lang !== "en" && author === english.author);
    if (langs.length || !isLegacyNonEnglish) langs.unshift("en");

    // A legacy ru/am post is still available in its own language.
    for (const [lang, author] of Object.entries(LANGUAGE_AUTHOR_MAP)) {
        if (author === english.author && !langs.includes(lang)) langs.push(lang);
    }

    return langs;
}

/**
 * Blog tags are maintained locally in src/data/tags.json (the same in every
 * language in WordPress). Their ids match WordPress, so getPostsByTag works.
 */
function localTags(): WPTag[] {
    return tagsData.map(({ id, name, slug }) => ({ id, name, slug }));
}

/**
 * Get a tag by its slug
 */
export async function getTagBySlug(slug: string, _lang?: string): Promise<WPTag | null> {
    return localTags().find((tag) => tag.slug === slug) ?? null;
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
        url.searchParams.append("v", cacheBuster());
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang && LANGUAGE_AUTHOR_MAP[lang]) {
            url.searchParams.append("author", LANGUAGE_AUTHOR_MAP[lang].toString());
        } else if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await wpFetch(url.toString(), { next: { revalidate: WP_REVALIDATE_SECONDS } });

        if (!response.ok) return { posts: [], total: 0, totalPages: 0 };

        const total = parseInt(response.headers.get("X-WP-Total") || "0");
        const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "0");
        const data = await response.json();

        const posts: LegalUpdate[] = data.map((p: any) => {
            const wordCount = p.content?.rendered?.replace(/<[^>]+>/g, "").split(/\s+/).length ?? 0;
            const image =
                p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium_large?.source_url ||
                p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                p.yoast_head_json?.og_image?.[0]?.url ||
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
        if (isDynamicServerUsageError(error)) throw error;
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
 * Detailed content for a Practice Area single page, maintained locally in
 * src/data/practice-areas.json. Falls back to English (flagged isFallback).
 */
export async function getPracticeAreaContent(slug: string, lang?: string): Promise<PracticeAreaContent | null> {
    const content = practiceAreaData.content as Record<Lang, Record<string, PracticeAreaContent>>;
    const localized = forLang(content, lang)[slug];
    if (localized) return localized;
    const english = content.en[slug];
    return english ? { ...english, isFallback: true } : null;
}

export async function getTags(_lang?: string): Promise<WPTag[]> {
    // Only tags that have posts, like WordPress's hide_empty.
    const used = new Set(tagsData.filter((tag) => tag.count > 0).map((tag) => tag.slug));
    return localTags().filter((tag) => used.has(tag.slug));
}

/**
 * Resolves a slug to its content type (post or portfolio)
 */
export async function getContentTypeBySlug(slug: string): Promise<"post" | "portfolio" | null> {
    try {
        // 1. Try fetching as a post
        const postRes = await wpFetch(`${WP_API_URL}/posts?slug=${slug}`, { next: { revalidate: WP_REVALIDATE_SECONDS } });
        if (postRes.ok) {
            const posts = await postRes.json();
            if (posts.length > 0) return "post";
        }

        // 2. Check the local practice-area listing
        if ((await getPortfolioItems()).some((item) => item.slug === slug)) return "portfolio";

        return null;
    } catch (error) {
        if (isDynamicServerUsageError(error)) throw error;
        console.error("Error resolving content type:", error);
        return null;
    }
}

/**
 * Get a static page (privacy policy, terms of service) by its slug, maintained
 * locally in src/data/pages.json.
 */
export async function getWPPageBySlug(slug: string, _lang?: string): Promise<WPPage | null> {
    return (pagesData as Record<string, WPPage>)[slug] ?? null;
}
