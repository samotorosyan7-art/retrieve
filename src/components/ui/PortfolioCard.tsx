import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { PortfolioItem } from "@/types/wordpress";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

interface PortfolioCardProps {
    item: PortfolioItem;
    className?: string;
}

export default function PortfolioCard({ item, className }: PortfolioCardProps) {
    const { t } = useTranslation();
    const basePath = item.category?.toLowerCase().includes("tax")
        ? "/tax-and-business-advisory-services"
        : "/legal-services";
    return (
        <Link
            href={`${basePath}/${item.slug}`}
            className={cn(
                "group block rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-primary/20 hover:shadow-elevated transition-all duration-300",
                className
            )}
        >
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-white backdrop-blur-sm">
                        {item.category === "Legal services" 
                            ? t("cat_legal_services") 
                            : item.category === "Tax & Business advisory services" 
                                ? t("cat_tax_advisory_services") 
                                : item.category}
                    </span>
                </div>

                {/* Title + Learn More Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-3 group-hover:text-white transition-colors">
                        {(() => {
                            const content = t("practice_content", { returnObjects: true }) as Record<string, any>;
                            if (content?.[item.slug]?.title) return content[item.slug].title;
                            
                            const titles = t("practice_titles", { returnObjects: true }) as Record<string, string>;
                            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/law$/, '');
                            const slugKey = normalize(item.slug);
                            const match = Object.keys(titles || {}).find(k => normalize(k) === slugKey);
                            return match ? titles[match] : item.title;
                        })()}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary rounded-full px-4 py-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        {t("learn_more") || "Learn More"} <ArrowRight size={12} />
                    </span>
                </div>
            </div>

            {/* Tags Section (if available) */}
            {item.tags && item.tags.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Link>
    );
}
