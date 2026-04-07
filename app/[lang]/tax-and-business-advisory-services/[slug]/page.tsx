import { cookies } from "next/headers";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { notFound } from "next/navigation";
import { getPracticeAreaContent, getPortfolioItems, getYoastMetadata } from "@/lib/wordpress";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, ChevronDown, FileText } from "lucide-react";
import enCommon from "@/locales/en/common.json";
import ruCommon from "@/locales/ru/common.json";
import amCommon from "@/locales/am/common.json";

const dictionaries = {
    en: enCommon,
    ru: ruCommon,
    am: amCommon,
} as const;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const t = dictionaries[lang] || dictionaries.en;
    const metadata = await getYoastMetadata(`/practice-areas/${slug}`, lang);
    
    // Check if we need to translate the title manually
    const slugKey = slug.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/-law$/, '');
    const translatedTitle = (t.practice_titles as any)?.[Object.keys(t.practice_titles || {}).find(k => k.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/-law$/, '') === slugKey) || ""] || metadata.title;

    if (translatedTitle && typeof translatedTitle === 'string') {
        metadata.title = { absolute: `${translatedTitle} - Retrieve` };
    }
    
    return metadata;
}

export const dynamic = "force-dynamic";

function getCategoryRoute(category?: string): string {
    if (category?.toLowerCase().includes("tax")) return "/tax-and-business-advisory-services";
    return "/legal-services";
}

