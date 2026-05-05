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
    return getYoastMetadata("/tax-and-business-advisory-services", lang);
}

export const dynamic = "force-dynamic";

export default async function TaxAdvisoryServicesPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const items = await getPortfolioItems(lang);

    const sortedItems = [...items].sort((a, b) => a.title.localeCompare(b.title));

    const taxAdvisoryServicesItems = sortedItems.filter(item => item.category === "Tax & Business advisory services");

    return (
        <div className="pt-40 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 md:px-8 mb-8">
                <div className="flex justify-between items-center">
                    <Breadcrumbs 
                        items={[{ label: (dictionaries[lang] as any).cat_tax_advisory_services || "Tax & Business Advisory Services" }]} 
                        theme="light"
                    />
                    <Link 
                        href="/legal-services"
                        className="text-[#005CB9] hover:text-[#004791] font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                        {(dictionaries[lang] as any).portfolio_legal_services || "Legal Services"}
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {(dictionaries[lang] as any).cat_tax_advisory_services || "Tax & Business Advisory Services"}
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                        {(dictionaries[lang] as any).page_tax_business_advisory_description || "Managing taxes and business finances in Armenia requires more than numbers — it requires strategy. Retrieve Legal & Tax brings together experienced advisors across accounting, tax planning, corporate finance, and M&A advisory. Whether you are a startup, growing business, or individual, we deliver tailored financial solutions that keep you compliant, competitive, and positioned for long-term growth."}
                    </p>
                </div>
                
                {/* Service Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {taxAdvisoryServicesItems.map((item, idx) => (
                        <PortfolioCard key={`${item.slug}-${idx}`} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
