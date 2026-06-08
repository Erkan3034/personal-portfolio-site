import React, { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext({ lang: 'tr', setLang: () => {}, t: (k) => k });

const getInitialLang = () => {
  try {
    const saved = localStorage.getItem('portfolio-lang');
    if (saved === 'tr' || saved === 'en') return saved;
  } catch {}
  const browserLang = (navigator.language || '').toLowerCase();
  return browserLang.startsWith('tr') ? 'tr' : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('portfolio-lang', l); } catch {}
  }, []);

  const t = useCallback(
    (key) => {
      const parts = key.split('.');
      let val = translations[lang];
      for (const p of parts) val = val?.[p];
      return val ?? key;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
