import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext({ lang: 'tr', setLang: () => {}, t: (k) => k });

// İlk render her zaman bu dille yapılır. <html lang="tr"> ve react-snap prerender'ı
// ile tutarlı olmalı; aksi halde istemcinin ilk render'ı prerender ile uyuşmaz.
const DEFAULT_LANG = 'tr';

const detectLang = () => {
  try {
    const saved = localStorage.getItem('portfolio-lang');
    if (saved === 'tr' || saved === 'en') return saved;
  } catch {}
  const browserLang = (typeof navigator !== 'undefined' ? navigator.language : '').toLowerCase();
  return browserLang.startsWith('tr') ? 'tr' : 'en';
};

export const LanguageProvider = ({ children }) => {
  // İlk render sabit DEFAULT_LANG ile yapılır; böylece prerender (react-snap) ile
  // istemcinin ilk render'ı birebir aynı olur ve hydration uyuşmazlığı (#418) oluşmaz.
  const [lang, setLangState] = useState(DEFAULT_LANG);

  // Mount sonrası gerçek dili (localStorage / tarayıcı) tespit edip uygula.
  useEffect(() => {
    const detected = detectLang();
    if (detected !== DEFAULT_LANG) setLangState(detected);
  }, []);

  // <html lang> özniteliğini güncel tut (erişilebilirlik / SEO).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
