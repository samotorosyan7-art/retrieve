"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortfolioItem } from "@/types/wordpress";
import PortfolioCard from "@/components/ui/PortfolioCard";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PracticeAreasGridProps {
    items: PortfolioItem[];
    activeCategory: "Legal services" | "Tax & Business advisory services";
}

const ITEMS_PER_PAGE = 6;

export default function PracticeAreasGrid({ items, activeCategory }: PracticeAreasGridProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

    const tabs = [
        { id: "Legal services", label: t("portfolio_legal_services") || "Legal Services", href: "/legal-services" },
        { id: "Tax & Business advisory services", label: t("portfolio_tax_services") || "Tax & Business Advisory Services", href: "/tax-and-business-advisory-services" }
    ];

    const filteredItems = items.filter(item => item.category === activeCategory);

    const displayItems = filteredItems.slice(0, visibleCount);
    const hasMore = visibleCount < filteredItems.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const handleTabChange = (tab: typeof tabs[number]) => {
        router.push(tab.href);
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-8">

                {/* Filtration Tabs */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border",
                                activeCategory === tab.id
                                    ? "bg-[#005CB9] text-white border-[#005CB9] shadow-md"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#005CB9]/50 hover:text-[#005CB9]"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto text-center mb-16">
                    <p className="text-gray-600 text-lg leading-relaxed">
                        {activeCategory === "Legal services" 
                            ? t("page_legal_services_description") 
                            : t("page_tax_business_advisory_description")
                        }
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {displayItems.map((item, idx) => (
                        <PortfolioCard key={`${item.slug}-${idx}`} item={item} />
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={handleLoadMore}
                            variant="outline"
                            className="rounded-full px-10 py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors uppercase tracking-wider text-sm shadow-sm"
                        >
                            Load More
                        </Button>
                    </div>
                )}

            </div>
        </section>
    );
}
