export type ClientCategory =
    | "technology"
    | "finance"
    | "healthcare"
    | "realestate"
    | "logistics"
    | "media"
    | "education"
    | "nonprofit"
    | "services"
    | "legal";

export interface Client {
    /** Display name */
    name: string;
    /** Monogram shown in the logo placeholder (1–4 chars) */
    short: string;
    /** Industry grouping (drives the directory filters) */
    category: ClientCategory;
    /** English description. UI chrome is localized; company bios stay in English. */
    description: string;
    /** Partners & affiliations are grouped separately from commercial clients */
    partner?: boolean;
}

/**
 * Client & partner roster. Order here is the canonical display order.
 * Categories are localized in the locale files under `clients_cat_*`.
 */
export const CLIENTS: Client[] = [
    {
        name: "WWF — World Wide Fund",
        short: "WWF",
        category: "nonprofit",
        description:
            "WWF Armenia is the Armenian national office of World Wide Fund for Nature, one of the world's leading environmental organizations. It works to protect biodiversity, conserve endangered species, promote sustainable natural resource management, support climate change adaptation, and strengthen environmental awareness and conservation efforts throughout Armenia.",
    },
    {
        name: "KANRI Innovation Technologies Corp",
        short: "KI",
        category: "technology",
        description:
            "KANRI Innovation Technologies Corp is an information technology company focused on software development and digital solutions. It provides web and software development, front-end and back-end engineering, and technology consulting for businesses — typically working with modern stacks such as React and cloud technologies to build scalable digital products and enterprise solutions.",
    },
    {
        name: "Doodooc",
        short: "DO",
        category: "technology",
        description:
            "doodooc.com is a generative music visualization platform that helps musicians and content creators automatically create high-quality, audio-reactive video visuals for their music. It uses AI to analyze audio — rhythm, beat, frequency, and mood — and generates synchronized animations from a large library of customizable templates, letting users produce music videos and visualizers without advanced editing skills.",
    },
    {
        name: "Simulacrum AI",
        short: "SA",
        category: "technology",
        description:
            "Simulacrum AI works on artificial intelligence systems that simulate human behavior, conversation, and digital environments. The platform is associated with building AI-driven virtual agents, interactive simulations, and generative models that mimic real-world interactions for use cases such as entertainment, training, customer engagement, and research.",
    },
    {
        name: "BeeGraphy",
        short: "BG",
        category: "technology",
        description:
            "BeeGraphy is a startup specializing in advanced parametric modeling and cloud-based 3D CAD software. Founded in 2021 by engineers, mathematicians, and designers, it developed a web application for creating complex computational models through visual programming — used in architectural and industrial design, engineering, and education.",
    },
    {
        name: "MIASEEN Inc",
        short: "MI",
        category: "media",
        description:
            "MIASEEN Inc is a digital entertainment and events company promoting contemporary Armenian culture across Armenia, Artsakh, and the global diaspora. Founded in 2020, it produces cultural stories, media content, and events that inspire Armenians to engage with and express their identity — bringing Armenian culture into mainstream media while fostering community connection across generations and regions.",
    },
    {
        name: "NoyMed",
        short: "NM",
        category: "healthcare",
        description:
            "NoyMed is a privately owned, niche biometrics-focused contract research organization (CRO) founded in 2017. It provides biometrics and clinical research support services with a strong focus on client success, building long-term partnerships by delivering high-quality, client-oriented solutions throughout every stage of collaboration.",
    },
    {
        name: "DevExpress",
        short: "DX",
        category: "technology",
        description:
            "DevExpress is a software development company providing a comprehensive suite of UI components, developer tools, and reporting solutions for desktop, web, and mobile applications. Its product line spans .NET (WinForms, WPF, ASP.NET, Blazor), JavaScript frameworks (Angular, React, Vue), and other platforms — helping developers build rich interfaces, dashboards, and enterprise-grade applications more efficiently.",
    },
    {
        name: "ECOS",
        short: "EC",
        category: "finance",
        description:
            "ECOS is an international, industry-leading company in the blockchain and FinTech sector, founded in 2017, with products spanning mining, hosting, cloud mining, and cryptocurrency investment. ECOS operates its own Free Economic Zone in Armenia, allowing customers to take advantage of its benefits.",
    },
    {
        name: "eqwefy",
        short: "EQ",
        category: "finance",
        description:
            "eqwefy is an investment platform providing access to leading Armenian startups. It lists technology and innovation companies that have already secured funding from professional investors and undergone internal due diligence and vetting. For investors, eqwefy offers risk-adjusted returns, diversification, and deal-flow access.",
    },
    {
        name: "HMS",
        short: "HMS",
        category: "healthcare",
        description:
            "HMS is a healthcare-focused group operating multiple subsidiaries across medical manufacturing, distribution, and professional healthcare services. Its portfolio includes LifePACK, LifeEXPORT, LifeCARE, JMC, PROLife, and Medbook — covering surgical packaging, global device export, patient-care products, and medical knowledge resources. The group also acts as an exclusive distributor for international medical technology partners in Armenia.",
    },
    {
        name: "Jarl Gaming",
        short: "JG",
        category: "media",
        description:
            "Jarl Gaming is a gaming and digital entertainment company operating in the online betting and esports ecosystem. It focuses on platform management, risk and player-behavior analysis, and operational processes such as bonuses, fraud prevention, and tournament control — working closely with technology providers to optimize gaming systems while ensuring compliance and user engagement.",
    },
    {
        name: "Omni Logistics",
        short: "OL",
        category: "logistics",
        description:
            "Omni Logistics is a logistics and supply-chain company headquartered in Yerevan with branches across Armenia. It provides end-to-end (“A to Z”) solutions, including international freight to around 180 countries, postal and delivery services through Omni Post, plus storage, sorting, packing, and customs brokerage — serving both businesses and individuals locally and internationally.",
    },
    {
        name: "Kljyan Archi Bureau",
        short: "KA",
        category: "realestate",
        description:
            "Kljyan Archi Bureau is a dynamic architectural studio specializing in comprehensive design for residential, commercial, public, and infrastructure projects. The firm combines aesthetics, functionality, and modern design principles, with a team of architects, designers, and engineers using innovative technologies to deliver practical and visually compelling spaces.",
    },
    {
        name: "Inostudio",
        short: "IS",
        category: "technology",
        description:
            "Inostudio is a software development company building custom web and mobile applications, digital platforms, and enterprise IT solutions. It provides end-to-end services — web and mobile development, DevOps, UI/UX design, system integration, and cloud solutions — helping startups and enterprises automate processes, scale products, and implement complex software systems.",
    },
    {
        name: "Lavanda Clinic",
        short: "LC",
        category: "healthcare",
        description:
            "Lavanda Clinic is an Armenian ophthalmology clinic providing modern eye diagnostics and treatment using advanced equipment from leading manufacturers in the USA, Europe, and Japan. It focuses on personalized care, combining experienced ophthalmologists with high-quality diagnostic technology for accurate treatment and improved eye health.",
    },
    {
        name: "Les Trois Chênes",
        short: "LT",
        category: "healthcare",
        description:
            "Les Trois Chênes is a French healthcare and wellness company that develops and produces natural health products, dietary supplements, and personal-care solutions. It focuses on plant-based, scientifically formulated products supporting everyday health, beauty, and well-being, with a portfolio of supplements, dermocosmetics, and OTC health solutions distributed through pharmacies and retail.",
    },
    {
        name: "Médecins du Monde",
        short: "MdM",
        category: "nonprofit",
        description:
            "Médecins du Monde (Armenia mission) is a humanitarian organization providing medical and emergency assistance in environmental and conflict-related crises in Armenia. It focuses on harm-reduction programs and mental health and psychosocial support (MHPSS), particularly for displaced people from Artsakh and other vulnerable communities, improving access to healthcare in emergency and post-crisis settings.",
    },
    {
        name: "New Level Work",
        short: "NL",
        category: "services",
        description:
            "New Level Work is a leadership development and coaching company founded in 2017, offering virtual programs to improve management performance and business outcomes. Rebranded from BetterManager in 2024, it combines human-led coaching with its AI-powered platform, Leora AI — providing one-on-one executive coaching, group training, and 360-degree feedback assessments.",
    },
    {
        name: "Open Forest",
        short: "OF",
        category: "technology",
        description:
            "Open Forest is a software and compliance-automation company that helps small businesses manage legal, tax, and accounting obligations on a unified platform. Its AI-driven “company compliance operating system” automates incorporation, accounting, tax filing, legal documentation, and governance in one place — reducing complexity, cost, and manual workload for startups and small companies.",
    },
    {
        name: "QLess",
        short: "QL",
        category: "technology",
        description:
            "QLess is a customer-experience and queue-management technology company providing a mobile virtual queuing platform, letting users join and manage service lines remotely without waiting in physical queues. It is widely used by businesses, government services, and educational institutions to improve customer flow and reduce waiting times.",
    },
    {
        name: "QuickStaffing",
        short: "QS",
        category: "services",
        description:
            "QuickStaffing is a recruitment and outsourcing company founded in 2019, specializing in staffing solutions for local and international organizations. It connects businesses with qualified candidates across industries and seniority levels — from junior specialists to senior management — helping companies overcome talent-acquisition challenges and build stable, productive teams.",
    },
    {
        name: "Raleigh & Drake",
        short: "RD",
        category: "logistics",
        description:
            "Raleigh & Drake is a travel startup originally founded in New York City and later based in Santa Monica, Los Angeles. It transforms the travel experience by providing authentic, local recommendations that help travelers discover destinations in a more genuine and immersive way. The company partnered with Anthony Bourdain and brings a curated, culturally rich approach to modern travel planning.",
    },
    {
        name: "RE/MAX",
        short: "R/M",
        category: "realestate",
        description:
            "RE/MAX is a global real estate franchise network connecting buyers, sellers, and real estate professionals through independently owned and operated brokerage offices. In Armenia, RE/MAX provides property sales, rentals, and investment consulting through local agents, backed by its large international network and professional real estate marketing services.",
    },
    {
        name: "ArtyTraders",
        short: "AT",
        category: "finance",
        description:
            "ArtyTraders is an AI-powered art marketplace and investment platform that lets users value, analyze, and trade artworks. It offers instant valuation, price prediction, portfolio tracking, and art-investment insights through AI-driven analytics — connecting artists, collectors, and investors in a data-driven art market.",
    },
    {
        name: "CareTech",
        short: "CT",
        category: "healthcare",
        description:
            "CareTech is one of the UK's leading providers of specialist social care and special education services, founded in 1993. It delivers high-quality, person-centered support for individuals with complex needs, including care services and educational programs. With over 30 years of experience, CareTech is known for stability, continuity of leadership, and improving the lives of those it supports.",
    },
    {
        name: "GetTransfer",
        short: "GT",
        category: "logistics",
        description:
            "GetTransfer is a global online marketplace for booking private transfers, taxi services, and chauffeur-driven transportation worldwide. The platform lets users compare offers from different drivers and providers, choose prices in advance, and arrange airport transfers, intercity rides, and local travel in over 100 countries.",
    },
    {
        name: "MedBook",
        short: "MB",
        category: "healthcare",
        description:
            "MedBook is a comprehensive medicine directory application providing detailed information on over 30,000 medicines, including brand details, usage information, and herbal alternatives. It serves as a reference tool for healthcare professionals and users to access medicine data online and offline through a centralized, easy-to-use digital platform.",
    },
    {
        name: "French University in Armenia",
        short: "UFAR",
        category: "education",
        partner: true,
        description:
            "UFAR — the French University in Armenia — is a higher education institution established in partnership with French universities. It offers bilingual (Armenian–French) academic programs in fields such as law, management, marketing, and finance, combining French educational standards with local academic requirements.",
    },
    {
        name: "American University of Armenia",
        short: "AUA",
        category: "education",
        partner: true,
        description:
            "The American University of Armenia is a private, independent university in Yerevan following the American higher education system. It offers undergraduate and graduate programs in business, engineering, public health, law, and social sciences, and is known for research-oriented education, international standards, and a strong focus on critical thinking and leadership.",
    },
    {
        name: "The Lawyers Global",
        short: "TLG",
        category: "legal",
        partner: true,
        description:
            "The Lawyers Global is an international legal directory and rating platform that identifies and recognizes leading law firms and legal professionals worldwide. It publishes rankings, memberships, and awards based on research into firms' performance, reputation, and expertise across jurisdictions, highlighting reputable legal service providers and increasing their global visibility.",
    },
    {
        name: "Armenian British Business Chamber",
        short: "ABBC",
        category: "nonprofit",
        partner: true,
        description:
            "The Armenian British Business Chamber (ABBC) is an independent membership organization established in 2010 to promote economic and business relations between Armenia and the United Kingdom. As one of Armenia's leading international business chambers, it supports private-sector development through networking, business insights, advocacy, and connections with government, diplomatic, and international business communities.",
    },
    {
        name: "IP-Coster",
        short: "IP",
        category: "legal",
        partner: true,
        description:
            "IP-Coster is a global intellectual property management platform that helps businesses, inventors, and legal professionals estimate costs, file, and manage patents, trademarks, industrial designs, and other IP rights worldwide. It provides online quotations, filing services, workflow management, and access to a network of IP professionals across more than 160 countries.",
    },
];

/**
 * Logo path for a client. Files live in `public/logo-images/` named by the
 * lowercase, alphanumeric form of `short` (e.g. "R/M" → rm.png, "MdM" → mdm.png).
 */
export const clientLogo = (c: Client): string =>
    `/logo-images/${c.short.toLowerCase().replace(/[^a-z0-9]/g, "")}.png`;

/**
 * Headline figure for the full client base. The roster below is a curated
 * selection; the firm has advised many more organizations than are listed.
 */
export const CLIENT_TOTAL_LABEL = "200+";

export const CLIENT_CATEGORY_ORDER: ClientCategory[] = [
    "technology",
    "finance",
    "healthcare",
    "realestate",
    "logistics",
    "media",
    "services",
    "nonprofit",
    "education",
    "legal",
];

/** Distinct industries represented across the whole roster (for stats). */
export const CLIENT_INDUSTRY_COUNT = new Set(CLIENTS.map((c) => c.category)).size;
