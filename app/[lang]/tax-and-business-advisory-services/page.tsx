import { cookies } from "next/headers";
import PracticeAreasGrid from "@/components/website/PracticeAreasGrid";
import { getPortfolioItems, getYoastMetadata } from "@/lib/wordpress";
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

    return (
        <div className="pt-40 min-h-screen bg-gray-50">
            <PracticeAreasGrid items={sortedItems} activeCategory="Tax & Business advisory services" />
        </div>
    );
}
