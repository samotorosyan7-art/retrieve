"use client";

import { useState } from "react";
import { ChevronDown, Scale, BookOpen, ShieldCheck, Building, Plane, Building2, Gavel, Zap, Briefcase, FileText, HeartPulse, Bitcoin, Users, Shield, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface PracticeAreasAccordionProps {
    areas: string[];
}

const getAreaIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("corporate") || l.includes("business") || l.includes("կորպ") || l.includes("корп")) return Building2;
    if (l.includes("tax") && !l.includes("advisory") || l.includes("հարկ") || l.includes("налог")) return FileText;
    if (l.includes("immigration") || l.includes("residency") || l.includes("ներ") || l.includes("иммигр") || l.includes("визо") || l.includes("կաց")) return Plane;
    if (l.includes("intellectual property") || l.includes(" ip") || l.includes("մտավոր") || l.includes("интеллект")) return ShieldCheck;
    if (l.includes("real estate") || l.includes("construction") || l.includes("անշ") || l.includes("недвиж") || l.includes("строит")) return Building;
    if (l.includes("banking") || l.includes("finance") || l.includes("բան") || l.includes("банк") || l.includes("финанс")) return Briefcase;
    if (l.includes("competition") || l.includes("antitrust") || l.includes("մրց") || l.includes("конкур") || l.includes("антимон")) return BarChart2;
    if (l.includes("energy") || l.includes("էներ") || l.includes("энерг")) return Zap;
    if (l.includes("investment") || l.includes("ներդ") || l.includes("инвест")) return BookOpen;
    if (l.includes("it") || l.includes("data") || l.includes("digital") || l.includes("տվ") || l.includes("данн")) return Shield;
    if (l.includes("health") || l.includes("pharma") || l.includes("առող") || l.includes("здрав") || l.includes("фарм")) return HeartPulse;
    if (l.includes("arbitration") || l.includes("litigation") || l.includes("արբ") || l.includes("դատ") || l.includes("арбитр") || l.includes("судеб")) return Gavel;
    if (l.includes("crypto") || l.includes("blockchain") || l.includes("կրիպ") || l.includes("крипт") || l.includes("блокч")) return Bitcoin;
    if (l.includes("employment") || l.includes("labor") || l.includes("աշխ") || l.includes("труд")) return Users;
    return Scale;
};

const getAreaKey = (label: string): string => {
    const l = label.toLowerCase();
    if (l.includes("corporate") || l.includes("business") || l.includes("կորպ") || l.includes("корп") || l.includes("կոմ")) return "corporate";
    if ((l.includes("tax") && !l.includes("advisory")) || l.includes("հարկ") || l.includes("налог")) return "tax";
    if (l.includes("immigration") || l.includes("residency") || l.includes("иммигр") || l.includes("կաց") || l.includes("ներ") || l.includes("визо")) return "immigration";
    if (l.includes("intellectual property") || l.includes(" ip") || l.includes("մտավոր") || l.includes("интеллект")) return "ip";
    if (l.includes("real estate") || l.includes("construction") || l.includes("անշ") || l.includes("недвиж") || l.includes("строит")) return "real_estate";
    if (l.includes("banking") || l.includes("finance") || l.includes("բան") || l.includes("банк") || l.includes("финанс")) return "banking";
    if (l.includes("competition") || l.includes("antitrust") || l.includes("մրց") || l.includes("конкур") || l.includes("антимон")) return "competition";
    if (l.includes("energy") || l.includes("էներ") || l.includes("энерг")) return "energy";
    if (l.includes("investment") || l.includes("ներդ") || l.includes("инвест")) return "investment";
    if (l.includes("it") || l.includes("data") || l.includes("digital") || l.includes("տվ") || l.includes("данн")) return "it";
    if (l.includes("health") || l.includes("pharma") || l.includes("առող") || l.includes("здрав") || l.includes("фарм")) return "health";
    if (l.includes("arbitration") || l.includes("litigation") || l.includes("արբ") || l.includes("դատ") || l.includes("арбитр") || l.includes("судеб")) return "arbitration";
    if (l.includes("crypto") || l.includes("blockchain") || l.includes("կրիպ") || l.includes("крипт") || l.includes("блокч")) return "crypto";
    if (l.includes("employment") || l.includes("labor") || l.includes("աշխ") || l.includes("труд")) return "employment";
    return "";
};

export default function PracticeAreasAccordion({ areas }: PracticeAreasAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const { t } = useTranslation();

    return (
        <div className="space-y-2">
            {areas.map((area, index) => {
                const Icon = getAreaIcon(area);
                const key = getAreaKey(area);
                const titleKey = key ? `practice_area_title_${key}` : "";
                const descKey = key ? `practice_area_desc_${key}` : "practice_area_desc_default";
                const title = titleKey ? t(titleKey, { defaultValue: area }) : area;
                const isOpen = openIndex === index;
                return (
                    <div
                        key={index}
                        className={cn(
                            "bg-white rounded-xl border overflow-hidden transition-all duration-200",
                            isOpen ? "border-[#005CB9]/40 shadow-md" : "border-gray-100 shadow-sm hover:border-[#005CB9]/20"
                        )}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                    isOpen ? "bg-[#005CB9] text-white" : "bg-[#005CB9]/10 text-[#005CB9]"
                                )}>
                                    <Icon size={17} />
                                </div>
                                <span className="text-sm font-bold text-gray-800">{title}</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={cn("text-gray-400 shrink-0 transition-transform duration-200", isOpen && "rotate-180 text-[#005CB9]")}
                            />
                        </button>

                        {isOpen && (
                            <div className="px-5 pb-4 pt-1 border-t border-gray-100 pl-[60px]">
                                <p className="text-gray-500 text-sm leading-relaxed">{t(descKey)}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
