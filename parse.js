const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('tax.html', 'utf8');
const $ = cheerio.load(html);

const data = {
    title: $("h1.attorna-page-title").text().trim(),
    overview: $(".gdlr-core-title-item-caption").first().text().trim(),
    howWeCanHelp: [],
    whyChooseUs: [],
    faqs: []
};

// Lists
const lists = $(".gdlr-core-icon-list-item ul");
if (lists.length >= 1) {
    $(lists[0]).find("li").each((i, el) => {
        data.howWeCanHelp.push($(el).text().trim());
    });
}
if (lists.length >= 2) {
    $(lists[1]).find("li").each((i, el) => {
        data.whyChooseUs.push($(el).text().trim());
    });
}

// FAQs
$(".gdlr-core-accordion-item-tab").each((i, el) => {
    const q = $(el).find(".gdlr-core-accordion-item-title").text().trim();
    const a = $(el).find(".gdlr-core-accordion-item-content").text().trim();
    if (q && a) data.faqs.push({ question: q, answer: a });
});

