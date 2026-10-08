import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PracticeAreasPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    permanentRedirect(`/${lang}/legal-services`);
}
