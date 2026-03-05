const cheerio = require("cheerio");

async function run() {
    const res = await fetch("https://retrieve.am/");
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Find the Practice Areas menu item in the main menu
    // The main menu usually has an ID like menu-main-navigation
    const menuItems = [];
    
    // Specifically target the "Practice Areas" menu item
    // It has the text "Practice Areas"
    let practiceAreasLi = null;
    $(".sf-menu > li").each((_, el) => {
        if ($(el).children("a").text().trim().includes("Practice Areas")) {
            practiceAreasLi = el;
        }
    });
    
    if (practiceAreasLi) {
        $(practiceAreasLi).find("> ul.sub-menu > li").each((_, subEl) => {
            const catName = $(subEl).children("a").text().trim();
            const children = [];
            
            $(subEl).find("> ul.sub-menu > li").each((_, childEl) => {
                const childName = $(childEl).children("a").text().trim();
                const childUrl = $(childEl).children("a").attr("href");
                // Convert full URLs to relative for our Next.js app
                let relativeUrl = childUrl ? childUrl.replace("https://retrieve.am", "") : "#";
                // Ensure it's correctly formatted, e.g., starts with "/"
                if (!relativeUrl.startsWith("/")) relativeUrl = "/" + relativeUrl;
                
                children.push({
                    label: childName,
                    url: relativeUrl
                });
            });
            
            if (catName) {
                menuItems.push({
                    label: catName,
                    children: children
                });
            }
        });
    }
    
    console.log(JSON.stringify(menuItems, null, 2));
}

run();
