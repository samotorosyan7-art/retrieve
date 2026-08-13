"use client";

import Link from "@/components/ui/LocalizedLink";
import Image from "next/image";
import { useState, useEffect, useRef, type CSSProperties } from "react";
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
    const [isMobilePracticeOpen, setIsMobilePracticeOpen] = useState(false);
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
        setIsMobilePracticeOpen(false);
        setExpandedMobileCategories({});
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

    // Lock body scroll while the fullscreen mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Escape closes the menu; resizing past the mobile breakpoint closes it too
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const closeMenu = () => {
        setIsOpen(false);
        setIsMobilePracticeOpen(false);
    };

    const toggleMobileCategory = (label: string) => {
        setExpandedMobileCategories(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    const navLinks = [
        { name: t("nav_home"), href: "/" },
        { name: t("nav_about_us"), href: "/about-us" },
        { name: t("nav_blog"), href: "/blog" },
        { name: t("nav_legal_updates"), href: "/legal-updates" },
    ];

    const mobileNavTop = [
        { name: t("nav_home"), href: "/" },
        { name: t("nav_about_us"), href: "/about-us" },
    ];
    const mobileNavBottom = [
        { name: t("nav_blog"), href: "/blog" },
        { name: t("nav_legal_updates"), href: "/legal-updates" },
        { name: t("nav_contact"), href: "/contact" },
    ];

    const staggerStyle = (index: number): CSSProperties => ({
        transitionDelay: isOpen ? `${120 + index * 70}ms` : "0ms",
    });

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] bg-white flex flex-col transition-shadow duration-300",
                scrolled && !isOpen
                    ? "shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_10px_30px_-15px_rgba(0,0,0,0.15)]"
                    : "border-b border-gray-100",
                isOpen && "h-[100dvh] overflow-hidden"
            )}
        >
            {/* Top Bar - Contact Info Only (desktop) */}
            <div className="hidden lg:block bg-gray-50 border-b border-gray-200 shrink-0">
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center py-2 text-xs text-gray-600">
                    <div className="flex gap-5 items-center">
                        <a
                            href="tel:+37441777332"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                            <Phone size={14} className="text-primary" />
                            <span className="font-medium tracking-wide">+374 41 777 332</span>
                        </a>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <a
                            href="mailto:info@retrieve.am"
                            className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                            <Mail size={14} className="text-primary" />
                            <span className="font-medium tracking-wide">info@retrieve.am</span>
                        </a>
                    </div>
                    <div className="text-gray-500 tracking-wide">
                        {t("working_hours")}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div
                className={cn(
                    "shrink-0 transition-all duration-300",
                    scrolled ? "py-0" : "py-1"
                )}
            >
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center py-1" onClick={closeMenu}>
                        <Image
                            src="/logo.jpg"
                            alt="Retrieve Legal & Tax law firm"
                            width={602}
                            height={205}
                            priority
                            className="h-14 lg:h-20 w-auto object-contain transition-transform"
                        />
                    </Link>
                    <nav className="hidden lg:flex gap-1 items-center">
                        {navLinks.slice(0, 1).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-base font-medium text-gray-600 px-4 py-2 rounded-full hover:bg-primary hover:text-white hover:shadow-soft transition-all duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Practice Areas Dropdown — state-based so it closes on navigate */}
                        <div
                            ref={practiceRef}
                            className={cn(
                                "relative px-4 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-primary hover:shadow-soft",
                                isPracticeOpen && "bg-primary shadow-soft"
                            )}
                            onMouseEnter={() => setIsPracticeOpen(true)}
                            onMouseLeave={() => setIsPracticeOpen(false)}
                        >
                            <button
                                onClick={() => setIsPracticeOpen(v => !v)}
                                className={cn(
                                    "flex items-center gap-1 text-base font-medium text-gray-600 hover:text-white transition-colors focus:outline-none",
                                    isPracticeOpen && "text-white"
                                )}
                            >
                                {t("nav_practice_areas")}
                                <ChevronDown size={14} className={cn("transition-transform duration-200", isPracticeOpen && "rotate-180")} />
                            </button>

                            {/* Dropdown panel */}
                            {isPracticeOpen && (
                                <div className="absolute top-full left-0 pt-2 w-72 z-50">
                                    <div className="bg-white rounded-xl shadow-medium border border-gray-100 p-2">
                                        {practiceAreas.map((category, idx) => {
                                            const categoryRoute = category.label.toLowerCase().includes("tax")
                                                ? "/tax-and-business-advisory-services"
                                                : "/legal-services";
                                            return (
                                            <div key={idx} className="relative group/sub">
                                                <Link
                                                    href={categoryRoute}
                                                    onClick={() => setIsPracticeOpen(false)}
                                                    className="flex items-center justify-between px-4 py-2.5 text-sm rounded-lg text-gray-700 font-semibold hover:text-primary transition-colors"
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
                                                            {category.children.map((subItem, sIdx) => {
                                                                const slug = subItem.url.replace(/\/$/, "").split("/").pop() || "";
                                                                const subItemHref = `${categoryRoute}/${slug}`;
                                                                return (
                                                                <Link
                                                                    key={sIdx}
                                                                    href={subItemHref}
                                                                    onClick={() => setIsPracticeOpen(false)}
                                                                    className="block px-4 py-2 text-sm rounded-lg text-gray-600 hover:text-primary transition-colors"
                                                                >
                                                                    {t(`practice_titles.${subItem.label}`, { defaultValue: subItem.label })}
                                                                </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {navLinks.slice(1).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-base font-medium text-gray-600 px-4 py-2 rounded-full hover:bg-primary hover:text-white hover:shadow-soft transition-all duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className={cn(isOpen && "lg:block hidden")}>
                            <LanguageSelector />
                        </div>

                        <div className="hidden lg:flex items-center gap-4">
                            <Button asChild className="rounded-full px-8 shadow-soft hover:shadow-medium transition-all bg-[#005CB9] text-white hover:bg-[#004a96]">
                                <Link href="/contact" className="flex items-center gap-2">
                                    {t("btn_contact_us")} <ArrowRight size={18} />
                                </Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full text-gray-800 hover:bg-gray-50 active:scale-95 transition-all"
                            onClick={() => setIsOpen(v => !v)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Mobile Menu */}
            <div
                className={cn(
                    "lg:hidden relative overflow-hidden",
                    isOpen ? "flex-1 min-h-0" : "flex-none h-0"
                )}
            >
                <div className="absolute inset-0 bg-white border-t border-gray-100" />

                <div
                    className={cn(
                        "relative h-full overflow-y-auto flex flex-col transition-opacity duration-200",
                        isOpen ? "opacity-100" : "opacity-0"
                    )}
                >
                    <nav className="flex flex-col px-6 pt-2">
                        {mobileNavTop.map((link, idx) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                style={staggerStyle(idx)}
                                className={cn(
                                    "block py-4 border-b border-gray-100 text-3xl font-extrabold text-gray-900 hover:text-primary transition-all duration-500 ease-out",
                                    isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Practice Areas — accordion */}
                        <div
                            style={staggerStyle(2)}
                            className={cn(
                                "border-b border-gray-100 transition-all duration-500 ease-out",
                                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                            )}
                        >
                            <button
                                onClick={() => setIsMobilePracticeOpen(v => !v)}
                                className="w-full flex items-center justify-between py-4 text-left"
                                aria-expanded={isMobilePracticeOpen}
                            >
                                <span className={cn("text-3xl font-extrabold transition-colors", isMobilePracticeOpen ? "text-primary" : "text-gray-900")}>
                                    {t("nav_practice_areas")}
                                </span>
                                <ChevronDown
                                    size={22}
                                    className={cn(
                                        "text-gray-400 transition-transform duration-300 shrink-0",
                                        isMobilePracticeOpen && "rotate-180 text-primary"
                                    )}
                                />
                            </button>

                            <div className={cn(
                                "grid transition-all duration-300 ease-in-out",
                                isMobilePracticeOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                            )}>
                                <div className="overflow-hidden">
                                    <div className="flex flex-col gap-1 pl-6 pb-4 border-l-2 border-gray-100 ml-1">
                                        {practiceAreas.map((category, idx) => {
                                            const categoryRoute = category.label.toLowerCase().includes("tax")
                                                ? "/tax-and-business-advisory-services"
                                                : "/legal-services";
                                            const isSubOpen = expandedMobileCategories[category.label];
                                            return (
                                                <div key={idx}>
                                                    <div className="flex items-center justify-between">
                                                        <Link
                                                            href={categoryRoute}
                                                            onClick={closeMenu}
                                                            className="flex-1 py-2 text-base font-semibold text-gray-700 hover:text-primary transition-colors"
                                                        >
                                                            {t(`practice_categories.${category.label}`, { defaultValue: category.label })}
                                                        </Link>
                                                        {category.children && category.children.length > 0 && (
                                                            <button
                                                                onClick={() => toggleMobileCategory(category.label)}
                                                                className="p-2 text-gray-400 hover:text-primary shrink-0"
                                                                aria-label="Toggle submenu"
                                                            >
                                                                <ChevronDown size={16} className={cn("transition-transform duration-300", isSubOpen && "rotate-180")} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {category.children && category.children.length > 0 && (
                                                        <div className={cn(
                                                            "grid transition-all duration-300 ease-in-out",
                                                            isSubOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                        )}>
                                                            <div className="overflow-hidden">
                                                                <div className="flex flex-col gap-0.5 pl-3 pb-1">
                                                                    {category.children.map((subItem, sIdx) => {
                                                                        const slug = subItem.url.replace(/\/$/, "").split("/").pop() || "";
                                                                        return (
                                                                            <Link
                                                                                key={sIdx}
                                                                                href={`${categoryRoute}/${slug}`}
                                                                                onClick={closeMenu}
                                                                                className="py-2 text-sm text-gray-500 hover:text-primary transition-colors"
                                                                            >
                                                                                {t(`practice_titles.${subItem.label}`, { defaultValue: subItem.label })}
                                                                            </Link>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {mobileNavBottom.map((link, i) => {
                            const idx = i + 3;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={closeMenu}
                                    style={staggerStyle(idx)}
                                    className={cn(
                                        "block py-4 border-b border-gray-100 text-3xl font-extrabold text-gray-900 hover:text-primary transition-all duration-500 ease-out",
                                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div
                        style={staggerStyle(6)}
                        className={cn(
                            "mt-auto px-6 pb-8 pt-6 flex flex-col gap-4 transition-all duration-500 ease-out",
                            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                        )}
                    >
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="tel:+37441777332"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-100 hover:text-primary transition-colors"
                            >
                                <Phone size={15} className="text-primary" /> +374 41 777 332
                            </a>
                            <a
                                href="mailto:info@retrieve.am"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-100 hover:text-primary transition-colors"
                            >
                                <Mail size={15} className="text-primary" /> info@retrieve.am
                            </a>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="shrink-0 rounded-full border border-gray-200">
                                <LanguageSelector />
                            </div>
                            <Button asChild size="lg" className="flex-1 justify-center rounded-full shadow-elevated bg-[#005CB9] text-white hover:bg-[#004a96]">
                                <Link href="/contact" onClick={closeMenu} className="flex items-center justify-center gap-2">
                                    {t("btn_contact_us")} <ArrowRight size={18} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
