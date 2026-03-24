import Link from "@/components/ui/LocalizedLink";
import { cookies } from "next/headers";
import { MoveLeft, HelpCircle, FileText, Home } from "lucide-react";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";

const dictionaries = { en, am, ru };

export default async function NotFound() {
    const cookieStore = await cookies();
    const lang = ((await cookieStore.get("i18next"))?.value || "en") as keyof typeof dictionaries;
    const t = dictionaries[lang] || dictionaries.en;

    return (
        <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-6 pt-32 pb-20">
            <div className="max-w-2xl w-full text-center">
                {/* Visual element */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                        <span className="text-[20rem] font-black text-[#003d7a]">404</span>
                    </div>
                    <div className="relative z-10 flex justify-center">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#005CB9] border border-gray-100 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                            <HelpCircle size={48} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-[#005CB9]/10 border border-[#005CB9]/20 rounded-full px-4 py-1.5 text-[#005CB9] text-xs font-bold tracking-widest uppercase mb-6">
                        {t.error_page_lost || "Lost your way?"}
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#003d7a] mb-6 tracking-tight">
                        {t["404_title"] || "Page Not Found"}
                    </h1>
                    
                    <p className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed">
                        {t["404_subtitle"] || "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href="/" 
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#005CB9] hover:bg-[#003d7a] text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                        >
                            <Home size={18} />
                            {t.btn_back_home || "Back to Home"}
                        </Link>
                        
                        <Link 
                            href="/practice-areas" 
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#005CB9] border border-gray-200 px-8 py-4 rounded-full font-bold transition-all active:scale-95"
                        >
                            <FileText size={18} />
                            {t.nav_practice_areas || "Practice Areas"}
                        </Link>
                    </div>

                    {/* Bottom hint */}
                    <p className="mt-16 text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
                        <MoveLeft size={14} />
                        {t.error_page_explore || "Explore our legal services or head back to the homepage."}
                    </p>
                </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="fixed top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
        </div>
    );
}
