import { Mail, Phone, MapPin, Clock, Linkedin } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata = {
    title: "Contact Us — RETRIEVE Legal & Tax",
    description: "Get in touch with RETRIEVE for professional legal and tax advisory services in Armenia.",
};

const contactInfo = [
    {
        icon: Phone,
        label: "Phone",
        value: "+374 41 777 332",
        href: "tel:+37441777332",
    },
    {
        icon: Mail,
        label: "Email",
        value: "info@retrieve.am",
        href: "mailto:info@retrieve.am",
    },
    {
        icon: MapPin,
        label: "Address",
        value: "Yerevan, Armenia",
        href: "https://maps.google.com/?q=Yerevan,Armenia",
    },
    {
        icon: Clock,
        label: "Working Hours",
        value: "Mon – Fri: 09:00 – 18:00",
        href: null,
    },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            {/* ── Hero strip ── */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-36 pb-20">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <span className="inline-block text-blue-200 font-bold tracking-widest uppercase text-xs mb-4">Get In Touch</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        Have a legal or tax question? Let&apos;s talk. Our experts are ready to help you.
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
                                <h2 className="text-white font-extrabold text-lg">Contact Information</h2>
                                <p className="text-blue-200 text-sm mt-1">We&apos;re available Monday to Friday</p>
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
                                <div className="text-white font-extrabold text-sm">Follow on LinkedIn</div>
                                <div className="text-blue-200 text-xs mt-0.5">Stay updated with our latest news</div>
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
                                    <h2 className="text-2xl font-extrabold text-gray-900">Send Us a Message</h2>
                                </div>
                                <p className="text-gray-500 text-sm ml-[52px]">
                                    Fill out the form and our team will get back to you within 24 hours.
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
