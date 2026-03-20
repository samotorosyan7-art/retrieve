import { getTeamMembers, getYoastMetadata } from "@/lib/wordpress";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Linkedin } from "lucide-react";
import TeamPageHero from "@/components/website/TeamPageHero";

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";
    return getYoastMetadata("/our-team", lang);
}


export default async function OurTeamPage() {
    const teamMembers = await getTeamMembers();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <TeamPageHero />

            {/* Team Grid */}
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member) => {
                        // Extract slug from WordPress link for local routing
                        const slug = member.link?.split("/personnel/")[1]?.replace(/\//g, "") || "";
                        const localLink = slug ? `/personnel/${slug}` : "#";

                        return (
                            <Link
                                key={member.id}
                                href={localLink}
                                className="group block"
                            >
                                <Card className="overflow-hidden border-gray-200 hover:border-primary/30 hover:shadow-elevated transition-all duration-300 h-full">
                                    {/* Image Container */}
                                    <div className="relative h-[28rem] w-full overflow-hidden bg-gray-100">
                                        {member.image ? (
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <CardHeader className="text-center pb-2 pt-6 bg-gray-50">
                                        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-1">
                                            {member.name}
                                        </h3>
                                    </CardHeader>
                                    <CardContent className="text-center pb-6 bg-gray-50">
                                        <p className="text-gray-600 text-sm uppercase tracking-wider mb-4">
                                            {member.position}
                                        </p>

                                        {/* LinkedIn Icon */}
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 flex items-center justify-center text-gray-600 group-hover:text-primary transition-colors">
                                                <Linkedin size={20} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
