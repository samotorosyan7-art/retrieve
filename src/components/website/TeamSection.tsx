"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WPTeamMember } from "@/types/wordpress";

export default function TeamSection({
    teamMembers,
    showAll = false,
    showCta = true
}: {
    teamMembers: WPTeamMember[];
    showAll?: boolean;
    showCta?: boolean;
}) {
    const { t } = useTranslation();

    // Show all members fetched from WP. If translation is available, use it.
    const displayMembers = showAll ? teamMembers : teamMembers.slice(0, 3);

    if (teamMembers.length === 0) return null;

    return (
        <section className="py-28 bg-white relative overflow-hidden">
            {/* Subtle decorative blobs */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-50 blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-50 blur-3xl opacity-40 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20 max-w-2xl mx-auto"
                >
                    <span className="text-[#005CB9] font-bold tracking-widest uppercase text-sm mb-4 block">
                        {t("team_meet_experts")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight mb-6">
                        {t("team_our_team")}
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8">
                        {t("about_us_cta_text")}
                    </p>
                    <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-[#005CB9] rounded-full" />
                    </div>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
                    {displayMembers.map((member, idx) => {
                        const slug = member.link?.split("/personnel/")[1]?.replace(/\//g, "") || "";
                        const localLink = slug ? `/personnel/${slug}` : "#";

                        return (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: idx * 0.12 }}
                            >
                                <Link
                                    href={localLink}
                                    className="group block relative overflow-hidden rounded-[1.75rem] aspect-[3/4] bg-gradient-to-b from-gray-100 to-gray-200 shadow-[0_12px_40px_-16px_rgba(0,60,122,0.3)] ring-1 ring-gray-200/80 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_34px_70px_-22px_rgba(0,92,185,0.5)] hover:ring-[#005CB9]/40"
                                >
                                    {/* Portrait */}
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.imageAlt || member.name}
                                            fill
                                            className="object-cover object-top transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={80} className="text-gray-300" />
                                        </div>
                                    )}

                                    {/* Layered gradients for legibility, plus a blue wash on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#02152b] via-[#02152b]/30 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#005CB9]/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    {/* Hover arrow */}
                                    <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/95 text-[#005CB9] flex items-center justify-center shadow-lg opacity-0 -translate-y-2 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                                        <ArrowUpRight size={20} strokeWidth={2.5} />
                                    </div>

                                    {/* Info */}
                                    <div className="absolute inset-x-0 bottom-0 p-7 z-20">
                                        <h3 className="text-2xl font-extrabold text-white leading-tight tracking-tight mb-2">
                                            {member.name}
                                        </h3>
                                        <p className="text-blue-100/85 text-[11px] font-semibold uppercase tracking-[0.18em]">
                                            {t(`team_member_positions.${member.position}`, { defaultValue: member.position })}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                {showCta && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-center mt-16"
                    >
                        <Link
                            href="/about-us"
                            className="inline-flex items-center gap-2 font-bold text-sm rounded-full px-10 py-4 border-2 border-[#005CB9] text-[#005CB9] hover:bg-[#005CB9] hover:text-white transition-all duration-300 shadow-sm"
                        >
                            {t("btn_view_all_members")} <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
