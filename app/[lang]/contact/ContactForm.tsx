"use client";

import { useTranslation } from "react-i18next";
import { useActionState, useEffect, useRef } from "react";
import { submitContactForm, ContactFormState } from "./actions";
import { Loader2, Send, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

function FieldWrapper({ label, required, children, icon: Icon }: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    icon: React.ElementType;
}) {
    return (
        <div className="space-y-1.5">
            <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <Icon size={14} className="text-[#005CB9]" />
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </span>
                {children}
            </label>
        </div>
    );
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005CB9]/30 focus:border-[#005CB9] transition-all";

export default function ContactForm() {
    const { t } = useTranslation();
    const SUBJECTS = [
        t("subjects_legal"),
        t("subjects_tax"),
        t("subjects_corporate"),
        t("subjects_business"),
        t("subjects_immigration"),
        t("subjects_other"),
    ];
    const [state, action, isPending] = useActionState<ContactFormState, FormData>(
        submitContactForm,
        null
    );
    const formRef = useRef<HTMLFormElement>(null);

    // Reset form on success
    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form ref={formRef} action={action} className="space-y-5">
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldWrapper label={t("full_name")} required icon={User}>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder={t("form_placeholder_name") || "John Smith"}
                        className={inputClass}
                    />
                </FieldWrapper>
                <FieldWrapper label={t("email")} required icon={Mail}>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder={t("form_placeholder_email") || "john@company.com"}
                        className={inputClass}
                    />
                </FieldWrapper>
            </div>

            {/* Phone + Subject row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FieldWrapper label={t("field_phone_number")} icon={Phone}>
                    <input
                        name="phone"
                        type="tel"
                        placeholder={t("form_placeholder_phone")}
                        className={inputClass}
                    />
                </FieldWrapper>
                <FieldWrapper label={t("field_subject")} icon={Briefcase}>
                    <select name="subject" className={cn(inputClass, "cursor-pointer")}>
                        <option value="">{t("form_placeholder_subject")}</option>
                        {SUBJECTS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </FieldWrapper>
            </div>

            {/* Message */}
            <FieldWrapper label={t("field_message")} required icon={MessageSquare}>
                <textarea
                    name="message"
                    required
                    rows={6}
                    placeholder={t("form_placeholder_message")}
                    className={cn(inputClass, "resize-none")}
                />
            </FieldWrapper>

            {/* Status banner */}
            {state && (
                <div className={cn(
                    "flex items-start gap-3 rounded-xl p-4 text-sm font-medium",
                    state.success
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                )}>
                    {state.success
                        ? <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                        : <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                    }
                    {state.message}
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#004791] to-[#005CB9] hover:from-[#003d7a] hover:to-[#004791] disabled:opacity-60 text-white font-bold text-sm rounded-xl px-6 py-4 transition-all duration-300 shadow-lg shadow-blue-900/20"
            >
                {isPending
                    ? <><Loader2 size={17} className="animate-spin" /> {t("form_btn_sending")}</>
                    : <><Send size={17} /> {t("form_btn_send")}</>
                }
            </button>

            <p className="text-xs text-gray-400 text-center">
                {t("form_privacy_consent")}
            </p>
        </form>
    );
}
