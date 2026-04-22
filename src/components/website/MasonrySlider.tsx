"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { LegalUpdate } from "@/types/wordpress";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function MasonrySlider({ posts }: { posts: LegalUpdate[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    if (!posts || posts.length === 0) return null;

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="relative py-20 bg-gray-50 border-b border-gray-100 overflow-hidden">

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        {t("special_offers") || "Trending services"}
                    </h2>
                </div>
                <div className="hidden md:flex gap-3">
                    <button
                        onClick={() => scroll("left")}
                        className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-all"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-all"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 relative">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 sm:gap-8 pb-8 pt-4 snap-x snap-mandatory hide-scrollbar relative z-0"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {posts.map((post, idx) => (
                        <div
                            key={post.id}
                            className="w-[85vw] sm:w-[400px] flex-shrink-0 snap-center bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col"
                        >
                            <Link href={`/offer/${post.slug}`} className="block relative h-60 w-full bg-gray-100 overflow-hidden">
                                {post.image ? (
                                    <Image
                                        src={post.image}
                                        alt={post.imageAlt || post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 85vw, 400px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                            </Link>
                            
                            <div className="p-6 sm:p-8 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    <Link href={`/offer/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto">
                                    <Link href={`/offer/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-blue-800 transition-colors">
                                        {t("btn_learn_more") || "Learn More"} <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
