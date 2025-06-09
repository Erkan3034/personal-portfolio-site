import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CertificateCard from '../components/CertificateCard';
import { getCertificates } from '../lib/supabase';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data, error } = await getCertificates();
        if (error) {
          console.error('Error fetching certificates:', error);
          // Fallback to sample data
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

  // Sample certificates for fallback
  const sampleCertificates = [
    {
      id: 1,
      title: 'React Developer Certification',
      issuer: 'Meta',
      description: 'React ve modern web geliştirme konularında kapsamlı eğitim ve sertifikasyon. Component lifecycle, hooks, state management ve best practices konularını içerir.',
      certificate_date: '2024-01-15',
      certificate_url: 'https://example.com',
      image: null
    },
    {
      id: 2,
      title: 'JavaScript Algorithms and Data Structures',
      issuer: 'freeCodeCamp',
      description: 'JavaScript algoritma ve veri yapıları konusunda 300+ saatlik eğitim. Temel programlama kavramlarından ileri seviye algoritmalara kadar kapsamlı içerik.',
      certificate_date: '2023-12-10',
      certificate_url: 'https://example.com',
      image: null
    },
    {
      id: 3,
      title: 'Node.js Developer Certification',
      issuer: 'OpenJS Foundation',
      description: 'Node.js backend geliştirme, API tasarımı, veritabanı entegrasyonu ve deployment konularında uzmanlaşma sertifikası.',
      certificate_date: '2023-11-20',
      certificate_url: 'https://example.com',
      image: null
    },
    {
      id: 4,
      title: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      description: 'AWS bulut hizmetleri temel seviye sertifikası. Cloud computing kavramları, AWS hizmetleri ve güvenlik konularını kapsar.',
      certificate_date: '2023-10-05',
      certificate_url: 'https://example.com',
      image: null
    },
    {
      id: 5,
      title: 'MongoDB Database Administrator',
      issuer: 'MongoDB University',
      description: 'MongoDB NoSQL veritabanı yönetimi, performans optimizasyonu ve güvenlik konularında uzmanlaşma sertifikası.',
      certificate_date: '2023-09-15',
      certificate_url: 'https://example.com',
      image: null
    },
    {
      id: 6,
      title: 'UI/UX Design Fundamentals',
      issuer: 'Google',
      description: 'Kullanıcı arayüzü ve deneyimi tasarımı temelleri. Wireframing, prototyping ve kullanıcı testleri konularını içerir.',
      certificate_date: '2023-08-20',
      certificate_url: 'https://example.com',
      image: null
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Sertifikalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sertifikalarım
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sürekli öğrenme ve gelişim yolculuğumda kazandığım sertifikalar. 
            Her sertifika, yeni bir beceri ve uzmanlık alanını temsil ediyor.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {certificates.length}
                </div>
                <div className="text-gray-600">Toplam Sertifika</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {new Set(certificates.map(c => c.issuer)).size}
                </div>
                <div className="text-gray-600">Farklı Kurum</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {certificates.filter(c => new Date(c.certificate_date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-gray-600">Son 1 Yıl</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {certificates.length > 0 ? Math.round(certificates.reduce((acc, cert) => acc + new Date(cert.certificate_date).getFullYear(), 0) / certificates.length) : 0}
                </div>
                <div className="text-gray-600">Ortalama Yıl</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz sertifika bulunmuyor
            </h3>
            <p className="text-gray-600">
              Yakında yeni sertifikalar eklenecek.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Sürekli Öğrenme</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Teknoloji dünyası sürekli değişiyor ve ben de bu değişime ayak uydurmak için 
              sürekli öğrenmeye devam ediyorum. Yeni sertifikalar ve beceriler kazanmaya 
              odaklanıyorum.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Daha Fazla Öğren
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificates; 