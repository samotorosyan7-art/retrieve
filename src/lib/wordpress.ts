import { WPPost, WPTeamMember, PortfolioItem, MenuItem } from "@/types/wordpress";
import * as cheerio from "cheerio";

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://wp.retrieve.am/wp-json/wp/v2";
const WP_BASE_URL = WP_API_URL.replace(/\/wp-json\/wp\/v2\/?$/, "");

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
 * Scrape the WordPress page <head> for Yoast SEO data and convert it to Next.js Metadata.
 * Falls back to {} gracefully if WP is slow or unavailable.
 */
export async function getYoastMetadata(path: string, lang: string = "en"): Promise<import("next").Metadata> {
    try {
        const baseUrl = lang === "en" ? WP_BASE_URL : `${WP_BASE_URL}/${lang}`;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const url = `${baseUrl}${cleanPath === "/" ? "" : cleanPath}/`;

        // 5-second timeout to avoid hanging Vercel serverless functions
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        let html: string;
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                next: { revalidate: 3600 },
                headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
            });
            clearTimeout(timeout);
            if (!response.ok) return {};
            html = await response.text();
        } catch {
            clearTimeout(timeout);
            return {};
        }

        const $ = cheerio.load(html);

        const title = $("title").text() || $("meta[property='og:title']").attr("content");
        const description = $("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content");
        const ogImage = $("meta[property='og:image']").attr("content");
        const canonical = $("link[rel='canonical']").attr("href");

        const fixedCanonical = canonical
            ? canonical.replace(/(www\.)?wp\.retrieve\.am/, "retrieve.am")
            : `https://www.retrieve.am${cleanPath}`;

        return {
            title: title ? { absolute: title } : undefined,
            description: description || undefined,
            alternates: { canonical: fixedCanonical },
            openGraph: {
                siteName: "Retrieve Legal & Tax",
                type: "website",
                title: title || undefined,
                description: description || undefined,
                images: ogImage ? [fixHttps(ogImage)] : undefined,
                url: fixedCanonical,
            },
            twitter: {
                card: "summary_large_image",
                title: title || undefined,
                description: description || undefined,
                images: ogImage ? [fixHttps(ogImage)] : undefined,
            },
        };
    } catch (e) {
        console.error(`Error scraping Yoast metadata for ${path}:`, e);
        return {};
    }
}


export async function getLatestPosts(limit = 3): Promise<WPPost[]> {
    try {
        const response = await fetch(`${WP_API_URL}/posts?per_page=${limit}&_embed`, {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            console.error("Failed to fetch posts:", response.statusText);
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
        url.searchParams.append("categories_exclude", "2");
        url.searchParams.append("per_page", limit.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { next: { revalidate: 1800 } });

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

            return {
                id: p.id,
                slug: p.slug,
                title: p.title?.rendered ?? "",
                excerpt: rawExcerpt,
                content: p.content?.rendered ?? "",
                date: p.date,
                image,
                author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
                readTime: Math.max(1, Math.ceil(wordCount / 200)),
                link: p.link ?? "",
            };
        });

        return { posts, total, totalPages };
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return { posts: [], total: 0, totalPages: 0 };
    }
}

