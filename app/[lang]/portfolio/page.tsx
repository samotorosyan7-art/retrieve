import { getPortfolioItems } from "@/lib/wordpress";
import { buildAlternates } from "@/lib/seo";
import PortfolioPageHero from "@/components/website/PortfolioPageHero";
import PortfolioPageBody from "@/components/website/PortfolioPageBody";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return {
        title: "Portfolio",
        description: "Explore our comprehensive portfolio of legal services and tax & business advisory services in Armenia.",
        alternates: buildAlternates(lang, "/portfolio"),
    };
}

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
    const portfolioItems = await getPortfolioItems();

    return (
        <main className="min-h-screen">
            <PortfolioPageHero />
            <PortfolioPageBody items={portfolioItems} />
        </main>
    );
}
