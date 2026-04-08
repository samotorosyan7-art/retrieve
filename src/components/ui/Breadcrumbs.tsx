import Link from "@/components/ui/LocalizedLink";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string | React.ReactNode;
    href?: string;
}

export default function Breadcrumbs({ items, className = "", theme = "dark" }: { items: BreadcrumbItem[], className?: string, theme?: "dark" | "light" }) {
    const isDark = theme === "dark";
    
    return (
        <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-2 text-sm font-medium ${isDark ? 'text-blue-200' : 'text-gray-500'} mb-8 ${className}`}>
            <Link href="/" className={`${isDark ? 'hover:text-white' : 'hover:text-[#005CB9]'} transition-colors flex items-center gap-1`} aria-label="Home">
                <Home size={14} className="mb-[1px]" />
            </Link>
            {items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                // If the label is a string and contains HTML, we strip it for safety and clean display
                let cleanLabel = item.label;
                if (typeof cleanLabel === "string") {
                    cleanLabel = cleanLabel.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
                }

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
    );
}
