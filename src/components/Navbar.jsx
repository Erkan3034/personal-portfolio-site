import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Ana Sayfa', path: '/' },
    { name: 'Hakkımda', path: '/about' },
    { name: 'Projeler', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sertifikalar', path: '/certificates' },
    { name: 'İletişim', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-5 pb-10"
    >
      {/* Desktop Floating Navbar - Apple Style */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? 'rgba(30, 30, 35, 0.85)' : 'rgba(30, 30, 35, 0.6)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(150%)',
          boxShadow: scrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex items-center gap-1 px-2 py-2 rounded-2xl border border-white/10"
        style={{
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(12px) saturate(150%)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center px-3 mr-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <picture className="block h-7">
              <source srcSet="/logo.png" type="image/png" />
              <img
                src="/logo.png"
                alt="Logo"
                className="h-7 w-auto object-contain"
              />
            </picture>
          </motion.div>
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 mr-1" />

        {/* Nav Items */}
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {/* Active Background */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="navActive"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200"
              />
              
              <span className="relative z-10">{item.name}</span>
            </motion.div>
          </Link>
        ))}
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: 'rgba(30, 30, 35, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
        }}
        className="md:hidden flex items-center justify-between w-full max-w-lg px-4 py-3 rounded-2xl border border-white/10"
        style={{
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <picture className="block h-6">
            <source srcSet="/logo.png" type="image/png" />
            <img
              src="/logo.png"
              alt="Logo"
              className="h-6 w-auto object-contain"
            />
          </picture>
        </Link>

        {/* Mobile menu button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.path
                  key="close"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <motion.path
                  key="menu"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </AnimatePresence>
          </svg>
        </motion.button>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-full left-4 right-4 mt-2"
          >
            <div 
              className="p-2 rounded-2xl border border-white/10"
              style={{
                backgroundColor: 'rgba(30, 30, 35, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
