"use client";

import Link from "@/components/ui/LocalizedLink";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { LegalUpdate } from "@/types/wordpress";

function formatDate(iso: string, lang: string = "en") {
    const locale = lang.startsWith("am") ? "hy-AM" : lang.startsWith("ru") ? "ru-RU" : "en-US";
    return new Date(iso).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

export default function BlogSection({ posts }: { posts: LegalUpdate[] }) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    if (!posts || posts.length === 0) return null;

    const displayPosts = posts.slice(0, 6);

    return (
        <section className="py-28 bg-[#F4F8FF]">
            <div className="container mx-auto px-4 md:px-8">
                {/* ── Header ── */}
                <motion.div
                    className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 border border-primary/20">
                            <BookOpen size={12} />
                            {t("blog_title")}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
                            {t("blog_recent_articles")}
                        </h2>
                        <p className="text-gray-500 mt-3 max-w-xl text-base leading-relaxed">
                            {t("blog_recent_desc")}
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors group shrink-0"
                    >
                        {t("btn_view_all_articles")}
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* ── 6-post grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {displayPosts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.45, delay: idx * 0.07 }}
                        >
                            <Link
                                href={`/legal-updates/${post.slug}`}
                                className="group flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_-10px_rgba(0,92,185,0.15)] hover:border-primary/20 transition-all duration-300 overflow-hidden"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-52 bg-gradient-to-br from-[#003d7a] to-[#005CB9] overflow-hidden shrink-0">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.imageAlt || post.title.replace(/<[^>]+>/g, "")}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen size={36} className="text-white/20" />
                                        </div>
                                    )}
                                    {/* Read time badge */}
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Clock size={11} />
                                        {post.readTime} {t("legal_update_read_min") || "min"}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    {/* Date */}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-3">
                                        <Calendar size={12} />
                                        {formatDate(post.date, lang)}
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="text-base font-extrabold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-3 line-clamp-2"
                                        title={post.title.replace(/<[^>]+>/g, "")}
                                        dangerouslySetInnerHTML={{ __html: post.title }}
                                    />

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    {/* CTA */}
                                    <div className="flex items-center gap-1.5 text-primary text-sm font-bold mt-auto pt-3 border-t border-gray-50">
                                        {t("btn_read_article")}
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* ── View More button ── */}
                <motion.div
                    className="flex justify-center mt-14"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.3 }}
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#004791] to-[#005CB9] hover:from-[#003d7a] hover:to-[#004791] text-white font-bold text-base rounded-2xl px-9 py-4 transition-all shadow-lg shadow-blue-900/20 group"
                    >
                        {t("btn_view_more_articles")}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
