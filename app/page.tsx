import { Metadata } from "next";
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
import { getPortfolioItems, getTeamMembers, getLegalUpdates, getTestimonials, getClientLogos, getWhyChooseUs } from "@/lib/wordpress";

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";

    const titles = {
        en: "Retrieve Legal & Tax | Law Firm in Armenia",
        am: "Retrieve Legal & Tax | Իրավաբանական ընկերություն Հայաստանում",
        ru: "Retrieve Legal & Tax | Юридическая фирма в Армении"
    };

    const descriptions = {
        en: "Retrieve Legal & Tax is a law firm in Armenia providing corporate, tax, immigration, intellectual property, real estate, and dispute resolution services.",
        am: "Retrieve Legal & Tax-ը իրավաբանական ընկերություն է Հայաստանում, որը տրամադրում է կորպորատիվ, հարկային, միգրացիոն, մտավոր սեփականության, անշարժ գույքի և վեճերի լուծման ծառայություններ:",
        ru: "Retrieve Legal & Tax — юридическая фирма в Армении, предоставляющая корпоративные, налоговые, иммиграционные услуги, услуги в области интеллектуальной собственности, недвижимости и разрешения споров."
    };

    const title = titles[lang as keyof typeof titles] || titles.en;
    const description = descriptions[lang as keyof typeof descriptions] || descriptions.en;

    return {
        title: {
            absolute: title
        },
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: "https://www.retrieve.am/",
            siteName: "Retrieve Legal & Tax",
            images: [
                {
                    url: "https://www.retrieve.am/path-to-default-share-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Retrieve Legal & Tax",
                },
            ],
            locale: lang === "am" ? "hy_AM" : lang === "ru" ? "ru_RU" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: ["https://www.retrieve.am/path-to-default-share-image.jpg"],
        },
    };
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
    const legalItems = portfolioItems.filter(item => item.category === "Legal services");
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
            <WhyChooseUs reasons={whyChooseUs} />
            <BlogSection posts={posts} />
            <ClientsCarousel logos={clientLogos} />
            <TeamSection teamMembers={teamMembers} />
            <Testimonials testimonials={testimonials} />
            <ContactSection />
            <Newsletter />
        </>
    );
}
