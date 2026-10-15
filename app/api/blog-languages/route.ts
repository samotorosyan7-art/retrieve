import { NextResponse } from "next/server";
import { getBlogPostLanguages } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

/** Languages a blog post is available in, used by the language switcher. */
export async function GET(request: Request) {
    const slug = new URL(request.url).searchParams.get("slug");
    if (!slug) return NextResponse.json({ languages: [] }, { status: 400 });

    const languages = await getBlogPostLanguages(slug);
    return NextResponse.json({ languages });
}
