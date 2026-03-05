"use client";

import { PortfolioItem } from "@/types/wordpress";
import PortfolioCard from "@/components/ui/PortfolioCard";
import { Section } from "@/components/ui/Section";
import { useTranslation } from "react-i18next";

interface PortfolioGridProps {
    items: PortfolioItem[];
    showCategories?: boolean;
    limit?: number;
}

export default function PortfolioGrid({ items, showCategories = true, limit }: PortfolioGridProps) {
    const { t } = useTranslation();
    // Group items by category
    const legalServices = items.filter(item => item.category === "Legal services");
    const taxServices = items.filter(item => item.category === "Tax & Business advisory services");

    // Apply limit if specified
    const displayItems = limit ? items.slice(0, limit) : items;
    const displayLegal = limit ? legalServices.slice(0, Math.ceil(limit * 0.7)) : legalServices;
    const displayTax = limit ? taxServices.slice(0, Math.floor(limit * 0.3)) : taxServices;

    if (!showCategories) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayItems.map((item, idx) => (
                    <PortfolioCard key={idx} item={item} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {/* Legal Services Section */}
            {displayLegal.length > 0 && (
                <div>
                    <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                            {t("portfolio_legal_services")}
                        </h3>
                        <div className="w-16 h-1 bg-primary/30 rounded-full">
                            <div className="w-1/2 h-full bg-primary rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayLegal.map((item, idx) => (
                            <PortfolioCard key={idx} item={item} />
                        ))}
                    </div>
                </div>
            )}

            {/* Tax & Business Advisory Services Section */}
            {displayTax.length > 0 && (
                <div>
                    <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                            {t("portfolio_tax_services")}
                        </h3>
                        <div className="w-16 h-1 bg-primary/30 rounded-full">
                            <div className="w-1/2 h-full bg-primary rounded-full"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayTax.map((item, idx) => (
                            <PortfolioCard key={idx} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
