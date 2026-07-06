import fs from "fs/promises";
import path from "path";

export interface LegalUpdatePDF {
    title: string;
    pdfLink: string;
}

const SUPPORTED_LANGS = ["en", "ru", "am"] as const;
const LEGAL_UPDATES_DIR = path.join(process.cwd(), "public", "legal-updates");

// Explicit display titles per file, in the order they should appear on the page.
// Any PDF dropped into a language folder without an entry here falls back to a
// title derived from its filename.
const CUSTOM_TITLES: Record<string, Record<string, string>> = {
    en: {
        "Banking-and-Finance-in-Armenia.pdf": "BANKING AND FINANCE IN ARMENIA: LEGAL FRAMEWORK FOR INTERNATIONAL CLIENTS",
        "IP-and-Trademarks-2.pdf": "PROTECTING YOUR INTELLECTUAL PROPERTY IN ARMENIA: WHAT YOU NEED TO KNOW",
        "Key Amendments to Armenia’s Law on Foreigners.pdf": "KEY AMENDMENTS TO ARMENIA’S LAW ON FOREIGNERS",
    },
    ru: {
        "IT-Sector-Support_Rus.pdf": "ГОСУДАРСТВЕННАЯ ПОДДЕРЖКА, ПРЕДОСТАВЛЯЕМАЯ ВЫСОКОТЕХНОЛОГИЧНОМУ СЕКТОРУ",
        "Ключевые поправки.pdf": "КЛЮЧЕВЫЕ ПОПРАВКИ К ЗАКОНУ АРМЕНИИ ОБ ИНОСТРАНЦАХ",
    },
    am: {
        "IT-Sector-Support_Arm-3.pdf": "ԲԱՐՁՐ ՏԵԽՆՈԼՈԳԻԱՆԵՐԻ ՈԼՈՐՏԻՆ ՏՐԱՄԱԴՐՎՈՂ ՊԵՏԱԿԱՆ ԱՋԱԿՑՈՒԹՅՈՒՆ",
        "Օտարերկրացիների_մասին_ՀՀ_օրենքի_հիմնական_փոփոխությունները.pdf": "«ՕՏԱՐԵՐԿՐԱՑԻՆԵՐԻ ՄԱՍԻՆ» ՀՀ ՕՐԵՆՔԻ ՀԻՄՆԱԿԱՆ ՓՈՓՈԽՈՒԹՅՈՒՆՆԵՐԸ",
    },
};

function fileNameToTitle(fileName: string): string {
    return fileName
        .replace(/\.pdf$/i, "")
        .replace(/[_-]+/g, " ")
        .trim();
}

/**
 * Reads legal update PDFs bundled with the project from public/legal-updates/<lang>.
 */
export async function getLegalUpdatesPDFs(lang: string): Promise<LegalUpdatePDF[]> {
    const resolvedLang = (SUPPORTED_LANGS as readonly string[]).includes(lang) ? lang : "en";
    const dir = path.join(LEGAL_UPDATES_DIR, resolvedLang);
    const titles = CUSTOM_TITLES[resolvedLang] || {};
    const order = Object.keys(titles);

    try {
        const files = await fs.readdir(dir);
        return files
            .filter((file) => file.toLowerCase().endsWith(".pdf"))
            .map((file) => ({
                title: titles[file] || fileNameToTitle(file),
                pdfLink: `/legal-updates/${resolvedLang}/${encodeURIComponent(file)}`,
                _file: file,
            }))
            .sort((a, b) => {
                const ai = order.indexOf(a._file);
                const bi = order.indexOf(b._file);
                if (ai === -1 && bi === -1) return a.title.localeCompare(b.title);
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
            })
            .map(({ title, pdfLink }) => ({ title, pdfLink }));
    } catch {
        return [];
    }
}
