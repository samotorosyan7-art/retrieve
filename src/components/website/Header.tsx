"use client";

import Link from "@/components/ui/LocalizedLink";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/wordpress";

interface HeaderProps {
    practiceAreas?: MenuItem[];
}

export default function Header({ practiceAreas = [] }: HeaderProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);
    const [expandedMobileCategories, setExpandedMobileCategories] = useState<Record<string, boolean>>({});
    const pathname = usePathname();
    const practiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close practice areas dropdown and mobile menu on route change
    useEffect(() => {
        setIsPracticeOpen(false);
        setIsOpen(false);
    }, [pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (practiceRef.current && !practiceRef.current.contains(e.target as Node)) {
                setIsPracticeOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const navLinks = [
        { name: t("nav_home"), href: "/" },
        { name: t("nav_our_team"), href: "/our-team" },
        { name: t("nav_blog"), href: "/blog" },
        { name: t("nav_legal_updates"), href: "/legal-updates" },
    ];

    const toggleMobileCategory = (label: string) => {
        setExpandedMobileCategories(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            {/* Top Bar - Contact Info Only */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center py-2 text-xs text-gray-600">
                    <div className="flex gap-4 items-center">
                        <a
                            href="tel:+37441777332"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                            <Phone size={14} className="text-primary" />
                            <span className="font-medium">+374 41 777 332</span>
                        </a>
                        <a
                            href="mailto:info@retrieve.am"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                            <Mail size={14} className="text-primary" />
                            <span className="font-medium">info@retrieve.am</span>
                        </a>
                    </div>
                    <div className="hidden sm:block text-gray-500">
                        {t("working_hours")}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div
                className={cn(
                    "transition-all duration-300",
                    scrolled ? "py-0" : "py-1"
                )}
            >
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="RETRIEVE Legal & Tax"
                            width={180}
                            height={100}
                            priority
                            className="h-24 w-auto"
                        />
                    </Link>
                    <nav className="hidden lg:flex gap-1 items-center">
                        {navLinks.slice(0, 1).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 px-4 py-2 rounded-full hover:text-[#005CB9] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Practice Areas Dropdown — state-based so it closes on navigate */}
                        <div ref={practiceRef} className="relative px-4 py-2 cursor-pointer">
                            <button
                                onClick={() => setIsPracticeOpen(v => !v)}
                                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#005CB9] transition-colors focus:outline-none"
                            >
                                {t("nav_practice_areas")}
                                <ChevronDown size={14} className={cn("transition-transform duration-200", isPracticeOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown panel */}
                            {isPracticeOpen && (
                                <div className="absolute top-full left-0 pt-2 w-72 z-50">
                                    <div className="bg-white rounded-xl shadow-medium border border-gray-100 p-2">
                                        {practiceAreas.map((category, idx) => (
                                            <div key={idx} className="relative group/sub">
                                                <Link
                                                    href="/practice-areas"
                                                    onClick={() => setIsPracticeOpen(false)}
                                                    className="flex items-center justify-between px-4 py-2.5 text-sm rounded-lg text-gray-700 font-semibold hover:text-[#005CB9] transition-colors"
                                                >
                                                    <span>
                                                        {t(`practice_categories.${category.label}`, { defaultValue: category.label })}
                                                    </span>
                                                    {category.children && category.children.length > 0 && (
                                                        <ChevronRight size={14} className="group-hover/sub:translate-x-1 transition-transform" />
                                                    )}
                                                </Link>

                                                {/* Level 2 Flyout */}
                                                {category.children && category.children.length > 0 && (
                                                    <div className="absolute top-0 left-full pl-2 w-72 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 transform -translate-x-2 group-hover/sub:translate-x-0 z-50">
                                                        <div className="bg-white rounded-xl shadow-medium border border-gray-100 p-1.5 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                            {category.children.map((subItem, sIdx) => (
                                                                <Link
                                                                    key={sIdx}
                                                                    href={subItem.url}
                                                                    onClick={() => setIsPracticeOpen(false)}
                                                                    className="block px-4 py-2 text-sm rounded-lg text-gray-600 hover:text-[#005CB9] transition-colors"
                                                                >
                                                                    {t(`practice_titles.${subItem.label}`, { defaultValue: subItem.label })}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {navLinks.slice(1).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 px-4 py-2 rounded-full hover:text-[#005CB9] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        <LanguageSelector />
                        <Button asChild className="rounded-full px-6 shadow-soft hover:shadow-medium transition-all">
                            <Link href="/contact" className="flex items-center gap-2">
                                {t("btn_contact_us")} <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={cn(
                "lg:hidden fixed inset-x-0 bg-white border-b border-gray-100 overflow-y-auto transition-all duration-300 ease-in-out shadow-medium custom-scrollbar",
                isOpen ? "max-h-[80vh] py-4 border-t" : "max-h-0 py-0"
            )}>
                <div className="container mx-auto px-4 flex flex-col gap-1">
                    <Link
                        href="/"
                        className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800 hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("nav_home")}
                    </Link>

                    {/* Mobile Practice Areas */}
                    <div className="flex flex-col">
                        <Link
                            href="/practice-areas"
                            className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-primary bg-primary/5 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("nav_practice_areas")}
                        </Link>

                        <div className="pl-6 flex flex-col mt-1 space-y-1 border-l-2 border-gray-100 ml-5 py-2">
                            {/* Removed 'All Practice Areas' and 'Our Portfolio' per request */}

                            {practiceAreas.map((category, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <button
                                        onClick={() => toggleMobileCategory(category.label)}
                                        className="flex items-center justify-between py-2 px-3 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-gray-50 text-left"
                                    >
                                        {t(`practice_categories.${category.label}`, { defaultValue: category.label })}
                                        {category.children && category.children.length > 0 && (
                                            <ChevronDown size={14} className={cn("transition-transform", expandedMobileCategories[category.label] && "rotate-180")} />
                                        )}
                                    </button>

                                    {/* Mobile Level 3 */}
                                    {expandedMobileCategories[category.label] && category.children && (
                                        <div className="pl-4 flex flex-col mt-1 space-y-0.5 border-l border-gray-100 ml-2 py-1">
                                            {category.children.map((subItem, sIdx) => (
                                                <Link
                                                    key={sIdx}
                                                    href={subItem.url}
                                                    onClick={() => setIsOpen(false)}
                                                    className="py-2 px-3 text-xs text-gray-500 hover:text-primary rounded-lg hover:bg-gray-50"
                                                >
                                                    {t(`practice_titles.${subItem.label}`, { defaultValue: subItem.label })}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/our-team"
                        className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800 hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("nav_our_team")}
                    </Link>
                    <Link
                        href="/blog"
                        className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800 hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("nav_blog")}
                    </Link>
                    <Link
                        href="/legal-updates"
                        className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800 hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("nav_legal_updates")}
                    </Link>
                    <Link
                        href="/contact"
                        className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-800 hover:text-primary transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        {t("nav_contact")}
                    </Link>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 px-2 pb-4">
                        <div className="flex justify-center">
                            <LanguageSelector />
                        </div>
                        <Button className="w-full justify-center rounded-xl py-6" asChild>
                            <Link href="/contact" onClick={() => setIsOpen(false)}>{t("btn_contact_us")}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

