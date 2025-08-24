import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../assets/locales/en.json';
import hi from '../../assets/locales/hi.json';
import ta from '../../assets/locales/ta.json';
import te from '../../assets/locales/te.json';
import bn from '../../assets/locales/bn.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  te: { translation: te },
  bn: { translation: bn },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources,
      lng: Localization.locale.split('-')[0] || 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
    })
    .catch(() => {
      // no-op
    });
}

export default i18n;