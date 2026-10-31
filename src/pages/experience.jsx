import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead, { SITE_URL } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';
import useExperiences from '../hooks/useExperiences';
import { groupExperiences, loc, locList, formatPeriod, isCurrent } from '../lib/experience';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const OrgName = ({ entry, lang }) => {
  const name = loc(entry, 'org', lang);
  if (!entry.org_url) return <span>{name}</span>;
  return (
    <a href={entry.org_url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors">
      {name}
    </a>
  );
};

// Zaman çizelgesindeki tek kayıt: solda tarih (mono), ortada dal çizgisi ve düğüm, sağda kart.
const TimelineEntry = ({ entry, lang, t, index }) => {
  const highlights = locList(entry, 'highlights', lang);
  const current = isCurrent(entry);
  const period = formatPeriod(entry, lang);
  const location = loc(entry, 'location', lang);
  const summary = loc(entry, 'summary', lang);
  // Site içi linkler router ile, dış linkler yeni sekmede açılır.
  const linkLabel = loc(entry, 'link_label', lang);
  const isInternal = entry.link_url?.startsWith('/');
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative grid grid-cols-[20px_1fr] md:grid-cols-[150px_28px_1fr] gap-x-4 md:gap-x-5 pb-10 last:pb-0"
    >
      {/* Tarih — masaüstünde solda */}
      <div className="hidden md:block pt-5 text-right">
        <span className="font-mono text-xs text-zinc-500 leading-5 whitespace-nowrap">{period}</span>
      </div>

      {/* Dal düğümü */}
      <div className="relative flex justify-center">
        <span
          className={`relative z-10 mt-6 w-3.5 h-3.5 rounded-full border-2 ${
            current ? 'border-emerald-400 bg-emerald-400/30' : 'border-zinc-600 bg-canvas'
          }`}
        >
          {current && <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />}
        </span>
      </div>

      {/* Kart */}
      <article className="group bg-surface border border-white/[0.07] hover:border-emerald-500/25 rounded-2xl p-5 sm:p-6 transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
          <span className="md:hidden font-mono text-[11px] text-zinc-500">{period}</span>
          {current && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-md px-1.5 py-0.5">
              <span className="text-emerald-500">HEAD</span>· {t('experience.current')}
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-white text-xl leading-snug">{loc(entry, 'role', lang)}</h3>
        <p className="text-emerald-400/90 font-body text-sm font-medium mt-1">
          <OrgName entry={entry} lang={lang} />
          {location && <span className="text-zinc-500 font-normal"> · {location}</span>}
        </p>

        {summary && (
          <p className="text-zinc-400 font-body text-[15px] leading-7 mt-4 whitespace-pre-line">{summary}</p>
        )}

        {highlights.length > 0 && (
          <ul className="mt-4 rounded-xl bg-canvas/60 border border-white/[0.05] px-4 py-3 space-y-1.5">
            {highlights.map((h) => (
              <li key={h} className="grid grid-cols-[14px_1fr] gap-2 text-sm font-body text-zinc-300 leading-6">
                <span className="font-mono text-emerald-500 select-none" aria-hidden="true">+</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {(entry.tags?.length > 0 || entry.link_url) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {entry.tags?.map((tag) => (
              <span key={tag} className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                {tag}
              </span>
            ))}
            {entry.link_url && (() => {
              const cls = 'ml-auto inline-flex items-center gap-1 text-sm font-body font-medium text-emerald-400 hover:text-emerald-300 transition-colors';
              const content = (
                <>
                  {linkLabel || entry.link_url}
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              );
              return isInternal
                ? <Link to={entry.link_url} className={cls}>{content}</Link>
                : <a href={entry.link_url} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>;
            })()}
          </div>
        )}
      </article>
    </motion.li>
  );
};

const Experience = () => {
  const { t, lang } = useLanguage();
  const rows = useExperiences();
  const groups = rows ? groupExperiences(rows) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${SITE_URL}/experience/`,
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Erkan Turgut',
      alumniOf: (rows || [])
        .filter((r) => r.category === 'education')
        .map((r) => ({ '@type': 'EducationalOrganization', name: r.org_tr })),
    },
  };

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={t('experience.seoTitle')} description={t('experience.seoDesc')} jsonLd={jsonLd} />

      <div className="max-w-screen-lg mx-auto px-4 sm:px-8 md:px-12 py-14">
        {/* Başlık */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-14">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400 text-sm font-medium font-body mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('experience.badge')}
            </span>
          </motion.div>
          <motion.h1 variants={item} className="font-display font-extrabold text-white text-4xl sm:text-5xl tracking-tight mb-4 max-w-3xl">
            {t('experience.heading')}
          </motion.h1>
          <motion.p variants={item} className="text-zinc-400 font-body text-lg leading-relaxed max-w-2xl">
            {t('experience.subheading')}
          </motion.p>
          <motion.div variants={item} className="mt-7">
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold font-body text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {t('experience.downloadCV')}
            </a>
          </motion.div>
        </motion.div>

        {/* Gruplar */}
        {!rows && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}
        <div className="space-y-16">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`exp-${group.id}`}>
              <div className="flex items-baseline gap-3 mb-8 md:pl-[170px]">
                <h2 id={`exp-${group.id}`} className="font-display font-bold text-white text-2xl">
                  <span className="font-mono text-emerald-500/70 text-base mr-2 select-none" aria-hidden="true">{'//'}</span>
                  {group.label[lang] || group.label.tr}
                </h2>
                <span className="font-mono text-xs text-zinc-600">
                  {group.items.length} {t('experience.entries')}
                </span>
              </div>

              <ol className="relative">
                {/* Dal çizgisi */}
                <span
                  aria-hidden="true"
                  className="absolute top-2 bottom-2 left-[9.5px] md:left-[183.5px] w-px bg-gradient-to-b from-emerald-500/50 via-white/10 to-transparent"
                />
                {group.items.map((entry, i) => (
                  <TimelineEntry key={entry.id} entry={entry} lang={lang} t={t} index={i} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
