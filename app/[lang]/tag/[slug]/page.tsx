import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getTagBySlug, getPostsByTag, getLegalUpdates, getYoastMetadata } from "@/lib/wordpress";
import { Calendar, Clock, ArrowRight, FileText, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";

const dictionaries = { en, am, ru };

interface Props {
    params: Promise<{ lang: string; slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;
    return getYoastMetadata(`/tag/${slug}`, lang as any);
}

export const dynamic = "force-dynamic";

const PER_PAGE = 9;

function formatDate(iso: string, lang: string = "en") {
    const locale = lang.startsWith("am") ? "hy-AM" : lang.startsWith("ru") ? "ru-RU" : "en-US";
    return new Date(iso).toLocaleDateString(locale, {
        year: "numeric", month: "long", day: "numeric",
    });
}

function Pagination({ currentPage, totalPages, t, slug }: { currentPage: number; totalPages: number; t: any; slug: string }) {
    if (totalPages <= 1) return null;
    const pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <nav className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <Link
                href={currentPage > 1 ? `/tag/${slug}?page=${currentPage - 1}` : "#"}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === 1 ? "text-gray-300 pointer-events-none bg-white border border-gray-100" : "text-[#005CB9] bg-white border border-gray-200 hover:border-[#005CB9] shadow-sm hover:shadow-md hover:bg-white flex"}`}
            >
                <ChevronLeft size={16} /> {t.pagination_prev}
            </Link>
            <div className="flex items-center gap-2">
                {pages.map((p, idx) => p === "..." ? (
                    <span key={idx} className="px-2 text-gray-400">…</span>
                ) : (
                    <Link
                        key={p}
                        href={`/tag/${slug}?page=${p}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${p === currentPage ? "bg-[#005CB9] text-white shadow-lg shadow-blue-200" : "bg-white border border-gray-200 text-gray-700 hover:border-[#005CB9] shadow-sm"}`}
                    >
                        {p}
                    </Link>
                ))}
            </div>
            <Link
                href={currentPage < totalPages ? `/tag/${slug}?page=${currentPage + 1}` : "#"}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${currentPage === totalPages ? "text-gray-300 pointer-events-none bg-white border border-gray-100" : "text-[#005CB9] bg-white border border-gray-200 hover:border-[#005CB9] shadow-sm hover:shadow-md hover:bg-white flex"}`}
            >
                {t.pagination_next} <ChevronRight size={16} />
            </Link>
        </nav>
    );
}

export default async function TagArchivePage({ params, searchParams }: Props) {
    const { lang, slug } = await params;
    const sParams = await searchParams;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    const currentPage = Math.max(1, parseInt(sParams.page ?? "1", 10) || 1);

    const tag = await getTagBySlug(slug, lang);
    if (!tag) notFound();

    const { posts, total, totalPages } = await getPostsByTag(tag.id, currentPage, PER_PAGE, lang);
    const { posts: recent } = await getLegalUpdates(1, 5, lang);

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-[#003d7a] to-[#005CB9] pt-44 pb-12 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6">
                        <Tag size={13} />
                        {t.category}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        {tag.name}
                    </h1>
                    {total > 0 && (
                        <p className="text-blue-100/80 text-lg font-medium">
                            {total} {t.blog_articles_found}
                        </p>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-14">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <FileText size={48} className="text-gray-200 mx-auto mb-4" />
                                <h2 className="text-xl font-bold text-gray-400">{t.blog_no_articles}</h2>
                                <p className="text-gray-400 mt-2">{t.blog_check_back_soon}</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {posts.map((post) => (
                                        <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col">
                                            <div className="relative h-52 bg-gray-100 overflow-hidden">
                                                {post.image ? (
                                                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#005CB9]/20 bg-blue-50">
                                                        <FileText size={40} />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <Clock size={10} /> {post.readTime} {t.legal_update_read_min}
                                                </div>
                                            </div>
                                            <div className="p-7 flex flex-col flex-1">
                                                <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold mb-3 uppercase tracking-wider">
                                                    <Calendar size={12} className="text-[#005CB9]/50" /> {formatDate(post.date, lang)}
                                                </div>
                                                <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#005CB9] mb-3 line-clamp-2 leading-snug transition-colors" dangerouslySetInnerHTML={{ __html: post.title }} />
                                                <p className="text-sm text-gray-500 line-clamp-3 mb-5 leading-relaxed flex-1">{post.excerpt}</p>
                                                <div className="flex items-center gap-1.5 text-[#005CB9] text-xs font-bold pt-4 border-t border-gray-50 uppercase tracking-widest">
                                                    {t.read_article_btn} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Pagination currentPage={currentPage} totalPages={totalPages} t={t} slug={slug} />
                            </>
                        )}
                    </div>

                    {/* Simple sidebar */}
                    <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-8">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm lg:sticky lg:top-28">
                            <h3 className="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-[#005CB9] rounded-full" />
                                {t.blog_recent_articles}
                            </h3>
                            <div className="space-y-8">
                                {recent.map((r) => (
                                    <Link key={r.id} href={`/blog/${r.slug}`} className="flex gap-4 group">
                                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 shadow-sm">
                                            {r.image ? (
                                                <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="64px" />
                                            ) : (
                                                <FileText size={20} className="absolute inset-0 m-auto text-gray-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{formatDate(r.date, lang)}</div>
                                            <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#005CB9] line-clamp-2 leading-snug transition-colors" dangerouslySetInnerHTML={{ __html: r.title }} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

