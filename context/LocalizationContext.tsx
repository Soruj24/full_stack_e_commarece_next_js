"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/lib/localization";

interface LocalizationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  country: string;
  setCountry: (code: string) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined,
);

export function LocalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] = useState("en");
  const [currency, setCurrencyState] = useState("USD");
  const [country, setCountryState] = useState("US");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    const savedCurr = localStorage.getItem("currency");
    const savedCountry = localStorage.getItem("country");

    if (savedLang && translations[savedLang]) {
      if (savedLang !== language) setLanguageState(savedLang);
    } else {
      const browserLang =
        typeof navigator !== "undefined" ? navigator.language : "en-US";
      const langCode = browserLang.split("-")[0];
      const countryCode = (browserLang.split("-")[1] || "").toUpperCase();
      const preferredLang = translations[langCode] ? langCode : "en";
      setLanguageState(preferredLang);
      localStorage.setItem("language", preferredLang);
      document.documentElement.lang = preferredLang;
      document.documentElement.dir = ["ar", "he"].includes(preferredLang)
        ? "rtl"
        : "ltr";
      const defaultCurrency =
        countryCode === "GB"
          ? "GBP"
          : countryCode === "US"
            ? "USD"
            : countryCode === "CA"
              ? "CAD"
              : countryCode === "AU"
                ? "AUD"
                : countryCode === "IN"
                  ? "INR"
                  : countryCode === "JP"
                    ? "JPY"
                    : preferredLang === "es"
                      ? "EUR"
                      : preferredLang === "bn"
                        ? "BDT"
                        : "USD";
      setCurrencyState(defaultCurrency);
      localStorage.setItem("currency", defaultCurrency);
      const defaultCountry = countryCode || "US";
      setCountryState(defaultCountry);
      localStorage.setItem("country", defaultCountry);
    }

    if (savedCurr && savedCurr !== currency) {
      setCurrencyState(savedCurr);
    }
    if (savedCountry && savedCountry !== country) {
      setCountryState(savedCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    // Handle RTL if needed (e.g. for Arabic/Hebrew)
    document.documentElement.dir = ["ar", "he"].includes(lang) ? "rtl" : "ltr";
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    localStorage.setItem("currency", curr);
  };

  const setCountry = (code: string) => {
    setCountryState(code);
    localStorage.setItem("country", code);
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    let current: Record<string, unknown> =
      translations[language] || translations["en"];

    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key] as Record<string, unknown>;
    }

    return typeof current === "string" ? current : path;
  };

  return (
    <LocalizationContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        country,
        setCountry,
        t,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider",
    );
  }
  return context;
}
