import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Linkedin, ArrowLeft, User, GraduationCap, Scale, MapPin } from "lucide-react";
import { getPersonnelDetails, getTeamMembers, getYoastMetadata } from "@/lib/wordpress";
import PracticeAreasAccordion from "@/components/website/PracticeAreasAccordion";

interface PersonnelPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: PersonnelPageProps) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || "en";
    return getYoastMetadata(`/personnel/${slug}`, lang);
}

export async function generateStaticParams() {
    const teamMembers = await getTeamMembers();
    return teamMembers.map((member) => {
        const slug = member.link?.split("/personnel/")[1]?.replace(/\//g, "") || "";
        return { slug };
    }).filter(p => p.slug);
}

export default async function PersonnelPage({ params }: PersonnelPageProps) {
    const { slug } = await params;
    const personnel = await getPersonnelDetails(slug);

    if (!personnel) notFound();

    const linkedinUrl = personnel.linkedin
        ? personnel.linkedin.startsWith("http") ? personnel.linkedin : `https://${personnel.linkedin}`
        : null;

    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* ── Thin top bar with back link ── */}
            <div className="bg-white border-b border-gray-100 pt-28 pb-0">
                <div className="container mx-auto px-4 md:px-8 py-4">
                    <Link
                        href="/our-team"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#005CB9] transition-colors group"
                    >
                        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Our Team
                    </Link>
                </div>
            </div>

            {/* ── Two-column body ── */}
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* ═══════════════════════════════
                        LEFT COLUMN — Photo + Info
                    ═══════════════════════════════ */}
                    <aside className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-28 space-y-6">

                        {/* Photo card */}
                        <div className="rounded-3xl overflow-hidden shadow-lg border border-white bg-white">
                            <div className="relative w-full aspect-[3/4]">
                                {personnel.image ? (
                                    <Image
                                        src={personnel.image}
                                        alt={personnel.name}
                                        fill
                                        className="object-cover object-top"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <User size={72} className="text-gray-300" />
                                    </div>
                                )}
                                {/* Blue gradient overlay at bottom */}
                                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#003d7a]/90 via-[#005CB9]/40 to-transparent" />

                                {/* Name + position on photo */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h1 className="text-2xl font-extrabold text-white leading-tight mb-1">
                                        {personnel.name}
                                    </h1>
                                    {personnel.position && (
                                        <p className="text-blue-200 text-sm font-medium">{personnel.position}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact info card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Contact</h3>

                            {personnel.email && (
                                <a href={`mailto:${personnel.email}`} className="flex items-start gap-3 group">
                                    <div className="w-9 h-9 rounded-xl bg-[#005CB9]/10 flex items-center justify-center shrink-0 group-hover:bg-[#005CB9] transition-colors mt-0.5">
                                        <Mail size={15} className="text-[#005CB9] group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-gray-400 font-medium mb-0.5">Email</div>
                                        <div className="text-sm font-semibold text-gray-800 break-all group-hover:text-[#005CB9] transition-colors">{personnel.email}</div>
                                    </div>
                                </a>
                            )}

                            {personnel.phone && (
                                <a href={`tel:${personnel.phone}`} className="flex items-start gap-3 group">
                                    <div className="w-9 h-9 rounded-xl bg-[#005CB9]/10 flex items-center justify-center shrink-0 group-hover:bg-[#005CB9] transition-colors mt-0.5">
                                        <Phone size={15} className="text-[#005CB9] group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-gray-400 font-medium mb-0.5">Phone</div>
                                        <div className="text-sm font-semibold text-gray-800 group-hover:text-[#005CB9] transition-colors">{personnel.phone}</div>
                                    </div>
                                </a>
                            )}

                            {linkedinUrl && (
                                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                                    <div className="w-9 h-9 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0A66C2] transition-colors mt-0.5">
                                        <Linkedin size={15} className="text-[#0A66C2] group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-gray-400 font-medium mb-0.5">LinkedIn</div>
                                        <div className="text-sm font-semibold text-gray-800 group-hover:text-[#0A66C2] transition-colors">View Profile →</div>
                                    </div>
                                </a>
                            )}

                            {/* Location — static for now */}
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin size={15} className="text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-[11px] text-gray-400 font-medium mb-0.5">Location</div>
                                    <div className="text-sm font-semibold text-gray-800">Yerevan, Armenia</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link
                            href="/contact"
                            className="block w-full text-center bg-gradient-to-r from-[#004791] to-[#005CB9] hover:from-[#003d7a] hover:to-[#004791] text-white font-bold text-sm rounded-2xl px-6 py-4 transition-all shadow-lg shadow-blue-900/20"
                        >
                            Schedule a Consultation
                        </Link>
                    </aside>

                    {/* ═══════════════════════════════
                        RIGHT COLUMN — Bio + Areas
                    ═══════════════════════════════ */}
                    <main className="flex-1 min-w-0 space-y-10">

                        {/* Biography */}
                        {personnel.biography && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#005CB9]/10 flex items-center justify-center">
                                        <User size={20} className="text-[#005CB9]" />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-gray-900">Biography</h2>
                                </div>
                                <div
                                    className="prose prose-lg max-w-none text-gray-600 leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5"
                                    dangerouslySetInnerHTML={{ __html: personnel.biography }}
                                />
                            </div>
                        )}

                        {/* Practice Areas */}
                        {personnel.practiceAreas && personnel.practiceAreas.length > 0 && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#005CB9]/10 flex items-center justify-center">
                                        <Scale size={20} className="text-[#005CB9]" />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-gray-900">Practice Areas</h2>
                                </div>
                                <PracticeAreasAccordion areas={personnel.practiceAreas} />
                            </div>
                        )}

                        {/* Education */}
                        {personnel.education && personnel.education.length > 0 && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#005CB9]/10 flex items-center justify-center">
                                        <GraduationCap size={20} className="text-[#005CB9]" />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-gray-900">Education & Bar Admission</h2>
                                </div>
                                <div className="relative pl-6 border-l-2 border-[#005CB9]/20 space-y-8">
                                    {personnel.education.map((edu, index) => (
                                        <div key={index} className="relative">
                                            <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-[#005CB9] border-4 border-white shadow-md" />
                                            <div className="bg-[#F4F7FB] rounded-xl p-5 border border-gray-100">
                                                {edu.year && (
                                                    <span className="inline-block text-xs font-bold text-[#005CB9] bg-[#005CB9]/10 rounded-full px-3 py-1 mb-2">
                                                        {edu.year}
                                                    </span>
                                                )}
                                                {edu.degree && <div className="font-bold text-gray-900 mb-1">{edu.degree}</div>}
                                                {edu.institution && <div className="text-sm text-gray-500">{edu.institution}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}
