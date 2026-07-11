import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ROLES = [
  'Full Stack Developer',
  'Python Developer',
  'Java Developer',
  'AI Enthusiast',
  'Problem Solver',
];

const GitHubIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const SOCIALS = [
  { href: 'https://github.com/Erkan3034', label: 'GitHub', Icon: GitHubIcon },
  { href: 'https://www.linkedin.com/in/erkanturgut1205', label: 'LinkedIn', Icon: LinkedInIcon },
  { href: 'https://x.com/Erkan_0630', label: 'X', Icon: XIcon },
  { href: 'mailto:turguterkan55@gmail.com', label: 'Email', Icon: EmailIcon, self: true },
];

const useTypewriter = (words) => {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let delay = deleting ? 35 : 80;
    if (!deleting && charIdx === word.length) delay = 1800;

    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < word.length) {
          setText(word.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setText(word.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setWordIdx((i) => (i + 1) % words.length);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words]);

  return text;
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const gradientBorder = 'linear-gradient(145deg, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0.05) 60%, transparent 100%)';

const HeroSection = () => {
  const role = useTypewriter(ROLES);
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-canvas">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/[0.04] blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-28 sm:pt-32 pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-center">

          {/* ── Left: content ── */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="order-2 lg:order-1">

            {/* Available badge */}
            <motion.div variants={itemAnim} className="mb-8 lg:mb-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400 text-sm font-medium font-body">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t('hero.badge')}
              </span>
            </motion.div>

            {/* Display name */}
            <motion.h1
              variants={itemAnim}
              className="font-display font-extrabold text-white leading-[0.88] tracking-tight mb-8 select-none"
              style={{ fontSize: 'clamp(40px, 8.5vw, 104px)' }}
            >
              ERKAN<br />
              <span className="text-zinc-500">TURGUT</span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div variants={itemAnim} className="flex items-center gap-2 mb-8">
              <div className="w-6 h-px bg-emerald-500/60" />
              <span className="font-body text-lg text-zinc-400 font-medium tracking-wide">
                {role}
                <span className="inline-block w-[2px] h-[18px] bg-emerald-400 ml-[3px] align-middle animate-blink" />
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemAnim}
              className="font-body text-zinc-500 text-base leading-[1.75] max-w-[480px] mb-10"
            >
              {t('hero.description')}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={itemAnim} className="flex flex-wrap gap-3 mb-12">
              <Link to="/projects">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold font-body text-sm transition-colors duration-200"
                >
                  {t('hero.ctaProjects')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3.5 min-h-[48px] rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 font-semibold font-body text-sm transition-all duration-200"
                >
                  {t('hero.ctaContact')}
                </motion.button>
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div variants={itemAnim} className="flex items-center flex-wrap gap-1">
              {SOCIALS.map(({ href, label, Icon, self }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={self ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.05] transition-all duration-150 cursor-pointer"
                >
                  <Icon />
                </motion.a>
              ))}

              <div className="hidden sm:block w-px h-4 bg-white/10 mx-3" />

              <span className="hidden sm:inline font-mono text-xs text-zinc-700 select-all">
                turguterkan55@gmail.com
              </span>
            </motion.div>
          </motion.div>

          {/* ── Right: profile image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full flex justify-center lg:justify-end order-1 lg:order-2 pb-2 lg:pb-0"
          >
            <div className="relative">
              {/* Border frame */}
              <div className="rounded-full p-px" style={{ background: gradientBorder }}>
                {/* Photo container — full circle, image fills via object-cover */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full bg-surface overflow-hidden">
                  <picture>
                    <source srcSet="/img/profile-336.webp 336w, /img/profile.webp 640w" type="image/webp" sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 320px" />
                    <source srcSet="/img/profile-336.png 336w, /img/profile.png 640w" type="image/png" sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 320px" />
                    <img
                      src="/img/profile-336.png"
                      alt="Erkan Turgut — Full Stack Developer"
                      className="w-full h-full object-cover object-top block"
                      loading="eager"
                      fetchpriority="high"
                      width="320"
                      height="320"
                    />
                  </picture>
                </div>
              </div>

              {/* Floating badge — bottom left (desktop only) */}
              <motion.div
                initial={{ opacity: 0, x: 16, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.9, duration: 0.45, ease: 'easeOut' }}
                className="hidden lg:flex absolute -bottom-4 -left-10 items-center gap-3 bg-surface border border-white/[0.07] rounded-2xl px-4 py-3 shadow-xl shadow-black/40"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CodeIcon />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold font-body leading-tight">{t('hero.badgeRole')}</p>
                  <p className="text-zinc-600 text-xs font-body">{t('hero.badgeRoleSub')}</p>
                </div>
              </motion.div>

              {/* Floating badge — top right (desktop only) */}
              <motion.div
                initial={{ opacity: 0, x: -12, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.05, duration: 0.45, ease: 'easeOut' }}
                className="hidden lg:flex absolute -top-4 -right-8 items-center gap-2 bg-surface border border-white/[0.07] rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/40"
              >
                <span className="text-xs text-zinc-500 font-body">{t('hero.badgeAI')}</span>
                <div className="w-px h-3 bg-white/10" />
                <span className="text-xs text-emerald-400 font-medium font-body">{t('hero.badgeAISub')}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-4 sm:left-8 md:left-12 lg:left-16 flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent"
          />
          <span className="font-body text-[11px] text-zinc-700 tracking-[0.18em] uppercase">
            {t('hero.scroll')}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
