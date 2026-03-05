"use client";

import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";

export default function TeamPageHero() {
    const { t } = useTranslation();
    return (
        <Section className="bg-gradient-to-br from-primary/5 via-white to-primary/5 pt-32 pb-16">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("page_team_title")}</h1>
                <div className="w-20 h-1.5 bg-primary/20 rounded-full mx-auto mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-primary rounded-full"></div>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                    {t("page_team_subtitle")}
                </p>
            </div>
        </Section>
    );
}
