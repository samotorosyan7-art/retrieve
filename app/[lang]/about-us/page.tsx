import { getTeamMembers, getYoastMetadata } from "@/lib/wordpress";
import AboutUsClient from "./AboutUsClient";
import { aboutSchema } from "@/data/about-schema";

interface Props {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { lang } = await params;
    return getYoastMetadata("/about-us", lang);
}

export const dynamic = "force-dynamic";

export default async function AboutUsPage({ params }: Props) {
    const { lang } = await params;
    const teamMembers = await getTeamMembers(lang);
    const jsonLd = aboutSchema[lang] ?? aboutSchema.en;
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutUsClient teamMembers={teamMembers} />
        </>
    );
}
