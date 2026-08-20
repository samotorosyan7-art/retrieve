import type { EducationEntry } from "@/types/wordpress";

export type PersonnelEducation = Record<"en" | "ru" | "am", EducationEntry[]>;

/**
 * Manually curated education/bar-admission entries, keyed by personnel slug.
 * WordPress does not publish this data in a scrapable form, so it is
 * maintained here directly instead of via getPersonnelDetails().
 */
export const personnelEducation: Record<string, PersonnelEducation> = {
    "feliks-hovakimyan": {
        en: [
            { year: "2025", degree: "Admitted to the State Bar of California", institution: "License to practice law in the state of California" },
            { year: "2021", degree: "School of Advocates of RA", institution: "License to Practice Law in Armenia" },
            { year: "2020", degree: "Master of Laws (LL.M), Specialization in Corporate Law", institution: "American University of Armenia" },
            { year: "2018", degree: "Bachelor of International Relations, Specialization in International Law", institution: "Yerevan State University" },
        ],
        ru: [
            { year: "2025", degree: "Принят в коллегию адвокатов штата Калифорния", institution: "Лицензия на осуществление адвокатской деятельности в штате Калифорния" },
            { year: "2021", degree: "Школа адвокатов Республики Армения", institution: "Лицензия на осуществление адвокатской деятельности в Республике Армения" },
            { year: "2020", degree: "Магистр права (LL.M.), специализация — корпоративное право", institution: "Американский университет Армении" },
            { year: "2018", degree: "Бакалавр международных отношений, специализация — международное право", institution: "Ереванский государственный университет" },
        ],
        am: [
            { year: "2025", degree: "Ընդունվել է Կալիֆոռնիա նահանգի փաստաբանների միություն", institution: "Կալիֆոռնիա նահանգում փաստաբանական գործունեություն իրականացնելու արտոնագիր" },
            { year: "2021", degree: "Հայաստանի Հանրապետության Փաստաբանական ակադեմիա", institution: "Հայաստանի Հանրապետությունում փաստաբանական գործունեություն իրականացնելու արտոնագիր" },
            { year: "2020", degree: "Իրավագիտության մագիստրոսի աստիճան (LL.M.), մասնագիտացում՝ կորպորատիվ իրավունք", institution: "Հայաստանի ամերիկյան համալսարան" },
            { year: "2018", degree: "Միջազգային հարաբերությունների բակալավրի աստիճան, մասնագիտացում՝ միջազգային իրավունք", institution: "Երևանի պետական համալսարան" },
        ],
    },
    "michael-hovhannesyan": {
        en: [
            { year: "2020", degree: "Master of Laws (LL.M), Specialization in Corporate Law", institution: "American University of Armenia" },
            { year: "2020", degree: "Certificate in Corporate Governance", institution: "University of Munich LMU" },
            { year: "2018", degree: "Bachelor of Arts, Specialization in Public Relations", institution: "American University of Armenia" },
        ],
        ru: [
            { year: "2020", degree: "Магистр права (LL.M.), специализация — корпоративное право", institution: "Американский университет Армении" },
            { year: "2020", degree: "Сертификат по корпоративному управлению", institution: "Мюнхенский университет имени Людвига-Максимилиана (LMU)" },
            { year: "2018", degree: "Бакалавр искусств (B.A.), специализация — связи с общественностью", institution: "Американский университет Армении" },
        ],
        am: [
            { year: "2020", degree: "Իրավագիտության մագիստրոսի աստիճան (LL.M), մասնագիտացում՝ կորպորատիվ իրավունք", institution: "Հայաստանի ամերիկյան համալսարան" },
            { year: "2020", degree: "Կորպորատիվ կառավարման վկայական", institution: "Մյունխենի Լյուդվիգ-Մաքսիմիլիան համալսարան (LMU)" },
            { year: "2018", degree: "Արվեստի բակալավրի աստիճան (B.A.), մասնագիտացում՝ հանրային կապեր", institution: "Հայաստանի ամերիկյան համալսարան" },
        ],
    },
    "vache-simonyan": {
        en: [
            { year: "2021", degree: "The Academy of Advocates", institution: "" },
            { year: "2013", degree: "The School of Prosecutors", institution: "" },
            { year: "2007-2009", degree: "Master of Law", institution: "Russian-Armenian University" },
            { year: "2003-2007", degree: "Bachelor of Law", institution: "Russian-Armenian University" },
        ],
        ru: [
            { year: "2021", degree: "Академия адвокатов РА", institution: "" },
            { year: "2013", degree: "Школа прокуроров РА", institution: "" },
            { year: "2007–2009", degree: "Магистр права", institution: "Российско-Армянский университет" },
            { year: "2003–2007", degree: "Бакалавр права", institution: "Российско-Армянский университет" },
        ],
        am: [
            { year: "2021", degree: "ՀՀ Փաստաբանական ակադեմիա", institution: "" },
            { year: "2013", degree: "ՀՀ Դատախազների դպրոց", institution: "" },
            { year: "2007–2009", degree: "Իրավագիտության մագիստրոսի աստիճան", institution: "Հայ-ռուսական համալսարան" },
            { year: "2003–2007", degree: "Իրավագիտության բակալավրի աստիճան", institution: "Հայ-ռուսական համալսարան" },
        ],
    },
    "aleksandr-harutyunyan": {
        en: [
            { year: "2018", degree: "Advocacy License of RA, Specialization in Civil and Administrative Law", institution: "School of Advocates of RA" },
            { year: "2017", degree: "Ph.D in Constitutional Law", institution: "Public Administration Academy of RA" },
            { year: "2013", degree: "LL.M", institution: "American University of Armenia" },
        ],
        ru: [
            { year: "2018", degree: "Лицензия адвоката Республики Армения, специализация — гражданское и административное право", institution: "Школа адвокатов Республики Армения" },
            { year: "2017", degree: "PhD по конституционному праву", institution: "Академия государственного управления Республики Армения" },
            { year: "2013", degree: "Программа магистра права (LL.M)", institution: "Американский университет Армении" },
        ],
        am: [
            { year: "2018", degree: "Հայաստանի Հանրապետության փաստաբանական արտոնագիր, մասնագիտացում՝ քաղաքացիական և վարչական իրավունք", institution: "Հայաստանի Հանրապետության Փաստաբանական դպրոց" },
            { year: "2017", degree: "Իրավագիտության դոկտոր (PhD)՝ սահմանադրական իրավունք", institution: "ՀՀ պետական կառավարման ակադեմիա" },
            { year: "2013", degree: "Իրավագիտության մագիստրոսի աստիճան (LL.M)", institution: "Հայաստանի ամերիկյան համալսարան" },
        ],
    },
    "iren-aghasyan": {
        en: [
            { year: "2016-2018", degree: "Bachelor in Economics-Marketing Management", institution: "Jean Moulin Lyon III" },
            { year: "2014-2018", degree: "Bachelor in Economics-Marketing Management", institution: "French University in Armenia" },
        ],
        ru: [
            { year: "2016–2018", degree: "Бакалавр экономики и управления маркетингом", institution: "Университет Жан Мулен Лион III" },
            { year: "2014–2018", degree: "Бакалавр экономики и управления маркетингом", institution: "Французский университет в Армении" },
        ],
        am: [
            { year: "2016–2018", degree: "Տնտեսագիտության և մարքեթինգի կառավարման բակալավրի աստիճան", institution: "Jean Moulin Lyon III համալսարան" },
            { year: "2014–2018", degree: "Տնտեսագիտության և մարքեթինգի կառավարման բակալավրի աստիճան", institution: "Հայաստանի ֆրանսիական համալսարան" },
        ],
    },
};
