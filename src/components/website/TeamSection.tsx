"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                                            {/* "View Profile" pill — slides up on hover */}
                                            <div className="mb-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-[#005CB9] rounded-full px-3 py-1.5 shadow-lg">
                                                    {t("btn_view_profile")} <ArrowRight size={10} />
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-extrabold text-white leading-tight mb-1 group-hover:text-blue-200 transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">
                                                {t(`team_member_positions.${member.position}`, { defaultValue: member.position })}
                                            </p>
                                        </div>
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
