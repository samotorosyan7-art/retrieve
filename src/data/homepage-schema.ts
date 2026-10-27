/**
 * Manually curated homepage JSON-LD, keyed by language.
 * Languages missing here fall back to English.
 */
export const homepageSchema: Record<string, object> = {
    en: {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Organization", "LegalService"],
                "@id": "https://www.retrieve.am/en/#organization",
                "name": "Retrieve Legal & Tax",
                "url": "https://www.retrieve.am/en",
                // /logo.png doesn't exist in /public; /logo.jpg is the published logo.
                "logo": "https://www.retrieve.am/logo.jpg",
                "image": "https://www.retrieve.am/logo.jpg",
                "description": "Retrieve Legal & Tax is a trusted law firm in Armenia, providing legal and tax advisory services to businesses and individuals.",
                "telephone": "+37441777332",
                "email": "info@retrieve.am",
                "priceRange": "$$",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "telephone": "+37441777332",
                    "email": "info@retrieve.am",
                    "availableLanguage": ["English", "Armenian", "Russian"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Baghramyan 41",
                    "addressLocality": "Yerevan",
                    "postalCode": "0019",
                    "addressCountry": "AM"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 40.1920,
                    "longitude": 44.5013
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday"
                    ],
                    "opens": "09:00",
                    "closes": "18:00"
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Armenia"
                },
                "sameAs": [
                    "https://www.linkedin.com/company/retrievelegal/",
                    "https://www.facebook.com/retrievelegalandtax/",
                    "https://www.instagram.com/retrieve.legal/"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://www.retrieve.am/en/#website",
                "url": "https://www.retrieve.am/en",
                "name": "Retrieve Legal & Tax",
                "publisher": {
                    "@id": "https://www.retrieve.am/en/#organization"
                }
            },
            {
                "@type": "HomePage",
                "@id": "https://www.retrieve.am/en/#webpage",
                "url": "https://www.retrieve.am/en",
                "name": "Retrieve Legal & Tax",
                "isPartOf": {
                    "@id": "https://www.retrieve.am/en/#website"
                },
                "about": {
                    "@id": "https://www.retrieve.am/en/#organization"
                },
                "mainEntity": {
                    "@id": "https://www.retrieve.am/en/#organization"
                }
            }
        ]
    },
    ru: {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Organization", "LegalService"],
                "@id": "https://www.retrieve.am/en/#organization",
                "name": "Retrieve Legal & Tax",
                "url": "https://www.retrieve.am/ru",
                "logo": "https://www.retrieve.am/logo.jpg",
                "image": "https://www.retrieve.am/logo.jpg",
                "description": "Retrieve Legal & Tax — юридическая фирма в Армении, оказывающая юридические и налоговые консультационные услуги бизнесу и частным лицам.",
                "telephone": "+37441777332",
                "email": "info@retrieve.am",
                "priceRange": "$$",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "telephone": "+37441777332",
                    "email": "info@retrieve.am",
                    "availableLanguage": ["English", "Armenian", "Russian"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Baghramyan 41",
                    "addressLocality": "Yerevan",
                    "postalCode": "0019",
                    "addressCountry": "AM"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 40.1920,
                    "longitude": 44.5013
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "18:00"
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Armenia"
                },
                "sameAs": [
                    "https://www.linkedin.com/company/retrievelegal/",
                    "https://www.facebook.com/retrievelegalandtax/",
                    "https://www.instagram.com/retrieve.legal/"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://www.retrieve.am/ru/#website",
                "url": "https://www.retrieve.am/ru",
                "name": "Retrieve Legal & Tax",
                "inLanguage": "ru",
                "publisher": { "@id": "https://www.retrieve.am/en/#organization" }
            },
            {
                "@type": "WebPage",
                "@id": "https://www.retrieve.am/ru/#webpage",
                "url": "https://www.retrieve.am/ru",
                "name": "Retrieve Legal & Tax",
                "inLanguage": "ru",
                "isPartOf": { "@id": "https://www.retrieve.am/ru/#website" },
                "about": { "@id": "https://www.retrieve.am/en/#organization" },
                "mainEntity": { "@id": "https://www.retrieve.am/en/#organization" }
            }
        ]
    },
    hy: {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Organization", "LegalService"],
                "@id": "https://www.retrieve.am/en/#organization",
                "name": "Retrieve Legal & Tax",
                "url": "https://www.retrieve.am/hy",
                "logo": "https://www.retrieve.am/logo.jpg",
                "image": "https://www.retrieve.am/logo.jpg",
                "description": "Retrieve Legal & Tax-ը իրավաբանական ընկերություն է Հայաստանում, որը բիզնեսին և անհատներին տրամադրում է իրավաբանական և հարկային խորհրդատվական ծառայություններ։",
                "telephone": "+37441777332",
                "email": "info@retrieve.am",
                "priceRange": "$$",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer support",
                    "telephone": "+37441777332",
                    "email": "info@retrieve.am",
                    "availableLanguage": ["English", "Armenian", "Russian"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Baghramyan 41",
                    "addressLocality": "Yerevan",
                    "postalCode": "0019",
                    "addressCountry": "AM"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 40.1920,
                    "longitude": 44.5013
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "18:00"
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Armenia"
                },
                "sameAs": [
                    "https://www.linkedin.com/company/retrievelegal/",
                    "https://www.facebook.com/retrievelegalandtax/",
                    "https://www.instagram.com/retrieve.legal/"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://www.retrieve.am/hy/#website",
                "url": "https://www.retrieve.am/hy",
                "name": "Retrieve Legal & Tax",
                "inLanguage": "hy",
                "publisher": { "@id": "https://www.retrieve.am/en/#organization" }
            },
            {
                "@type": "WebPage",
                "@id": "https://www.retrieve.am/hy/#webpage",
                "url": "https://www.retrieve.am/hy",
                "name": "Retrieve Legal & Tax",
                "inLanguage": "hy",
                "isPartOf": { "@id": "https://www.retrieve.am/hy/#website" },
                "about": { "@id": "https://www.retrieve.am/en/#organization" },
                "mainEntity": { "@id": "https://www.retrieve.am/en/#organization" }
            }
        ]
    },
};
