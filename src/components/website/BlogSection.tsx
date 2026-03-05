"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, ArrowRight, User, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { LegalUpdate } from "@/lib/wordpress";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function BlogSection({ posts }: { posts: LegalUpdate[] }) {
    const { t } = useTranslation();

    if (!posts || posts.length === 0) return null;

    const [featured, ...rest] = posts;

    return (
        <section className="py-24 bg-white">
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
                            {t("blog_subtitle")}
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors group shrink-0"
                    >
                        View all articles
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* ── Featured post ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="mb-10"
                >
                    <a
                        href={featured.link || `https://retrieve.am/${featured.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-10px_rgba(0,92,185,0.18)] transition-all duration-400"
                    >
                        {/* Image */}
                        <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#003d7a] to-[#005CB9] overflow-hidden">
                            {featured.image ? (
                                <Image
                                    src={featured.image}
                                    alt={featured.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen size={48} className="text-white/20" />
                                </div>
                            )}
                            {/* Featured badge */}
                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                Featured
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold mb-4">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    {formatDate(featured.date)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={12} />
                                    {featured.readTime} min read
                                </span>
                                {featured.author && (
                                    <span className="flex items-center gap-1.5">
                                        <User size={12} />
                                        {featured.author}
                                    </span>
                                )}
                            </div>
                            <h3
                                className="text-xl md:text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-4 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: featured.title }}
                            />
                            {featured.excerpt && (
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                    {featured.excerpt}
                                </p>
                            )}
                            <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                                {t("btn_read_article")}
                                <ArrowRight size={14} />
                            </span>
                        </div>
                    </a>
                </motion.div>

                {/* ── Secondary cards grid ── */}
                {rest.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rest.map((post, idx) => (
                            <motion.a
                                key={post.id}
                                href={post.link || `https://retrieve.am/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.45, delay: idx * 0.1 }}
                                className="group flex gap-5 p-5 rounded-2xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-[0_8px_24px_-8px_rgba(0,92,185,0.13)] transition-all duration-300"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-28 h-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#003d7a] to-[#005CB9]">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="112px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen size={22} className="text-white/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Text */}
                                <div className="flex flex-col justify-between min-w-0">
                                    <div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold mb-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} />
                                                {formatDate(post.date)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={11} />
                                                {post.readTime}m
                                            </span>
                                        </div>
                                        <h3
                                            className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: post.title }}
                                        />
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-primary text-xs font-bold mt-2">
                                        Read
                                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
