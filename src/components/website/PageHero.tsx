"use client";

import { useTranslation } from "react-i18next";

interface PageHeroProps {
    titleKey: string;
    subtitleKey: string;
    className?: string;
}

export default function PageHero({ titleKey, subtitleKey, className }: PageHeroProps) {
    const { t } = useTranslation();

    return (
        <div className={`bg-gray-50 py-16 ${className ?? ""}`}>
            <div className="container mx-auto px-4 md:px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-6 text-center">
                    {t(titleKey)}
                </h1>
                <div className="w-24 h-1 bg-[#1e3a8a] mx-auto mb-8"></div>
                <p className="text-gray-600 text-center max-w-3xl mx-auto text-lg">
                    {t(subtitleKey)}
                </p>
            </div>
        </div>
    );
}
