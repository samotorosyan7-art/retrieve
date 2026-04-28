"use client";

import Image from "next/image";
import { useRef } from "react";
import Link from "@/components/ui/LocalizedLink";
import { LegalUpdate } from "@/types/wordpress";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PopularGuides({ posts }: { posts: LegalUpdate[] }) {
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
        <section className="relative py-20 bg-[#E8F0F8] overflow-hidden">
            {/* Background Image - Adjusted opacity to match screenshot */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://wp.retrieve.am/wp-content/uploads/2026/04/Legal-Guides.jpg"
                    alt="Legal Guides"
                    fill
                    className="object-cover opacity-[0.4]"
                />
            </div>
            
            {/* Subtle overlay to soften the background image */}
            <div className="absolute inset-0 bg-white/5 z-[1]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] tracking-[0.05em] uppercase text-center w-full">
                        {t("popular_guides_title")}
                    </h2>
                </div>

                {/* Carousel wrapper with navigation arrows */}
                <div className="relative px-12">
                    {/* Left arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center text-[#4A4A4A] hover:text-primary transition-colors !opacity-100"
                        aria-label="Previous guide"
                    >
                        <ChevronLeft size={32} strokeWidth={1.5} />
                    </button>

                    {/* Right arrow */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center text-[#4A4A4A] hover:text-primary transition-colors !opacity-100"
                        aria-label="Next guide"
                    >
                        <ChevronRight size={32} strokeWidth={1.5} />
                    </button>

                    {/* Scrollable cards */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/offer/${post.slug}`}
                                className="min-w-[280px] sm:min-w-[340px] flex-1 snap-center bg-white rounded-2xl p-8 flex items-start justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] leading-tight flex-1">
                                    {post.title}
                                </h3>
                                <div className="flex-shrink-0 pt-1">
                                    <ArrowUpRight size={24} className="text-primary" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
