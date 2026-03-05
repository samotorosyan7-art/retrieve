"use client";

import { useTranslation } from "react-i18next";
import Image from "next/image";

interface ClientsCarouselProps {
    logos?: { id: string; url: string; alt: string }[];
}

export default function ClientsCarousel({ logos = [] }: ClientsCarouselProps) {
    const { t } = useTranslation();

    if (!logos || logos.length === 0) return null;

    // Duplicate the array to create the seamless infinite scroll illusion
    const extendedClients = [...logos, ...logos, ...logos];

    return (
        <section className="py-24 bg-[#F4F6F8] overflow-hidden border-t border-gray-100">
            <div className="container mx-auto px-4 md:px-8 mb-12">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 mb-4 tracking-tight">
                        {t("clients_carousel_title") || "Trusted by Industry Leaders"}
                    </h2>
                    <div className="w-16 h-1 bg-primary/20 mx-auto rounded-full">
                        <div className="w-1/2 h-full bg-primary rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Seamless Infinite Carousel */}
            <div className="relative w-full flex overflow-x-hidden group py-4 bg-white border-y border-gray-100">

                {/* Gradient masks for fading edges */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

                {/* Animated Track - pure CSS animation is often smoother for marques than JS springs */}
                <div className="animate-marquee flex gap-12 sm:gap-20 items-center justify-center whitespace-nowrap">
                    {extendedClients.map((client, idx) => (
                        <div
                            key={`${client.id}-${idx}`}
                            className="relative w-32 sm:w-40 h-20 flex-shrink-0 transition-all duration-300 cursor-pointer object-contain flex items-center justify-center"
                        >
                            <img
                                src={client.url}
                                alt={client.alt}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Global styles for the marquee keyframes */}
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-33.33%); } /* Translating exactly one set of the duplicated items */
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                    width: max-content;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
