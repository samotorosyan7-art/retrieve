import { getPortfolioItems } from "@/lib/wordpress";
import PortfolioPageHero from "@/components/website/PortfolioPageHero";
import PortfolioPageBody from "@/components/website/PortfolioPageBody";

export const metadata = {
    title: "Portfolio - Our Practice Areas | Retrieve",
    description: "Explore our comprehensive portfolio of legal services and tax & business advisory services.",
};

export default async function PortfolioPage() {
    const portfolioItems = await getPortfolioItems();

    return (
        <main className="min-h-screen">
            <PortfolioPageHero />
            <PortfolioPageBody items={portfolioItems} />
        </main>
    );
}
