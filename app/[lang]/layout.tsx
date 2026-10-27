import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import I18nProvider from "@/components/providers/I18nProvider";
import MobileFAB from "@/components/website/MobileFAB";
import { getPracticeAreasNav } from "@/lib/wordpress";
import { LOCALES } from "@/lib/seo";
import Script from "next/script";


export const metadata: Metadata = {
    metadataBase: new URL("https://www.retrieve.am"),
    title: {
        default: "Retrieve Legal & Tax | Law Firm in Armenia",
        template: "%s | Retrieve Legal & Tax"
    },
    description: "Expert legal and tax services in Armenia for businesses and individuals.",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.png", type: "image/png" },
        ],
        apple: "/favicon.png",
    },
    openGraph: {
        images: ["https://www.retrieve.am/logo.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        images: ["https://www.retrieve.am/logo.jpg"],
    },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const practiceAreas = await getPracticeAreasNav();
    const { lang: routeLang } = await params;
    const lang = (LOCALES as readonly string[]).includes(routeLang) ? routeLang : "en";

    return (
        <html lang={lang} className="font-sans">
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=AW-18179368906"
                strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'AW-18179368906');
                `}
            </Script>
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
