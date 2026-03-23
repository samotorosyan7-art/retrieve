export interface WPPost {
    id: number;
    date: string;
    slug: string;
    link: string;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    tags?: number[];
    _embedded?: {
        "wp:featuredmedia"?: WPMedia[];
        "wp:term"?: any[][];
    };
}

export interface WPTag {
    id: number;
    name: string;
    slug: string;
}

export interface WPMedia {
    id: number;
    source_url: string;
    alt_text: string;
}

export interface WPPage {
    id: number;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
}

export interface WPTeamMember {
    id: string;
    name: string;
    position: string;
    image: string;
    link: string;
}

export interface PortfolioItem {
    id?: number;
    title: string;
    slug: string;
    image: string | null;
    category?: string;
    categories?: number[];
    tags?: string[];
}

export interface EducationEntry {
    year: string;
    degree: string;
    institution: string;
}

export interface PersonnelDetails {
    name: string;
    position: string;
    image: string;
    biography: string;
    practiceAreas: string[];
    email?: string;
    phone?: string;
    linkedin?: string;
    education: EducationEntry[];
}

export interface MenuItem {
    label: string;
    url: string;
    children?: MenuItem[];
}
