"use client";

import Link from "@/components/ui/LocalizedLink";
import { useParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
    label: string | React.ReactNode;
    href?: string;
}

function stripHtml(value: string) {
    return value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
}

export default function Breadcrumbs({ items, className = "", theme = "dark" }: { items: BreadcrumbItem[], className?: string, theme?: "dark" | "light" }) {
    const isDark = theme === "dark";
    const params = useParams();
    const lang = (params?.lang as string) || "en";
    const baseUrl = `https://www.retrieve.am/${lang}`;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            ...items.map((item, idx) => {
                const listItem: { "@type": string; position: number; name: string; item?: string } = {
                    "@type": "ListItem",
                    position: idx + 2,
                    name: typeof item.label === "string" ? stripHtml(item.label) : "",
                };
                if (item.href) {
                    listItem.item = item.href === "/" ? baseUrl : `${baseUrl}${item.href}`;
                }
                return listItem;
            }),
        ],
    };

    return (
        <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <nav aria-label="Breadcrumb" className={cn("flex items-center flex-wrap gap-2 text-sm font-medium mb-8", isDark ? 'text-blue-200' : 'text-gray-500', className)}>
            <Link href="/" className={`${isDark ? 'hover:text-white' : 'hover:text-[#005CB9]'} transition-colors flex items-center gap-1`} aria-label="Home">
                <Home size={14} className="mb-[1px]" />
            </Link>
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                const cleanLabel = typeof item.label === "string" ? stripHtml(item.label) : item.label;

                return (
                    <div key={idx} className="flex items-center gap-2">
                        <ChevronRight size={14} className={`${isDark ? 'text-blue-300/50' : 'text-gray-300'} flex-shrink-0`} />
                        {item.href && !isLast ? (
                            <Link 
                                href={item.href} 
                                className={`${isDark ? 'hover:text-white' : 'hover:text-[#005CB9]'} transition-colors truncate max-w-[120px] sm:max-w-[200px] md:max-w-none`}
                                title={typeof cleanLabel === 'string' ? cleanLabel : ''}
                            >
                                {cleanLabel}
                            </Link>
                        ) : (
                            <span 
                                className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold truncate max-w-[150px] sm:max-w-[250px] md:max-w-none`}
                                title={typeof cleanLabel === 'string' ? cleanLabel : ''}
                                aria-current={isLast ? "page" : undefined}
                            >
                                {cleanLabel}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
        </>
    );
}
