import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getLegalUpdateBySlug, getLegalUpdates } from "@/lib/wordpress";
import { Calendar, Clock, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";

const dictionaries = { en, am, ru };

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    const { posts } = await getLegalUpdates(1, 50);
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const lang = (await cookieStore.get("i18next"))?.value || "en";
    const post = await getLegalUpdateBySlug(slug, lang);
    if (!post) return {};
    
    const title = post.title.replace(/<[^>]+>/g, "").trim();
    return {
        title: title,
        description: post.excerpt?.slice(0, 160),
        openGraph: {
            title: `${title} | Retrieve Legal & Tax`,
            description: post.excerpt?.slice(0, 160),
            images: post.image ? [post.image] : [],
        },
    };
}

function formatDate(iso: string, lang: string = "en") {
    const locale = lang === "am" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US";
    return new Date(iso).toLocaleDateString(locale, {
        year: "numeric", month: "long", day: "numeric",
    });
}

export default async function LegalUpdateSinglePage({ params }: Props) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const lang = (await cookieStore.get("i18next"))?.value || "en";
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;

    const post = await getLegalUpdateBySlug(slug, lang);
    if (!post) notFound();

    const { posts: related } = await getLegalUpdates(1, 4, lang);
    const sidebar = related.filter((p) => p.slug !== slug).slice(0, 3);

    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* Hero strip */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-36 pb-20">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium mb-8 group transition-colors">
                        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                        {t.blog_back_to_blog}
                    </Link>

                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 text-blue-200 text-sm mb-5">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} /> {formatDate(post.date, lang)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={13} /> {post.readTime} {t.legal_update_read_min}
                            </span>
                        </div>
                        <h1
                            className="text-3xl md:text-5xl font-extrabold text-white leading-tight"
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
                                <Image src={post.image} alt={post.title.replace(/<[^>]+>/g, "")} fill className="object-cover" priority />
                            </div>
                        )}

                        {/* Content */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
                            <div
                                className="
                                    prose prose-lg max-w-none text-gray-700
                                    prose-headings:font-extrabold prose-headings:text-gray-900
                                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                    prose-a:text-[#005CB9] prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-gray-900
                                    prose-ul:list-disc prose-ul:pl-5
                                    prose-ol:list-decimal prose-ol:pl-5
                                    prose-li:mb-1
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#005CB9] prose-blockquote:bg-blue-50 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                                    [&_p]:mb-5 [&_p]:leading-relaxed
                                "
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
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
                    <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-6 lg:sticky lg:top-28">

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
                                                    ? <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="56px" />
                                                    : <FileText size={20} className="absolute inset-0 m-auto text-[#005CB9]/30" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-400 mb-1">{formatDate(r.date, lang)}</div>
                                                <div
                                                    className="text-sm font-bold text-gray-800 group-hover:text-[#005CB9] transition-colors line-clamp-2 leading-snug"
                                                    dangerouslySetInnerHTML={{ __html: r.title }}
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Practice areas link */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-extrabold text-gray-900 mb-3">
                                {t.blog_sidebar_practice_areas_title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {t.blog_sidebar_practice_areas_desc}
                            </p>
                            <Link href="/practice-areas" className="inline-flex items-center gap-2 text-sm font-bold text-[#005CB9] hover:underline">
                                {t.view_all_services} <ArrowRight size={13} />
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
