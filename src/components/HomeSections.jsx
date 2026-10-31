import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogs, getProjects } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import { projectPath, blogPath } from '../lib/slug';
import useExperiences from '../hooks/useExperiences';
import { loc, formatPeriod, isCurrent } from '../lib/experience';

// Prerender sırasında çekilen veri sayfaya JSON olarak gömülür; istemci ilk render'da onu
// okuyarak bölümleri boş göstermeden açar, ardından Supabase'ten güncel veriyle yeniler.
const SNAPSHOT_ID = 'home-data';
const EMPTY = { projects: [], posts: [] };

const readEmbedded = () => {
  try {
    const el = document.getElementById(SNAPSHOT_ID);
    return el ? JSON.parse(el.textContent) : null;
  } catch {
    return null;
  }
};

const embedForPrerender = (data) => {
  if (navigator.userAgent !== 'ReactSnap') return;
  let el = document.getElementById(SNAPSHOT_ID);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/json';
    el.id = SNAPSHOT_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
};

const firstParagraph = (text, max) => {
  const p = (text || '').split('\n').find((s) => s.trim()) || '';
  return p.length > max ? `${p.slice(0, max - 1).trimEnd()}…` : p;
};

const readingMinutes = (html) => Math.max(1, Math.ceil(String(html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));

const toHomeData = (projects, blogs) => ({
  projects: (projects || [])
    .filter((p) => p.featured)
    .sort((a, b) => String(b.project_date || '').localeCompare(String(a.project_date || '')))
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: firstParagraph(p.description, 170),
      image: p.image,
      technologies: (Array.isArray(p.technologies) ? p.technologies : []).slice(0, 4),
    })),
  posts: (blogs || [])
    .filter((b) => !(b.is_external && b.external_url))
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      summary: firstParagraph(b.summary, 140),
      image: b.image,
      published_at: b.published_at,
      minutes: b.kaggle_notebook_id ? null : readingMinutes(b.content),
      kaggle: !!b.kaggle_notebook_id,
    })),
});

const Arrow = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const SectionHeader = ({ id, index, title, sub, to, linkLabel }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
    <div>
      <span className="font-mono text-xs text-emerald-500/80 tracking-widest">{index} /</span>
      <h2 id={id} className="font-display font-extrabold text-white text-3xl sm:text-4xl tracking-tight mt-2">{title}</h2>
      {sub && <p className="text-zinc-500 font-body mt-2">{sub}</p>}
    </div>
    <Link to={to} className="group inline-flex items-center gap-2 text-sm font-body font-medium text-zinc-300 hover:text-emerald-400 transition-colors shrink-0">
      {linkLabel}
      <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

const FeaturedProject = ({ project, large, index }) => (
  <motion.div
    {...reveal}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    className={large ? 'md:col-span-2' : ''}
  >
    {/* Masaüstünde yatay kart: görsel solda, metin sağda. Görsel genişliği sınırlı tutulur. */}
    <Link
      to={projectPath(project)}
      className="group relative flex flex-col md:flex-row h-full rounded-2xl overflow-hidden bg-surface border border-white/[0.07] hover:border-emerald-500/30 transition-colors duration-300"
    >
      {/* Kapak görselleri 16:9 hazırlanıyor; oranı sabit tutmak kırpılmayı önler. */}
      <div className={`relative overflow-hidden aspect-[16/9] bg-surface-2 shrink-0 md:self-center ${large ? 'md:w-[44%] md:m-4 md:rounded-xl' : 'md:w-[42%] md:m-3 md:rounded-lg'}`}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-2" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-surface/70 to-transparent" />
      </div>
      <div className={`relative flex flex-col flex-1 min-w-0 ${large ? 'p-6 sm:p-7 md:pl-3 md:justify-center' : 'p-5 md:pl-1'}`}>
        <h3 className={`font-display font-bold text-white group-hover:text-emerald-300 transition-colors ${large ? 'text-2xl' : 'text-lg'} leading-snug`}>
          {project.title}
        </h3>
        <p className={`text-zinc-400 font-body mt-2 leading-relaxed ${large ? 'text-[15px] line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
          {project.technologies.map((tech) => (
            <span key={tech} className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/[0.07] border border-emerald-500/15 text-emerald-400/90">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  </motion.div>
);

const HomeSections = () => {
  const { t, lang } = useLanguage();
  const [data, setData] = useState(() => readEmbedded() || EMPTY);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getProjects(), getBlogs()]).then(([p, b]) => {
      if (cancelled || (p.error && b.error)) return;
      const next = toHomeData(p.data, b.data);
      setData(next);
      embedForPrerender(next);
    });
    return () => { cancelled = true; };
  }, []);

  const experiences = useExperiences();
  const work = (experiences || []).filter((e) => e.category === 'work').slice(0, 3);
  const dateFmt = (d) => new Date(d).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="relative bg-canvas">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-24 space-y-28">

        {/* 01 — Öne çıkan projeler */}
        {data.projects.length > 0 && (
          <section aria-labelledby="home-featured">
            <SectionHeader id="home-featured" index="01" title={t('home.featuredTitle')} sub={t('home.featuredSub')} to="/projects" linkLabel={t('home.allProjects')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.projects.map((project, i) => (
                <FeaturedProject key={project.id} project={project} large={i === 0} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* 02 — Deneyim özeti */}
        {work.length > 0 && (
        <section aria-labelledby="home-experience">
          <SectionHeader id="home-experience" index="02" title={t('home.experienceTitle')} to="/experience" linkLabel={t('home.allExperience')} />
          <ol className="border-t border-white/[0.07]">
            {work.map((entry, i) => (
              <motion.li key={entry.id} {...reveal} transition={{ duration: 0.45, delay: i * 0.07 }} className="border-b border-white/[0.07]">
                <Link to="/experience" className="group grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] items-baseline gap-x-6 gap-y-1 py-6">
                  <span className="font-mono text-xs text-zinc-500">{formatPeriod(entry, lang)}</span>
                  <span>
                    <span className="font-display font-bold text-white text-xl group-hover:text-emerald-300 transition-colors">{loc(entry, 'role', lang)}</span>
                    <span className="text-zinc-500 font-body"> — {loc(entry, 'org', lang)}</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-2">
                    {isCurrent(entry) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400/60" />}
                    <Arrow className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ol>
        </section>
        )}

        {/* 03 — Son yazılar */}
        {data.posts.length > 0 && (
          <section aria-labelledby="home-posts">
            <SectionHeader id="home-posts" index="03" title={t('home.latestTitle')} sub={t('home.latestSub')} to="/blog" linkLabel={t('home.allPosts')} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.posts.map((post, i) => (
                <motion.div key={post.id} {...reveal} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <Link to={blogPath(post)} className="group flex flex-col h-full rounded-2xl overflow-hidden bg-surface border border-white/[0.07] hover:border-emerald-500/30 transition-colors duration-300">
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                      {post.image && (
                        <img src={post.image} alt={post.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                        {post.published_at && <time dateTime={post.published_at}>{dateFmt(post.published_at)}</time>}
                        {post.minutes && <><span className="text-zinc-700">·</span><span>{post.minutes} {t('home.minRead')}</span></>}
                        {post.kaggle && <><span className="text-zinc-700">·</span><span>Kaggle</span></>}
                      </div>
                      <h3 className="font-display font-bold text-white text-lg leading-snug mt-2 group-hover:text-emerald-300 transition-colors">{post.title}</h3>
                      {post.summary && <p className="text-sm text-zinc-500 font-body mt-2 line-clamp-2 leading-relaxed">{post.summary}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomeSections;
