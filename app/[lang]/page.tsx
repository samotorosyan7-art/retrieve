
import { cookies } from "next/headers";
import Hero from "@/components/website/Hero";
import WhyChooseUs from "@/components/website/WhyChooseUs";
import ClientsCarousel from "@/components/website/ClientsCarousel";
import Testimonials from "@/components/website/Testimonials";

import TeamSection from "@/components/website/TeamSection";
import BlogSection from "@/components/website/BlogSection";
import Newsletter from "@/components/website/Newsletter";
import PopularGuides from "@/components/website/PopularGuides";
import AboutPreviewNew from "@/components/website/AboutPreview";
import LegalPractices from "@/components/website/LegalPractices";
import TaxAdvisoryGrid from "@/components/website/TaxAdvisoryGrid";
import ContactSection from "@/components/website/ContactSection";
import { getPortfolioItems, getTeamMembers, getLegalUpdates, getClientLogos, getYoastMetadata, getMasonryPosts } from "@/lib/wordpress";

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";
    return getYoastMetadata("/", lang);
}


export const dynamic = "force-dynamic";

export default async function HomePage() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";

    const portfolioItems = await getPortfolioItems(lang);
    const teamMembers = await getTeamMembers(lang);
    const { posts } = await getLegalUpdates(1, 6, lang);
    const clientLogos = await getClientLogos(lang);
    const { posts: masonryPosts } = await getMasonryPosts(6, lang);
    const orderSlugs = [
        "corporate-business-law",
        "immigration-residence-services",
        "employment-law",
        "intellectual-property-law",
        "real-estate-construction-law",
        "investment-law",
        "arbitration-ligitation"
    ];

    const legalItems = portfolioItems
        .filter(item => item.category === "Legal services")
        .sort((a, b) => {
            const aIdx = orderSlugs.indexOf(a.slug);
            const bIdx = orderSlugs.indexOf(b.slug);
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
            if (aIdx !== -1) return -1;
            if (bIdx !== -1) return 1;
            return 0;
        });
        
    const taxItems = portfolioItems.filter(item => item.category === "Tax & Business advisory services");

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Organization", "LegalService"],
                "@id": `https://www.retrieve.am/${lang}/#organization`,
                "name": "Retrieve Legal & Tax",
                "url": `https://www.retrieve.am/${lang}`,
                "logo": "https://www.retrieve.am/logo.jpg",
                "image": "https://www.retrieve.am/logo.jpg",
                "description": "Retrieve Legal & Tax is a trusted law firm in Armenia, providing legal and tax advisory services to businesses and individuals.",
                "telephone": "+37441777332",
                "email": "info@retrieve.am",
                "priceRange": "$$",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "telephone": "+37441777332",
                    "email": "info@retrieve.am",
                    "availableLanguage": ["English", "Armenian", "Russian"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Argishti 11/11",
                    "addressLocality": "Yerevan",
                    "postalCode": "0015",
                    "addressCountry": "AM"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 40.1741,
                    "longitude": 44.5038
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday"
                    ],
                    "opens": "09:00",
                    "closes": "18:00"
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Armenia"
                },
                "sameAs": [
                    "https://www.linkedin.com/company/retrievelegal/"
                ]
            },
            {
                "@type": "WebSite",
                "@id": `https://www.retrieve.am/${lang}/#website`,
                "url": `https://www.retrieve.am/${lang}`,
                "name": "Retrieve Legal & Tax",
                "publisher": {
                    "@id": `https://www.retrieve.am/${lang}/#organization`
                }
            },
            {
                "@type": "WebPage",
                "@id": `https://www.retrieve.am/${lang}/#webpage`,
                "url": `https://www.retrieve.am/${lang}`,
                "name": "Retrieve Legal & Tax",
                "isPartOf": {
                    "@id": `https://www.retrieve.am/${lang}/#website`
                },
                "about": {
                    "@id": `https://www.retrieve.am/${lang}/#organization`
                },
                "mainEntity": {
                    "@id": `https://www.retrieve.am/${lang}/#organization`
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero />
            <PopularGuides posts={masonryPosts} />
            <AboutPreviewNew />
            <LegalPractices items={legalItems} />
            <TaxAdvisoryGrid items={taxItems} />
            <WhyChooseUs />
            <ClientsCarousel logos={clientLogos} />
            <TeamSection teamMembers={teamMembers} />
            <BlogSection posts={posts} />
            <Testimonials />
            <ContactSection />
            <Newsletter />
        </>
    );
}
