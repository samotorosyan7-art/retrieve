import * as cheerio from "cheerio";

async function run() {
    const res = await fetch("https://retrieve.am/legal-updates/", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const items = [];
    // Just looking for things that look like articles with PDFs. The standard structure is often blog-style or portfolio-style.
    $("a[href$='.pdf']").each((i, el) => {
        const href = $(el).attr("href");
        let parent = $(el).parents(".gdlr-core-item-list, article, .gdlr-core-portfolio-item").first();
        if (parent.length === 0) parent = $(el).parent();
        items.push({
            href,
            text: $(el).text().trim() || parent.text().trim().replace(/\s+/g, ' ').substring(0, 100)
        });
    });
}
run().catch(console.error);
