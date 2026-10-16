import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getBlogPostLanguages, getLegalUpdateBySlug, getLegalUpdates, getTags, getYoastMetadata } from "@/lib/wordpress";
import { formatDate } from "@/lib/dateUtils";
import { buildAlternates } from "@/lib/seo";
import { Calendar, Clock, ArrowLeft, ArrowRight, FileText, Layout } from "lucide-react";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";
import personnelData from "@/data/personnel.json";

const dictionaries = { en, am, ru };

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

const BYLINE_TITLE_RE = /\b(attorney|lawyer|associate|partner|counsel|advocate|managing director)\b|адвокат|юрист|партн|փաստաբան|իրավաբան|գործընկեր/i;

const ORGANIZATION_ID = "https://www.retrieve.am/en/#organization";

const stripTags = (html: string) =>
    html.replace(/<[^>]+>|&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const normalizeName = (name: string) =>
    name.replace(/,?\s*Esq\.?$/i, "").trim().toLowerCase();

// Personnel slug by every localized spelling of the person's name.
const personnelSlugByName = new Map<string, string>();
for (const profiles of Object.values(personnelData.profiles as Record<string, Record<string, { name: string }>>)) {
    for (const [slug, profile] of Object.entries(profiles)) {
        personnelSlugByName.set(normalizeName(profile.name), slug);
    }
}

// Authored posts open with a short "Name, Job title" block (a table with one
// cell per author, or paragraphs) before the first heading or body paragraph.
function getBylineAuthors(html: string): { name: string; jobTitle: string }[] {
    const blockRe = /<(p|figure|h[1-6]|div|ul|ol)\b[^>]*>[\s\S]*?<\/\1>/g;
    const lead: string[] = [];
    for (const match of html.matchAll(blockRe)) {
        if (match[1] !== "p" && match[1] !== "figure") break;
        const text = stripTags(match[0]);
        if (!text) continue;
        if (text.length > 150) break;
        lead.push(match[0]);
    }
    const leadHtml = lead.join("\n");
    if (!BYLINE_TITLE_RE.test(stripTags(leadHtml))) return [];

    const cells = leadHtml.includes("<td")
        ? [...leadHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1])
        : [leadHtml];

    const authors: { name: string; jobTitle: string }[] = [];
    for (const cell of cells) {
        let name: string;
        let jobTitle: string;
        const title = cell.match(/<em\b[^>]*>([\s\S]*?)<\/em>/);
        if (title) {
            // "<strong>Name,</strong> <em>Job title</em>"
            jobTitle = stripTags(title[1]);
            name = stripTags(cell.slice(0, title.index));
        } else {
            // "Name<br>Job title"
            const lines = cell.split(/<br\s*\/?>|<\/p>/).map(stripTags).filter(Boolean);
            name = lines[0] || "";
            jobTitle = lines.slice(1).join(" ");
        }
        name = name.replace(/[\s,]+$/, "");
        jobTitle = jobTitle.replace(/^[\s,]+|[\s,]+$/g, "");
        if (name && name.length <= 60) authors.push({ name, jobTitle });
    }
    return authors;
}



export async function generateMetadata({ params }: Props) {
    const { slug, lang } = await params;
    const [metadata, languages] = await Promise.all([
        getYoastMetadata(`/${slug}`, lang, `/blog/${slug}`),
        getBlogPostLanguages(slug),
    ]);
    // hreflang should only list languages the post is actually translated into.
    if (languages.length) {
        metadata.alternates = buildAlternates(lang, `/blog/${slug}`, languages);
    }
    return metadata;
}

export const dynamic = "force-dynamic";

