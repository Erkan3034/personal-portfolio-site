import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CertificateCard from '../components/CertificateCard';
import { getCertificates } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data, error } = await getCertificates();
        if (error) {
          console.error('Error fetching certificates:', error);
          setCertificates(sampleCertificates);
        } else {
          setCertificates(data || sampleCertificates);
        }
      } catch (error) {
        console.error('Error:', error);
        setCertificates(sampleCertificates);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const sampleCertificates = [
    {
      id: 1,
      title: 'React Developer Certification',
      issuer: 'Meta',
      description: 'React ve modern web geliştirme konularında kapsamlı eğitim.',
      certificate_date: '2024-01-15',
      certificate_url: 'https://example.com',
      image: null
    },
    {
      id: 2,
      title: 'JavaScript Algorithms',
      issuer: 'freeCodeCamp',
      description: 'JavaScript algoritma ve veri yapıları konusunda 300+ saatlik eğitim.',
      certificate_date: '2023-12-10',
      certificate_url: 'https://example.com',
      image: null
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto" />
          </div>
          <p className="text-gray-400">Sertifikalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pt-24">
      <SEOHead
        title="Sertifikalarım"
        description="Erkan Turgut'un kazandığı yazılım ve teknoloji sertifikaları, eğitimleri ve başarıları."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Başarılarım</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span className="text-white">Sertifika</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-purple-500">larım</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Sürekli öğrenme ve gelişim yolculuğumda kazandığım sertifikalar.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Toplam Sertifika', value: certificates.length, icon: '🏆' },
            { label: 'Farklı Kurum', value: new Set(certificates.map(c => c.issuer)).size, icon: '🏢' },
            { label: 'Son 1 Yıl', value: certificates.filter(c => new Date(c.certificate_date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)).length, icon: '📅' },
            { label: 'Aktif Öğrenme', value: '∞', icon: '📚' },
          ].map((stat) => (
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

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <CertificateCard certificate={certificate} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Geliştirme aşamasında
            </h3>
            <p className="text-gray-400">
              Yakında yeni sertifikalar eklenecek.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
