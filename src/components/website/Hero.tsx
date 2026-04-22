"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import InteractiveIntake from "@/components/website/InteractiveIntake";

export default function Hero() {
    const { t, i18n } = useTranslation();
    const isSmallLang = i18n.language === "am" || i18n.language === "ru";

    return (
        <section className="relative w-full min-h-[85vh] lg:min-h-[800px] flex items-center bg-gray-50 overflow-hidden pt-44 lg:pt-48">
            {/* Background elements (Soft SaaS style instead of dark overlay) */}
            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white to-[#F4F6F8] z-0"></div>
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[80px] pointer-events-none"></div>
            

            <div className="container mx-auto px-4 md:px-8 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Column: Dominant H1, Subheading, CTAs */}
                    <div className="flex-1 w-full max-w-2xl text-left animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white shadow-sm rounded-full border border-gray-100 mb-8 mt-4 lg:mt-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                {t("hero_badge")}
                            </span>
                        </div>

                        <h1 className={cn(
                            "font-extrabold leading-[1.1] mb-6 text-gray-950 tracking-tight",
                            isSmallLang 
                                ? "text-3xl md:text-4xl lg:text-5xl" 
                                : "text-4xl md:text-5xl lg:text-5xl"
                        )}>
                            {t("hero_title_full")}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                            {t("hero_subtitle")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="rounded-full px-8 h-14 w-full sm:w-auto text-base hover:scale-105 shadow-soft hover:shadow-elevated transition-transform" asChild>
                                <Link href="/contact">
                                    {t("btn_book_consultation")}
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 w-full sm:w-auto text-base border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all" asChild>
                                <Link href="/legal-services">
                                    {t("btn_learn_more")}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Floating Interactive Intake Card */}
                    <div className="w-full lg:w-[450px] flex-shrink-0 lg:ml-auto animate-fade-in-up lg:animate-fade-in-left animation-delay-300 pb-16 lg:pb-0">
                        <div className="transform hover:-translate-y-2 transition-transform duration-500 will-change-transform">
                            <InteractiveIntake />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