export async function getTeamMembers(lang?: string): Promise<WPTeamMember[]> {
    try {
        const baseUrl = lang === "ru" ? `${WP_BASE_URL}/ru/` : `${WP_BASE_URL}/`;
        // Fallback to our-team page scraping since API is hidden
        const response = await fetch(`${baseUrl}our-team/`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch team page");
            return [];
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const teamMembers: WPTeamMember[] = [];

        // Select team member elements - based on typical Goodlayers/Attorna theme structure
        // Looking for .gdlr-core-personnel-item or similar
        $(".gdlr-core-personnel-list-column").each((i, el) => {
            const name = $(el).find(".gdlr-core-personnel-list-title a").text().trim();
            const position = $(el).find(".gdlr-core-personnel-list-position").text().trim();
            const rawImage = $(el).find(".gdlr-core-personnel-list-image img").attr("src");
            const image = rawImage ? fixHttps(rawImage) : "";
            const link = $(el).find(".gdlr-core-personnel-list-title a").attr("href") || "";
            const httpsLink = fixHttps(link);

            if (name) {
                teamMembers.push({
                    id: `team-${i}`,
                    name,
                    position,
                    image,
                    link: httpsLink,
                });
            }
        });

        return teamMembers;
    } catch (error) {
        console.error("Error scraping team members:", error);
        return [];
    }
}

/**
 * Get portfolio categories and sub-categories by scraping the main menu
 */
export async function getPortfolioCategories(): Promise<MenuItem[]> {
    try {
        const response = await fetch(`${WP_BASE_URL}/`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)",
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
 * Get all portfolio items (practice areas) - Scraped from Live WP HTML
 */
export async function getPortfolioItems(lang?: string): Promise<PortfolioItem[]> {
    try {
        const fetchItemsFromUrl = async (scrapeUrl: string, category: string): Promise<PortfolioItem[]> => {
            const res = await fetch(scrapeUrl, {
                next: { revalidate: 3600 },
                headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" }
            });
            if (!res.ok) return [];
            const html = await res.text();
            const $ = cheerio.load(html);
            const items: PortfolioItem[] = [];

            $(".gdlr-core-portfolio-item, .gdlr-core-column-service-item, .gdlr-core-item-list").each((i, el) => {
                const title = $(el).find("h3, .gdlr-core-portfolio-title, .gdlr-core-column-service-title").text().trim();
                const image = $(el).find("img").attr("src") || null;
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
export async function getPersonnelDetails(slug: string): Promise<import("@/types/wordpress").PersonnelDetails | null> {
    try {
        const response = await fetch(`${WP_BASE_URL}/personnel/${slug}/`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)",
            },
        });

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
        let image = $(".gdlr-core-column-20 img").first().attr("src") ||
            $("img[src*='wp-content/uploads']").first().attr("src") || "";
        
        if (image.startsWith("http://")) {
            image = image.replace("http://", "https://");
        }

        // Extract biography from main content column
        let biography = "";
        const bioContainer = $(".gdlr-core-column-40 .gdlr-core-text-box-item-content").first();
        if (bioContainer.length) {
            biography = bioContainer.html() || "";
        }

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

        // Extract contact info from icon list
        let email = "";
        let phone = "";

        $(".gdlr-core-icon-list-content").each((_, el) => {
            const text = $(el).text().trim();
            if (text.includes('@')) {
                email = text;
            } else if (text.includes('+') || text.match(/\d{2,}/)) {
                phone = text;
            }
        });

        // Also check mailto and tel links
        if (!email) {
            email = $("a[href^='mailto:']").attr("href")?.replace("mailto:", "") || "";
        }
        if (!phone) {
            phone = $("a[href^='tel:']").attr("href")?.replace("tel:", "").replace(/\s/g, "") || "";
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
        const baseUrl = lang === "ru" ? `${WP_BASE_URL}/ru/` : `${WP_BASE_URL}/`;
        const response = await fetch(baseUrl, {
            next: { revalidate: 3600 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
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
        const baseUrl = lang === "ru" ? `${WP_BASE_URL}/ru/` : `${WP_BASE_URL}/`;
        const response = await fetch(baseUrl, {
            next: { revalidate: 3600 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
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
        const baseUrl = lang === "ru" ? `${WP_BASE_URL}/ru/` : `${WP_BASE_URL}/`;
        const response = await fetch(baseUrl, {
            next: { revalidate: 3600 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
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
        const baseUrl = lang === "ru" ? `${WP_BASE_URL}/ru/` : `${WP_BASE_URL}/`;
        const response = await fetch(`${baseUrl}legal-services/`, {
            next: { revalidate: 3600 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
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
        const baseUrl = lang === "ru" ? `${WP_BASE_URL}/ru/` : `${WP_BASE_URL}/`;
        const response = await fetch(`${baseUrl}legal-services/`, {
            next: { revalidate: 3600 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
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

export interface LegalUpdate {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    image: string | null;
    author: string;
    readTime: number;
    link?: string;
}

/**
 * Fetch legal updates (blog posts) from the WordPress REST API
 */
export async function getLegalUpdates(
    page = 1,
    perPage = 9,
    lang?: string
): Promise<{ posts: LegalUpdate[]; total: number; totalPages: number }> {
    try {
        const url = new URL(`${WP_API_URL}/posts`);
        url.searchParams.append("categories", "2");
        url.searchParams.append("per_page", perPage.toString());
        url.searchParams.append("page", page.toString());
        url.searchParams.append("_embed", "1");
        url.searchParams.append("orderby", "date");
        url.searchParams.append("order", "desc");
        if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { next: { revalidate: 1800 } });

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

            return {
                id: p.id,
                slug: p.slug,
                title: p.title?.rendered ?? "",
                excerpt: rawExcerpt,
                content: p.content?.rendered ?? "",
                date: p.date,
                image,
                author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
                readTime: Math.max(1, Math.ceil(wordCount / 200)),
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
        if (lang) {
            url.searchParams.append("lang", lang);
        }

        const response = await fetch(url.toString(), { next: { revalidate: 1800 } });

        if (!response.ok) return null;

        const data = await response.json();
        if (!data.length) return null;

        const p = data[0];
        const wordCount = p.content?.rendered?.replace(/<[^>]+>/g, "").split(/\s+/).length ?? 0;
        const image =
            p._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url ||
            p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            null;
        const rawExcerpt = p.excerpt?.rendered?.replace(/<[^>]+>/g, "").replace(/\[&hellip;\]/, "…").trim() ?? "";

        return {
            id: p.id,
            slug: p.slug,
            title: p.title?.rendered ?? "",
            excerpt: rawExcerpt,
            content: p.content?.rendered ?? "",
            date: p.date,
            image,
            author: p._embedded?.author?.[0]?.name ?? "RETRIEVE",
            readTime: Math.max(1, Math.ceil(wordCount / 200)),
        };
    } catch (error) {
        console.error("Error fetching legal update by slug:", error);
        return null;
    }
}

export interface PracticeAreaContent {
    title: string;
    overview: string;
    howWeCanHelp: string[];
    whyChooseUs: string[];
    faqs: { question: string; answer: string }[];
    image?: string;
}

/**
 * Scrape detailed content for a Practice Area single page
 */
export async function getPracticeAreaContent(slug: string, lang?: string): Promise<PracticeAreaContent | null> {
    try {
        const baseUrl = lang && lang !== "en" ? `${WP_BASE_URL}/${lang}/` : `${WP_BASE_URL}/`;
        const url = `${baseUrl}practice-areas/${slug}/`;
        
        const response = await fetch(url, {
            next: { revalidate: 3600 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
        });

        if (!response.ok) return null;

        const html = await response.text();
        const $ = cheerio.load(html);

        const data: PracticeAreaContent = {
            title: $("h1.attorna-page-title").text().trim(),
            overview: $(".gdlr-core-title-item-caption").first().text().trim(),
            howWeCanHelp: [],
            whyChooseUs: [],
            faqs: []
        };

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
        const img = $(".gdlr-core-portfolio-thumbnail img").attr("src") 
                 || $(".gdlr-core-media-image img").attr("src") 
                 || $(".gdlr-core-image-item img").attr("src") 
                 || $("meta[property=\"og:image\"]").attr("content");
        
        if (img) {
            data.image = img;
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
            next: { revalidate: 3600 },
            headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" },
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
                // Replace wordpress URL with proxy URL to avoid 403 forbidden hotlinking
                let proxyLink = pdfLink;
                if (pdfLink.includes("wp.retrieve.am/wp-content/uploads/")) {
                    proxyLink = pdfLink.replace("https://wp.retrieve.am/wp-content/uploads/", "/api/pdf/");
                } else if (pdfLink.includes("retrieve.am/wp-content/uploads/")) {
                    proxyLink = pdfLink.replace("https://retrieve.am/wp-content/uploads/", "/api/pdf/");
                }

                pdfs.push({
                    title,
                    pdfLink: proxyLink,
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

