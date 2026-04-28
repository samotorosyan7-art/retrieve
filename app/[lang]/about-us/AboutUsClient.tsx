"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Shield, Award, Users, Target, CheckCircle2, ArrowRight, Briefcase, Scale, Globe, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { Button } from "@/components/ui/Button";
import TeamSection from "@/components/website/TeamSection";
import { WPTeamMember } from "@/types/wordpress";

interface AboutUsClientProps {
    teamMembers: WPTeamMember[];
}

export default function AboutUsClient({ teamMembers }: AboutUsClientProps) {
    const { t } = useTranslation();

    const values = [
        {
            icon: Shield,
            titleKey: "about_us_value_integrity_title",
            textKey: "about_us_value_integrity_text",
        },
        {
            icon: Award,
            titleKey: "about_us_value_excellence_title",
            textKey: "about_us_value_excellence_text",
        },
        {
            icon: Users,
            titleKey: "about_us_value_client_focused_title",
            textKey: "about_us_value_client_focused_text",
        },
    ];

    const stats = [
        { label: t("about_us_stat_experience", { defaultValue: "Years of Experience" }), value: "10+", icon: Briefcase },
        { label: t("about_us_stat_cases", { defaultValue: "Successful Cases" }), value: "500+", icon: Scale },
        { label: t("about_us_stat_partners", { defaultValue: "Global Partners" }), value: "20+", icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            
            {/* ── Hero strip ── */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-44 pb-24">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block text-blue-200 font-bold tracking-widest uppercase text-xs mb-4"
                    >
                        {t("hero_badge")}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
                    >
                        {t("about_us_hero_title")}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        {t("about_us_hero_subtitle")}
                    </motion.p>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="container mx-auto px-4 md:px-8 py-16 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* LEFT — Side Info */}
                    <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-6 lg:sticky lg:top-28">
                        
                        {/* Values Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated overflow-hidden">
                            <div className="bg-gradient-to-r from-[#003d7a] to-[#005CB9] px-6 py-5">
                                <h2 className="text-white font-extrabold text-lg">{t("about_us_values_title")}</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {values.map((v, idx) => (
                                    <div key={idx} className="px-6 py-5 flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-[#005CB9]/10 flex items-center justify-center shrink-0 group-hover:bg-[#005CB9] transition-all">
                                            <v.icon size={18} className="text-[#005CB9] group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 mb-1">{t(v.titleKey)}</div>
                                            <p className="text-xs text-gray-500 leading-relaxed">{t(v.textKey)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated p-6 space-y-6">
                            {stats.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                        <s.icon size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-[#005CB9]">{s.value}</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Location Mini-Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated p-6 space-y-4">
                            <div className="flex items-center gap-3 text-[#005CB9]">
                                <MapPin size={20} />
                                <h3 className="font-bold text-gray-900">{t("about_us_location_title")}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{t("about_us_address")}</p>
                            <div className="rounded-2xl overflow-hidden h-32 border border-gray-50">
                                <iframe
                                    src="https://maps.google.com/maps?q=Argishti%2011%2F11%2C%20Yerevan%2C%20Armenia&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT — Main Content */}
                    <main className="flex-1 min-w-0 space-y-10">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#005CB9]/10 flex items-center justify-center mb-6">
                                    <Target className="text-[#005CB9]" size={24} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{t("about_us_mission_title")}</h2>
                                <p className="text-gray-600 leading-relaxed">{t("about_us_mission_text")}</p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#005CB9]/10 flex items-center justify-center mb-6">
                                    <Users className="text-[#005CB9]" size={24} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{t("about_us_vision_title")}</h2>
                                <p className="text-gray-600 leading-relaxed">{t("about_us_vision_text")}</p>
                            </motion.div>
                        </div>

                        {/* Story Section with Background Image */}
                        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex items-center">
                            {/* Background Image for section */}
                            <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-20 md:opacity-100 z-0">
                                <Image 
                                    src="https://wp.retrieve.am/wp-content/uploads/2026/04/Law-Firm-Armenia.jpg"
                                    alt="Reliable Results"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent hidden md:block" />
                            </div>

                            <div className="relative z-10 w-full md:w-2/3 p-8 md:p-12 space-y-6">
                                <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                    {t("about_us_story_title_1", { defaultValue: "Committed to Providing" })} <span className="text-[#005CB9]">{t("about_us_story_title_2", { defaultValue: "Reliable Results" })}</span>
                                </h2>
                                <p className="text-gray-600 leading-relaxed max-w-xl">
                                    {t("about_us_story_text")}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    {[
                                        t("about_us_feature_1"),
                                        t("about_us_feature_2"),
                                        t("about_us_feature_3"),
                                        t("about_us_feature_4"),
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <CheckCircle2 size={18} className="text-[#005CB9]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch">
                            {/* Left — tall featured image */}
                            <motion.div
                                whileHover={{ scale: 1.015 }}
                                className="md:col-span-3 relative rounded-3xl overflow-hidden shadow-xl min-h-[340px]"
                            >
                                <Image
                                    src="https://wp.retrieve.am/wp-content/uploads/2026/04/Law-Firm-Retrieve-Team-1.jpg"
                                    alt="Retrieve Team"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#003d7a]/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">{t("team_title")}</p>
                                    <p className="text-lg font-extrabold leading-tight">Retrieve Legal & Tax</p>
                                </div>
                            </motion.div>

                            {/* Right — office image + stats badge */}
                            <div className="md:col-span-2 flex flex-col gap-5">
                                <motion.div
                                    whileHover={{ scale: 1.015 }}
                                    className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-md flex-1 min-h-[200px]"
                                >
                                    <Image
                                        src="https://wp.retrieve.am/wp-content/uploads/2026/04/Law-Firm-in-Yerevan.jpg"
                                        alt="Office"
                                        fill
                                        className="object-contain p-3"
                                    />
                                </motion.div>
                                <div className="rounded-3xl bg-gradient-to-br from-[#005CB9] to-[#003d7a] p-6 text-white flex flex-col justify-center gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-black">10+</div>
                                        <div className="text-sm text-blue-100 leading-tight">{t("about_us_feature_1")}</div>
                                    </div>
                                    <div className="w-full h-px bg-white/20" />
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-black">200+</div>
                                        <div className="text-sm text-blue-100 leading-tight">{t("about_us_feature_2")}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Section Integration */}
                        <div className="pt-10">
                            <TeamSection teamMembers={teamMembers} showAll={true} showCta={false} />
                        </div>

                        {/* FINAL CTA SECTION */}
                        <div className="bg-gradient-to-r from-[#003d7a] to-[#005CB9] rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-black mb-6">{t("about_us_cta_title")}</h2>
                                <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                                    {t("about_us_cta_text")}
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button asChild size="lg" className="rounded-full px-12 h-16 text-lg font-bold bg-white text-[#005CB9] hover:bg-blue-50 shadow-xl transition-all group/btn">
                                        <Link href="/contact" className="flex items-center gap-2">
                                            {t("btn_contact_us")} <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <div className="flex items-center gap-6 text-white/80 font-medium">
                                        <a href="tel:+37441777332" className="flex items-center gap-2 hover:text-white transition-colors">
                                            <Phone size={18} />
                                            <span>+374 41 777 332</span>
                                        </a>
                                        <a href="mailto:info@retrieve.am" className="flex items-center gap-2 hover:text-white transition-colors">
                                            <Mail size={18} />
                                            <span>info@retrieve.am</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
