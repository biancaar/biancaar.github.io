import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  translations
} from "../i18n/translations";

const LANGUAGE_STORAGE_KEY = "site_language";
const LanguageContext = createContext(null);

const normalizeLanguage = (value) =>
  SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;

const getByPath = (source, path) =>
  path.split(".").reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), source);

const interpolate = (value, params) => {
  if (!params || typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return normalizeLanguage(stored);

    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    setLanguageState(normalizeLanguage(nextLanguage));
  }, []);

  const t = useCallback(
    (key, params) => {
      const current = getByPath(translations[language], key);
      const fallback = getByPath(translations[DEFAULT_LANGUAGE], key);
      const value = current ?? fallback ?? key;
      return interpolate(value, params);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
