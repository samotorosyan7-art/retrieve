import { getWPPageBySlug, getYoastMetadata } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "@/components/ui/LocalizedLink";
import { ArrowLeft } from "lucide-react";
import en from "@/locales/en/common.json";
import hy from "@/locales/hy/common.json";
import ru from "@/locales/ru/common.json";

const dictionaries = { en, hy, ru };

const staticTitles: Record<string, string> = {
    en: "Privacy Policy",
    ru: "Политика конфиденциальности",
    hy: "Գաղտնիության քաղաքականություն",
};

const lastUpdatedText: Record<string, string> = {
    en: "Last updated: 19.05.2026",
    ru: "Последнее обновление: 19.05.2026",
    hy: "Վերջին թարմացումը՝ 19.05.2026",
};

const armenianCorrections: Record<string, string> = {
    "ՍույնԳաղտնիության": "Սույն Գաղտնիության",
    "կայքիայցելուների": "կայքի այցելուների",
    "անձնականտվյալները": "անձնական տվյալները",
    "Գաղտնիությանքաղաքականությունը": "Գաղտնիության քաղաքականությունը",
    "նույնականացմանհամարներ": "նույնականացման համարներ",
    "մասինտեղեկատվություն": "մասին տեղեկատվություն",
    "մանդատիշրջանակում": "մանդատի շրջանակում",
    "պայմանագրայինփաստաթղթեր": "պայմանագրային փաստաթղթեր",
    "կամխորհրդատվությունների": "կամ խորհրդատվությունների",
    "սարքինույնականացուցիչները": "սարքի նույնականացուցիչները",
    "համապատասխանությանտվյալների": "համապատասխանության տվյալների",
    "կարգավորողպահանջներին": "կարգավորող պահանջներին",
    "խարդախությունըկանխելու": "խարդախությունը կանխելու",
    "հետևյալնպատակներով": "հետևյալ նպատակներով",
    "պատշաճուսումնասիրության": "պատշաճ ուսումնասիրության",
    "գործողօրենսդրության": "գործող օրենսդրության",
    "պայմաններիկիրառում": "պայմանների կիրառում",
    "նրանքպարտավորված": "նրանք պարտավորված",
    "օրենքովպահանջվող": "օրենքով պահանջվող",
    "ամպայինպահեստավորում": "ամպային պահեստավորում",
    "համաձայնագրերիհիման": "համաձայնագրերի հիման",
    "կամվերակազմակերպման": "կամ վերակազմակերպման",
    "մերգործընկերները": "մեր գործընկերները",
    "ստանդարտպայմանագրային": "ստանդարտ պայմանագրային",
    "ծառայությանավարտից": "ծառայության ավարտից",
    "կամբաժանորդագրությունից": "կամ բաժանորդագրությունից",
    "հետևյալիրավունքները": "հետևյալ իրավունքները",
    "պահպանմանպարտավորությունների": "պահպանման պարտավորությունների",
    "տվյալներիպաշտպանության": "տվյալների պաշտպանության",
    "կազմակերպչականմիջոցներ": "կազմակերպչական միջոցներ",
    "անվտանգկապուղիներ": "անվտանգ կապուղիներ",
    "Մենքպատասխանատվություն": "Մենք պատասխանատվություն",
    "գաղտնիությանքաղաքականության": "գաղտնիության քաղաքականության",
    "շարունակականօգտագործումը": "շարունակական օգտագործումը",
    "Ձերհամաձայնությունը": "Ձեր համաձայնությունը"
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    // Russian is mapped to "practice-area-1", Armenian to "practice-area-2", English/others to "privacy-policy"
    const slug = lang === "ru" ? "practice-area-1" : lang === "hy" ? "practice-area-2" : "privacy-policy";
    return getYoastMetadata(`/${slug}`, lang);
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    
    // Fetch dynamically from WP: ru -> practice-area-1, hy -> practice-area-2, others -> privacy-policy
    const slug = lang === "ru" ? "practice-area-1" : lang === "hy" ? "practice-area-2" : "privacy-policy";
    const page = await getWPPageBySlug(slug, lang);

    if (!page) {
        notFound();
    }

    const title = staticTitles[lang] || staticTitles.en;
    // Clean all non-breaking spaces (&nbsp; and unicode \u00a0) to allow proper word-wrap in the browser
    let cleanContent = page.content
        .replace(/&nbsp;/g, " ")
        .replace(/\u00a0/g, " ");

    if (lang === "hy") {
        Object.entries(armenianCorrections).forEach(([connected, corrected]) => {
            cleanContent = cleanContent.split(connected).join(corrected);
        });
    }

    return (
        <div className="min-h-screen bg-[#F4F7FB] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-44 pb-20">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight break-words">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 md:px-8 -mt-10 pb-24 relative z-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-16">
                            <article 
                                className="blog-content prose prose-lg max-w-none text-gray-700 break-words w-full overflow-hidden
                                    prose-headings:font-extrabold prose-headings:text-gray-900
                                    prose-h2:text-2xl prose-h2:attorna-page-title prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-100
                                    prose-h3:text-xl prose-h3:font-bold prose-h3:mt-10 prose-h3:mb-4
                                    prose-strong:text-gray-900
                                    prose-p:mb-6 prose-p:leading-relaxed
                                    prose-li:marker:text-[#005CB9]
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#005CB9] prose-blockquote:bg-blue-50/50 prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic"
                                dangerouslySetInnerHTML={{ __html: cleanContent }}
                            />
                        </div>
                        
                        {/* Footer Section in Card */}
                        <div className="bg-gray-50/80 border-t border-gray-100 p-8 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#005CB9] transition-all">
                                <ArrowLeft size={16} /> {t.btn_back_home || "Back to Home"}
                            </Link>
                            <p className="text-xs text-gray-400 font-medium italic">
                                {lastUpdatedText[lang] || lastUpdatedText.en}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