export default async function LegalUpdateSinglePage({ params }: Props) {
    const { slug, lang } = await params;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;

    const post = await getLegalUpdateBySlug(slug, lang);
    if (!post) {
        redirect(`/${lang}/blog`);
    }

    // The post lookup matches the slug in any language, so send untranslated
    // languages (e.g. /en/ for a Russian-only post) to one the post exists in.
    const languages = await getBlogPostLanguages(slug);
    if (languages.length && !languages.includes(lang)) {
        redirect(`/${languages[0]}/blog/${encodeURIComponent(decodeURIComponent(slug))}`);
    }

    const { posts: related } = await getLegalUpdates(1, 4, lang);
    const sidebar = related.filter((p) => p.slug !== slug).slice(0, 3);
    const allTags = await getTags(lang);

    const canonicalUrl = `https://www.retrieve.am/${lang}/blog/${post.slug}`;
    // WordPress returns site-local (Asia/Yerevan) timestamps without an offset.
    const publishDate = post.date ? `${post.date}+04:00` : new Date().toISOString();
    const modifiedDate = post.modified ? `${post.modified}+04:00` : publishDate;

    const bylineAuthors = getBylineAuthors(post.content).map(({ name, jobTitle }) => {
        const personnelSlug = personnelSlugByName.get(normalizeName(name));
        const personnelUrl = personnelSlug && `https://www.retrieve.am/${lang}/personnel/${personnelSlug}`;
        return {
            "@type": "Person",
            // One stable identity per person across all languages.
            ...(personnelSlug && { "@id": `https://www.retrieve.am/en/personnel/${personnelSlug}#person` }),
            "name": name,
            ...(jobTitle && { "jobTitle": jobTitle }),
            ...(personnelUrl && { "url": personnelUrl })
        };
    });

    const articleBase = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${canonicalUrl}#article`,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
        },
        "headline": post.title,
        "description": post.excerpt || ""
    };
    const publisher = {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        "name": "Retrieve Legal & Tax",
        "url": "https://www.retrieve.am/en",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.retrieve.am/logo.jpg"
        }
    };
    const articleDates = {
        "datePublished": publishDate,
        "dateModified": modifiedDate,
        "inLanguage": lang
    };

    // Posts with a byline credit their authors; the rest credit the firm.
    const schemaMarkup = bylineAuthors.length ? {
        ...articleBase,
        "image": {
            "@type": "ImageObject",
            "url": post.image || "https://www.retrieve.am/logo.jpg"
        },
        "author": bylineAuthors,
        "publisher": publisher,
        ...articleDates
    } : {
        ...articleBase,
        "image": [post.image || "https://www.retrieve.am/logo.jpg"],
        "author": {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            "name": "Retrieve Legal & Tax",
            "url": `https://www.retrieve.am/${lang}`
        },
        "publisher": publisher,
        ...articleDates
    };

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            {/* JSON-LD Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />

            {/* Hero */}
            <div className="container mx-auto px-4 md:px-8 pt-36 pb-6">
                {/* Curved Hero Inset Card */}
                <div className="relative bg-gradient-to-br from-[#003D7A] via-[#005CB9] to-[#0070DB] rounded-[2rem] overflow-hidden shadow-xl pt-8 pb-16 px-6 md:pt-10 md:pb-24 md:px-12 text-white">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                    <Breadcrumbs className="relative z-10" items={[
                        { label: t.page_blog_title || "Insights & News", href: "/blog" },
                        { label: post.title }
                    ]} />

                    <div className="max-w-3xl mx-auto relative z-10 space-y-6 text-center">
                        <div className="flex items-center justify-center gap-4 text-blue-200 text-sm">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} /> {formatDate(post.date, lang)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={13} /> {post.readTime} {t.legal_update_read_min}
                            </span>
                        </div>
                        <h1
                            className="text-3xl md:text-[52px] lg:text-4xl font-extrabold tracking-tight leading-tight break-words max-w-5xl"
                            dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="container mx-auto px-4 md:px-8 py-14">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* ── Main article ── */}
                    <article className="flex-1 min-w-0">

                        {/* Featured image */}
                        {post.image && (
                            <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-lg">
                                <Image src={post.image} alt={post.imageAlt || post.title.replace(/<[^>]+>/g, "")} fill className="object-cover" priority />
                            </div>
                        )}

                        {/* Content */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 overflow-x-hidden">
                            <div
                                className="
                                    blog-content prose prose-lg max-w-none text-gray-700 break-words
                                    prose-headings:font-extrabold prose-headings:text-gray-900
                                    prose-h2:text-[23px] prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-lg prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-3
                                    prose-h4:text-sm prose-h4:font-bold prose-h4:mt-6 prose-h4:mb-2
                                    prose-strong:text-gray-900
                                    prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6
                                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6
                                    prose-li:text-base prose-li:mb-2 prose-li:pl-2
                                    prose-li:marker:text-[#005CB9]
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#005CB9] prose-blockquote:bg-blue-50 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                                    [&_p]:text-base [&_p]:mb-5 [&_p]:leading-relaxed
                                "
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-2 items-center">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-2">{t.tags}:</span>
                                    {post.tags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={`/tag/${tag.slug}`}
                                            className="bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#005CB9] text-xs font-bold rounded-lg px-3 py-1.5 transition-colors"
                                        >
                                            #{(t as any).tag_names?.[tag.slug] || tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer nav */}
                        <div className="mt-8 flex items-center justify-between">
                            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#005CB9] transition-colors">
                                <ArrowLeft size={14} /> {t.blog_all_articles}
                            </Link>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#005CB9] hover:bg-[#004791] text-white text-sm font-bold rounded-full px-6 py-3 transition-colors">
                                {t.btn_speak_to_expert} <ArrowRight size={14} />
                            </Link>
                        </div>
                    </article>

                    {/* ── Sidebar ── */}
                    <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-8">

                        {/* Recent articles */}
                        {sidebar.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                                    <FileText size={16} className="text-[#005CB9]" />
                                    {t.blog_sidebar_recent_title}
                                </h3>
                                <div className="space-y-4">
                                    {sidebar.map((r) => (
                                        <Link key={r.id} href={`/blog/${r.slug}`} className="flex gap-3 group">
                                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#005CB9]/10 shrink-0">
                                                {r.image
                                                    ? <Image src={r.image} alt={r.imageAlt || r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="56px" />
                                                    : <FileText size={20} className="absolute inset-0 m-auto text-[#005CB9]/30" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-400 mb-1">{formatDate(r.date, lang)}</div>
                                                <div
                                                    className="text-sm font-bold text-gray-800 group-hover:text-[#005CB9] transition-all leading-snug line-clamp-2 group-hover:line-clamp-none break-words cursor-help"
                                                    title={r.title.replace(/<[^>]+>/g, "")}
                                                    dangerouslySetInnerHTML={{ __html: r.title }}
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tag Cloud */}
                        {allTags.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="font-extrabold text-gray-900 mb-5 flex items-center gap-2">
                                    <Layout size={16} className="text-[#005CB9]" />
                                    {t.blog_sidebar_tags_title}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={`/tag/${tag.slug}`}
                                            className="bg-[#005CB9] hover:bg-[#004791] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 transition-colors inline-block"
                                        >
                                            {(t as any).tag_names?.[tag.slug] || tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA card */}
                        <div className="bg-gradient-to-br from-[#003d7a] to-[#005CB9] rounded-2xl p-7 relative overflow-hidden">
                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
                            <h3 className="text-white font-extrabold text-lg mb-2">
                                {t.have_legal_questions}
                            </h3>
                            <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                                {t.have_legal_questions_desc}
                            </p>
                            <Link href="/contact" className="block text-center bg-white text-[#005CB9] hover:bg-blue-50 font-bold text-sm rounded-xl px-5 py-3 transition-colors">
                                {t.schedule_consultation}
                            </Link>
                        </div>

                        {/* Practice areas link */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-extrabold text-gray-900 mb-3">
                                {t.blog_sidebar_practice_areas_title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {t.blog_sidebar_practice_areas_desc}
                            </p>
                            <Link href="/legal-services" className="inline-flex items-center gap-2 text-sm font-bold text-[#005CB9] hover:underline">
                                {t.view_all_services} <ArrowRight size={13} />
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
