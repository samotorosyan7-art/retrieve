import { permanentRedirect } from "next/navigation";

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

/**
 * All WordPress posts now live under /blog/. 
 * This page redirects old /legal-updates/[slug] URLs to /en/blog/[slug].
 */
export default async function LegalUpdateRedirector({ params }: Props) {
    const { lang, slug } = await params;
    permanentRedirect(`/${lang}/blog/${slug}`);
}
