import { cookies } from "next/headers";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { notFound, redirect } from "next/navigation";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }) {
    const { slug, lang } = await params;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    
    // 1. Fetch metadata from WordPress
    const metadata = await getYoastMetadata(`/practice-areas/${slug}`, lang, `/tax-and-business-advisory-services/${slug}`);
    
    // 2. If WordPress successfully provided a title, use the metadata as is
    if (metadata.title) {
        return metadata;
    }

    // 3. Fallback: If WordPress didn't provide a title, use local translations
    let translatedTitle = (t as any).practice_content?.[slug]?.title;
    
    if (!translatedTitle) {
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/law$/, '');
        const slugKey = normalize(slug);
        translatedTitle = (t.practice_titles as any)?.[Object.keys(t.practice_titles || {}).find(k => normalize(k) === slugKey) || ""];
    }

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

export default async function TaxAdvisoryServiceDetailPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
    const { slug, lang } = await params;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    let content = await getPracticeAreaContent(slug, lang);

    // If WordPress has no content, check if we have local fallback translations
    if (!content && (t as any).practice_content?.[slug]) {
        const local = (t as any).practice_content[slug];
        content = {
            title: local.title || "",
            overview: local.overview || "",
            howWeCanHelp: local.how_we_can_help || [],
            whyChooseUs: local.why_choose_us || [],
            faqs: local.faqs || [],
            image: local.image || "",
            imageAlt: local.imageAlt || ""
        };
    }

    if (!content) {
        redirect(`/${lang}/tax-and-business-advisory-services`);
    }

    // Override content if local translations exist for any language
    if ((t as any).practice_content?.[slug]) {
        const local = (t as any).practice_content[slug];
        content.title = local.title || content.title;
        content.overview = local.overview || content.overview;
        content.howWeCanHelp = local.how_we_can_help || content.howWeCanHelp;
        // Standard practice areas pull "Why Choose Us" from WordPress (falling back to
        // local only when WP has none). Curated pages authored locally in every language
        // (e.g. iGaming, which is present in the English dictionary) keep their local translations.
        const isCuratedPage = !!(dictionaries.en as any).practice_content?.[slug];
        content.whyChooseUs = isCuratedPage
            ? (local.why_choose_us || content.whyChooseUs)
            : ((content.whyChooseUs && content.whyChooseUs.length > 0)
                ? content.whyChooseUs
                : (local.why_choose_us || content.whyChooseUs));
        if (local.faqs) {
            content.faqs = local.faqs;
        }
        if (local.image) {
            content.image = local.image;
        }
    }

    const displayTitle = (t as any).practice_content?.[slug]?.title 
        ? (t as any).practice_content[slug].title
        : (t.practice_titles as any)?.[Object.keys(t.practice_titles || {}).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/law$/, '') === slug.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/law$/, '')) || ""] 
            ? (t.practice_titles as any)[Object.keys(t.practice_titles || {}).find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/law$/, '') === slug.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/law$/, '')) || ""]
            : content.title;

    const faqSchemaMarkup = content.faqs && content.faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    // Helper function to parse bullet points (e.g. "Title: Description")
    const parseBullet = (item: string) => {
        if (item.includes(":")) {
            const parts = item.split(":");
            const title = parts[0].trim();
            const description = parts.slice(1).join(":").trim();
            return { title, description };
        }
        return { title: item, description: "" };
    };

    const parsedHelp = (content.howWeCanHelp || []).map(item => parseBullet(item));
    const parsedWhy = (content.whyChooseUs || []).map(item => parseBullet(item));

    // Dynamic Title Formats
    const heroDescriptionText = (t as any).practice_content?.[slug]?.hero_desc 
        ? (t as any).practice_content[slug].hero_desc
        : lang === 'en' 
        ? `Retrieve Legal & Tax provides comprehensive ${displayTitle.toLowerCase()} services for local and international businesses. Our goal is to deliver actionable advice and solutions that help you make confident decisions and manage risks effectively.`
        : lang === 'am'
        ? `Retrieve Legal & Tax-ը տրամադրում է համապարփակ ${displayTitle.toLowerCase()} ծառայություններ տեղական և միջազգային բիզնեսների համար: Մեր նպատակն է առաջարկել գործնական լուծումներ, որոնք կօգնեն ձեզ վստահ որոշումներ կայացնել:`
        : `Retrieve Legal & Tax предоставляет комплексные услуги в сфере ${displayTitle.toLowerCase()} для местных и международных компаний. Наша цель — предложить практические решения для уверенного ведения бизнеса.`;

    const heroButtonText = (t as any).practice_content?.[slug]?.hero_btn
        ? (t as any).practice_content[slug].hero_btn
        : t.book_legal_consultation || "Book Legal Consultation";

    const introTitle = lang === 'en'
        ? `${displayTitle} Services for Businesses in Armenia`
        : lang === 'am'
        ? `${displayTitle} ծառայություններ բիզնեսի համար Հայաստանում`
        : `${displayTitle} услуги для бизнеса в Армении`;

    const ourServicesTitle = `${t.our_services_prefix || "Our "}${displayTitle}${t.our_services_suffix || " Services"}`;
    const whyChooseTitle = `${t.why_choose_title_prefix || "Why Choose the "}${displayTitle}${t.why_choose_title_suffix || " Attorneys at Retrieve Legal & Tax?"}`;

    // Optional, page-specific content blocks (e.g. the fully authored Corporate page).
    const pc = ((t as any).practice_content?.[slug] || {}) as Record<string, any>;

    return (
        <div className="min-h-screen bg-[#F4F7FB] pb-12">
            {/* JSON-LD FAQ Schema Markup */}
            {faqSchemaMarkup && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaMarkup) }}
                />
            )}

            {/* ── Breadcrumbs and Hero Section ── */}
            <div className="container mx-auto px-4 md:px-8 pt-36 pb-6">
                {/* Curved Hero Inset Card */}
                <div className="relative bg-gradient-to-br from-[#003D7A] via-[#005CB9] to-[#0070DB] rounded-[2rem] overflow-hidden shadow-xl pt-8 pb-16 px-6 md:pt-10 md:pb-24 md:px-12 text-white">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                    {/* Breadcrumbs — same style as the blog section (light text on the gradient hero) */}
                    <Breadcrumbs
                        className="relative z-10"
                        items={[
                            { label: t.cat_tax_advisory_services || "Tax & Business Advisory Services", href: "/tax-and-business-advisory-services" },
                            { label: displayTitle }
                        ]}
                    />

                    <div className="max-w-[52rem] mx-auto relative z-10 space-y-6 text-center">
                        <h1 className="text-3xl md:text-[52px] font-extrabold tracking-tight leading-tight max-w-[52rem] mx-auto">
                            {displayTitle}
                        </h1>
                        <p className="text-blue-100 text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                            {heroDescriptionText}
                        </p>
                        <div className="pt-4">
                            <Link href="/contact" className="inline-block bg-white text-[#005CB9] hover:bg-gray-50 font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200">
                                {heroButtonText}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Overview Section ── */}
            {content.overview && (
                <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6 text-left">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {pc.intro_title || introTitle}
                            </h2>
                            <div 
                                className="overflow-x-auto prose prose-lg max-w-none text-gray-700 break-words
                                    prose-headings:font-extrabold prose-headings:text-gray-900
                                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                    prose-strong:text-gray-900
                                    prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6
                                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6
                                    prose-li:mb-2 prose-li:pl-2
                                    prose-li:marker:text-[#005CB9]
                                    [&_p]:mb-5 [&_p]:leading-relaxed [&_p]:text-gray-600 [&_p]:font-medium"
                                dangerouslySetInnerHTML={{ __html: content.overview }}
                            />
                        </div>
                        {content.image && (
                            <div className="lg:col-span-5 relative w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                                <Image
                                    src={content.image}
                                    alt={content.imageAlt || displayTitle}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── CTA (after Overview) ── */}
            {pc.cta_overview_title && (
                <section className="container mx-auto px-4 md:px-8 py-6 text-center">
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10 text-left">
                            <div className="space-y-4 max-w-3xl">
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                                    {pc.cta_overview_title}
                                </h3>
                                {pc.cta_overview_desc && (
                                    <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed whitespace-pre-line">
                                        {pc.cta_overview_desc}
                                    </p>
                                )}
                            </div>
                            <div className="shrink-0">
                                <Link href="/contact" className="inline-block bg-[#005CB9] hover:bg-[#004791] text-white font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200">
                                    {pc.cta_overview_btn || (t.contact_badge || "Get in touch")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Services Section (Our [Title] Services) ── */}
            {content.howWeCanHelp && content.howWeCanHelp.length > 0 && (
                <>
                    <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                            {ourServicesTitle}
                        </h2>
                        {pc.services_intro && (
                            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed max-w-3xl mx-auto mt-4">
                                {pc.services_intro}
                            </p>
                        )}
                        <div className="flex flex-wrap justify-center gap-6 w-full mt-12">
                            {parsedHelp.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all flex flex-col items-start text-left"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-50 p-2 rounded-full text-[#005CB9] shrink-0">
                                            <CheckCircle2 size={20} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                            {item.title}
                                        </h3>
                                    </div>
                                    {item.description && (
                                        <p className="text-gray-600 text-sm font-medium leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Section: M&A / Transactions ── */}
                    {pc.mna_title && (
                        <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                            <div className="max-w-4xl mx-auto text-left">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                                    {pc.mna_title}
                                </h2>
                                {pc.mna_desc && (
                                    <div className="space-y-4 text-gray-600 font-medium text-sm md:text-base leading-relaxed mb-8">
                                        {String(pc.mna_desc).split(/\n+/).map((p: string) => p.trim()).filter(Boolean).map((p: string, i: number) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>
                                )}
                                {Array.isArray(pc.mna_items) && pc.mna_items.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {pc.mna_items.map((item: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                                                <div className="bg-blue-50 p-1.5 rounded-full text-[#005CB9] shrink-0">
                                                    <CheckCircle2 size={18} strokeWidth={2.5} />
                                                </div>
                                                <span className="text-gray-800 font-semibold text-sm">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── CTA 2 Section (Under Services) ── */}
                    <section className="container mx-auto px-4 md:px-8 py-6 text-center">
                        <div className="relative max-w-5xl mx-auto">
                            {/* Dot patterns overflowing */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                            
                            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10 text-left">
                                <div className="space-y-4 max-w-3xl">
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                                        {(t as any).practice_content?.[slug]?.cta_services_title
                                            ? (t as any).practice_content[slug].cta_services_title
                                            : `${t.cta_looking_title_prefix}${displayTitle}${t.cta_looking_title_suffix}`}
                                    </h3>
                                    <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed whitespace-pre-line">
                                        {(t as any).practice_content?.[slug]?.cta_services_desc
                                            ? (t as any).practice_content[slug].cta_services_desc
                                            : t.cta_services_desc}
                                    </p>
                                </div>
                                <div className="shrink-0">
                                    <Link href="/contact" className="inline-block bg-[#005CB9] hover:bg-[#004791] text-white font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200">
                                        {(t as any).practice_content?.[slug]?.cta_services_btn
                                            ? (t as any).practice_content[slug].cta_services_btn
                                            : (t.contact_badge || "Get in touch")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* ── Why Choose Us Section ── */}
            {content.whyChooseUs && content.whyChooseUs.length > 0 && (
                <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
                    <div className="max-w-3xl mx-auto mb-12 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {(t as any).practice_content?.[slug]?.why_choose_title || whyChooseTitle}
                        </h2>
                        <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed whitespace-pre-line">
                            {(t as any).practice_content?.[slug]?.why_choose_desc
                                ? (t as any).practice_content[slug].why_choose_desc
                                : lang === 'en'
                                ? `Retrieve Legal & Tax offers client-focused, results-driven legal advice. Here is why businesses choose our ${displayTitle.toLowerCase()} services:`
                                : lang === 'am'
                                ? `Retrieve Legal & Tax-ն առաջարկում է հաճախորդամետ և արդյունավետ իրավական աջակցություն: Ահա թե ինչու են բիզնեսները ընտրում մեր ${displayTitle.toLowerCase()} ծառայությունները.`
                                : `Retrieve Legal & Tax предлагает ориентированные на клиента и результат юридические услуги. Вот почему компании выбирают нас для услуг в сфере ${displayTitle.toLowerCase()}:`
                            }
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 w-full">
                        {parsedWhy.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all flex flex-col items-start text-left"
                            >
                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── FAQs Section ── */}
            {content.faqs && content.faqs.length > 0 && (
                <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 tracking-tight">
                        {t.faqs}
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-4 w-full">
                        {content.faqs.map((faq, idx) => (
                            <details 
                                key={idx} 
                                className="group bg-white rounded-2xl p-6 cursor-pointer open:bg-white open:ring-1 open:ring-gray-200 transition-all shadow-sm border border-gray-100"
                            >
                                <summary className="flex items-center justify-between font-bold text-gray-900 text-base md:text-lg outline-none select-none text-left">
                                    {faq.question}
                                    <span className="ml-4 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-[#005CB9] bg-blue-50 p-2 rounded-full">
                                        <ChevronDown size={18} strokeWidth={3} />
                                    </span>
                                </summary>
                                <div className="mt-5 text-gray-600 leading-relaxed text-sm md:text-base border-t border-gray-100 pt-5 text-left font-medium whitespace-pre-line">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA 3 Section (After FAQ) ── */}
            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="relative bg-gradient-to-br from-[#E8F1FC] via-[#F1F6FC] to-[#E8F1FC] rounded-3xl p-8 md:p-12 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
                    {/* Subtle decorative background shapes */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-200/20 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-200/20 blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10 text-left max-w-3xl space-y-4">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                            {(t as any).practice_content?.[slug]?.cta_journey_title
                                ? (t as any).practice_content[slug].cta_journey_title
                                : t.cta_journey_title}
                        </h3>
                        {(t as any).practice_content?.[slug]?.cta_journey_desc ? (
                            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed whitespace-pre-line">
                                {(t as any).practice_content[slug].cta_journey_desc}
                            </p>
                        ) : null}
                    </div>
                    <div className="relative z-10 shrink-0">
                        <Link href="/contact" className="inline-block bg-[#005CB9] hover:bg-[#004791] text-white font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200">
                            {(t as any).practice_content?.[slug]?.cta_journey_btn
                                ? (t as any).practice_content[slug].cta_journey_btn
                                : (t.cta_journey_btn || "Contact us now")}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
