import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CertificateCard from '../components/CertificateCard';
import { getCertificates } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const sampleCertificates = [
  {
    id: 1,
    title: 'React Developer Certification',
    issuer: 'Meta',
    description: 'React ve modern web geliştirme konularında kapsamlı eğitim.',
    certificate_date: '2024-01-15',
    certificate_url: 'https://example.com',
    image: null,
  },
  {
    id: 2,
    title: 'JavaScript Algorithms',
    issuer: 'freeCodeCamp',
    description: 'JavaScript algoritma ve veri yapıları konusunda 300+ saatlik eğitim.',
    certificate_date: '2023-12-10',
    certificate_url: 'https://example.com',
    image: null,
  },
];

const Certificates = () => {
  const { t } = useLanguage();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await getCertificates();
        setCerts(error || !data ? sampleCertificates : data);
      } catch {
        setCerts(sampleCertificates);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const uniqueIssuers = new Set(certs.map((c) => c.issuer)).size;
  const recentCount = certs.filter(
    (c) => new Date(c.certificate_date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-body text-sm">{t('certificates.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={t('certificates.seoTitle')} description={t('certificates.seoDesc')} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400 text-sm font-medium font-body mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t('certificates.badge')}
          </span>
          <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl tracking-tight mb-3">
            {t('certificates.heading')}
          </h1>
          <p className="text-zinc-400 font-body text-lg max-w-xl">
            {t('certificates.subheading')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: t('certificates.total'), value: certs.length, icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg> },
            { label: t('certificates.issuers'), value: uniqueIssuers, icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg> },
            { label: t('certificates.lastYear'), value: recentCount, icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
            { label: t('certificates.learning'), value: '∞', icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <CertificateCard certificate={cert} />
            </motion.div>
          ))}
        </div>

        {certs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-surface border border-white/[0.07] flex items-center justify-center">
              <svg className="w-7 h-7 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold font-body mb-2">{t('certificates.empty')}</h3>
            <p className="text-zinc-500 font-body text-sm">{t('certificates.emptySub')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
