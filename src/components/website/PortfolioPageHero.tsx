"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";

export default function PortfolioPageHero() {
    const { t } = useTranslation();
    return (
        <Section className="bg-gradient-to-br from-primary via-primary-dark to-primary-darker text-white pt-44 pb-20">
            <div className="max-w-4xl mx-auto text-center">
                <Link
                    href="/"
                    className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    {t("page_portfolio_back_home")}
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("page_portfolio_title")}</h1>
                <p className="text-xl text-white/90 leading-relaxed">
                    {t("page_portfolio_subtitle")}
                </p>
            </div>
        </Section>
    );
}
