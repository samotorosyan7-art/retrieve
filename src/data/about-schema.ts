/**
 * Manually curated About page JSON-LD, keyed by language.
 * Languages missing here fall back to English.
 */
export const aboutSchema: Record<string, object> = {
    en: {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": "https://www.retrieve.am/en/about-us#webpage",
                "url": "https://www.retrieve.am/en/about-us",
                "name": "About Retrieve Law Firm",
                "inLanguage": "en",
                "isPartOf": { "@id": "https://www.retrieve.am/en/#website" },
                "about": { "@id": "https://www.retrieve.am/en/#organization" },
                "mainEntity": { "@id": "https://www.retrieve.am/en/#organization" },
                "breadcrumb": { "@id": "https://www.retrieve.am/en/about-us#breadcrumb" }
            },
            {
                "@type": ["Organization", "LegalService"],
                "@id": "https://www.retrieve.am/en/#organization",
                "name": "Retrieve Legal & Tax",
                "url": "https://www.retrieve.am/en",
                "employee": [
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/feliks-hovakimyan#person", "name": "Feliks Hovakimyan", "url": "https://www.retrieve.am/en/personnel/feliks-hovakimyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/michael-hovhannesyan#person", "name": "Michael Hovhannesyan", "url": "https://www.retrieve.am/en/personnel/michael-hovhannesyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/vache-simonyan#person", "name": "Vache Simonyan", "url": "https://www.retrieve.am/en/personnel/vache-simonyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/aleksandr-harutyunyan#person", "name": "Aleksandr Harutyunyan", "url": "https://www.retrieve.am/en/personnel/aleksandr-harutyunyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/lia-nikoghosyan#person", "name": "Lia Nikoghosyan", "url": "https://www.retrieve.am/en/personnel/lia-nikoghosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/mariam-dovlatyan#person", "name": "Mariam Dovlatyan", "url": "https://www.retrieve.am/en/personnel/mariam-dovlatyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/meline-nadaryan#person", "name": "Meline Nadaryan", "url": "https://www.retrieve.am/en/personnel/meline-nadaryan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/anahit-petrosyan#person", "name": "Anahit Petrosyan", "url": "https://www.retrieve.am/en/personnel/anahit-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/larisa-petrosyan#person", "name": "Larisa Petrosyan", "url": "https://www.retrieve.am/en/personnel/larisa-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/lilit-petrosyan#person", "name": "Lilit Petrosyan", "url": "https://www.retrieve.am/en/personnel/lilit-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/papin-karapetyan#person", "name": "Papin Karapetyan", "url": "https://www.retrieve.am/en/personnel/papin-karapetyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/mikayel-sargsyan#person", "name": "Mikayel Sargsyan", "url": "https://www.retrieve.am/en/personnel/mikayel-sargsyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/yeghishe-manukyan#person", "name": "Yeghishe Manukyan", "url": "https://www.retrieve.am/en/personnel/yeghishe-manukyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/nanar-siravyan#person", "name": "Nanar Siravyan", "url": "https://www.retrieve.am/en/personnel/nanar-siravyan" }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://www.retrieve.am/en/about-us#breadcrumb",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.retrieve.am/en" },
                    { "@type": "ListItem", "position": 2, "name": "About Us" }
                ]
            }
        ]
    },
    ru: {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": "https://www.retrieve.am/ru/about-us#webpage",
                "url": "https://www.retrieve.am/ru/about-us",
                "name": "О юридической фирме Retrieve",
                "inLanguage": "ru",
                "isPartOf": { "@id": "https://www.retrieve.am/ru/#website" },
                "about": { "@id": "https://www.retrieve.am/en/#organization" },
                "mainEntity": { "@id": "https://www.retrieve.am/en/#organization" },
                "breadcrumb": { "@id": "https://www.retrieve.am/ru/about-us#breadcrumb" }
            },
            {
                "@type": ["Organization", "LegalService"],
                "@id": "https://www.retrieve.am/en/#organization",
                "name": "Retrieve Legal & Tax",
                "url": "https://www.retrieve.am/ru",
                "employee": [
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/feliks-hovakimyan#person", "name": "Феликс Овакимян", "url": "https://www.retrieve.am/ru/personnel/feliks-hovakimyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/michael-hovhannesyan#person", "name": "Майкл Оганнесян", "url": "https://www.retrieve.am/ru/personnel/michael-hovhannesyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/vache-simonyan#person", "name": "Ваче Симонян", "url": "https://www.retrieve.am/ru/personnel/vache-simonyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/aleksandr-harutyunyan#person", "name": "Александр Арутюнян", "url": "https://www.retrieve.am/ru/personnel/aleksandr-harutyunyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/lia-nikoghosyan#person", "name": "Лия Никогосян", "url": "https://www.retrieve.am/ru/personnel/lia-nikoghosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/mariam-dovlatyan#person", "name": "Мариам Довлатян", "url": "https://www.retrieve.am/ru/personnel/mariam-dovlatyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/meline-nadaryan#person", "name": "Мелине Надарян", "url": "https://www.retrieve.am/ru/personnel/meline-nadaryan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/anahit-petrosyan#person", "name": "Анаит Петросян", "url": "https://www.retrieve.am/ru/personnel/anahit-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/larisa-petrosyan#person", "name": "Лариса Петросян", "url": "https://www.retrieve.am/ru/personnel/larisa-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/lilit-petrosyan#person", "name": "Лилит Петросян", "url": "https://www.retrieve.am/ru/personnel/lilit-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/papin-karapetyan#person", "name": "Папин Карапетян", "url": "https://www.retrieve.am/ru/personnel/papin-karapetyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/mikayel-sargsyan#person", "name": "Микаел Саргсян", "url": "https://www.retrieve.am/ru/personnel/mikayel-sargsyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/yeghishe-manukyan#person", "name": "Егише Манукян", "url": "https://www.retrieve.am/ru/personnel/yeghishe-manukyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/nanar-siravyan#person", "name": "Нанар Сиравян", "url": "https://www.retrieve.am/ru/personnel/nanar-siravyan" }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://www.retrieve.am/ru/about-us#breadcrumb",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://www.retrieve.am/ru" },
                    { "@type": "ListItem", "position": 2, "name": "О нас" }
                ]
            }
        ]
    },
    hy: {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": "https://www.retrieve.am/hy/about-us#webpage",
                "url": "https://www.retrieve.am/hy/about-us",
                "name": "Retrieve իրավաբանական ընկերության մասին",
                "inLanguage": "hy",
                "isPartOf": { "@id": "https://www.retrieve.am/hy/#website" },
                "about": { "@id": "https://www.retrieve.am/en/#organization" },
                "mainEntity": { "@id": "https://www.retrieve.am/en/#organization" },
                "breadcrumb": { "@id": "https://www.retrieve.am/hy/about-us#breadcrumb" }
            },
            {
                "@type": ["Organization", "LegalService"],
                "@id": "https://www.retrieve.am/en/#organization",
                "name": "Retrieve Legal & Tax",
                "url": "https://www.retrieve.am/hy",
                "employee": [
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/feliks-hovakimyan#person", "name": "Ֆելիքս Հովակիմյան", "url": "https://www.retrieve.am/hy/personnel/feliks-hovakimyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/michael-hovhannesyan#person", "name": "Մայքլ Հովհաննեսյան", "url": "https://www.retrieve.am/hy/personnel/michael-hovhannesyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/vache-simonyan#person", "name": "Վաչե Սիմոնյան", "url": "https://www.retrieve.am/hy/personnel/vache-simonyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/aleksandr-harutyunyan#person", "name": "Ալեքսանդր Հարությունյան", "url": "https://www.retrieve.am/hy/personnel/aleksandr-harutyunyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/lia-nikoghosyan#person", "name": "Լիա Նիկողոսյան", "url": "https://www.retrieve.am/hy/personnel/lia-nikoghosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/mariam-dovlatyan#person", "name": "Մարիամ Դովլաթյան", "url": "https://www.retrieve.am/hy/personnel/mariam-dovlatyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/meline-nadaryan#person", "name": "Մելինե Նադարյան", "url": "https://www.retrieve.am/hy/personnel/meline-nadaryan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/anahit-petrosyan#person", "name": "Անահիտ Պետրոսյան", "url": "https://www.retrieve.am/hy/personnel/anahit-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/larisa-petrosyan#person", "name": "Լարիսա Պետրոսյան", "url": "https://www.retrieve.am/hy/personnel/larisa-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/lilit-petrosyan#person", "name": "Լիլիթ Պետրոսյան", "url": "https://www.retrieve.am/hy/personnel/lilit-petrosyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/papin-karapetyan#person", "name": "Պապին Կարապետյան", "url": "https://www.retrieve.am/hy/personnel/papin-karapetyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/mikayel-sargsyan#person", "name": "Միքայել Սարգսյան", "url": "https://www.retrieve.am/hy/personnel/mikayel-sargsyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/yeghishe-manukyan#person", "name": "Եղիշե Մանուկյան", "url": "https://www.retrieve.am/hy/personnel/yeghishe-manukyan" },
                    { "@type": "Person", "@id": "https://www.retrieve.am/en/personnel/nanar-siravyan#person", "name": "Նանար Սիրավյան", "url": "https://www.retrieve.am/hy/personnel/nanar-siravyan" }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://www.retrieve.am/hy/about-us#breadcrumb",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Գլխավոր", "item": "https://www.retrieve.am/hy" },
                    { "@type": "ListItem", "position": 2, "name": "Մեր մասին" }
                ]
            }
        ]
    }
};
