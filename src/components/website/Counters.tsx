"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";

import { useEffect } from "react";
import { useMotionValue, useTransform, animate } from "framer-motion";

// Custom hook for number counting animation
const Counter = ({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        if (isInView) {
            animate(count, value, {
                duration: 2,
                ease: "easeOut"
            });
        }
    }, [isInView, value, count]);

    return (
        <div ref={ref} className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-soft border border-gray-100 transform hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-baseline gap-1 text-primary mb-2">
                <motion.span
                    className="text-5xl md:text-6xl font-extrabold tracking-tighter"
                >
                    {rounded}
                </motion.span>
                <motion.span
                    className="text-3xl font-bold text-blue-400"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    {suffix}
                </motion.span>
            </div>
            <motion.p
                className="text-gray-500 font-medium text-center uppercase tracking-wider text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                {label}
            </motion.p>
        </div>
    );
};

export default function Counters() {
    const { t } = useTranslation();

    const stats = [
        { value: 15, suffix: "+", label: t("counters_years") || "Years of Experience" },
        { value: 500, suffix: "+", label: t("counters_cases") || "Successful Cases" },
        { value: 120, suffix: "+", label: t("counters_clients") || "Global Clients" },
        { value: 15, suffix: "", label: t("counters_professionals") || "Legal Professionals" },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden h-full z-10 -mt-10">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, idx) => (
                        <Counter key={idx} value={stat.value} suffix={stat.suffix} label={stat.label} />
                    ))}
                </div>
            </div>
        </section>
    );
}
