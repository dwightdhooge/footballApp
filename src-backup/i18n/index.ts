import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import nlBE from "./translations/nl-BE.json";
import en from "./translations/en.json";
import frBE from "./translations/fr-BE.json";

const resources = {
  "nl-BE": {
    translation: nlBE,
  },
  en: {
    translation: en,
  },
  "fr-BE": {
    translation: frBE,
  },
};

// Get device locale and fallback to English
const getDeviceLanguage = (): string => {
  const locale = Localization.getLocales()[0]?.languageCode;

  // Check if we have a translation for the device locale
  if (locale && locale.startsWith("nl")) {
    return "nl-BE";
  }

  if (locale && locale.startsWith("fr")) {
    return "fr-BE";
  }

  // Default to English for all other languages
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(), // Use device language
  fallbackLng: "en", // Fallback to English
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
