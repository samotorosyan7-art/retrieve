import * as cheerio from "cheerio";

async function run() {
    const res = await fetch("https://retrieve.am/legal-updates/", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    $("a[href$='.pdf']").each((i, el) => {
        const parent = $(el).closest(".gdlr-core-item-list, .gdlr-core-blog-grid, .gdlr-core-portfolio-item, article, .gdlr-core-pbf-column").first();
        if (parent.length > 0) {
        } else {
        }
    });
}
run().catch(console.error);
