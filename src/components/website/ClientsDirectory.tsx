"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { CLIENTS, CLIENT_CATEGORY_ORDER, clientLogo, type Client, type ClientCategory } from "@/data/clients";

function ClientCard({ client, index }: { client: Client; index: number }) {
    const { t } = useTranslation();
    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.4), ease: [0.22, 1, 0.36, 1] }}
            className="group flex h-full flex-col rounded-[1.4rem] border border-gray-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:border-[#005CB9] hover:shadow-[0_22px_44px_-22px_rgba(0,92,185,0.35)] md:p-7"
        >
            <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-12 items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={clientLogo(client)}
                        alt={client.name}
                        loading="lazy"
                        className="h-11 w-auto max-w-[140px] object-contain"
                    />
                </div>
                <span className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors group-hover:border-[#005CB9]/30 group-hover:text-[#005CB9]">
                    {t(`clients_cat_${client.category}`) || client.category}
                </span>
            </div>

            <h3 className="text-xl font-bold leading-snug tracking-tight text-gray-900">
                {client.name}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-gray-600">{client.description}</p>
        </motion.article>
    );
}

export default function ClientsDirectory() {
    const { t } = useTranslation();
    const [active, setActive] = useState<ClientCategory | "all">("all");

    const commercial = useMemo(() => CLIENTS.filter((c) => !c.partner), []);
    const partners = useMemo(() => CLIENTS.filter((c) => c.partner), []);

    const availableCategories = useMemo(() => {
        const present = new Set(commercial.map((c) => c.category));
        return CLIENT_CATEGORY_ORDER.filter((c) => present.has(c));
    }, [commercial]);

    const filtered = useMemo(
        () => (active === "all" ? commercial : commercial.filter((c) => c.category === active)),
        [active, commercial]
    );

    return (
        <section className="relative bg-[#F7F7F4] pb-24">
            <div className="container mx-auto px-4 md:px-8">
                {/* Filter rail */}
                <div className="sticky top-[104px] z-20 -mx-4 mb-12 border-y border-gray-200/70 bg-[#F7F7F4]/85 px-4 py-4 backdrop-blur-md md:top-[120px] md:mx-0 md:rounded-2xl md:border md:px-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <FilterChip label={t("clients_filter_all") || "All"} active={active === "all"} onClick={() => setActive("all")} />
                        {availableCategories.map((cat) => (
                            <FilterChip
                                key={cat}
                                label={t(`clients_cat_${cat}`) || cat}
                                active={active === cat}
                                onClick={() => setActive(cat)}
                            />
                        ))}
                    </div>
                </div>

                {/* Card grid */}
                <div key={active} className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((client, i) => (
                        <ClientCard key={client.name} client={client} index={i} />
                    ))}
                </div>

                {/* Partners */}
                {partners.length > 0 && (
                    <div className="mt-24">
                        <div className="mb-10 max-w-2xl">
                            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#005CB9]">
                                <span className="h-px w-7 bg-[#005CB9]/40" />
                                {t("clients_partners_eyebrow") || "Affiliations"}
                            </span>
                            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-950 md:text-3xl">
                                {t("clients_partners_title") || "Partners & affiliations"}
                            </h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                                {t("clients_partners_intro") ||
                                    "Institutions and networks we collaborate with to serve clients across borders."}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {partners.map((client, i) => (
                                <ClientCard key={client.name} client={client} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Closing CTA */}
                <div className="relative mt-24 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#003D7A] via-[#005CB9] to-[#0070DB] p-10 text-white md:p-14">
                    <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-extrabold leading-tight tracking-tight md:text-[2rem]">
                                {t("clients_cta_title") || "Join the organizations we advise."}
                            </h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-blue-100">
                                {t("clients_cta_desc") ||
                                    "Whether you're entering the Armenian market or scaling globally, our legal and tax team is ready to help."}
                            </p>
                        </div>
                        <Link
                            href="/contact"
                            className="group/cta inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#005CB9] transition-all duration-300 hover:bg-blue-50 hover:shadow-lg"
                        >
                            {t("clients_cta_btn") || "Become a client"}
                            <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                active
                    ? "bg-gray-950 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#005CB9]/40 hover:text-[#005CB9]"
            }`}
        >
            {label}
        </button>
    );
}
