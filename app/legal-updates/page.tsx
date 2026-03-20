import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { getLegalUpdatesPDFs, getYoastMetadata } from "@/lib/wordpress";
import { Download, FileText } from "lucide-react";
import enCommon from "@/locales/en/common.json";
import ruCommon from "@/locales/ru/common.json";
import amCommon from "@/locales/am/common.json";

const dictionaries = {
    en: enCommon,
    ru: ruCommon,
    am: amCommon,
} as const;

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    return getYoastMetadata("/legal-updates", lang);
}

export default async function LegalUpdatesPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const t = dictionaries[lang] || dictionaries.en;
    const pdfs = await getLegalUpdatesPDFs();

    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-44 pb-24">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6">
                        <FileText size={13} />
                        {t.legal_updates_badge}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight">
                        {t.legal_updates_title}
                    </h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        {t.legal_updates_desc}
                    </p>
                </div>
            </div>

            {/* PDFs Grid */}
            <div className="container mx-auto px-4 md:px-8 py-20">
                {pdfs.length === 0 ? (
                    <div className="text-center py-24">
                        <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-500">
                            {t.legal_updates_empty}
                        </h2>
                        <p className="text-gray-400 mt-2">
                            {t.legal_updates_empty_desc}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                        {pdfs.map((pdf, idx) => (
                            <Link
                                key={idx}
                                href={pdf.pdfLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:border-[#005CB9]/20 transition-all duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-1"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#003d7a] to-[#005CB9] overflow-hidden shrink-0 border-b border-gray-50">
                                    {pdf.image ? (
                                        <Image
                                            src={pdf.image}
                                            alt={pdf.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText size={48} className="text-white/20" />
                                        </div>
                                    )}
                                    {/* Hover Overlay Glassmorphism */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="bg-[#005CB9] text-white p-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <Download size={24} />
                                        </div>
                                    </div>

                                    {/* PDF Badge */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#005CB9] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                        <FileText size={12} />
                                        PDF
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1 relative bg-white z-10">
                                    <h2
                                        className="text-lg font-bold text-gray-900 group-hover:text-[#005CB9] transition-colors leading-snug line-clamp-3"
                                        title={pdf.title}
                                    >
                                        {pdf.title}
                                    </h2>

                                    {/* Download Footer */}
                                    <div className="mt-auto pt-6 flex flex-col">
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#005CB9]">
                                            {t.btn_download_article}
                                            <div className="w-6 h-6 rounded-full bg-[#005CB9]/5 flex items-center justify-center group-hover:bg-[#005CB9]/10 group-hover:translate-x-1 transition-all">
                                                <Download size={12} />
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003d7a] to-[#005CB9] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-20" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
