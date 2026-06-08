import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  const NAV_ITEMS = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.about', path: '/about' },
    { key: 'nav.projects', path: '/projects' },
    { key: 'nav.blog', path: '/blog' },
    { key: 'nav.certificates', path: '/certificates' },
    { key: 'nav.contact', path: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  const LangToggle = ({ mobile }) => (
    <button
      onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
      className={`flex items-center gap-1 rounded-xl font-mono font-semibold text-xs transition-all duration-150 cursor-pointer ${
        mobile
          ? 'px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          : 'px-2.5 py-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]'
      }`}
      aria-label="Switch language"
    >
      <span className={lang === 'tr' ? 'text-emerald-400' : 'text-zinc-500'}>TR</span>
      <span className="text-zinc-700">/</span>
      <span className={lang === 'en' ? 'text-emerald-400' : 'text-zinc-500'}>EN</span>
    </button>
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      {/* Desktop nav */}
      <motion.nav
        animate={{
          backgroundColor: scrolled ? 'rgba(12,12,14,0.92)' : 'rgba(12,12,14,0.7)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)'
            : '0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        transition={{ duration: 0.25 }}
        style={{ backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
        className="hidden md:flex items-center gap-0.5 px-2 py-1.5 rounded-2xl"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center px-3 mr-1">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <picture className="block h-7">
              <source srcSet="/logo.png" type="image/png" />
              <img src="/logo.png" alt="Logo" className="h-7 w-auto object-contain" />
            </picture>
          </motion.div>
        </Link>

        <div className="w-px h-5 bg-white/[0.08] mr-1" />

        {NAV_ITEMS.map((item) => (
          <Link key={item.key} to={item.path} className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium font-body transition-colors duration-150 ${
                isActive(item.path) ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {isActive(item.path) && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-white/[0.08] rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{t(item.key)}</span>
            </motion.div>
          </Link>
        ))}

        <div className="w-px h-5 bg-white/[0.08] mx-1" />
        <LangToggle />
      </motion.nav>

      {/* Mobile nav */}
      <motion.nav
        style={{
          backgroundColor: 'rgba(12,12,14,0.92)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07)',
        }}
        className="md:hidden flex items-center justify-between w-full max-w-lg px-4 py-3 rounded-2xl"
      >
        <Link to="/">
          <picture className="block h-6">
            <source srcSet="/logo.png" type="image/png" />
            <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
          </picture>
        </Link>

        <div className="flex items-center gap-2">
          <LangToggle mobile />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t('nav.menuToggle')}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.path key="x" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }}
                    strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <motion.path key="menu" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }}
                    strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </AnimatePresence>
            </svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-4 right-4 mt-2"
          >
            <div
              className="p-2 rounded-2xl"
              style={{
                backgroundColor: 'rgba(12,12,14,0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)',
              }}
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium font-body transition-all duration-150 ${
                      isActive(item.path)
                        ? 'text-white bg-white/[0.08]'
                        : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <div className="px-2 pt-1 pb-1">
                <Link to="/contact">
                  <button className="w-full py-2.5 rounded-xl bg-emerald-500 text-black text-sm font-semibold font-body cursor-pointer">
                    {t('nav.contactBtn')}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
