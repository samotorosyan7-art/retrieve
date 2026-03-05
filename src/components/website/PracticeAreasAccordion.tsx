"use client";

import { useState } from "react";
import { ChevronDown, Scale, BookOpen, ShieldCheck, Building, Plane, Building2, Gavel, Zap, Briefcase, FileText, HeartPulse, Bitcoin, Users, Shield, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticeAreasAccordionProps {
    areas: string[];
}

const getAreaData = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("corporate") || l.includes("business")) return { icon: Building2, desc: "Legal structuring, corporate governance, and transactions for businesses of all sizes." };
    if (l.includes("tax") && !l.includes("advisory")) return { icon: FileText, desc: "Strategic tax planning, dispute resolution, and compliance with local and international regulations." };
    if (l.includes("immigration") || l.includes("residency")) return { icon: Plane, desc: "Visa applications, residency permits, and citizenship processes for individuals and families." };
    if (l.includes("intellectual property") || l.includes("ip")) return { icon: ShieldCheck, desc: "Protection of trademarks, copyrights, patents, and trade secrets." };
    if (l.includes("real estate") || l.includes("construction")) return { icon: Building, desc: "Property transactions, lease agreements, and development project legal support." };
    if (l.includes("banking") || l.includes("finance")) return { icon: Briefcase, desc: "Financial regulatory compliance, banking operations, and structured finance." };
    if (l.includes("competition")) return { icon: BarChart2, desc: "Antitrust compliance, merger reviews, and competition law advisory." };
    if (l.includes("energy")) return { icon: Zap, desc: "Regulatory framework navigation for energy production, distribution, and renewables." };
    if (l.includes("investment")) return { icon: BookOpen, desc: "Cross-border investment structuring, due diligence, and regulatory approvals." };
    if (l.includes("it") || l.includes("data privacy") || l.includes("data protection")) return { icon: Shield, desc: "GDPR compliance, data security frameworks, and tech sector regulatory advice." };
    if (l.includes("health") || l.includes("pharmaceuticals")) return { icon: HeartPulse, desc: "Healthcare licensing, pharmaceutical regulations, and medical sector compliance." };
    if (l.includes("arbitration") || l.includes("litigation")) return { icon: Gavel, desc: "Dispute resolution through arbitration and court litigation across jurisdictions." };
    if (l.includes("crypto") || l.includes("blockchain")) return { icon: Bitcoin, desc: "Legal advisory for crypto assets, blockchain ventures, and DeFi structures." };
    if (l.includes("employment") || l.includes("labor")) return { icon: Users, desc: "Employment contracts, HR policies, workforce regulations, and dispute advisory." };
    return { icon: Scale, desc: "Specialized legal advisory tailored to your specific needs and circumstances." };
};

export default function PracticeAreasAccordion({ areas }: PracticeAreasAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-2">
            {areas.map((area, index) => {
                const { icon: Icon, desc } = getAreaData(area);
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
                                <span className="text-sm font-bold text-gray-800">{area}</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={cn("text-gray-400 shrink-0 transition-transform duration-200", isOpen && "rotate-180 text-[#005CB9]")}
                            />
                        </button>

                        {isOpen && (
                            <div className="px-5 pb-4 pt-1 border-t border-gray-100 pl-[60px]">
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
