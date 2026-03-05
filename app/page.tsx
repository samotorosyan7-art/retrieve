import Hero from "@/components/website/Hero";
import WhyChooseUs from "@/components/website/WhyChooseUs";
import ClientsCarousel from "@/components/website/ClientsCarousel";
import Testimonials from "@/components/website/Testimonials";

import TeamSection from "@/components/website/TeamSection";
import BlogSection from "@/components/website/BlogSection";
import Newsletter from "@/components/website/Newsletter";
import LegalPractices from "@/components/website/LegalPractices";
import TaxAdvisoryGrid from "@/components/website/TaxAdvisoryGrid";
import { getPortfolioItems, getTeamMembers, getBlogPosts, getTestimonials, getClientLogos, getWhyChooseUs } from "@/lib/wordpress";

export default async function HomePage() {
    const portfolioItems = await getPortfolioItems();
    const teamMembers = await getTeamMembers();
    const { posts } = await getBlogPosts(3);
    const testimonials = await getTestimonials();
    const clientLogos = await getClientLogos();
    const whyChooseUs = await getWhyChooseUs();
    const legalItems = portfolioItems.filter(item => item.category === "Legal services");
    const taxItems = portfolioItems.filter(item => item.category === "Tax & Business advisory services");

    return (
        <>
            <Hero />
            <LegalPractices items={legalItems} />
            <TaxAdvisoryGrid items={taxItems} />
            <WhyChooseUs reasons={whyChooseUs} />
            <ClientsCarousel logos={clientLogos} />

            <Testimonials testimonials={testimonials} />

            <TeamSection teamMembers={teamMembers} />

            <BlogSection posts={posts} />
            <Newsletter />
        </>
    );
}
