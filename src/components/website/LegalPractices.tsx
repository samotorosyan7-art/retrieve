"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "@/components/ui/LocalizedLink";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import PortfolioCard from "@/components/ui/PortfolioCard";
import { PortfolioItem } from "@/types/wordpress";

interface LegalPracticesProps {
    items?: PortfolioItem[];
}

export default function LegalPractices({ items = [] }: LegalPracticesProps) {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yTransform = useTransform(scrollYProgress, [0, 1], [50, -50]);

    if (!items || items.length === 0) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.3, duration: 0.6 } }
    };

    return (
        <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">
                        {t("legal_practices_subtitle") || "Specialized Expertise"}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-6 tracking-tight">
                        {t("page_legal_services_title")}
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        {t("legal_services_description")}
                    </p>
                    <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-primary rounded-full"></div>
                    </div>
                </motion.div>

                <motion.div
                    style={{ y: yTransform }}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {items.slice(0, 8).map((item, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <PortfolioCard item={item} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <Button variant="outline" size="lg" asChild className="rounded-full px-10 border-[#005CB9] text-[#005CB9] hover:bg-[#005CB9] hover:text-white hover:border-[#005CB9] transition-colors shadow-sm">
                        <Link href="/legal-services">
                            {t("btn_view_all_practices")}
                        </Link>
                    </Button>
                </motion.div>

            </div>
        </section>
    );
}
