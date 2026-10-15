
import Hero from "@/components/website/Hero";
import WhyChooseUs from "@/components/website/WhyChooseUs";
import ClientsShowcase from "@/components/website/ClientsShowcase";
import Testimonials from "@/components/website/Testimonials";

import TeamSection from "@/components/website/TeamSection";
import BlogSection from "@/components/website/BlogSection";
import Newsletter from "@/components/website/Newsletter";
import PopularGuides from "@/components/website/PopularGuides";
import AboutPreviewNew from "@/components/website/AboutPreview";
import LegalPractices from "@/components/website/LegalPractices";
import TaxAdvisoryGrid from "@/components/website/TaxAdvisoryGrid";
import ContactSection from "@/components/website/ContactSection";
import { getPortfolioItems, getTeamMembers, getLegalUpdates, getYoastMetadata, getMasonryPosts } from "@/lib/wordpress";
import { homepageSchema } from "@/data/homepage-schema";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const lang = (await params).lang;
    return getYoastMetadata("/", lang);
}


export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
    const lang = (await params).lang;

    const portfolioItems = await getPortfolioItems(lang);
    const teamMembers = await getTeamMembers(lang);
    const { posts } = await getLegalUpdates(1, 6, lang);
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

    const jsonLd = homepageSchema[lang] ?? homepageSchema.en;

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
            <ClientsShowcase />
            <TeamSection teamMembers={teamMembers} />
            <BlogSection posts={posts} />
            <Testimonials />
            <ContactSection />
            <Newsletter />
        </>
    );
}
