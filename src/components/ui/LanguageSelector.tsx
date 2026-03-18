"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
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
    const { i18n } = useTranslation();
    const router = useRouter();
    const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
    const [isOpen, setIsOpen] = useState(false);

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
        
        // Refresh server components
        router.refresh();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
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
