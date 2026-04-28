"use client";

import { Facebook, Linkedin, Instagram, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "@/components/ui/LocalizedLink";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@/types/wordpress";

const SOCIAL_LINKS = [
    {
        href: "https://www.facebook.com/retrievelegalandtax",
        Icon: Facebook,
        label: "Facebook",
    },
    {
        href: "https://www.linkedin.com/company/retrievelegal/",
        Icon: Linkedin,
        label: "LinkedIn",
    },
    {
        href: "https://www.instagram.com/retrieve.legal/",
        Icon: Instagram,
        label: "Instagram",
    },
];

const QUICK_LINKS = [
    { label: "nav_home", href: "/" },
    { label: "nav_about_us", href: "/about-us" },
    { label: "nav_practice_areas", href: "/legal-services" },
    { label: "nav_blog", href: "/blog" },
    { label: "nav_legal_updates", href: "/legal-updates" },
    { label: "nav_contact", href: "/contact" },
];

interface FooterProps {
    practiceAreas?: MenuItem[];
}

export default function Footer({ practiceAreas = [] }: FooterProps) {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-8">
                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

                    {/* Column 1: Brand + social */}
                    <div className="sm:col-span-2 lg:col-span-1 space-y-6">
                        <Link href="/" className="inline-block">
                            <div className="bg-white rounded-xl px-3 py-2 inline-block">
                                <Image
                                    src="/logo.png"
                                    alt="Retrieve"
                                    width={130}
                                    height={36}
                                    className="h-8 w-auto object-contain"
                                />
                            </div>
                        </Link>
                        <p className="leading-relaxed text-gray-400 text-sm">
                            {t("footer_description")}
                        </p>
                        <div className="flex gap-3">
                            {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 bg-gray-800 flex items-center justify-center rounded-xl text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>

                        {/* Contact mini-list */}
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3 group">
                                <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0 mt-0.5">
                                    <MapPin size={14} />
                                </div>
                                <span className="text-gray-400">{t("footer_address")}</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                    <Phone size={14} />
                                </div>
                                <a href="tel:+37441777332" className="text-gray-400 hover:text-white transition-colors">+374 41 777 332</a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                    <Mail size={14} />
                                </div>
                                <a href="mailto:info@retrieve.am" className="text-gray-400 hover:text-white transition-colors">info@retrieve.am</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-base font-bold text-white flex items-center gap-3">
                            <span className="w-1 h-6 bg-primary rounded-full block shrink-0" />
                            {t("footer_quick_links")}
                        </h3>
                        <ul className="space-y-2.5">
                            {QUICK_LINKS.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors group"
                                    >
                                        <ArrowRight size={13} className="text-gray-600 group-hover:text-primary transition-colors shrink-0" />
                                        {t(label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 & 4: Dynamic Practice Areas */}
                    {practiceAreas.map((category, idx) => {
                        const categoryRoute = category.label.toLowerCase().includes("tax")
                            ? "/tax-and-business-advisory-services"
                            : "/legal-services";
                        return (
                        <div key={idx} className="space-y-6">
                            <h3 className="text-base font-bold text-white flex items-center gap-3">
                                <span className="w-1 h-6 bg-primary rounded-full block shrink-0" />
                                {t(`practice_categories.${category.label}`, { defaultValue: category.label })}
                            </h3>
                            {category.children && category.children.length > 0 && (
                                <ul className="space-y-2.5">
                                    {category.children.map((subItem, sIdx) => {
                                        const slug = subItem.url.replace(/\/$/, "").split("/").pop() || "";
                                        return (
                                        <li key={sIdx}>
                                            <Link
                                                href={`${categoryRoute}/${slug}`}
                                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors group"
                                            >
                                                <ArrowRight size={13} className="text-gray-600 group-hover:text-primary transition-colors shrink-0" />
                                                {t(`practice_titles.${subItem.label}`, { defaultValue: subItem.label })}
                                            </Link>
                                        </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                        );
                    })}
                </div>

                {/* ── Bottom bar ── */}
                <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} Retrieve Law Firm. {t("footer_rights")}</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">{t("footer_privacy_policy")}</Link>
                        <Link href="#" className="hover:text-white transition-colors">{t("footer_terms_of_service")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
