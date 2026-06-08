import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogById } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const calculateReadingTime = (content) => {
  if (!content) return 3;
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
};

const BlogDetail = () => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await getBlogById(id);
        if (!error) setBlog(data);
      } catch {}
      finally { setLoading(false); }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-body text-sm">{t('blog.detailLoading')}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface border border-white/[0.07] flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">{t('blog.notFound')}</h2>
          <p className="text-zinc-500 font-body mb-7">{t('blog.notFoundSub')}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold font-body text-sm transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('blog.backToBlog')}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (blog.is_external && blog.external_url) {
    window.location.href = blog.external_url;
    return null;
  }

  const readingTime = calculateReadingTime(blog.content || blog.excerpt);

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={blog.title} description={blog.summary || blog.excerpt} />

      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-emerald-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-3xl mx-auto px-8 sm:px-12 py-12">

        {/* Back nav */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/[0.07] text-zinc-400 hover:text-white hover:border-emerald-500/25 transition-all duration-200 text-sm font-body font-medium"
          >
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('blog.backToBlog')}
          </Link>
        </motion.div>

        {/* Article header */}
        <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium font-body bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/20">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight mb-8">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 pb-8 border-b border-white/[0.07]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold font-mono">
                ET
              </div>
              <div>
                <div className="font-semibold text-white font-body text-sm">{blog.author || 'Erkan Turgut'}</div>
                <div className="text-xs text-zinc-500 font-body">{t('blog.author')}</div>
              </div>
            </div>

            {blog.published_at && (
              <>
                <div className="hidden sm:block w-px h-8 bg-white/[0.07]" />
                <div className="flex items-center gap-2 text-zinc-400">
                  <div className="w-9 h-9 rounded-xl bg-surface border border-white/[0.07] flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm font-body">
                      {new Date(blog.published_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-zinc-500 font-body">{t('blog.publishDate')}</div>
                  </div>
                </div>
              </>
            )}

            <div className="hidden sm:block w-px h-8 bg-white/[0.07]" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-surface border border-white/[0.07] flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-white text-sm font-body">{readingTime} {t('blog.minute')}</div>
                <div className="text-xs text-zinc-500 font-body">{t('blog.readingTime')}</div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Featured image */}
        {blog.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 rounded-2xl overflow-hidden border border-white/[0.07]"
          >
            <img src={blog.image} alt={blog.title} className="w-full h-auto object-cover" />
          </motion.div>
        )}

        {/* Article content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-14"
        >
          <div
            className="prose prose-lg prose-invert max-w-none
              prose-headings:font-display prose-headings:text-white prose-headings:font-bold
              prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:font-body
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-emerald-400 prose-code:bg-white/[0.06] prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-surface prose-pre:border prose-pre:border-white/[0.07] prose-pre:rounded-xl
              prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-500/[0.04] prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-zinc-300
              prose-li:text-zinc-300 prose-li:font-body
              prose-img:rounded-xl prose-img:border prose-img:border-white/[0.07]"
            dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt }}
          />
        </motion.article>

        {/* Share section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="p-6 rounded-2xl bg-surface border border-white/[0.07]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h3 className="text-base font-semibold font-body text-white mb-1">{t('blog.share')}</h3>
                <p className="text-zinc-500 font-body text-sm">{t('blog.shareSub')}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-surface-2 border border-white/[0.07] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-surface-2 border border-white/[0.07] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="w-10 h-10 rounded-xl bg-surface-2 border border-white/[0.07] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all duration-200 cursor-pointer"
                  title={t('blog.copyLink')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Author card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10"
        >
          <div className="p-6 rounded-2xl bg-surface border border-white/[0.07]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-16 h-16 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg font-mono shrink-0">
                ET
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-base font-semibold font-body text-white mb-1">Erkan Turgut</h3>
                <p className="text-zinc-500 font-body text-sm leading-relaxed mb-4">
                  {t('blog.authorBio')}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {[
                    { href: 'https://github.com/Erkan3034', icon: <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /> },
                    { href: 'https://www.linkedin.com/in/erkanturgut1205', icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /> },
                    { href: 'https://x.com/Erkan_0630', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-surface-2 border border-white/[0.07] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all duration-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold font-body text-sm transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('blog.discoverPosts')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;
