"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export default function I18nProvider({ children, lang }: { children: React.ReactNode; lang: string }) {
    const [mounted, setMounted] = useState(false);

    // Sync language immediately during render if needed
    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    // We always wrap in I18nextProvider now to ensure consistent context
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
