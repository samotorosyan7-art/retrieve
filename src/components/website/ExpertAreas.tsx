"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Scale, Globe, FileText, Shield, Users, ArrowRight } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function ExpertAreas() {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    // subtle scroll-velocity antigravity effect for the whole grid
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Cards move up slightly as you scroll past them
    const yTransform = useTransform(scrollYProgress, [0, 1], [50, -50]);

    const practices = [
        { icon: Briefcase, title: t("practice_corp_title") || "Corporate", description: t("practice_corp_desc") || "M&A, Contracts", link: "/practice-areas/corporate" },
        { icon: Scale, title: t("practice_tax_title") || "Tax Law", description: t("practice_tax_desc") || "Planning & Compliance", link: "/practice-areas/tax" },
        { icon: Globe, title: t("practice_imm_title") || "Immigration", description: t("practice_imm_desc") || "Visas & Relocation", link: "/practice-areas/immigration" },
        { icon: FileText, title: t("practice_real_title") || "Real Estate", description: t("practice_real_desc") || "Transactions & Leases", link: "/practice-areas/real-estate" },
        { icon: Shield, title: t("practice_ip_title") || "Intellectual Property", description: t("practice_ip_desc") || "Trademarks", link: "/practice-areas/ip" },
        { icon: Users, title: t("practice_labor_title") || "Labor Law", description: t("practice_labor_desc") || "Employment Contracts", link: "/practice-areas/labor" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.4, duration: 0.8 } }
    };

    return (
        <section ref={sectionRef} className="py-24 bg-[#F4F6F8] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* Header Sequence */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-6 tracking-tight">
                        {t("expert_areas_title")}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto">
                        {t("expert_areas_desc") || "Explore our core solution areas designed to mitigate risk and drive operational excellence."}
                    </p>
                </motion.div>

                {/* Grid Sequence with Antigravity */}
                <motion.div
                    style={{ y: yTransform }}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {practices.map((practice, index) => (
                        <motion.div key={index} variants={itemVariants} className="h-full">
                            <div className="group h-full bg-white border border-gray-100 rounded-2xl p-8 shadow-soft hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 flex flex-col will-change-transform cursor-pointer relative overflow-hidden">

                                {/* Background glow effect on hover */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] transform translate-x-16 -translate-y-16 group-hover:bg-primary/10 transition-colors duration-500"></div>

                                <div className="w-14 h-14 bg-[#F4F6F8] text-primary rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-sm relative z-10">
                                    <practice.icon size={28} strokeWidth={1.5} />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors relative z-10">
                                    {practice.title}
                                </h3>

                                <p className="text-gray-500 leading-relaxed mb-8 flex-grow relative z-10">
                                    {practice.description}
                                </p>

                                <Link href={practice.link} className="inline-flex items-center gap-2 font-semibold text-primary mt-auto relative z-10 w-fit pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                                    {t("btn_learn_more")} <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-center mt-20"
                >
                    <Button variant="outline" size="lg" asChild className="rounded-full px-10 border-gray-200 text-gray-700 hover:bg-white hover:text-primary transition-colors shadow-sm">
                        <Link href="/legal-services">
                            {t("btn_view_all_practices") || "View All Solutions"}
                        </Link>
                    </Button>
                </motion.div>

            </div>
        </section>
    );
}
