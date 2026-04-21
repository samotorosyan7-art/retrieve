"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Language {
    code: string;
    name: string;
    flag: string;
}

const languages: Language[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "am", name: "Հայերեն", flag: "🇦🇲" },
];

export default function LanguageSelector() {
    const { i18n, t } = useTranslation();
    const router = useRouter();
    const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
    const [isOpen, setIsOpen] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        const langCode = i18n.resolvedLanguage || i18n.language || "en";
        const found = languages.find(l => l.code === langCode);
        if (found) {
            setCurrentLang(found);
        }
    }, [i18n.language, i18n.resolvedLanguage]);

    const handleLanguageChange = (lang: Language) => {
        i18n.changeLanguage(lang.code);
        setCurrentLang(lang);
        setIsOpen(false);
        localStorage.setItem("preferred-language", lang.code);
        // Set cookie for server-side access
        document.cookie = `i18next=${lang.code}; path=/; max-age=31104000`; // 1 year
        
        // Push router to new lang path
        let newPathname = pathname || "/";
        const parts = newPathname.split("/");
        
        if (parts.length > 1 && ["en", "ru", "am"].includes(parts[1])) {
            parts[1] = lang.code;
            
            // Special handling for detail pages to avoid 404s when slugs are not shared across languages
            if (parts.length > 3) {
                if (parts[2] === "blog") {
                    newPathname = `/${lang.code}/blog`;
                } else if (parts[2] === "personnel") {
                    newPathname = `/${lang.code}/our-team`;
                } else if (parts[2] === "legal-services") {
                    newPathname = `/${lang.code}/legal-services`;
                } else if (parts[2] === "tax-and-business-advisory-services") {
                    newPathname = `/${lang.code}/tax-and-business-advisory-services`;
                } else {
                    newPathname = parts.join("/");
                }
            } else {
                newPathname = parts.join("/") || "/";
            }
        } else {
            // Unlikely to hit this if middleware is strictly rewriting, but fallback
            newPathname = `/${lang.code}${newPathname}`;
        }
        
        router.push(newPathname);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t("select_language", { defaultValue: "Select language" })}
                aria-expanded={isOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
                <span className="text-xl">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-medium border border-gray-100 overflow-hidden z-50 min-w-[150px]">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left",
                                    currentLang.code === lang.code && "bg-primary/5 text-primary"
                                )}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span className="text-sm font-medium">{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
