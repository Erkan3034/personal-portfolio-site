import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBlogs } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const calculateReadingTime = (content) => {
  if (!content) return 3;
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
};

const slugify = (text) => {
  if (!text) return '';
  const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
  return text.toString().toLowerCase()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => trMap[m])
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const BlogCard = ({ post, index }) => {
  const { lang, t } = useLanguage();
  const isKaggle = !!post.kaggle_notebook_id;
  const isExternal = post.is_external && post.external_url && !isKaggle;
  const readingTime = isKaggle ? null : calculateReadingTime(post.content || post.excerpt);

  const contentType = isKaggle ? 'kaggle' : isExternal ? 'medium' : 'blog';

  const CardContent = () => (
    <>
      {post.image && (
        <div className="relative overflow-hidden h-36">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase text-white backdrop-blur-md ${
              contentType === 'kaggle' ? 'bg-blue-500/70' : 'bg-emerald-500/70'
            }`}>
              {contentType === 'kaggle' ? 'Kaggle' : contentType === 'medium' ? 'Medium' : 'Blog'}
            </span>
          </div>
          {readingTime && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-black/50 backdrop-blur-md text-white/90">
                {readingTime} {t('blog.minRead')}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`p-4 flex flex-col flex-1 ${!post.image ? 'pt-5' : ''}`}>
        {!post.image && (
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border ${
              contentType === 'kaggle' ? 'bg-blue-500/[0.08] text-blue-400 border-blue-500/20' : 'bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20'
            }`}>
              {contentType === 'kaggle' ? 'Kaggle' : contentType === 'medium' ? 'Medium' : 'Blog'}
            </span>
            {readingTime && <span className="text-[10px] text-zinc-500">{readingTime} {t('blog.minRead')}</span>}
          </div>
        )}

        {post.published_at && (
          <div className="text-zinc-500 text-xs mb-2">
            {new Date(post.published_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        )}

        <h3 className="font-semibold font-body text-white text-sm mb-2 group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-zinc-500 text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
          {post.summary || post.excerpt || '...'}
        </p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] font-medium text-zinc-500 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded font-body">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.07] mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-[9px] font-bold font-mono">
              ET
            </div>
            <span className="text-xs text-zinc-500 font-body">Erkan</span>
          </div>
          <span className="flex items-center gap-1 text-emerald-400 font-medium text-xs">
            {t('blog.read')}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );

  const cardCls = "group relative flex flex-col h-full rounded-xl bg-surface border border-white/[0.07] overflow-hidden transition-all duration-200 hover:border-emerald-500/25 hover:bg-emerald-500/[0.02]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      {isExternal ? (
        <button onClick={() => window.open(post.external_url, '_blank', 'noopener,noreferrer')} className={`${cardCls} text-left w-full cursor-pointer`}>
          <CardContent />
        </button>
      ) : (
        <Link to={`/blog/${slugify(post.title)}`} className={`${cardCls} cursor-pointer`}>
          <CardContent />
        </Link>
      )}
    </motion.div>
  );
};

const Blog = () => {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await getBlogs();
        if (error) { setError(t('blog.errorLoading')); setBlogs([]); }
        else setBlogs(data || []);
      } catch { setError(t('blog.errorLoading')); setBlogs([]); }
      finally { setLoading(false); }
    };
    fetchBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => ({
    all: blogs.length,
    internal: blogs.filter((b) => !b.is_external && !b.kaggle_notebook_id).length,
    external: blogs.filter((b) => b.is_external && b.external_url).length,
    kaggle: blogs.filter((b) => b.kaggle_notebook_id).length,
  }), [blogs]);

  const filteredBlogs = useMemo(() => {
    let result = [...blogs];
    if (activeFilter === 'internal') result = result.filter((b) => !b.is_external && !b.kaggle_notebook_id);
    else if (activeFilter === 'external') result = result.filter((b) => b.is_external && b.external_url);
    else if (activeFilter === 'kaggle') result = result.filter((b) => b.kaggle_notebook_id);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) =>
        b.title?.toLowerCase().includes(q) ||
        b.summary?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.tags?.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [blogs, activeFilter, searchQuery]);

  const uniqueTags = useMemo(() => [...new Set(blogs.flatMap((b) => b.tags || []))].length, [blogs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-body text-sm">{t('blog.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={t('blog.seoTitle')} description={t('blog.seoDesc')} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400 text-sm font-medium font-body mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t('blog.badge')}
          </span>
          <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl tracking-tight mb-3">
            {t('blog.heading')}
          </h1>
          <p className="text-zinc-400 font-body text-lg max-w-xl mb-6">
            {t('blog.subheading')}
          </p>
          <motion.a
            href="https://medium.com/@turguterkan55"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-white/[0.07] text-white text-sm font-semibold font-body hover:border-white/[0.15] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
            </svg>
            {t('blog.visitMedium')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-5 rounded-2xl bg-surface border border-white/[0.07] mb-10"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: t('blog.all'), count: counts.all },
              { id: 'internal', label: t('blog.internal'), count: counts.internal },
              { id: 'external', label: 'Medium', count: counts.external },
              { id: 'kaggle', label: 'Kaggle', count: counts.kaggle },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeFilter === f.id
                    ? 'bg-emerald-500 text-black'
                    : 'bg-surface-2 border border-white/[0.07] text-zinc-400 hover:text-white hover:border-white/[0.15]'
                }`}
              >
                {f.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeFilter === f.id ? 'bg-black/20' : 'bg-white/[0.06]'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-2 border border-white/[0.08] text-white placeholder-zinc-600 font-body text-sm focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all duration-200 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/25 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-400 font-body text-sm">{error}</p>
          </div>
        )}

        {/* No results */}
        {filteredBlogs.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-surface border border-white/[0.07] flex items-center justify-center">
              <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold font-body mb-2">
              {searchQuery ? t('blog.noResults') : t('blog.noBlogs')}
            </h3>
            <p className="text-zinc-500 font-body text-sm mb-5">
              {searchQuery
                ? `${t('blog.noMatchPrefix')} "${searchQuery}" ${t('blog.noMatchSuffix')}`
                : t('blog.comingSoon')}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-body text-sm hover:bg-emerald-500/20 transition-colors cursor-pointer">
                {t('blog.clearSearch')}
              </button>
            )}
          </motion.div>
        )}

        {/* Blog Grid */}
        {filteredBlogs.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBlogs.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Stats */}
        {blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { label: t('blog.totalPosts'), value: blogs.length, icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg> },
              { label: t('blog.internal'), value: counts.internal, icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
              { label: 'Medium', value: counts.external, icon: <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" /></svg> },
              { label: 'Kaggle', value: counts.kaggle, icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4v2m8-2v2m-4 2v8m0 0l-3-3m3 3l3-3"/></svg> },
              { label: t('blog.totalTags'), value: uniqueTags, icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg> },
            ].map((s) => (
              <div key={s.label} className="bg-surface border border-white/[0.07] rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">{s.icon}</div>
                <div>
                  <div className="text-xl font-display font-bold text-white">{s.value}</div>
                  <div className="text-xs text-zinc-500 font-body">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;
