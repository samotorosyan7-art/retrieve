
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
import { getPortfolioItems, getTeamMembers, getLegalUpdates, getTestimonials, getClientLogos, getWhyChooseUs, getYoastMetadata } from "@/lib/wordpress";

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";
    return getYoastMetadata("/", lang);
}



export default async function HomePage() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";

    const portfolioItems = await getPortfolioItems(lang);
    const teamMembers = await getTeamMembers(lang);
    const { posts } = await getLegalUpdates(1, 6, lang);
    const testimonials = await getTestimonials(lang);
    const clientLogos = await getClientLogos(lang);
    const whyChooseUs = await getWhyChooseUs(lang);
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
        "@type": "LegalService",
        "name": "Retrieve Legal & Tax",
        "url": "https://www.retrieve.am",
        "description": "Retrieve Legal & Tax is a law firm and advisory service in Armenia providing legal, tax, accounting, immigration, intellectual property, and business advisory support.",
        "telephone": "+374 41 777 332",
        "areaServed": "Armenia",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Yerevan",
            "addressCountry": "AM"
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
            <WhyChooseUs reasons={whyChooseUs} />
            <ClientsCarousel logos={clientLogos} />
            <TeamSection teamMembers={teamMembers} />
            <Testimonials testimonials={testimonials} />
            <ContactSection />
            <Newsletter />
        </>
    );
}
