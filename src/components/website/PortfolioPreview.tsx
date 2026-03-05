"use client";

import { Section } from "@/components/ui/Section";
import PortfolioGrid from "@/components/website/PortfolioGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PortfolioItem } from "@/types/wordpress";

interface PortfolioPreviewProps {
    items: PortfolioItem[];
}

export default function PortfolioPreview({ items }: PortfolioPreviewProps) {
    const { t } = useTranslation();

    return (
        <Section className="bg-white py-20">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t("portfolio_title")}</h2>
                <div className="w-20 h-1.5 bg-primary/20 rounded-full mx-auto mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-primary rounded-full"></div>
                </div>
                <p className="text-gray-500 leading-relaxed text-lg">
                    {t("portfolio_subtitle")}
                </p>
            </div>

            <PortfolioGrid items={items} showCategories={true} limit={undefined} />

            <div className="text-center mt-12">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-colors font-semibold"
                >
                    {t("btn_view_all_portfolio")}
                    <ArrowRight size={18} />
                </Link>
            </div>
        </Section>
    );
}
