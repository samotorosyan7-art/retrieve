import { Mail, Phone, MapPin, Clock, Linkedin } from "lucide-react";
import ContactForm from "./ContactForm";

import { cookies } from "next/headers";
import en from "@/locales/en/common.json";
import am from "@/locales/am/common.json";
import ru from "@/locales/ru/common.json";

const dictionaries = { en, am, ru };

export async function generateMetadata() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const t = dictionaries[lang] || dictionaries.en;
    
    return {
        title: `${t.nav_contact} | Retrieve Legal & Tax`,
        description: t.contact_desc,
    };
}

export default async function ContactPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("i18next")?.value || "en") as keyof typeof dictionaries;
    const t = dictionaries[lang] || dictionaries.en;

    const contactInfo = [
        {
            icon: Phone,
            label: t.phone,
            value: "+374 41 777 332",
            href: "tel:+37441777332",
        },
        {
            icon: Mail,
            label: t.email,
            value: "info@retrieve.am",
            href: "mailto:info@retrieve.am",
        },
        {
            icon: MapPin,
            label: t.footer_address,
            value: t.footer_address,
            href: "https://maps.google.com/?q=Yerevan,Armenia",
        },
        {
            icon: Clock,
            label: t.nav_contact, // Or a more specific key if available, but nav_contact is used for "Working Hours" in some places? No, working_hours is a string.
            label_text: t.footer_contact_info,
            value: t.working_hours,
            href: null,
        },
    ];
    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* ── Hero strip ── */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-36 pb-20">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <span className="inline-block text-blue-200 font-bold tracking-widest uppercase text-xs mb-4">{t.contact_badge}</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">{t.nav_contact}</h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        {t.contact_desc}
                    </p>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="container mx-auto px-4 md:px-8 py-16 -mt-8">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* ═══════════════════════════════════
                        LEFT — Info panels
                    ═══════════════════════════════════ */}
                    <aside className="w-full lg:w-80 xl:w-96 shrink-0 space-y-6 lg:sticky lg:top-28">

                        {/* Contact Info Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-[#003d7a] to-[#005CB9] px-6 py-5">
                                <h2 className="text-white font-extrabold text-lg">{t.footer_contact_info}</h2>
                                <p className="text-blue-200 text-sm mt-1">{t.working_hours}</p>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                                    <div key={label} className="px-6 py-4 flex items-start gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-[#005CB9]/10 flex items-center justify-center shrink-0 group-hover:bg-[#005CB9] transition-colors">
                                            <Icon size={17} className="text-[#005CB9] group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">{label}</div>
                                            {href ? (
                                                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm font-bold text-gray-800 hover:text-[#005CB9] transition-colors">
                                                    {value}
                                                </a>
                                            ) : (
                                                <div className="text-sm font-bold text-gray-800">{value}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* LinkedIn card */}
                        <a
                            href="https://www.linkedin.com/company/retrieve-am"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-[#0A66C2] hover:bg-[#004182] rounded-2xl px-6 py-5 transition-colors group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                <Linkedin size={22} className="text-white" />
                            </div>
                            <div>
                                <div className="text-white font-extrabold text-sm">LinkedIn</div>
                                <div className="text-blue-200 text-xs mt-0.5">Retrieve Legal & Tax</div>
                            </div>
                        </a>

                        {/* Map embed */}
                        <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm h-56">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48908.63069878893!2d44.46669!3d40.18111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abd26a3a037d7%3A0x8e4ebf92e56980f4!2sYerevan%2C%20Armenia!5e0!3m2!1sen!2s!4v1709000000000!5m2!1sen!2s"
                                className="w-full h-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="RETRIEVE office location — Yerevan, Armenia"
                            />
                        </div>
                    </aside>

                    {/* ═══════════════════════════════════
                        RIGHT — Contact Form
                    ═══════════════════════════════════ */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-[#005CB9]/10 flex items-center justify-center">
                                        <Mail size={20} className="text-[#005CB9]" />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-gray-900">{t.form_btn_send}</h2>
                                </div>
                                <p className="text-gray-500 text-sm ml-[52px]">
                                    {t.contact_desc}
                                </p>
                            </div>
                            <ContactForm />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
