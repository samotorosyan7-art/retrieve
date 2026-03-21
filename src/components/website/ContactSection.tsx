"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import ContactForm from "../../../app/[lang]/contact/ContactForm";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
    const { t } = useTranslation();

    return (
        <section id="contact" className="py-24 bg-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#005CB9 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            
            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* Left side: Info */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">
                                {t("contact_badge") || "Get in Touch"}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-950 mb-8 tracking-tight">
                                {t("contact_main_title") || "Contact Retrieve"}
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-xl">
                                {t("contact_desc") || "Have questions about our services or need legal assistance? Our team is ready to provide the guidance you need. Reach out to us today."}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shrink-0">
                                        <Phone size={20} className="text-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{t("contact_call_us") || "Call Us"}</h3>
                                        <a href="tel:+37441777332" className="text-gray-600 hover:text-primary transition-colors">+374 41 777 332</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shrink-0">
                                        <Mail size={20} className="text-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{t("contact_email_us") || "Email Us"}</h3>
                                        <a href="mailto:info@retrieve.am" className="text-gray-600 hover:text-primary transition-colors">info@retrieve.am</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 shrink-0">
                                        <MapPin size={20} className="text-primary group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{t("contact_visit_us") || "Visit Us"}</h3>
                                        <span className="text-gray-600">{t("footer_address") || "Yerevan, Armenia"}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side: Form */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gray-50/50 border border-gray-100 rounded-3xl p-8 md:p-10 shadow-soft"
                        >
                            <ContactForm />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
