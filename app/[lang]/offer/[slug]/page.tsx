import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getLegalUpdateBySlug, getYoastMetadata } from "@/lib/wordpress";
import { Calendar, ArrowLeft } from "lucide-react";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";
import QuoteForm from "@/components/website/QuoteForm";

const dictionaries = { en, am, ru };

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug, lang } = await params;
    return getYoastMetadata(`/${slug}`, lang, `/offer/${slug}`);
}

export const dynamic = "force-dynamic";

function formatDate(iso: string, lang: string = "en") {
    const locale = lang === "am" ? "hy-AM" : lang === "ru" ? "ru-RU" : "en-US";
    return new Date(iso).toLocaleDateString(locale, {
        year: "numeric", month: "long", day: "numeric",
    });
}

export default async function OfferSinglePage({ params }: Props) {
    const { slug, lang } = await params;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;

    const post = await getLegalUpdateBySlug(slug, lang);
    if (!post) {
        redirect(`/${lang}`);
    }

    return (
        <div className="min-h-screen bg-[#F4F7FB] relative overflow-hidden">
            {/* Hero strip */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-44 pb-12">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <Breadcrumbs items={[
                        { label: t.special_offers || "Trending services", href: "/" },
                        { label: post.title }
                    ]} />

                    <div className="max-w-5xl mt-6">
                        <div className="flex items-center gap-4 text-blue-200 text-sm mb-5">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={13} /> {formatDate(post.date, lang)}
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
                <div className="flex flex-col-reverse lg:flex-row gap-12">

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
                        </div>

                        {/* Footer nav */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#005CB9] transition-colors">
                                <ArrowLeft size={14} /> {t.btn_back_home || "Back to Home"}
                            </Link>

                            <a 
                                href="#quote-form" 
                                className="inline-flex items-center gap-2 bg-[#005CB9] hover:bg-[#004791] text-white text-sm font-bold rounded-full px-8 py-3.5 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {t.get_a_quote || "Get a Quote"}
                            </a>
                        </div>

                    </article>

                    {/* ── Sidebar with Form ── */}
                    <aside className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-32">
                        <QuoteForm postTitle={post.title.replace(/<[^>]+>/g, "")} />
                    </aside>
                </div>
            </div>
        </div>
    );
}
