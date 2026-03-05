"use client";

import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import PortfolioGrid from "@/components/website/PortfolioGrid";
import { PortfolioItem } from "@/types/wordpress";

export default function PortfolioPageBody({ items }: { items: PortfolioItem[] }) {
    const { t } = useTranslation();
    return (
        <Section className="bg-gray-50 py-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                    {t("page_portfolio_practice_areas")}
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    {t("page_portfolio_practice_areas_subtitle")}
                </p>
            </div>
            <PortfolioGrid items={items} showCategories={true} />
        </Section>
    );
}
