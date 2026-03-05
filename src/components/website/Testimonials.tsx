"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";

interface TestimonialsProps {
    testimonials?: { text: string; author: string; role: string; initial: string }[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 400; // approximate card width + gap
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden relative border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-8 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F4F6F8] rounded-full border border-gray-100 mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                            {t("testimonials_title") || "Client Success Stories"}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
                        {t("testimonials_subtitle") || "Hear directly from the businesses we've partnered with."}
                    </h2>
                </div>

                {/* Desktop Navigation Controls */}
                <div className="hidden md:flex gap-3">
                    <button
                        onClick={() => scroll("left")}
                        className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary hover:shadow-soft transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary hover:shadow-soft transition-all"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* Scrolling Card Track (Clio stepped card logic via horizontal scroll) */}
            <div className="container mx-auto px-4 md:px-8 relative">

                {/* Fade edges */}
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 sm:gap-8 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar relative z-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((testy, idx) => (
                        <div
                            key={idx}
                            className="w-[85vw] sm:w-[400px] flex-shrink-0 snap-center bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-soft hover:shadow-elevated hover:-translate-y-2 transition-all duration-500 relative group flex flex-col"
                        >
                            {/* Decorative Quote Icon */}
                            <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <Quote size={60} strokeWidth={1} />
                            </div>

                            <div className="relative z-10 flex-grow">
                                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal mb-8 pt-4">
                                    "{testy.text}"
                                </p>
                            </div>

                            <div className="relative z-10 flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                                    {testy.initial}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-tight block">{testy.author}</h4>
                                    <span className="text-sm text-gray-500 block mt-0.5">{testy.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
