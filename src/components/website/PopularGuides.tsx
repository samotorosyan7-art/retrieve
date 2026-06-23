"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { LegalUpdate } from "@/types/wordpress";
import { ArrowUpRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const ImagePlaceholder = () => (
    <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #003D7A 0%, #005CB9 55%, #0070DB 100%)" }}
    />
);

export default function PopularGuides({ posts }: { posts: LegalUpdate[] }) {
    const { t } = useTranslation();

    if (!posts || posts.length === 0) return null;

    const [featured, ...rest] = posts;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">

                {/* ── Header ── */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="block mb-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#005CB9]">
                            Knowledge Center
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-[#1A1A1A]">
                            {t("popular_guides_title")}
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center gap-1.5 text-sm font-bold text-[#005CB9] group hover:opacity-70 transition-opacity duration-200"
                    >
                        View all
                        <ArrowUpRight
                            size={15}
                            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Link>
                </div>

                {/* ── Bento Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Featured card — spans 2 cols, image as full-bleed background */}
                    <Link
                        href={`/offer/${featured.slug}`}
                        className="md:col-span-2 relative rounded-2xl overflow-hidden group block"
                        style={{ minHeight: "460px" }}
                    >
                        <div className="absolute inset-0">
                            {featured.image ? (
                                <Image
                                    src={featured.image}
                                    alt={featured.imageAlt || featured.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                />
                            ) : (
                                <ImagePlaceholder />
                            )}
                        </div>

                        {/* Gradient overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(to top, rgba(2,8,20,0.95) 0%, rgba(2,8,20,0.4) 55%, rgba(2,8,20,0.05) 100%)",
                            }}
                        />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
                            {featured.tags && featured.tags.length > 0 && (
                                <span
                                    className="self-start mb-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase"
                                    style={{
                                        background: "rgba(74,159,255,0.18)",
                                        color: "#4A9FFF",
                                        border: "1px solid rgba(74,159,255,0.3)",
                                    }}
                                >
                                    {featured.tags[0].name}
                                </span>
                            )}
                            <h3 className="text-white text-2xl md:text-[28px] font-black leading-tight mb-3">
                                {featured.title}
                            </h3>
                            {featured.excerpt && (
                                <p className="text-white/55 text-sm font-medium leading-relaxed mb-5 line-clamp-2">
                                    {stripHtml(featured.excerpt)}
                                </p>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-white/40">
                                    <Clock size={12} />
                                    {featured.readTime} min read
                                </span>
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#005CB9]"
                                    style={{ background: "rgba(255,255,255,0.12)" }}
                                >
                                    <ArrowUpRight size={16} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Right column — 2 stacked cards with images */}
                    <div className="flex flex-col gap-4">
                        {rest.slice(0, 2).map((post) => (
                            <Link
                                key={post.id}
                                href={`/offer/${post.slug}`}
                                className="flex-1 rounded-2xl overflow-hidden group border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative h-[140px] overflow-hidden shrink-0">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.imageAlt || post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1 justify-between">
                                    <div>
                                        {post.tags && post.tags.length > 0 && (
                                            <span className="block mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#005CB9]">
                                                {post.tags[0].name}
                                            </span>
                                        )}
                                        <h3 className="font-bold text-sm leading-snug text-[#111827] line-clamp-3 group-hover:text-[#005CB9] transition-colors duration-200">
                                            {post.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                                            <Clock size={11} />
                                            {post.readTime} min read
                                        </span>
                                        <ArrowUpRight
                                            size={15}
                                            className="text-gray-300 group-hover:text-[#005CB9] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom row — up to 3 equal cards with images */}
                    {rest.slice(2, 5).map((post) => (
                        <Link
                            key={post.id}
                            href={`/offer/${post.slug}`}
                            className="rounded-2xl overflow-hidden group border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col"
                        >
                            {/* Image */}
                            <div className="relative h-[170px] overflow-hidden shrink-0">
                                {post.image ? (
                                    <Image
                                        src={post.image}
                                        alt={post.imageAlt || post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <ImagePlaceholder />
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1 justify-between">
                                <div>
                                    {post.tags && post.tags.length > 0 && (
                                        <span className="block mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#005CB9]">
                                            {post.tags[0].name}
                                        </span>
                                    )}
                                    <h3 className="font-bold text-sm leading-snug text-[#111827] line-clamp-3 group-hover:text-[#005CB9] transition-colors duration-200">
                                        {post.title}
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                                        <Clock size={11} />
                                        {post.readTime} min read
                                    </span>
                                    <ArrowUpRight
                                        size={15}
                                        className="text-gray-300 group-hover:text-[#005CB9] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile: view all */}
                <div className="mt-10 flex md:hidden justify-center">
                    <Link
                        href="/blog"
                        className="flex items-center gap-1.5 text-sm font-bold text-[#005CB9]"
                    >
                        View all guides
                        <ArrowUpRight size={15} />
                    </Link>
                </div>
            </div>
        </section>
    );
}