import * as cheerio from "cheerio";

async function run() {
    const res = await fetch("https://retrieve.am/legal-updates/", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RetrieveBot/1.0)" }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const items: any[] = [];

    $(".gdlr-core-portfolio-item, article, .gdlr-core-blog-grid").each((i, el) => {
        const title = $(el).find(".gdlr-core-portfolio-title, .gdlr-core-blog-title").text().trim();
        const pdfLink = $(el).find("a[href$='.pdf']").attr("href");
        const image = $(el).find("img").attr("src");
        const date = $(el).find(".gdlr-core-blog-info-font.gdlr-core-skin-caption a").text().trim() || $(el).find(".gdlr-core-portfolio-info").text().trim();
        const excerpt = $(el).find(".gdlr-core-portfolio-content, .gdlr-core-blog-content").text().trim();

        if (pdfLink || title) {
            items.push({
                title,
                pdfLink,
                image,
                date,
                excerpt
            });
        }
    });

}
run().catch(console.error);
