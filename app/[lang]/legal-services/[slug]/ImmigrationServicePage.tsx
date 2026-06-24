import Link from "@/components/ui/LocalizedLink";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import enCommon from "@/locales/en/common.json";
import ruCommon from "@/locales/ru/common.json";
import amCommon from "@/locales/am/common.json";
import {
    Plane,
    Briefcase,
    Home,
    Flag,
    Users,
    TrendingUp,
    CheckCircle2,
    ChevronDown,
    ArrowRight,
} from "lucide-react";

const dictionaries = {
    en: enCommon,
    ru: ruCommon,
    am: amCommon,
} as const;

// Icons cycle through the service cards in the order they appear.
const SERVICE_ICONS = [Plane, Briefcase, Home, Flag, Users, TrendingUp];

interface ServiceCard {
    title: string;
    body: string[];
    included: string[];
}

interface ProcessStep {
    title: string;
    desc: string;
    optional?: boolean;
}

interface WhyChooseCard {
    title: string;
    desc: string;
}

interface Faq {
    question: string;
    answer: string;
}

interface ImmigrationContent {
    title: string;
    hero_title: string;
    hero_subtitle?: string;
    hero_desc: string;
    hero_btn: string;
    intro_title: string;
    intro_lead: string;
    intro_body: string;
    services_title: string;
    services_intro: string;
    included_label: string;
    services_cards: ServiceCard[];
    cta_services_title: string;
    cta_services_desc: string;
    cta_services_btn: string;
    process_title: string;
    process_optional_label: string;
    process_steps: ProcessStep[];
    company_title: string;
    company_desc: string[];
    company_items: string[];
    why_choose_title: string;
    why_choose_cards: WhyChooseCard[];
    cta_hiring_title: string;
    cta_hiring_desc: string;
    cta_hiring_btn: string;
    faqs: Faq[];
    cta_journey_title: string;
    cta_journey_desc: string;
    cta_journey_btn: string;
}

