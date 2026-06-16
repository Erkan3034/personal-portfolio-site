import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError(t('projects.projectsLabel'));
      else setProject(data);
      setLoading(false);
    };
    fetchProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Lightbox: Esc ile kapat + arka plan scroll kilidi
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface border border-white/[0.07] flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-body mb-6">{error || t('projects.noResults')}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-semibold font-body text-sm transition-colors duration-150 cursor-pointer"
          >
            {t('projects.goBack')}
          </button>
        </motion.div>
      </div>
    );
  }

  const techList = Array.isArray(project.technologies) ? project.technologies : [];

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={project.title} description={project.description} />

      <div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-12 py-12">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-body text-zinc-500 mb-10"
        >
          <Link to="/projects" className="hover:text-emerald-400 transition-colors duration-150">
            {t('projects.projectsLabel')}
          </Link>
          <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white truncate">{project.title}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-surface border border-white/[0.07] overflow-hidden"
        >
          {/* Project image */}
          {project.image && (
            <button
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={t('projects.viewImage')}
              className="relative overflow-hidden block w-full group/img cursor-zoom-in"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full max-h-80 object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent" />
              {/* Hover ipucu */}
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 text-white text-xs font-body opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803zM10.5 7.5v6m3-3h-6" />
                </svg>
                {t('projects.viewImage')}
              </span>
            </button>
          )}

          <div className="p-4 sm:p-8">
            {/* Featured badge */}
            {project.featured && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium font-body mb-5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {t('projects.featuredBadge')}
              </span>
            )}

            {/* Title */}
            <h1 className="font-display font-extrabold text-white text-2xl sm:text-3xl md:text-4xl tracking-tight mb-3">
              {project.title}
            </h1>

            {/* Date */}
            {project.project_date && (
              <p className="text-zinc-500 font-body text-sm mb-6">
                {new Date(project.project_date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}

            {/* Description */}
            {project.description?.trim() && (
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-white font-semibold font-body text-sm mb-4">
                  <span className="w-1 h-4 rounded-full bg-emerald-500" />
                  {t('projects.about')}
                </h3>
                <div className="space-y-4 border-l border-white/[0.07] pl-4 sm:pl-5">
                  {project.description.split('\n').filter((p) => p.trim()).map((paragraph, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? 'text-zinc-200 font-body text-base sm:text-lg leading-relaxed'
                          : 'text-zinc-400 font-body text-base leading-relaxed'
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {techList.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-semibold font-body text-sm mb-3">{t('projects.usedTech')}</h3>
                <div className="flex flex-wrap gap-2">
                  {techList.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/[0.07] text-emerald-400 border border-emerald-500/20 text-sm font-body">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-2 border border-white/[0.07] text-white hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-200 text-sm font-semibold font-body"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}

              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold font-body text-sm transition-colors duration-150"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t('projects.liveDemo')}
                </a>
              )}

              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-2 border border-white/[0.07] text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all duration-200 text-sm font-semibold font-body cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('projects.goBack')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && project.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label={t('projects.closePreview')}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={project.image}
              alt={project.title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
