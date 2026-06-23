"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Scale, Globe } from "lucide-react";

const MAIN_PHOTO = "https://wp.retrieve.am/wp-content/uploads/2026/04/Law-Firm-in-Yerevan.jpg";

export default function AboutPreviewNew() {
    const { t } = useTranslation();

    const stats = [
        { icon: Briefcase, value: "10+",  label: t("about_us_stat_experience", { defaultValue: "Years" }) },
        { icon: Scale,     value: "500+", label: t("about_us_stat_cases",      { defaultValue: "Cases" }) },
        { icon: Globe,     value: "120+", label: t("about_us_stat_partners",   { defaultValue: "Partners" }) },
    ];

    return (
        <section className="relative py-20 md:py-28 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* ── LEFT: Single image ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-6 relative h-[320px] sm:h-[450px] md:h-[560px]"
                    >
                        <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl z-0" />
                        <div className="relative w-[85%] h-[80%] overflow-hidden z-10">
                            <Image
                                src={MAIN_PHOTO}
                                alt="Law Firm in Yerevan"
                                fill
                                className="object-contain p-6 transition-transform duration-700"
                                sizes="(max-width: 1024px) 70vw, 35vw"
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* ── RIGHT: Text content ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="lg:col-span-6 space-y-8"
                    >
                        {/* Eyebrow */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-px bg-[#005CB9]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#005CB9]">
                                Est. 2014 · Yerevan
                            </span>
                        </div>

                        {/* Heading — with left accent bar */}
                        <div className="flex gap-5 items-start">
                            <div className="w-1 shrink-0 self-stretch rounded-full bg-[#005CB9] mt-1" />
                            <h2 className="text-3xl md:text-4xl xl:text-[2.75rem] font-black text-[#050F1E] leading-tight tracking-tight">
                                {t("about_preview_title")}
                            </h2>
                        </div>

                        {/* Body */}
                        <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium">
                            {t("about_preview_text_1")}
                        </p>

                        {/* Stats row */}
                        <div className="flex items-center gap-0 divide-x divide-gray-200 border border-gray-100 rounded-2xl overflow-hidden bg-[#F8FAFB]">
                            {stats.map((s, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1 py-5 px-3">
                                    <span className="text-2xl font-black text-[#005CB9] leading-none">{s.value}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{s.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link
                            href="/about-us"
                            className="inline-flex items-center gap-2.5 bg-[#005CB9] hover:bg-[#004791] text-white font-bold text-sm rounded-full px-8 py-4 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {t("btn_about_us")}
                            <ArrowRight size={16} />
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}