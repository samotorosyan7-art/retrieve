'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import ruCommon from '../locales/ru/common.json';
import amCommon from '../locales/am/common.json';

const resources = {
    en: {
        common: enCommon,
    },
    ru: {
        common: ruCommon,
    },
    am: {
        common: amCommon,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['cookie', 'localStorage'],
            lookupCookie: 'i18next',
            cookieMinutes: 10080, // 7 days
        },
    });

export default i18n;
