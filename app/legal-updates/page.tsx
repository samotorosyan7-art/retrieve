import Image from "next/image";
import Link from "next/link";
import { getLegalUpdates } from "@/lib/wordpress";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";

export const metadata = {
    title: "Legal Updates — RETRIEVE Legal & Tax",
    description: "Stay informed with the latest legal and regulatory updates from RETRIEVE.",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
}

export default async function LegalUpdatesPage() {
    const { posts, total } = await getLegalUpdates(1, 12);

    return (
        <div className="min-h-screen bg-[#F4F7FB]">

            <h1>Legal Updates</h1>
        </div>
    );
}
