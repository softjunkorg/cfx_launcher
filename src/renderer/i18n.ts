import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import i18n from "i18next";
import en_US from "./locales/en-US.json";
import pt_BR from "./locales/pt-BR.json";

const resources = {
  "en-US": { translation: en_US },
  "pt-BR": { translation: pt_BR },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  lng: "en-US",
  debug: true,
});

export default i18n;
