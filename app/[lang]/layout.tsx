import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import I18nProvider from "@/components/providers/I18nProvider";
import MobileFAB from "@/components/website/MobileFAB";
import { getPortfolioCategories } from "@/lib/wordpress";
import { cookies } from "next/headers";


export const metadata: Metadata = {
    title: {
        default: "Retrieve Legal & Tax | Law Firm in Armenia",
        template: "%s | Retrieve Legal & Tax"
    },
    description: "Expert legal and tax services in Armenia for businesses and individuals.",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
    alternates: {
        canonical: "https://www.retrieve.am/en/",
        languages: {
            "en": "https://www.retrieve.am/en/",
            "am": "https://www.retrieve.am/am/",
            "ru": "https://www.retrieve.am/ru/",
            "x-default": "https://www.retrieve.am/en/",
        },
    },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const practiceAreas = await getPortfolioCategories();
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";

    return (
        <html lang={lang} className="font-sans">
            <body className="antialiased text-text bg-background tracking-tight">
                <I18nProvider lang={lang}>
                    <div className="flex flex-col min-h-screen">
                        <Header practiceAreas={practiceAreas} />
                        <main className="flex-grow">{children}</main>
                        <Footer practiceAreas={practiceAreas} />
                        <MobileFAB />
                    </div>
                </I18nProvider>
            </body>
        </html>
    );
}
