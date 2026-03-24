import { getPortfolioItems } from "@/lib/wordpress";
import PortfolioPageHero from "@/components/website/PortfolioPageHero";
import PortfolioPageBody from "@/components/website/PortfolioPageBody";

export const metadata = {
    title: "Portfolio",
    description: "Explore our comprehensive portfolio of legal services and tax & business advisory services in Armenia.",
};

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
