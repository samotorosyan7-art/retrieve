import { getTeamMembers, getYoastMetadata } from "@/lib/wordpress";
import AboutUsClient from "./AboutUsClient";

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
    return <AboutUsClient teamMembers={teamMembers} />;
}
