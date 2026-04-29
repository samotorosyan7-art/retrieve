"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import InteractiveIntake from "@/components/website/InteractiveIntake";

export default function Hero() {
    const { t, i18n } = useTranslation();
    const isSmallLang = i18n.language === "am" || i18n.language === "ru";

    return (
        <section className="relative w-full min-h-[85vh] lg:min-h-[800px] flex items-center overflow-hidden pt-36 sm:pt-44 lg:pt-52 bg-gray-900 z-0">
            {/* Hero Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://wp.retrieve.am/wp-content/uploads/2026/04/Law-Firm-Armenia.jpg"
                    alt="Law Firm Armenia"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/80 to-transparent z-[2]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-20 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Content Column */}
                    <div className="flex-1 w-full max-w-2xl text-left relative z-30">
                        <h1 className={cn(
                            "font-extrabold leading-[1.15] md:leading-[1.1] mb-6 text-white tracking-tight",
                            isSmallLang
                                ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                                : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                        )}>
                            {t("hero_title_full")}
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-10 leading-relaxed max-w-xl">
                            {t("hero_subtitle")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                            {/* THE BLUE BUTTON */}
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full px-8 md:px-10 h-14 md:h-16 text-sm md:text-base font-bold text-white bg-[#005CB9] hover:bg-[#004791] shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto active:scale-95"
                            >
                                {t("btn_book_consultation")}
                            </Link>
                            
                            <Link
                                href="/legal-services"
                                className="inline-flex items-center justify-center rounded-full px-8 md:px-10 h-14 md:h-16 text-sm md:text-base font-bold text-white bg-transparent border-2 border-white/80 hover:border-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto active:scale-95"
                            >
                                {t("btn_learn_more")}
                            </Link>
                        </div>
                    </div>

                    {/* Intake Column */}
                    <div className="w-full lg:w-[450px] flex-shrink-0 lg:ml-auto relative z-10 pb-12 lg:pb-0">
                        <div className="transform-none lg:hover:-translate-y-2 transition-transform duration-500">
                            <InteractiveIntake />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
