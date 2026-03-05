const cheerio = require('cheerio');

async function scrape() {
    try {
        const response = await fetch("https://retrieve.am/practice-areas/tax-law-compliance/", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        console.log("TITLE:", $("h1").text().trim());

        // Find main content
        const contentBlocks = [];
        $(".gdlr-core-text-box-item-content").each((i, el) => {
            contentBlocks.push($(el).html().trim());
        });

        console.log("CONTENT BLOCKS:", contentBlocks.length);
        if (contentBlocks.length > 0) {
            console.log("FIRST BLOCK:", contentBlocks[0].substring(0, 200));
        }

        // See if there's an image
        const img = $(".gdlr-core-portfolio-thumbnail img").attr("src") || $(".gdlr-core-media-image img").attr("src") || $(".gdlr-core-image-item img").attr("src");
        console.log("IMAGE:", img);

    } catch (e) {
        console.error(e);
    }
}
scrape();
