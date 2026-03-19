"use client";

import { useTranslation } from "react-i18next";
import {
    Shield,
    Target,
    Zap,
    Award,
    Star,
    TrendingUp,
    HeartHandshake,
    Briefcase,
    Lightbulb,
    Scale,
    Compass,
    Crown,
} from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useMemo, useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

interface WhyChooseUsProps {
    reasons?: { title: string; description: string }[];
}

const ALL_ICONS = [
    Shield,
    Target,
    Zap,
    Award,
    Star,
    TrendingUp,
    HeartHandshake,
    Briefcase,
    Lightbulb,
    Scale,
    Compass,
    Crown,
];

// Deterministic icon assignment (no random on every render)
const ICON_COLORS = [
    { bg: "from-blue-600 to-blue-400", glow: "rgba(0,92,185,0.25)" },
    { bg: "from-indigo-600 to-indigo-400", glow: "rgba(99,102,241,0.25)" },
    { bg: "from-sky-600 to-sky-400", glow: "rgba(14,165,233,0.25)" },
    { bg: "from-violet-600 to-violet-400", glow: "rgba(139,92,246,0.25)" },
];

// ── Animated count-up stat card ──
function StatCounter({
    value,
    suffix,
    label,
}: {
    value: number;
    suffix: string;
    label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        if (isInView) {
            animate(count, value, { duration: 2, ease: "easeOut" });
        }
    }, [isInView, value, count]);

    return (
        <div
            ref={ref}
            className="text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-soft group hover:border-primary/30 hover:shadow-[0_8px_24px_-6px_rgba(0,92,185,0.12)] transition-all duration-300"
        >
            <div className="flex items-baseline justify-center gap-0.5">
                <motion.span
                    className="text-3xl md:text-4xl font-black"
                    style={{
                        background: "linear-gradient(135deg, #005CB9 0%, #3B82F6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {rounded}
                </motion.span>
                <motion.span
                    className="text-2xl font-black"
                    style={{
                        background: "linear-gradient(135deg, #005CB9 0%, #3B82F6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.6, duration: 0.4 }}
                >
                    {suffix}
                </motion.span>
            </div>
            <motion.p
                className="text-sm text-gray-500 font-medium mt-1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                {label}
            </motion.p>
        </div>
    );
}

export default function WhyChooseUs({ reasons = [] }: WhyChooseUsProps) {
    const { t } = useTranslation();

    // Stable icons for SSR to avoid hydration mismatch
    const [icons, setIcons] = useState(ALL_ICONS.slice(0, 4));

    useEffect(() => {
        // Randomize only on client after hydration
        setIcons([...ALL_ICONS].sort(() => 0.5 - Math.random()).slice(0, 4));
    }, []);



    if (!reasons || reasons.length === 0) return null;

    const cards = reasons.slice(0, 4);

    return (
        <section className="relative py-28 overflow-hidden bg-[#F4F8FF]">
            {/* ─── Decorative background blobs ─── */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, #005CB9 0%, transparent 70%)",
                    filter: "blur(80px)",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full opacity-20"
                style={{
                    background:
                        "radial-gradient(circle, #005CB9 0%, transparent 70%)",
                    filter: "blur(100px)",
                }}
            />

            {/* ─── Subtle grid pattern ─── */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "linear-gradient(#005CB9 1px, transparent 1px), linear-gradient(90deg, #005CB9 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative z-10 container mx-auto px-4 md:px-8">
                {/* ─── Section header ─── */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-5 border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {t("expert_areas_subtitle") || "Specialized Expertise"}
                    </span>

                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight mb-6 leading-tight">
                        {t("why_choose_us_title") || "Why Clients Choose Us"}
                    </h2>

                    <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
                        {t("why_choose_us_desc") || "Trusted by clients across Armenia for our unwavering commitment to excellence and results-driven legal services."}
                    </p>
                </motion.div>

                {/* ─── Cards grid ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {cards.map((reason, idx) => {
                        const Icon = icons[idx] || Shield;
                        const palette =
                            ICON_COLORS[idx % ICON_COLORS.length];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.55,
                                    delay: idx * 0.1,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{ y: -6 }}
                                className="group relative flex flex-col h-full rounded-3xl bg-white border border-gray-100/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_48px_-12px_rgba(0,92,185,0.18)] transition-all duration-500 overflow-hidden cursor-default"
                            >
                                {/* Card top accent line */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, #005CB9, transparent)`,
                                    }}
                                />

                                {/* Card glow on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(ellipse at top left, ${palette.glow} 0%, transparent 60%)`,
                                    }}
                                />

                                <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
                                    {/* Icon */}
                                    <div className="mb-6">
                                        <div
                                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${palette.bg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-400`}
                                            style={{
                                                boxShadow: `0 8px 20px -4px ${palette.glow}`,
                                            }}
                                        >
                                            <Icon
                                                size={26}
                                                className="text-white"
                                                strokeWidth={1.75}
                                            />
                                        </div>
                                    </div>

                                    {/* Number badge */}
                                    <span className="text-xs font-bold text-primary/40 tracking-widest uppercase mb-2">
                                        0{idx + 1}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-lg font-extrabold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                                        {t(`why_choose_us_items.${reason.title}`) !== `why_choose_us_items.${reason.title}`
                                            ? t(`why_choose_us_items.${reason.title}`)
                                            : reason.title}
                                    </h3>

                                    {/* Divider */}
                                    <div className="w-8 h-0.5 bg-primary/20 rounded-full mb-4 group-hover:w-12 group-hover:bg-primary/50 transition-all duration-400" />

                                    {/* Description */}
                                    <p className="text-gray-500 leading-relaxed text-sm flex-grow">
                                        {reason.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ─── Bottom stats bar (animated count-up) ─── */}
                <motion.div
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <StatCounter value={15} suffix="+" label={t("counters_years")} />
                    <StatCounter value={500} suffix="+" label={t("counters_cases")} />
                    <StatCounter value={120} suffix="+" label={t("counters_clients")} />
                    <StatCounter value={15} suffix="" label={t("counters_professionals")} />
                </motion.div>
            </div>
        </section>
    );
}
