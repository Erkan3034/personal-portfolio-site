import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificateCard = ({ certificate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    title,
    issuer,
    description,
    certificate_date,
    image,
    certificate_url
  } = certificate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Certificate Image */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 font-medium">Sertifika</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-6">
        {/* Title and Date */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          {certificate_date && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {new Date(certificate_date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'short'
              })}
            </span>
          )}
        </div>

        {/* Issuer */}
        <p className="text-primary font-medium mb-3">
          {issuer}
        </p>

        {/* Description Preview */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Expand/Collapse Button */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-primary font-medium hover:text-primary/80 transition-colors duration-200"
          >
            {isExpanded ? 'Daha az göster' : 'Detayları gör'}
          </motion.button>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="text-gray-600 mb-4">
                  {description}
                </p>
                
                {certificate_url && (
                  <motion.a
                    href={certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Sertifikayı Görüntüle
                  </motion.a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CertificateCard; 