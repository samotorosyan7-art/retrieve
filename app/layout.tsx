import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import I18nProvider from "@/components/providers/I18nProvider";
import MobileFAB from "@/components/website/MobileFAB";
import { getPortfolioCategories } from "@/lib/wordpress";


export const metadata: Metadata = {
    title: "RETRIEVE - Legal & Tax Services",
    description: "Professional legal and tax services in Armenia",
    icons: {
        icon: "/logo.png",
        apple: "/logo.png",
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const practiceAreas = await getPortfolioCategories();

    return (
        <html lang="en" className="font-sans">
            <body className="antialiased text-text bg-background tracking-tight">
                <I18nProvider>
                    <div className="flex flex-col min-h-screen">
                        <Header practiceAreas={practiceAreas} />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                        <MobileFAB />
                    </div>
                </I18nProvider>
            </body>
        </html>
    );
}
