import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getLegalUpdateBySlug, getLegalUpdates, getTags, getYoastMetadata } from "@/lib/wordpress";
import { Calendar, Clock, ArrowLeft, ArrowRight, FileText, Layout } from "lucide-react";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";

const dictionaries = { en, am, ru };

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}



export async function generateMetadata({ params }: Props) {
    const { slug, lang } = await params;
    return getYoastMetadata(`/${slug}`, lang, `/blog/${slug}`);
}

export const dynamic = "force-dynamic";

function formatDate(iso: string, lang: string = "en") {
    const locale = lang === "am" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US";
    return new Date(iso).toLocaleDateString(locale, {
        year: "numeric", month: "long", day: "numeric",
    });
}

export default async function LegalUpdateSinglePage({ params }: Props) {
    const { slug, lang } = await params;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;

    const post = await getLegalUpdateBySlug(slug, lang);
    if (!post) {
        redirect(`/${lang}/blog`);
    }

    const { posts: related } = await getLegalUpdates(1, 4, lang);
    const sidebar = related.filter((p) => p.slug !== slug).slice(0, 3);
    const allTags = await getTags(lang);

    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* Hero strip */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-44 pb-12">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <Breadcrumbs items={[
                        { label: t.page_blog_title || "Insights & News", href: "/blog" },
                        { label: post.title }
                    ]} />

                    <div className="max-w-5xl">
                        <div className="flex items-center gap-4 text-blue-200 text-sm mb-5">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} /> {formatDate(post.date, lang)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={13} /> {post.readTime} {t.legal_update_read_min}
                            </span>
                        </div>
                        <h1
                            className="text-3xl md:text-5xl font-extrabold text-white leading-tight break-words"
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
                                    prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-base prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-3
                                    prose-h4:text-sm prose-h4:font-bold prose-h4:mt-6 prose-h4:mb-2
                                    prose-strong:text-gray-900
                                    prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6
                                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6
                                    prose-li:mb-2 prose-li:pl-2
                                    prose-li:marker:text-[#005CB9]
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#005CB9] prose-blockquote:bg-blue-50 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                                    [&_p]:mb-5 [&_p]:leading-relaxed
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