export default function ImmigrationServicePage({ lang }: { lang: string }) {
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    const c = (t as any).practice_content?.["immigration-residence-services"] as ImmigrationContent;

    const faqSchemaMarkup =
        c.faqs && c.faqs.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: c.faqs.map((faq) => ({
                      "@type": "Question",
                      name: faq.question,
                      acceptedAnswer: { "@type": "Answer", text: faq.answer },
                  })),
              }
            : null;

    return (
        <div className="min-h-screen bg-[#F4F7FB] pb-12">
            {faqSchemaMarkup && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaMarkup) }}
                />
            )}

            {/* ── Breadcrumbs and Hero ── */}
            <div className="container mx-auto px-4 md:px-8 pt-36 pb-6">
                <div className="relative bg-gradient-to-br from-[#003D7A] via-[#005CB9] to-[#0070DB] rounded-[2rem] overflow-hidden shadow-xl pt-8 pb-16 px-6 md:pt-10 md:pb-24 md:px-12 text-white">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                    <Breadcrumbs
                        className="relative z-10"
                        items={[
                            { label: t.cat_legal_services || "Legal Services", href: "/legal-services" },
                            { label: c.title },
                        ]}
                    />

                    <div className="max-w-5xl mx-auto relative z-10 space-y-6 text-center">
                        <h1 className="text-3xl md:text-[52px] font-extrabold tracking-tight leading-tight max-w-5xl mx-auto">
                            {c.hero_title}
                        </h1>
                        {c.hero_subtitle && (
                            <p className="text-white text-base md:text-xl font-semibold leading-snug max-w-5xl mx-auto">
                                {c.hero_subtitle}
                            </p>
                        )}
                        <p className="text-blue-100 text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-5xl mx-auto">
                            {(() => {
                                const firmName = "Retrieve Legal & Tax";
                                const parts = c.hero_desc.split(firmName);
                                if (parts.length < 2) return c.hero_desc;
                                return (
                                    <>
                                        {parts[0]}
                                        <Link
                                            href="/"
                                            className="underline decoration-blue-300 underline-offset-2 font-bold text-white hover:text-blue-200 transition-colors"
                                        >
                                            {firmName}
                                        </Link>
                                        {parts.slice(1).join(firmName)}
                                    </>
                                );
                            })()}
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/contact"
                                className="inline-block bg-white text-[#005CB9] hover:bg-gray-50 font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
                            >
                                {c.hero_btn}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section 1: Immigration Law and Relocation ── */}
            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Left: text content */}
                        <div className="p-8 md:p-12 flex flex-col justify-center space-y-5">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {c.intro_title}
                            </h2>
                            <p className="text-gray-800 font-semibold text-base leading-relaxed">
                                {c.intro_lead}
                            </p>
                            <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                                {c.intro_body}
                            </p>
                        </div>
                        {/* Right: image */}
                        <div className="relative min-h-[300px] lg:min-h-0 p-6 lg:p-8 flex items-center justify-center">
                            <img
                                src="https://wp.retrieve.am/wp-content/uploads/2026/06/desired3-image.jpeg"
                                alt={c.intro_title}
                                className="w-full h-full object-cover rounded-2xl"
                                style={{ maxHeight: "420px" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 2: Our Immigration Services ── */}
            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        {c.services_title}
                    </h2>
                    <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                        {c.services_intro}
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {c.services_cards.map((card, idx) => {
                        const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length];
                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all flex flex-col text-left"
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-blue-50 p-2.5 rounded-2xl text-[#005CB9] shrink-0">
                                        <Icon size={22} strokeWidth={2.25} />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                                        {card.title}
                                    </h3>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {card.body.map((p, i) => (
                                        <p key={i} className="text-gray-600 text-sm font-medium leading-relaxed">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-auto border-t border-gray-100 pt-5">
                                    <p className="text-xs font-bold uppercase tracking-wide text-[#005CB9] mb-3">
                                        {c.included_label}
                                    </p>
                                    <ul className="space-y-2.5">
                                        {card.included.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2.5">
                                                <CheckCircle2
                                                    size={18}
                                                    strokeWidth={2.5}
                                                    className="text-[#005CB9] shrink-0 mt-0.5"
                                                />
                                                <span className="text-gray-700 text-sm font-medium leading-relaxed">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── CTA: Looking to obtain residency / citizenship ── */}
            <section className="container mx-auto px-4 md:px-8 py-6 text-center">
                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                    <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10 text-left">
                        <div className="space-y-4 max-w-3xl">
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                                {c.cta_services_title}
                            </h3>
                            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
                                {c.cta_services_desc}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href="/contact"
                                className="inline-block bg-[#005CB9] hover:bg-[#004791] text-white font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
                            >
                                {c.cta_services_btn}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Step-by-Step Process ── */}
            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight text-center mb-12">
                    {c.process_title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {c.process_steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-7 text-left"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#005CB9] text-white font-extrabold text-base shrink-0">
                                    {idx + 1}
                                </div>
                                {step.optional && (
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#005CB9] bg-blue-50 rounded-full px-2.5 py-1">
                                        {c.process_optional_label}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Section 4: Immigration Support for Companies ── */}
            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left: text content */}
                        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {c.company_title}
                            </h2>
                            <div className="space-y-3 text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                                {c.company_desc.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                            <ul className="space-y-3">
                                {c.company_items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2
                                            size={20}
                                            strokeWidth={2.5}
                                            className="text-[#005CB9] shrink-0"
                                        />
                                        <span className="text-gray-900 font-bold text-sm md:text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Right: image */}
                        <div className="relative min-h-[320px] lg:min-h-0">
                            <img
                                src="https://wp.retrieve.am/wp-content/uploads/2026/06/Immigration-Support-for-Companies-in-Armenia.jpg"
                                alt={c.company_title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 5: Why Choose Our Immigration Lawyers ── */}
            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
                <div className="max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        {c.why_choose_title}
                    </h2>
                </div>
                <div className="flex flex-wrap justify-center gap-6 w-full">
                    {c.why_choose_cards.map((card, idx) => (
                        <div
                            key={idx}
                            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-all flex flex-col items-start text-left"
                        >
                            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3">{card.title}</h3>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA: Hiring foreign employees ── */}
            <section className="container mx-auto px-4 md:px-8 py-6 text-center">
                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[radial-gradient(#005CB9_3px,transparent_3px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                    <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10 text-left">
                        <div className="space-y-4 max-w-3xl">
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                                {c.cta_hiring_title}
                            </h3>
                            <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
                                {c.cta_hiring_desc}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link
                                href="/contact"
                                className="inline-block bg-[#005CB9] hover:bg-[#004791] text-white font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
                            >
                                {c.cta_hiring_btn}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 6: FAQs ── */}
            {c.faqs && c.faqs.length > 0 && (
                <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 tracking-tight">
                        {t.faqs}
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-4 w-full">
                        {c.faqs.map((faq, idx) => (
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

            {/* ── Final CTA ── */}
            <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
                <div className="relative bg-gradient-to-br from-[#E8F1FC] via-[#F1F6FC] to-[#E8F1FC] rounded-3xl p-8 md:p-12 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-200/20 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-200/20 blur-2xl pointer-events-none" />
                    <div className="relative z-10 text-left max-w-3xl space-y-4">
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                            {c.cta_journey_title}
                        </h3>
                        <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed">
                            {c.cta_journey_desc}
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-[#005CB9] hover:bg-[#004791] text-white font-bold text-sm md:text-base rounded-full px-8 py-4 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
                        >
                            {c.cta_journey_btn}
                            <ArrowRight size={18} strokeWidth={2.5} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
