import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { cookies } from "next/headers";
import { getBlogPosts, getYoastMetadata } from "@/lib/wordpress";
import { Calendar, Clock, ArrowRight, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";

const dictionaries = { en, am, ru };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return getYoastMetadata("/blog", lang);
}

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

function formatDate(iso: string, lang: string = "en") {
    const locale = lang.startsWith("am") ? "hy-AM" : lang.startsWith("ru") ? "ru-RU" : "en-US";
    return new Date(iso).toLocaleDateString(locale, {
        year: "numeric", month: "long", day: "numeric",
    });
}

function Pagination({ currentPage, totalPages, t }: { currentPage: number; totalPages: number; t: any }) {
    const t_prev = t.pagination_prev;
    const t_next = t.pagination_next;
    
    if (totalPages <= 1) return null;

    // Build a window of page numbers around current page
    const pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <nav
            aria-label="Blog pagination"
            className="flex items-center justify-center gap-2 mt-14 flex-wrap"
        >
            {/* Prev */}
            <Link
                href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "#"}
                aria-disabled={currentPage === 1}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                    ${currentPage === 1
                        ? "text-gray-300 cursor-not-allowed pointer-events-none bg-white border border-gray-100"
                        : "text-[#005CB9] bg-white border border-gray-200 hover:border-[#005CB9] hover:bg-[#005CB9] hover:text-white shadow-sm"
                    }`}
            >
                <ChevronLeft size={16} />
                {t_prev}
            </Link>

            {/* Page numbers */}
            {pages.map((p, idx) =>
                p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 font-semibold select-none">
                        …
                    </span>
                ) : (
                    <Link
                        key={p}
                        href={`/blog?page=${p}`}
                        aria-current={p === currentPage ? "page" : undefined}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200
                            ${p === currentPage
                                ? "bg-[#005CB9] text-white shadow-md shadow-blue-900/20"
                                : "bg-white border border-gray-200 text-gray-700 hover:border-[#005CB9] hover:text-[#005CB9] shadow-sm"
                            }`}
                    >
                        {p}
                    </Link>
                )
            )}

            {/* Next */}
            <Link
                href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : "#"}
                aria-disabled={currentPage === totalPages}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                    ${currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed pointer-events-none bg-white border border-gray-100"
                        : "text-[#005CB9] bg-white border border-gray-200 hover:border-[#005CB9] hover:bg-[#005CB9] hover:text-white shadow-sm"
                    }`}
            >
                {t_next}
                <ChevronRight size={16} />
            </Link>
        </nav>
    );
}

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { lang } = await params;
    const sParams = await searchParams;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    
    const currentPage = Math.max(1, parseInt(sParams.page ?? "1", 10) || 1);
    const { posts, total, totalPages } = await getBlogPosts(PER_PAGE, currentPage, lang);

    const start = (currentPage - 1) * PER_PAGE + 1;
    const end = Math.min(currentPage * PER_PAGE, total);

    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* Hero */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-44 pb-12">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6">
                        <FileText size={13} />
                        {t.blog_insights_badge}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight">
                        {t.page_blog_title}
                    </h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        {t.page_blog_subtitle}
                    </p>
                    {total > 0 && (
                        <div className="mt-6 inline-block bg-white/10 border border-white/20 rounded-full px-5 py-2 text-white text-sm font-semibold">
                            {total} {t.blog_articles_published || "articles published"}
                        </div>
                    )}
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 md:px-8 py-16">
                {/* Results info */}
                {total > 0 && (
                    <p className="text-sm text-gray-500 font-medium mb-8">
                        {t.blog_showing} <span className="font-bold text-gray-700">{start}–{end}</span> {t.blog_of} <span className="font-bold text-gray-700">{total}</span> {t.blog_articles} &nbsp;·&nbsp; {t.blog_page_label} <span className="font-bold text-gray-700">{currentPage}</span> {t.blog_of} <span className="font-bold text-gray-700">{totalPages}</span>
                    </p>
                )}

                {posts.length === 0 ? (
                    <div className="text-center py-24">
                        <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-500">
                            {t.blog_no_articles}
                        </h2>
                        <p className="text-gray-400 mt-2">
                            {t.blog_check_back_soon}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#005CB9]/20 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-52 bg-gradient-to-br from-[#003d7a] to-[#005CB9] overflow-hidden shrink-0">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.imageAlt || post.title.replace(/<[^>]+>/g, "")}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText size={40} className="text-white/30" />
                                        </div>
                                    )}
                                    {/* Read time badge */}
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Clock size={11} />
                                        {post.readTime} {t.legal_update_read_min}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    {/* Date */}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-3">
                                        <Calendar size={12} />
                                        {formatDate(post.date, lang)}
                                    </div>

                                    {/* Title */}
                                    <h2
                                        className="text-base font-extrabold text-gray-900 group-hover:text-[#005CB9] transition-colors leading-snug mb-3 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: post.title }}
                                    />

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p 
                                            className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt.replace(/&nbsp;/g, " ") }}
                                        />
                                    )}

                                    {/* CTA row */}
                                    <div className="flex items-center gap-1.5 text-[#005CB9] text-sm font-bold mt-auto pt-2 border-t border-gray-50">
                                        {t.read_article_btn}
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} t={t} />
            </div>
        </div>
    );
}
