import { cookies } from "next/headers";
import { permanentRedirect, notFound } from "next/navigation";
import { getPortfolioItems } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export default async function LegacyPracticeAreaRedirect({ params }: { params: Promise<{ slug: string, lang: string }> }) {
    const { slug, lang } = await params;
    
    // Find category for the item to redirect accurately
    const allAreas = await getPortfolioItems();
    const item = allAreas.find(a => a.slug === slug);
    
    if (!item) {
        // Fallback to legal-services if not found in list (or 404)
        permanentRedirect(`/${lang}/legal-services/${slug}`);
    }
    
    const basePath = item.category?.toLowerCase().includes("tax")
      ? "tax-and-business-advisory-services"
      : "legal-services";
      
    permanentRedirect(`/${lang}/${basePath}/${slug}`);
}
