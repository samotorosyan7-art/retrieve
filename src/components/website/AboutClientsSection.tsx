"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import { CLIENTS, clientLogo } from "@/data/clients";

// A compact, container-fitting selection of logos for the About page.
const FEATURED = CLIENTS.slice(0, 12);

export default function AboutClientsSection() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                        {t("clients_about_title") || "Trusted by 200+ clients"}
                    </h2>
                    <p className="mt-3 text-base text-gray-600 leading-relaxed max-w-xl">
                        {t("clients_about_desc") ||
                            "A selection of the organizations we advise across industries and borders."}
                    </p>
                </div>
                <Link
                    href="/clients"
                    className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#005CB9] hover:text-[#004791] transition-colors"
                >
                    {t("clients_view_all") || "View all clients"}
                    <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {FEATURED.map((client) => (
                    <div
                        key={client.name}
                        title={client.name}
                        className="flex h-20 items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-[#005CB9]/40 hover:shadow-sm"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={clientLogo(client)}
                            alt={client.name}
                            loading="lazy"
                            className="max-h-10 max-w-[85%] object-contain grayscale-[0.2] transition-all duration-300 hover:grayscale-0"
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
