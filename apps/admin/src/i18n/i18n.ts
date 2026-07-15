import ENV from '@/config/env.variables';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpBackend) // Loads translations from public/locales
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    supportedLngs: ['en', 'fr'],
    fallbackLng: 'en',

    defaultNS: 'common',
    fallbackNS: 'common',

    debug: ENV.VITE_NODE_ENV === 'dev', // Only debug in development
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'students', 'classrooms', 'enums'] as const,

    // detection: {
    //   order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    //   caches: ['localStorage'],
    // },
  });

export default i18n;
