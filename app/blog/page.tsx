import Image from "next/image";
import Link from "next/link";
import { getLegalUpdates } from "@/lib/wordpress";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";

export const metadata = {
    title: "Blog — RETRIEVE Legal & Tax",
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

            {/* Hero */}
            <div className="relative bg-gradient-to-br from-[#003d7a] via-[#005CB9] to-[#0070db] overflow-hidden pt-36 pb-24">
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-blue-200 text-xs font-bold tracking-widest uppercase mb-6">
                        <FileText size={13} />
                        Insights & Analysis
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight">
                        Our Blog
                    </h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        Expert legal perspectives, business insights, and regulatory updates from the RETRIEVE team.                    </p>
                    {total > 0 && (
                        <div className="mt-6 inline-block bg-white/10 border border-white/20 rounded-full px-5 py-2 text-white text-sm font-semibold">
                            {total} articles published
                        </div>
                    )}
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 md:px-8 py-16">
                {posts.length === 0 ? (
                    <div className="text-center py-24">
                        <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-500">No updates available yet</h2>
                        <p className="text-gray-400 mt-2">Check back soon for our latest legal insights.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#005CB9]/20 transition-all duration-300 flex flex-col overflow-hidden"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-52 bg-gradient-to-br from-[#003d7a] to-[#005CB9] overflow-hidden shrink-0">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText size={40} className="text-white/30" />
                                        </div>
                                    )}
                                    {/* Read time badge */}
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Clock size={11} />
                                        {post.readTime} min read
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    {/* Date */}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-3">
                                        <Calendar size={12} />
                                        {formatDate(post.date)}
                                    </div>

                                    {/* Title */}
                                    <h2
                                        className="text-base font-extrabold text-gray-900 group-hover:text-[#005CB9] transition-colors leading-snug mb-3 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: post.title }}
                                    />

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    {/* CTA row */}
                                    <div className="flex items-center gap-1.5 text-[#005CB9] text-sm font-bold mt-auto pt-2 border-t border-gray-50">
                                        Read Article
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
