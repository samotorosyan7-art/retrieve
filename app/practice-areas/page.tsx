
import PageHero from "@/components/website/PageHero";
import PracticeAreasGrid from "@/components/website/PracticeAreasGrid";
import { getPortfolioItems } from "@/lib/wordpress";

export default async function PracticeAreasPage() {
    const items = await getPortfolioItems();

    return (
        <div className="pt-24 min-h-screen bg-gray-50">
            <PracticeAreasGrid items={items} />
        </div>
    );
}
