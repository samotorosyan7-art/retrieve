"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronRight, CheckCircle2, ShieldCheck, Building2, Calculator, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitIntakeForm } from "../../../app/actions/intakeActions";

type StepInfo = {
    id: "tax" | "corporate" | "ip" | null;
};

export default function InteractiveIntake() {
    const { t } = useTranslation();
    const [step, setStep] = useState<number>(1);
    const [selection, setSelection] = useState<StepInfo>({ id: null });
    const [formData, setFormData] = useState({ name: "", email: "", details: "" });
    const [isPending, startTransition] = useTransition();

    const handleSelectCategory = (id: "tax" | "corporate" | "ip") => {
        setSelection({ id });
        setStep(2);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selection.id) return;
        startTransition(async () => {
            await submitIntakeForm({
                category: selection.id!,
                name: formData.name,
                email: formData.email,
            });
            setStep(3);
        });
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            position: "absolute" as const,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            position: "relative" as const,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            position: "absolute" as const,
        })
    };

    return (
        <div className="bg-white rounded-3xl shadow-elevated border border-gray-100 p-8 w-full max-w-md relative overflow-hidden flex flex-col min-h-[420px]">
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-6 z-10">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-primary/60 tracking-wider uppercase mb-1">
                        {t("intake_badge")}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                        {step === 1 ? t("intake_step1_title") : step === 2 ? t("intake_step2_title") : t("intake_step3_title")}
                    </h3>
                </div>
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <ArrowLeft size={18} />
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-grow relative mt-2">
                <AnimatePresence custom={step} mode="popLayout">
                    {/* STEP 1: Categories */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex flex-col gap-3 w-full"
                        >
                            <button
                                onClick={() => handleSelectCategory("tax")}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-primary/20 hover:shadow-soft transition-all text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white rounded-lg text-primary shadow-sm group-hover:scale-110 transition-transform">
                                        <Calculator size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 leading-tight">{t("intake_tax_title")}</div>
                                        <div className="text-sm text-gray-500">{t("intake_tax_desc")}</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </button>

                            <button
                                onClick={() => handleSelectCategory("corporate")}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-primary/20 hover:shadow-soft transition-all text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white rounded-lg text-primary shadow-sm group-hover:scale-110 transition-transform">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 leading-tight">{t("intake_corp_title")}</div>
                                        <div className="text-sm text-gray-500">{t("intake_corp_desc")}</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </button>

                            <button
                                onClick={() => handleSelectCategory("ip")}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-transparent bg-gray-50 hover:bg-white hover:border-primary/20 hover:shadow-soft transition-all text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white rounded-lg text-primary shadow-sm group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 leading-tight">{t("intake_ip_title")}</div>
                                        <div className="text-sm text-gray-500">{t("intake_ip_desc")}</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: Details */}
                    {step === 2 && (
                        <motion.form
                            key="step2"
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex flex-col gap-4 w-full"
                            onSubmit={handleFormSubmit}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("full_name")}</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 pb-0.5"
                                    placeholder={t("form_placeholder_name")}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50 pb-0.5"
                                    placeholder={t("form_placeholder_email")}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <Button type="submit" disabled={isPending} className="w-full rounded-xl mt-2 h-12 shadow-soft hover:shadow-medium">
                                {isPending ? (
                                    <><Loader2 size={16} className="animate-spin" /> {t("form_btn_sending")}</>
                                ) : (
                                    t("btn_book_consultation")
                                )}
                            </Button>
                        </motion.form>
                    )}

                    {/* STEP 3: Success */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex flex-col items-center justify-center text-center h-[280px]"
                        >
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
                                <CheckCircle2 size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{t("intake_step3_title")}</h4>
                            <p className="text-gray-500 mb-8 max-w-[250px]">
                                {t("intake_success_desc")}
                            </p>
                            <Button variant="outline" onClick={() => { setStep(1); setFormData({ name: "", email: "", details: "" }) }} className="rounded-full px-8">
                                {t("btn_back_to_start")}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress indicators bottom */}
            <div className="flex justify-center gap-2 mt-auto pt-6">
                {[1, 2, 3].map((dot) => (
                    <div
                        key={dot}
                        className={`h-1.5 rounded-full transition-all duration-300 ${step === dot ? "w-6 bg-primary" : "w-1.5 bg-gray-200"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
