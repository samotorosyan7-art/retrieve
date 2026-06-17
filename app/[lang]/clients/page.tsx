import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ClientsDirectory from "@/components/website/ClientsDirectory";
import { CLIENTS, CLIENT_INDUSTRY_COUNT, CLIENT_TOTAL_LABEL } from "@/data/clients";
import enCommon from "@/locales/en/common.json";
import ruCommon from "@/locales/ru/common.json";
import amCommon from "@/locales/am/common.json";

const dictionaries = {
    en: enCommon,
    ru: ruCommon,
    am: amCommon,
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = dictionaries[lang as keyof typeof dictionaries] || dictionaries.en;
    return {
        title: (t as any).clients_meta_title || "Our Clients",
        description:
            (t as any).clients_meta_desc ||
            "The organizations Retrieve Legal & Tax advises — from global nonprofits and universities to fast-scaling startups across Armenia and beyond.",
    };
}

export default async function ClientsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = (dictionaries[lang as keyof typeof dictionaries] || dictionaries.en) as any;

    const partnerCount = CLIENTS.filter((c) => c.partner).length;

    return (
        <main className="min-h-screen bg-[#F7F7F4]">
            {/* ── Editorial hero ── */}
            <section className="relative overflow-hidden pb-12 pt-36 md:pb-16 md:pt-44">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(0,92,185,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,92,185,0.05) 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 35%, transparent 100%)",
                    }}
                />
                <div aria-hidden className="pointer-events-none absolute -top-20 right-0 h-72 w-[40rem] rounded-full bg-[#0070DB]/10 blur-3xl" />

                <div className="container relative z-10 mx-auto px-4 md:px-8">
                    <Breadcrumbs theme="light" items={[{ label: t.clients_breadcrumb || "Clients" }]} />

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-8">
                            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#005CB9]">
                                <span className="h-px w-7 bg-[#005CB9]/40" />
                                {t.clients_eyebrow || "Our Clients"}
                            </span>
                            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight text-gray-950 md:text-6xl">
                                {t.clients_page_title || "The organizations we work with"}
                            </h1>
                            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600">
                                {t.clients_page_intro ||
                                    "We advise a wide spectrum of organizations — global nonprofits, universities, established enterprises, and fast-scaling startups — across industries and borders."}
                            </p>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="flex gap-10 lg:justify-end">
                                <Stat value={CLIENT_TOTAL_LABEL} label={t.clients_stat_clients_only || "Clients"} />
                                <Stat value={`${partnerCount}`} label={t.clients_stat_partners || "Partners"} />
                                <Stat value={`${CLIENT_INDUSTRY_COUNT}`} label={t.clients_stat_industries || "Industries"} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ClientsDirectory />
        </main>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div>
            <div className="text-4xl font-extrabold leading-none tracking-tight text-gray-950">
                {value.endsWith("+") ? (
                    <>
                        {value.slice(0, -1)}
                        <span className="text-[#005CB9]">+</span>
                    </>
                ) : (
                    value
                )}
            </div>
            <div className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">{label}</div>
        </div>
    );
}
