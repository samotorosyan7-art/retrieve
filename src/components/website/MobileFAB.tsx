"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function MobileFAB() {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show FAB only after scrolling down a bit, so it doesn't overlap header immediately
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 transition-all duration-300 transform lg:hidden block",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
            )}
        >
            <Link
                href="/contact"
                className="flex items-center justify-center p-4 bg-primary text-white rounded-full shadow-elevated hover:bg-primary-hover hover:-translate-y-1 hover:shadow-[0_20px_40px_-5px_rgba(0,92,185,0.4)] transition-all group"
            >
                <MessageSquarePlus size={24} />
                {/* Optional expanding text on hover or just icon on mobile */}
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-in-out whitespace-nowrap font-medium text-sm">
                    {t("btn_contact_us") || "Contact Us"}
                </span>
            </Link>
        </div>
    );
}
