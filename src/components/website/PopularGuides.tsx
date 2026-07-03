"use client";

import { useEffect, useRef } from "react";
import Link from "@/components/ui/LocalizedLink";
import { LegalUpdate } from "@/types/wordpress";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

const SLIDE_INTERVAL_MS = 5000;

function GuideCard({ post, t }: { post: LegalUpdate; t: (key: string) => string }) {
    return (
        <Link
            href={`/offer/${post.slug}`}
            className="group flex h-full min-h-[280px] flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
            {post.tags && post.tags.length > 0 && (
                <span className="mb-3 self-start text-[10px] font-bold uppercase tracking-wider text-[#005CB9]">
                    {post.tags[0].name}
                </span>
            )}
            <h3 className="font-bold text-lg leading-snug text-[#111827] line-clamp-3 group-hover:text-[#005CB9] transition-colors duration-200 mb-3">
                {post.title}
            </h3>
            {post.excerpt && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 mb-6">
                    {stripHtml(post.excerpt)}
                </p>
            )}
            <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-[#005CB9]">
                {t("btn_learn_more")}
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

export default function PopularGuides({ posts }: { posts: LegalUpdate[] }) {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const slides = posts ?? [];
    const canSlide = slides.length > 3;

    const scrollByOneCard = (dir: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        const card = el.children[0] as HTMLElement | undefined;
        if (!card) return;

        const gap = parseFloat(getComputedStyle(el).columnGap || "16");
        const step = card.offsetWidth + gap;
        const maxScroll = el.scrollWidth - el.clientWidth;

        if (dir === 1 && el.scrollLeft >= maxScroll - 8) {
            el.scrollTo({ left: 0, behavior: "smooth" });
            return;
        }
        if (dir === -1 && el.scrollLeft <= 8) {
            el.scrollTo({ left: maxScroll, behavior: "smooth" });
            return;
        }
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    useEffect(() => {
        if (!canSlide) return;
        const id = setInterval(() => scrollByOneCard(1), SLIDE_INTERVAL_MS);
        return () => clearInterval(id);
    }, [canSlide, slides.length]);

    if (slides.length === 0) return null;

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

                    {/* ── Left column — static ── */}
                    <div className="lg:col-span-4 lg:pt-3">
                        <span className="block mb-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#005CB9]">
                            Knowledge Center
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-[#1A1A1A] mb-5">
                            {t("popular_guides_title")}
                        </h2>
                        <p className="text-[15px] leading-relaxed text-gray-500 font-medium max-w-sm">
                            {t("popular_guides_subtitle")}
                        </p>
                    </div>

                    {/* ── Right column — native-scroll carousel, one card per step ── */}
                    <div className="lg:col-span-8">
                        <div className="rounded-3xl bg-[#64748b] p-5 md:p-7">
                            <div
                                ref={scrollRef}
                                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {slides.map((post) => (
                                    <div
                                        key={post.id}
                                        className="w-[85vw] sm:w-[calc((100%-2rem)/3)] shrink-0 snap-start"
                                    >
                                        <GuideCard post={post} t={t} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arrows — centered */}
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => scrollByOneCard(-1)}
                                aria-label="Previous guides"
                                className="w-10 h-10 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#005CB9] hover:border-[#005CB9] transition-all duration-200"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollByOneCard(1)}
                                aria-label="Next guides"
                                className="w-10 h-10 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#005CB9] hover:border-[#005CB9] transition-all duration-200"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
