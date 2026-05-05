import { cookies } from "next/headers";
import { getPortfolioItems, getYoastMetadata } from "@/lib/wordpress";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PortfolioCard from "@/components/ui/PortfolioCard";
import Link from "@/components/ui/LocalizedLink";
import { ArrowRight } from "lucide-react";
import enCommon from "@/locales/en/common.json";
import ruCommon from "@/locales/ru/common.json";
import amCommon from "@/locales/am/common.json";

const dictionaries = {
    en: enCommon,
    ru: ruCommon,
    am: amCommon,
} as const;

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    return getYoastMetadata("/legal-services", lang);
}

export const dynamic = "force-dynamic";

export default async function LegalServicesPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const items = await getPortfolioItems(lang);

    const orderSlugs = [
        "corporate-business-law",
        "immigration-residence-services",
        "employment-law",
        "intellectual-property-law",
        "real-estate-construction-law",
        "investment-law",
        "arbitration-ligitation"
    ];

    const sortedItems = [...items].sort((a, b) => {
        const aIdx = orderSlugs.indexOf(a.slug);
        const bIdx = orderSlugs.indexOf(b.slug);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return 0;
    });

    const legalServicesItems = sortedItems.filter(item => item.category === "Legal services");

    return (
        <div className="pt-40 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 md:px-8 mb-8">
                <div className="flex justify-between items-center">
                    <Breadcrumbs 
                        items={[{ label: (dictionaries[lang] as any).cat_legal_services || "Legal Services" }]} 
                        theme="light"
                    />
                    <Link 
                        href="/tax-and-business-advisory-services"
                        className="text-[#005CB9] hover:text-[#004791] font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                        {(dictionaries[lang] as any).portfolio_tax_services || "Tax & Business Advisory Services"}
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {(dictionaries[lang] as any).cat_legal_services || "Legal Services"}
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                        {(dictionaries[lang] as any).page_legal_services_description || "Navigating legal complexities in Armenia requires trusted expertise. Retrieve Legal & Tax offers comprehensive legal services, bringing together seasoned attorneys across diverse practice areas — from business formation and real estate to arbitration, banking, and cryptocurrency law. We deliver clear, practical legal solutions that protect your interests and support your long-term goals."}
                    </p>
                </div>
                
                {/* Service Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {legalServicesItems.map((item, idx) => (
                        <PortfolioCard key={`${item.slug}-${idx}`} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
