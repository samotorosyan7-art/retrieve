
import { cookies } from "next/headers";
import Hero from "@/components/website/Hero";
import WhyChooseUs from "@/components/website/WhyChooseUs";
import ClientsCarousel from "@/components/website/ClientsCarousel";
import Testimonials from "@/components/website/Testimonials";

import TeamSection from "@/components/website/TeamSection";
import BlogSection from "@/components/website/BlogSection";
import Newsletter from "@/components/website/Newsletter";
import LegalPractices from "@/components/website/LegalPractices";
import TaxAdvisoryGrid from "@/components/website/TaxAdvisoryGrid";
import ContactSection from "@/components/website/ContactSection";
import { getPortfolioItems, getTeamMembers, getLegalUpdates, getClientLogos, getYoastMetadata } from "@/lib/wordpress";

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
        "@type": ["LegalService", "ProfessionalService", "Attorney"],
        "@id": "https://www.retrieve.am/#organization",
        "name": "Retrieve Legal & Tax",
        "url": "https://www.retrieve.am",
        "logo": "https://www.retrieve.am/logo.png",
        "image": "https://www.retrieve.am/logo.png",
        "description": "Expert Legal and Tax Services, Lawyer Consultation, and Legal Setup in Armenia. We provide corporate law, tax advisory, and business setup support.",
        "telephone": "+374 41 777 332",
        "email": "info@retrieve.am",
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
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
        },
        "timeZone": "Asia/Yerevan", 
        "priceRange": "$$",
        "areaServed": {
            "@type": "Country",
            "name": "Armenia"
        },
        "sameAs": [
            "https://www.linkedin.com/company/retrievelegal/"
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Legal and Tax Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Legal Setup in Armenia"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Lawyer Consultation"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Tax Advisory Services"
                    }
                }
            ]
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero />
            <LegalPractices items={legalItems} />
            <TaxAdvisoryGrid items={taxItems} />
            <BlogSection posts={posts} />
            <WhyChooseUs />
            <ClientsCarousel logos={clientLogos} />
            <TeamSection teamMembers={teamMembers} />
            <Testimonials />
            <ContactSection />
            <Newsletter />
        </>
    );
}
