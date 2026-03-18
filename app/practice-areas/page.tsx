import { cookies } from "next/headers";
import PracticeAreasGrid from "@/components/website/PracticeAreasGrid";
import { getPortfolioItems } from "@/lib/wordpress";
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
    const t = dictionaries[lang] || dictionaries.en;

    return {
        title: `${t.page_practice_areas_title} | Retrieve Legal & Tax`,
        description: t.page_practice_areas_subtitle,
    };
}

export default async function PracticeAreasPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const t = dictionaries[lang] || dictionaries.en;
    const items = await getPortfolioItems(lang);

    return (
        <div className="pt-24 min-h-screen bg-gray-50">
            <PracticeAreasGrid items={items} />
        </div>
    );
}
