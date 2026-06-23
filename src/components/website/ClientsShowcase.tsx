"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { CLIENT_INDUSTRY_COUNT, CLIENT_TOTAL_LABEL, CLIENTS, clientLogo, type Client } from "@/data/clients";

function LogoCard({ client }: { client: Client }) {
    return (
        <div className="group/card flex w-[180px] shrink-0 snap-start flex-col items-center rounded-2xl border border-gray-200/80 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:border-[#005CB9]/40 hover:shadow-[0_16px_32px_-16px_rgba(0,92,185,0.4)] hover:-translate-y-1 sm:w-[200px]">
            <div className="flex h-16 w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {client.url ? (
                    <a href={client.url} target="_blank" rel="nofollow noopener noreferrer" aria-label={client.name}>
                        <img
                            src={clientLogo(client)}
                            alt={client.name}
                            loading="lazy"
                            className="max-h-14 max-w-[85%] object-contain grayscale-[0.15] transition-all duration-300 group-hover/card:grayscale-0"
                        />
                    </a>
                ) : (
                    <img
                        src={clientLogo(client)}
                        alt={client.name}
                        loading="lazy"
                        className="max-h-14 max-w-[85%] object-contain grayscale-[0.15] transition-all duration-300 group-hover/card:grayscale-0"
                    />
                )}
            </div>
            <div className="mt-4 line-clamp-1 text-center text-[14px] font-semibold leading-tight text-gray-900">
                {client.name}
            </div>
            {client.partner && (
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#005CB9]/70">
                    Partner
                </span>
            )}
        </div>
    );
}

export default function ClientsShowcase() {
    const { t } = useTranslation();
    const trackRef = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 4);
        setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    useEffect(() => {
        updateArrows();
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        return () => {
            el.removeEventListener("scroll", updateArrows);
            window.removeEventListener("resize", updateArrows);
        };
    }, [updateArrows]);

    const scroll = (dir: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
    };

    return (
        <section className="relative overflow-hidden border-y border-gray-100 bg-[#F7F7F4] py-20 md:py-28">
            {/* Precision grid + soft glow atmosphere */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.5]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(0,92,185,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,92,185,0.05) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                    maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000 40%, transparent 100%)",
                }}
            />
            <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[#0070DB]/10 blur-3xl" />

            <div className="container relative z-10 mx-auto px-4 md:px-8">
                {/* Header — asymmetric editorial split */}
                <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-7"
                    >
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#005CB9]">
                            <span className="h-px w-7 bg-[#005CB9]/40" />
                            {t("clients_eyebrow") || "Our Clients"}
                        </span>
                        <h2 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight text-gray-950 md:text-[2.85rem]">
                            {t("clients_section_title") || "Trusted by the organizations shaping Armenia's economy"}
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-5"
                    >
                        <p className="text-[15px] font-medium leading-relaxed text-gray-600">
                            {t("clients_section_subtitle") ||
                                "From global nonprofits and universities to fast-scaling startups, we advise across industries and borders."}
                        </p>
                        <div className="mt-6 flex items-center gap-8">
                            <div>
                                <div className="text-3xl font-extrabold tracking-tight text-gray-950">
                                    {CLIENT_TOTAL_LABEL.replace("+", "")}
                                    <span className="text-[#005CB9]">+</span>
                                </div>
                                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                                    {t("clients_stat_clients") || "Clients & partners"}
                                </div>
                            </div>
                            <div className="h-10 w-px bg-gray-200" />
                            <div>
                                <div className="text-3xl font-extrabold tracking-tight text-gray-950">
                                    {CLIENT_INDUSTRY_COUNT}
                                </div>
                                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                                    {t("clients_stat_industries") || "Industries"}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Slider controls */}
                <div className="mb-5 flex items-center justify-end gap-3">
                    <SliderButton direction="left" disabled={!canLeft} onClick={() => scroll(-1)} label={t("clients_prev") || "Previous"} />
                    <SliderButton direction="right" disabled={!canRight} onClick={() => scroll(1)} label={t("clients_next") || "Next"} />
                </div>

                {/* Logo slider */}
                <div className="relative">
                    {/* edge fades */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#F7F7F4] to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#F7F7F4] to-transparent" />
                    <div
                        ref={trackRef}
                        className="flex snap-x gap-4 overflow-x-auto scroll-smooth px-1 pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {CLIENTS.map((client) => (
                            <LogoCard key={client.name} client={client} />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 flex justify-center">
                    <Link
                        href="/clients"
                        className="group/btn inline-flex items-center gap-2.5 rounded-full bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#005CB9] hover:shadow-[0_14px_30px_-12px_rgba(0,92,185,0.6)]"
                    >
                        {t("clients_view_all") || "View all clients"}
                        <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function SliderButton({
    direction,
    disabled,
    onClick,
    label,
}: {
    direction: "left" | "right";
    disabled: boolean;
    onClick: () => void;
    label: string;
}) {
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:border-[#005CB9] hover:bg-[#005CB9] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
        >
            <Icon size={20} strokeWidth={2.25} />
        </button>
    );
}
