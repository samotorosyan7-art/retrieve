const cheerio = require("cheerio");

async function run() {
    const url = "https://wp.retrieve.am/";
    console.log("Fetching url:", url);
    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        console.error("Fetch failed with status:", response.status);
        return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const menuItems = [];
    let practiceAreasLi = null;

    $(".sf-menu > li").each((idx, el) => {
        const text = $(el).children("a").text().trim();
        console.log(`Checking top-level menu item ${idx}: "${text}"`);
        if (text.includes("Practice Areas")) {
            practiceAreasLi = el;
        }
    });

    if (practiceAreasLi) {
        console.log("Found 'Practice Areas' menu list item!");
        $(practiceAreasLi).find("> ul.sub-menu > li").each((_, subEl) => {
            const catName = $(subEl).children("a").text().trim();
            console.log(`  Subcategory: "${catName}"`);
            const children = [];

            $(subEl).find("> ul.sub-menu > li").each((_, childEl) => {
                const childName = $(childEl).children("a").text().trim();
                const childUrl = $(childEl).children("a").attr("href");
                console.log(`    Child Area: "${childName}" -> "${childUrl}"`);
                
                let relativeUrl = childUrl ? childUrl.replace(/^https?:\/\/(www\.|wp\.)?retrieve\.am/, "") : "#";
                if (!relativeUrl.startsWith("/")) relativeUrl = "/" + relativeUrl;

                children.push({
                    label: childName,
                    url: relativeUrl
                });
            });

            if (catName) {
                menuItems.push({
                    label: catName,
                    url: "#",
                    children: children
                });
            }
        });
    } else {
        console.log("Could NOT find any menu item containing 'Practice Areas'!");
    }

    console.log("\nFinal parsed menu items:\n", JSON.stringify(menuItems, null, 2));
}

run().catch(console.error);