export default async function TaxAdvisoryServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const t = dictionaries[lang] || dictionaries.en;
    const content = await getPracticeAreaContent(slug, lang);

    if (!content) notFound();

    const allAreas = await getPortfolioItems(lang);
    const sidebarAreas = allAreas.filter(a => a.slug !== slug).slice(0, 5);

    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* ── Hero Strip ── */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-44 pb-20">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <Link href="/tax-and-business-advisory-services" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-medium mb-8 group transition-colors">
                        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                        {t.back_to_practice_areas}
                    </Link>

                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-blue-200 text-xs font-bold tracking-widest uppercase mb-5">
                            <ShieldCheck size={14} />
                            {t.our_expertise}
                        </div>
                        <h1
                            className="text-4xl md:text-6xl font-bold text-white leading-tight"
                            dangerouslySetInnerHTML={{ 
                                __html: content.isFallback && (t.practice_titles as any)?.[Object.keys(t.practice_titles || {}).find(k => k.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/-law$/, '') === slug.toLowerCase().replace(/-law$/, '')) || ""] 
                                    ? (t.practice_titles as any)[Object.keys(t.practice_titles || {}).find(k => k.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/-law$/, '') === slug.toLowerCase().replace(/-law$/, '')) || ""]
                                    : content.title 
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="container mx-auto px-4 md:px-8 py-16 -mt-8 relative z-20">
                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* ── Main Content Area ── */}
                    <article className="flex-1 min-w-0">
                        {content.image && (
                            <div className="relative w-full h-80 md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-xl border border-white">
                                <Image
                                    src={content.image}
                                    alt={content.title}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        )}

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-16">

                            {content.overview && (
                                <section>
                                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-8 h-1 bg-[#005CB9] rounded-full"></div>
                                        {t.overview}
                                    </h2>
                                    <div 
                                        className="overflow-x-auto prose prose-lg max-w-none text-gray-700
                                            prose-headings:font-extrabold prose-headings:text-gray-900
                                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                            prose-a:text-[#005CB9] prose-a:no-underline hover:prose-a:underline
                                            prose-strong:text-gray-900
                                            prose-ul:list-disc prose-ul:pl-5
                                            prose-ol:list-decimal prose-ol:pl-5
                                            prose-li:mb-1
                                            [&_p]:mb-5 [&_p]:leading-relaxed [&_p]:text-gray-600 [&_p]:font-medium"
                                        dangerouslySetInnerHTML={{ __html: content.overview }}
                                    />
                                </section>
                            )}

                            {content.howWeCanHelp.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                                        <div className="w-8 h-1 bg-[#005CB9] rounded-full"></div>
                                        {t.how_we_can_help}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {content.howWeCanHelp.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50/50 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                                                <CheckCircle2 className="text-[#005CB9] shrink-0 mt-0.5" size={20} />
                                                <span className="text-gray-700 font-medium leading-snug">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {content.whyChooseUs.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                                        <div className="w-8 h-1 bg-[#005CB9] rounded-full"></div>
                                        {t.why_choose_us_question}
                                    </h2>
                                    <div className="space-y-4">
                                        {content.whyChooseUs.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-r from-[#005CB9] to-[#003d7a] text-white shadow-md transform transition-transform hover:-translate-y-1">
                                                <div className="flex bg-white/20 p-3 rounded-full shrink-0">
                                                    <ShieldCheck size={24} className="text-white" />
                                                </div>
                                                <span className="text-lg font-semibold leading-snug">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {content.faqs.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                                        <div className="w-8 h-1 bg-[#005CB9] rounded-full"></div>
                                        {t.faqs}
                                    </h2>
                                    <div className="space-y-4">
                                        {content.faqs.map((faq, idx) => (
                                            <details key={idx} className="group bg-gray-50 rounded-2xl p-6 cursor-pointer open:bg-white open:ring-1 open:ring-gray-200 transition-all">
                                                <summary className="flex items-center justify-between font-bold text-gray-900 text-lg outline-none select-none">
                                                    {faq.question}
                                                    <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-[#005CB9] bg-blue-100 p-2 rounded-full">
                                                        <ChevronDown size={18} strokeWidth={3} />
                                                    </span>
                                                </summary>
                                                <div className="mt-5 text-gray-600 leading-relaxed text-base border-t border-gray-100 pt-5">
                                                    {faq.answer}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </section>
                            )}

                        </div>
                    </article>

                    {/* ── Sidebar ── */}
                    <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-8 lg:sticky lg:top-32">

                        <div className="bg-gradient-to-br from-[#003d7a] to-[#005CB9] rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-blue-900/10">
                            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                            <h3 className="text-white text-2xl font-extrabold mb-3">
                                {t.require_legal_assistance}
                            </h3>
                            <p className="text-blue-100 text-base mb-8 leading-relaxed font-medium">
                                {t.require_legal_assistance_desc}
                            </p>
                            <Link href="/contact" className="block text-center bg-white text-[#005CB9] hover:bg-gray-50 font-bold text-base rounded-2xl px-6 py-4 transition-all shadow-md hover:shadow-lg">
                                {t.schedule_consultation}
                            </Link>
                        </div>

                        {sidebarAreas.length > 0 && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                                <h3 className="font-extrabold text-xl text-gray-900 mb-6 flex items-center gap-2">
                                    <FileText size={20} className="text-[#005CB9]" />
                                    {t.other_services}
                                </h3>
                                <div className="space-y-2">
                                    {sidebarAreas.map((area) => {
                                        const translatedAreaTitle = lang !== 'en' && (t.practice_titles as any)?.[area.title] 
                                            ? (t.practice_titles as any)[area.title] 
                                            : area.title;
                                        return (
                                            <Link
                                                key={area.slug}
                                                href={`${getCategoryRoute(area.category)}/${area.slug}`}
                                                className="group flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="text-gray-700 font-semibold group-hover:text-[#005CB9] transition-colors">{translatedAreaTitle}</span>
                                                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#005CB9] group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <Link href="/tax-and-business-advisory-services" className="inline-flex items-center justify-center w-full gap-2 text-sm font-bold text-[#005CB9] hover:text-[#003d7a] transition-colors bg-blue-50/50 hover:bg-blue-50 py-3 rounded-xl">
                                        {t.view_all_practice_areas_btn}
                                    </Link>
                                </div>
                            </div>
                        )}

                    </aside>
                </div>
            </div>
        </div>
    );
}
