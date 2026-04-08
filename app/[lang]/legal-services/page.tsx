import { cookies } from "next/headers";
import PracticeAreasGrid from "@/components/website/PracticeAreasGrid";
import { getPortfolioItems, getYoastMetadata } from "@/lib/wordpress";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
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

    return (
        <div className="pt-40 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 md:px-8 mb-8">
                <Breadcrumbs 
                    items={[{ label: (dictionaries[lang] as any).cat_legal_services || "Legal Services" }]} 
                    theme="light"
                />
            </div>
            <PracticeAreasGrid items={sortedItems} activeCategory="Legal services" />
        </div>
    );
}
