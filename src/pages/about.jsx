import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
  'Node.js', 'Django', 'Flask', 'PHP', 'SQL', 'MongoDB',
  'PostgreSQL', 'HTML/CSS', 'Tailwind CSS', 'Unity',
  'Git', 'Framer Motion',
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={t('about.seoTitle')} description={t('about.seoDesc')} />

      <div className="max-w-screen-xl mx-auto px-8 sm:px-12 lg:px-16 py-14">

        {/* Header */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="mb-14">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400 text-sm font-medium font-body mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('about.badge')}
            </span>
          </motion.div>
          <motion.h1 variants={item} className="font-display font-extrabold text-white text-4xl sm:text-5xl tracking-tight mb-4">
            {t('about.heading')}
          </motion.h1>
          <motion.p variants={item} className="text-zinc-400 font-body text-lg leading-relaxed max-w-2xl">
            {t('about.subheading')}
          </motion.p>
        </motion.div>

        {/* CV button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <a
            href="/cv.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold font-body text-sm transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {t('about.downloadCV')}
          </a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="lg:col-span-2 bg-surface border border-white/[0.07] rounded-2xl p-7"
          >
            <h2 className="font-display font-bold text-white text-2xl mb-5">{t('about.storyTitle')}</h2>
            <div className="space-y-4 text-zinc-400 font-body text-base leading-[1.8]">
              <p>{t('about.story1')}</p>
              <p>{t('about.story2')}</p>
              <p>{t('about.story3')}</p>
            </div>
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <h3 className="font-body font-semibold text-white text-sm">{t('about.shortTerm')}</h3>
              </div>
              <ul className="space-y-2">
                {(t('about.shortTermGoals') || []).map((g) => (
                  <li key={g} className="flex items-start gap-2 text-zinc-500 text-sm font-body">
                    <span className="text-emerald-500 mt-0.5">·</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="font-body font-semibold text-white text-sm">{t('about.longTerm')}</h3>
              </div>
              <ul className="space-y-2">
                {(t('about.longTermGoals') || []).map((g) => (
                  <li key={g} className="flex items-start gap-2 text-zinc-500 text-sm font-body">
                    <span className="text-emerald-500 mt-0.5">·</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="lg:col-span-3 bg-surface border border-white/[0.07] rounded-2xl p-7"
          >
            <h2 className="font-display font-bold text-white text-2xl mb-6">{t('about.techStack')}</h2>
            <div className="flex flex-wrap gap-2.5">
              {SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.28, delay: 0.04 * i }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-300 text-sm font-medium font-body hover:border-emerald-500/30 hover:text-white hover:bg-emerald-500/[0.06] transition-all duration-150 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
