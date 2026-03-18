"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Mail, CheckCircle2, Bell, ArrowRight } from "lucide-react";

export default function Newsletter() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            setEmail("");
        }, 1500);
    };

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db]" />

            {/* Decorative rings */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="max-w-2xl mx-auto text-center">

                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mb-8">
                        <Bell size={28} className="text-white" />
                    </div>

                    {/* Heading */}
                    <p className="text-blue-200 font-bold tracking-widest uppercase text-xs mb-4">{t("newsletter_badge")}</p>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                        {t("newsletter_main_title")}
                    </h2>
                    <p className="text-blue-200 text-base mb-10 max-w-lg mx-auto leading-relaxed">
                        {t("newsletter_main_desc")}
                    </p>

                    {/* Form / Success */}
                    {status === "success" ? (
                        <div className="flex items-center justify-center gap-4 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-8">
                            <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center">
                                <CheckCircle2 size={26} className="text-emerald-300" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-white font-extrabold text-lg">{t("newsletter_success_title")}</h4>
                                <p className="text-blue-200 text-sm">{t("newsletter_success_desc")}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative">
                            <div className="flex flex-col sm:flex-row gap-3 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-2">
                                <div className="relative flex-1">
                                    <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t("placeholder_email")}
                                        disabled={status === "loading"}
                                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/10 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="h-12 px-7 rounded-xl bg-white text-[#005CB9] hover:bg-blue-50 font-extrabold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                                >
                                    {status === "loading"
                                        ? <Loader2 size={17} className="animate-spin" />
                                        : <><span>{t("btn_subscribe")}</span><ArrowRight size={15} /></>
                                    }
                                </button>
                            </div>
                            <p className="text-blue-300/70 text-xs mt-4">
                                {t("newsletter_privacy_note")}
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
