'use client';

import { ReactNode, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cookies from 'js-cookie';

export interface I18nProviderProps {
  children: ReactNode;
}

// Enable more verbose debugging
const isDevMode = process.env.NODE_ENV === 'development';

// Import English translations
import enAdmin from '../../public/locales/en/admin.json';
import enCommon from '../../public/locales/en/common.json';
import enFeatures from '../../public/locales/en/features.json';
import enContact from '../../public/locales/en/contact.json';
import enAuth from '../../public/locales/en/auth.json';
import enSuperAdmin from '../../public/locales/en/super-admin.json';

// Import Amharic translations
import amAdmin from '../../public/locales/am/admin.json';
import amCommon from '../../public/locales/am/common.json';
import amFeatures from '../../public/locales/am/features.json';
import amContact from '../../public/locales/am/contact.json';
import amAuth from '../../public/locales/am/auth.json';
import amSuperAdmin from '../../public/locales/am/super-admin.json';

// Import Oromo translations
import omAdmin from '../../public/locales/om/admin.json';
import omCommon from '../../public/locales/om/common.json';
import omFeatures from '../../public/locales/om/features.json';
import omContact from '../../public/locales/om/contact.json';
import omAuth from '../../public/locales/om/auth.json';
import omSuperAdmin from '../../public/locales/om/super-admin.json';

// Initialize with resources already loaded
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'am', 'om'],
    debug: isDevMode,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      // Pre-load all translations for all languages
      en: {
        admin: enAdmin,
        common: enCommon,
        features: enFeatures,
        contact: enContact,
        auth: enAuth,
        superAdmin: enSuperAdmin
      },
      am: {
        admin: amAdmin,
        common: amCommon,
        features: amFeatures,
        contact: amContact,
        auth: amAuth,
        superAdmin: amSuperAdmin
      },
      om: {
        admin: omAdmin,
        common: omCommon,
        features: omFeatures,
        contact: omContact,
        auth: omAuth,
        superAdmin: omSuperAdmin
      }
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      lookupCookie: 'NEXT_LOCALE',
      caches: ['cookie'],
    },
    react: {
      useSuspense: false,
    },
    defaultNS: 'common',
    ns: ['admin', 'common', 'features', 'contact', 'auth', 'superAdmin'],
  }).then(() => {
    if (isDevMode) {
      console.log('i18next initialized with language:', i18n.language);
      console.log('Available languages:', i18n.languages);
      console.log('Available namespaces:', i18n.options.ns);
      console.log('Loaded resources:', i18n.services.resourceStore.data);
    }
  }).catch(error => {
    console.error('Error initializing i18next:', error);
  });

export function I18nProvider({ children }: I18nProviderProps): JSX.Element {
  useEffect(() => {
    // Save the language preference to a cookie for SSR
    const handleLanguageChange = () => {
      if (isDevMode) {
        console.log('Language changed to:', i18n.language);
      }
      Cookies.set('NEXT_LOCALE', i18n.language);
    };

    // Log initial state
    if (isDevMode) {
      console.log('Initial language:', i18n.language);
      console.log('Initial resources:', i18n.services.resourceStore.data);
      
      // Check availability of translations for all languages and namespaces
      const languages = ['en', 'am', 'om'];
      const namespaces = ['admin', 'common', 'features', 'contact', 'auth', 'superAdmin'];
      
      languages.forEach(lang => {
        namespaces.forEach(ns => {
          console.log(`${lang} ${ns} available:`, i18n.hasResourceBundle(lang, ns));
        });
      });
    }

    i18n.on('languageChanged', handleLanguageChange);

    // Force a reload of all namespaces to ensure they're loaded for all languages
    i18n.loadNamespaces(['admin', 'common', 'features', 'contact', 'auth', 'superAdmin']).then(() => {
      if (isDevMode) {
        console.log('All namespaces loaded');
      }
    });

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 