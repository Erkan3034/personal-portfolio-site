import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBlogs } from '../lib/supabase';

// Reading time calculator
const calculateReadingTime = (content) => {
  if (!content) return 3;
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Animated background particles
const FloatingParticle = ({ delay, duration, size, left, top }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-xl"
    style={{ width: size, height: size, left: `${left}%`, top: `${top}%` }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Enhanced Blog Card Component
const BlogCard = ({ post, index, isFeatured = false }) => {
  const isExternal = post.is_external && post.external_url;
  const readingTime = calculateReadingTime(post.content || post.excerpt);

  const handleClick = () => {
    if (isExternal) {
      window.open(post.external_url, '_blank', 'noopener,noreferrer');
    }
  };

  const CardContent = () => (
    <>
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      
      {/* Image Section */}
      {post.image && (
        <div className={`relative overflow-hidden ${isFeatured ? 'h-64' : 'h-48'}`}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-md ${
              isExternal 
                ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white' 
                : 'bg-gradient-to-r from-primary/80 to-cyan-500/80 text-white'
            }`}>
              {isExternal ? (
                <>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12z"/>
                  </svg>
                  Medium
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                  </svg>
                  Blog
                </>
              )}
            </span>
          </div>

          {/* Reading Time */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-white/90">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} dk
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className={`p-6 flex flex-col flex-1 ${!post.image ? 'pt-8' : ''}`}>
        {/* No image - show badge inline */}
        {!post.image && (
          <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
              isExternal 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' 
                : 'bg-gradient-to-r from-primary/20 to-cyan-500/20 text-primary border border-primary/30'
            }`}>
              {isExternal ? 'Medium' : 'Blog'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} dk okuma
            </span>
          </div>
        )}

        {/* Date */}
        {post.published_at && (
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(post.published_at).toLocaleDateString('tr-TR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        )}

        {/* Title */}
        <h3 className={`font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-cyan-400 transition-all duration-300 line-clamp-2 ${
          isFeatured ? 'text-2xl' : 'text-xl'
        }`}>
          {post.title}
        </h3>

        {/* Summary */}
        <p className={`text-gray-400 leading-relaxed mb-4 flex-1 ${isFeatured ? 'line-clamp-4' : 'line-clamp-3'}`}>
          {post.summary || post.excerpt || 'Blog yazısı açıklaması...'}
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, isFeatured ? 5 : 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg hover:border-primary/50 hover:text-primary transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              ET
            </div>
            <span className="text-sm text-gray-400">Erkan Turgut</span>
          </div>
          
          <span className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all duration-300">
            {isExternal ? "Oku" : "Devamını Oku"}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );

  const cardClasses = `group relative flex flex-col h-full rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
    isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      {isExternal ? (
        <button onClick={handleClick} className={`${cardClasses} text-left w-full`}>
          <CardContent />
        </button>
      ) : (
        <Link to={`/blog/${post.id}`} className={cardClasses}>
          <CardContent />
        </Link>
      )}
    </motion.div>
  );
};

// Search Input Component
const SearchInput = ({ value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      placeholder="Blog yazılarında ara..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

// Filter Tab Component
const FilterTabs = ({ activeFilter, onFilterChange, counts }) => {
  const filters = [
    { id: 'all', label: 'Tümü', count: counts.all },
    { id: 'internal', label: 'Site İçi', count: counts.internal },
    { id: 'external', label: 'Medium', count: counts.external },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeFilter === filter.id
              ? 'text-white'
              : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
          }`}
        >
          {activeFilter === filter.id && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-gradient-to-r from-primary to-cyan-500 rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            {filter.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === filter.id 
                ? 'bg-white/20' 
                : 'bg-white/5'
            }`}>
              {filter.count}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};

const Blog = () => {
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
        if (error) {
          setError('Bloglar yüklenirken bir hata oluştu.');
          setBlogs([]);
        } else {
          setBlogs(data || []);
        }
      } catch (err) {
        setError('Bloglar yüklenirken bir hata oluştu.');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Filtered and searched blogs
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    // Apply filter
    if (activeFilter === 'internal') {
      result = result.filter(b => !b.is_external);
    } else if (activeFilter === 'external') {
      result = result.filter(b => b.is_external && b.external_url);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title?.toLowerCase().includes(query) ||
        b.summary?.toLowerCase().includes(query) ||
        b.excerpt?.toLowerCase().includes(query) ||
        b.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [blogs, activeFilter, searchQuery]);

  // Counts for filter tabs
  const counts = useMemo(() => ({
    all: blogs.length,
    internal: blogs.filter(b => !b.is_external).length,
    external: blogs.filter(b => b.is_external && b.external_url).length,
  }), [blogs]);

  // Get featured post (latest with image)
  const featuredPost = useMemo(() => {
    if (activeFilter !== 'all' || searchQuery) return null;
    return filteredBlogs.find(b => b.image) || null;
  }, [filteredBlogs, activeFilter, searchQuery]);

  // Regular posts (excluding featured)
  const regularPosts = useMemo(() => {
    if (!featuredPost) return filteredBlogs;
    return filteredBlogs.filter(b => b.id !== featuredPost.id);
  }, [filteredBlogs, featuredPost]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pt-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingParticle delay={0} duration={8} size={300} left={10} top={20} />
        <FloatingParticle delay={2} duration={10} size={200} left={70} top={60} />
        <FloatingParticle delay={4} duration={12} size={250} left={80} top={10} />
        <FloatingParticle delay={1} duration={9} size={180} left={30} top={70} />
        
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Yazılarım & Paylaşımlarım</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="text-white">Blog </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-purple-500">
              Yazıları
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Yazılım geliştirme, teknoloji trendleri ve kişisel deneyimlerim hakkında 
            düşüncelerimi paylaştığım köşem.
          </p>

          {/* Medium Link */}
          <motion.a
            href="https://medium.com/@turguterkan55"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold border border-white/10 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
            Medium Profilimi Ziyaret Et
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10">
            <FilterTabs 
              activeFilter={activeFilter} 
              onFilterChange={setActiveFilter}
              counts={counts}
            />
            <div className="w-full lg:w-80">
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm text-red-400 px-6 py-4 mb-8 flex items-center gap-3"
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-400">Blog yazıları yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* No Results */}
            {filteredBlogs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery 
                    ? `"${searchQuery}" için sonuç bulunamadı.`
                    : 'Henüz blog yazısı eklenmemiş.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    Aramayı Temizle
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
                  transition={{ duration: 0.3 }}
                >
                  {/* Featured Post */}
                  {featuredPost && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mb-8"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-6 bg-gradient-to-b from-primary to-cyan-500 rounded-full" />
                        <h2 className="text-lg font-semibold text-white">Öne Çıkan</h2>
                      </div>
                      <div className="grid grid-cols-1">
                        <BlogCard post={featuredPost} index={0} isFeatured={true} />
                      </div>
                    </motion.div>
                  )}

                  {/* Regular Posts */}
                  {regularPosts.length > 0 && (
                    <div>
                      {featuredPost && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                          <h2 className="text-lg font-semibold text-white">Tüm Yazılar</h2>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post, index) => (
                          <BlogCard key={post.id} post={post} index={index} />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Stats Section */}
            {blogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { label: 'Toplam Yazı', value: blogs.length, icon: '📝' },
                  { label: 'Site İçi', value: counts.internal, icon: '🏠' },
                  { label: 'Medium', value: counts.external, icon: '📰' },
                  { label: 'Toplam Etiket', value: [...new Set(blogs.flatMap(b => b.tags || []))].length, icon: '🏷️' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center"
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
