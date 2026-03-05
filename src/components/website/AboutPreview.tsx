"use client";

import { useTranslation } from "react-i18next";

export default function AboutPreview() {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                    <div className="relative h-[400px] w-full bg-gray-200 rounded-md overflow-hidden">
                        {/* Placeholder for about image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            About Us Image
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-6">{t("about_title")}</h2>
                    <div className="w-20 h-1 bg-[#1e3a8a] mb-8"></div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {t("about_text_1")}
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#1e3a8a] rounded-full"></div>
                            <span className="text-gray-700 font-medium">{t("about_bullet_1")}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#1e3a8a] rounded-full"></div>
                            <span className="text-gray-700 font-medium">{t("about_bullet_2")}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#1e3a8a] rounded-full"></div>
                            <span className="text-gray-700 font-medium">{t("about_bullet_3")}</span>
                        </li>
                    </ul>
                    <a href="/about" className="bg-[#1e3a8a] text-white px-8 py-3 font-medium hover:bg-blue-900 transition-colors uppercase text-sm tracking-wide rounded-sm inline-block">
                        {t("btn_about_learn_more")}
                    </a>
                </div>
            </div>
        </section>
    );
}
