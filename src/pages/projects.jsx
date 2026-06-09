import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const sampleProjects = [
  {
    id: 1,
    title: 'E-Ticaret Platformu',
    description: 'Modern React ve Node.js ile geliştirilmiş tam özellikli e-ticaret platformu.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    project_date: '2024-01-15',
    featured: true,
    image: null,
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Takım çalışması için geliştirilmiş görev yönetim uygulaması.',
    technologies: ['React', 'Firebase', 'Tailwind CSS'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    project_date: '2023-12-20',
    featured: false,
    image: null,
  },
];

const STAT_ICONS = {
  projects: (
    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  tech: (
    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  featured: (
    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await getProjects();
        setProjects(error || !data ? sampleProjects : data);
      } catch {
        setProjects(sampleProjects);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const allTechs = [...new Set(projects.flatMap((p) => p.technologies || []))];
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.technologies?.includes(filter));
  const techCount = (tech) => projects.filter((p) => p.technologies?.includes(tech)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-body text-sm">{t('projects.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={t('projects.seoTitle')} description={t('projects.seoDesc')} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400 text-sm font-medium font-body mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t('projects.badge')}
          </span>
          <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl tracking-tight mb-3">
            {t('projects.heading')}
          </h1>
          <p className="text-zinc-400 font-body text-lg max-w-xl">
            {t('projects.subheading')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 mb-10"
        >
          {[
            { label: t('projects.totalProjects'), value: projects.length, icon: STAT_ICONS.projects },
            { label: t('projects.technologies'), value: allTechs.length, icon: STAT_ICONS.tech },
            { label: t('projects.featured'), value: projects.filter((p) => p.featured).length, icon: STAT_ICONS.featured },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-white/[0.07] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-display font-bold text-white">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-zinc-500 font-body leading-tight">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mb-10"
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none rounded-l-2xl" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none rounded-r-2xl" />

          {/* Scroll container */}
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="inline-flex items-center gap-1 p-1.5 bg-surface border border-white/[0.07] rounded-2xl min-w-max">
              {['all', ...allTechs].map((tech) => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium font-body transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    filter === tech
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {tech === 'all' ? t('projects.all') : tech}
                  {tech !== 'all' && (
                    <span className={`text-[10px] font-mono px-1 py-0.5 rounded-md leading-none ${
                      filter === tech ? 'bg-black/20 text-black/70' : 'bg-white/[0.07] text-zinc-600'
                    }`}>
                      {techCount(tech)}
                    </span>
                  )}
                  {tech === 'all' && (
                    <span className={`text-[10px] font-mono px-1 py-0.5 rounded-md leading-none ${
                      filter === 'all' ? 'bg-black/20 text-black/70' : 'bg-white/[0.07] text-zinc-600'
                    }`}>
                      {projects.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="cursor-pointer"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-surface border border-white/[0.07] flex items-center justify-center">
              <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold font-body mb-2">{t('projects.noResults')}</h3>
            <p className="text-zinc-500 font-body text-sm">{t('projects.noResultsHint')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
