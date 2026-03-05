const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('tax.html', 'utf8');
const $ = cheerio.load(html);

// Find main image
let img = $(".gdlr-core-portfolio-thumbnail img").attr("src");
if (!img) {
    // Try other common locations for the featured image
    img = $(".gdlr-core-pbf-wrapper").eq(0).find("img").attr("src");
}
console.log("FEATURED IMAGE:", img);

// Find content wrapper
// Let's look for paragraphs inside gdlr-core-text-box-item-content that are not in header/footer
const contentBlocks = [];
mainContent = $(".gdlr-core-page-builder-body");
if (mainContent.length) {
    mainContent.find(".gdlr-core-text-box-item-content").each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
            contentBlocks.push($(el).html().trim());
        }
    });
}

console.log("EXTRACTED BLOCKS:", contentBlocks.length);
if (contentBlocks.length > 0) {
    console.log("BLOCK 0:", contentBlocks[0].substring(0, 200).replace(/\n/g, ''));
    console.log("BLOCK 1:", contentBlocks[1]?.substring(0, 200).replace(/\n/g, ''));
}
