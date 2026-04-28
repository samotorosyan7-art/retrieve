import { cookies } from "next/headers";
import { getTeamMembers, getYoastMetadata } from "@/lib/wordpress";
import AboutUsClient from "./AboutUsClient";

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";
    return getYoastMetadata("/about-us", lang);
}

export const dynamic = "force-dynamic";

export default async function AboutUsPage() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";
    
    // Fetch team members for the consolidated About Us page
    const teamMembers = await getTeamMembers(lang);

    return <AboutUsClient teamMembers={teamMembers} />;
}
