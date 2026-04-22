"use client";

import { useTranslation } from "react-i18next";
import { useActionState, useEffect, useRef } from "react";
import { submitContactForm, ContactFormState } from "../../../app/[lang]/contact/actions";
import { Loader2, Send, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare } from "lucide-react";
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

export default function QuoteForm({ postTitle }: { postTitle: string }) {
    const { t } = useTranslation();
    const [state, action, isPending] = useActionState<ContactFormState, FormData>(
        submitContactForm,
        null
    );
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-soft sticky top-32">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
                {t("get_a_quote") || "Get a Quote"}
            </h3>
            
            <form ref={formRef} action={action} className="space-y-5">
                <input type="hidden" name="subject" value={`Quote Request: ${postTitle}`} />
                
                <FieldWrapper label={t("full_name")} required icon={User}>
                    <input
                        name="name"
                        type="text"
                        required
                        placeholder={t("form_placeholder_name") || "John Smith"}
                        className={inputClass}
                    />
                </FieldWrapper>

                <FieldWrapper label={t("field_phone_number")} required icon={Phone}>
                    <input
                        name="phone"
                        type="tel"
                        required
                        placeholder={t("form_placeholder_phone") || "+374 XX XXX XXX"}
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

                <FieldWrapper label={t("citizenship")} required icon={User}>
                    <select
                        name="citizenship"
                        required
                        className={inputClass}
                        defaultValue=""
                    >
                        <option value="" disabled>{t("select_citizenship") || "Select Citizenship"}</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Russia">Russia</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="Iran">Iran</option>
                        <option value="India">India</option>
                        <option value="China">China</option>
                        <option value="Other">Other</option>
                    </select>
                </FieldWrapper>

                <FieldWrapper label={t("field_message")} required icon={MessageSquare}>
                    <textarea
                        name="message"
                        required
                        rows={4}
                        placeholder={t("form_placeholder_message") || "Tell us about your needs..."}
                        className={cn(inputClass, "resize-none")}
                    />
                </FieldWrapper>

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

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#004791] to-[#005CB9] hover:from-[#003d7a] hover:to-[#004791] disabled:opacity-60 text-white font-bold text-sm rounded-xl px-6 py-4 transition-all duration-300 shadow-lg shadow-blue-900/20"
                >
                    {isPending
                        ? <><Loader2 size={17} className="animate-spin" /> {t("form_btn_sending") || "Sending..."}</>
                        : <><Send size={17} /> {t("form_btn_send") || "Send Request"}</>
                    }
                </button>
            </form>
        </div>
    );
}
