"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calculator, Landmark, TrendingUp, Handshake, ArrowRight } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface TaxAdvisoryServicesProps {
    services?: { label: string; url: string }[];
}

export default function TaxAdvisoryServices({ services = [] }: TaxAdvisoryServicesProps) {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Hardcode generic info based on strings to match ExpertAreas style
    const getServiceData = (label: string) => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes("accounting")) return { icon: Calculator, desc: "Comprehensive bookkeeping and financial reporting." };
        if (lowerLabel.includes("advisory") && lowerLabel.includes("tax")) return { icon: Landmark, desc: "Strategic tax planning and compliance." };
        if (lowerLabel.includes("finance")) return { icon: TrendingUp, desc: "Corporate finance strategy and capital management." };
        if (lowerLabel.includes("m&a")) return { icon: Handshake, desc: "Mergers, acquisitions, and restructuring support." };
        return { icon: Landmark, desc: "Professional advisory services." };
    };

    if (!services || services.length === 0) return null;

    return (
        <section className="py-24 bg-[#F4F6F8] relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 relative z-10">

                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Side: Copy */}
                    <div className="w-full lg:w-5/12 sticky top-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                        >
                            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">
                                {t("tax_advisory_subtitle") || "Strategic Growth"}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-950 mb-6 tracking-tight leading-tight">
                                {t("tax_advisory_title") || "Tax & Business Advisory Services"}
                            </h2>
                            <div className="w-20 h-1.5 bg-primary/20 rounded-full overflow-hidden mb-8">
                                <div className="w-1/2 h-full bg-primary rounded-full"></div>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                {t("tax_advisory_desc") || "Navigate complex financial landscapes with our expert tax consultants and business advisors. We provide actionable strategies to optimize your operational structures."}
                            </p>
                            <Button className="rounded-full px-8 shadow-soft" asChild>
                                <Link href="https://retrieve.am/legal-services/">
                                    {t("btn_contact_advisory") || "Schedule a Consultation"}
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Side: Accordion Opening Logic */}
                    <div className="w-full lg:w-7/12 flex flex-col gap-4">
                        {services.map((service, index) => {
                            const data = getServiceData(service.label);
                            const isActive = openIndex === index;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={cn(
                                        "bg-white border rounded-2xl overflow-hidden shadow-sm transition-all duration-300",
                                        isActive ? "border-primary/30 shadow-medium" : "border-gray-100 hover:border-gray-300"
                                    )}
                                >
                                    <button
                                        onClick={() => setOpenIndex(isActive ? null : index)}
                                        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                                isActive ? "bg-primary text-white" : "bg-blue-50 text-primary"
                                            )}>
                                                <data.icon size={24} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{service.label}</h3>
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className={cn("text-gray-400 transition-transform duration-300", isActive && "rotate-180 text-primary")}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-6 pb-6 pt-2 pl-[88px] border-t border-gray-50">
                                                    <p className="text-gray-600 mb-4">{data.desc}</p>
                                                    <Link href={service.url} className="inline-flex items-center gap-2 font-semibold text-primary hover:text-blue-800 transition-colors text-sm">
                                                        {t("btn_learn_more") || "Explore Details"} <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
