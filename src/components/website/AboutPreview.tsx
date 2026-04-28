"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function AboutPreviewNew() {
    const { t } = useTranslation();

    return (
        <section className="relative py-20 md:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Column: 2 Overlapping Images */}
                    <div className="w-full lg:w-1/2 flex-shrink-0">
                        <div className="relative h-[320px] sm:h-[450px] md:h-[600px] w-full">
                            {/* Main large image */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="absolute left-0 top-0 w-[85%] h-[80%] rounded-[2rem] overflow-hidden bg-gray-50 shadow-2xl z-10 border-8 border-white"
                            >
                                <Image
                                    src="https://wp.retrieve.am/wp-content/uploads/2026/04/Law-Firm-in-Yerevan.jpg"
                                    alt="Law-Firm-in-Yerevan"
                                    fill
                                    className="object-contain p-6 transition-transform duration-700"
                                    sizes="(max-width: 768px) 70vw, 35vw"
                                />
                            </motion.div>

                            {/* Smaller overlapping image - NEW URL */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="absolute right-0 bottom-0 w-[55%] h-[65%] rounded-[2rem] overflow-hidden bg-gray-50 shadow-2xl z-20 border-8 border-white"
                            >
                                <Image
                                    src="https://wp.retrieve.am/wp-content/uploads/2026/04/Law-Firm-Retrieve-Team-1.jpg"
                                    alt="Law-Firm-Retrieve-Team"
                                    fill
                                    className="object-cover transition-transform duration-700"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </motion.div>

                            {/* Abstract accent shape */}
                            <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl z-0"></div>
                        </div>
                    </div>

                    {/* Right Column: Text content */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                                {t("about_preview_title")}
                            </h2>

                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    {t("about_preview_text_1")}
                                </p>
                                <p>
                                    {t("about_preview_text_2")}
                                </p>
                            </div>

                            <div className="mt-10 h-1.5 w-24 bg-primary rounded-full mb-10"></div>

                            <Button asChild className="rounded-full px-10 h-14 text-base font-bold bg-[#005CB9] text-white hover:bg-[#004a96] shadow-xl hover:shadow-2xl transition-all duration-300">
                                <Link href="/about-us" className="flex items-center gap-2">
                                    {t("btn_about_us")} <ArrowRight size={18} />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
