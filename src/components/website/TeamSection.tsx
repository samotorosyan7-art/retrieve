"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WPTeamMember } from "@/types/wordpress";

export default function TeamSection({ teamMembers }: { teamMembers: WPTeamMember[] }) {
    const { t } = useTranslation();

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
                        {t("team_subtitle")}
                    </p>
                    <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-[#005CB9] rounded-full" />
                    </div>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.slice(0, 3).map((member, idx) => {
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
                                <Link href={localLink} className="group block rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#005CB9]/20 transition-all duration-400">

                                    {/* Image \u2014 extra tall portrait */}
                                    <div className="relative h-[26rem] overflow-hidden bg-gray-100">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.imageAlt || member.name}
                                                fill
                                                className="object-cover object-top transition-transform duration-600 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User size={64} className="text-gray-300" />
                                            </div>
                                        )}

                                        {/* Dark gradient overlay always visible at bottom */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

                                        {/* "View Profile" pill — slides up on hover */}
                                        <div className="absolute inset-x-0 bottom-5 flex justify-center">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#005CB9] rounded-full px-4 py-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                                {t("btn_view_profile")} <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="px-7 py-6 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#005CB9] transition-colors leading-snug mb-1">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 font-medium">
                                                {t(`team_roles.${member.position}`) !== `team_roles.${member.position}` 
                                                    ? t(`team_roles.${member.position}`) 
                                                    : member.position}
                                            </p>
                                        </div>
                                        <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-[#005CB9]/10 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                                            <ArrowRight size={16} className="text-gray-400 group-hover:text-[#005CB9] transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/our-team"
                        className="inline-flex items-center gap-2 font-bold text-sm rounded-full px-10 py-4 border-2 border-[#005CB9] text-[#005CB9] hover:bg-[#005CB9] hover:text-white transition-all duration-300 shadow-sm"
                    >
                        {t("btn_view_all_members")} <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
