import { notFound, permanentRedirect } from "next/navigation";
import { getContentTypeBySlug } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

/**
 * This route handles "flat" URLs like /en/some-slug and redirects them
 * to their correct prefixed paths (e.g., /en/blog/some-slug or /en/practice-areas/some-slug).
 * This resolves issues with stale Google indexing and inconsistent WordPress permalinks.
 */
export default async function SlugRedirector({ params }: Props) {
    const { lang, slug } = await params;

    // 1. Try to identify the content type from WordPress
    const type = await getContentTypeBySlug(slug);

    if (type === "post") {
        // All blog posts and legal articles now live under /blog/
        permanentRedirect(`/${lang}/blog/${slug}`);
    } 
    
    if (type === "portfolio") {
        // All practice areas live under /practice-areas/
        permanentRedirect(`/${lang}/practice-areas/${slug}`);
    }

    // 2. If no content is found, trigger the standard 404
    notFound();
}
