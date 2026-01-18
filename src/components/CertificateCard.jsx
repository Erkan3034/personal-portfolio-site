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
      whileHover={{ y: -5 }}
      className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Certificate Image */}
      <div className="relative h-40 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-cyan-500/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">Sertifika</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Certificate Content */}
      <div className="p-4">
        {/* Title and Date */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors duration-200 line-clamp-1 flex-1">
            {title}
          </h3>
          {certificate_date && (
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
              {new Date(certificate_date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'short'
              })}
            </span>
          )}
        </div>

        {/* Issuer */}
        <p className="text-sm text-primary font-medium mb-2">
          {issuer}
        </p>

        {/* Description Preview */}
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Expand/Collapse Button */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-primary font-medium">
            {isExpanded ? 'Daha az göster' : 'Detayları gör'}
          </span>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="text-sm text-gray-400 mb-4 space-y-2">
                  {description?.split('\n').map((paragraph, index) => {
                    if (!paragraph.trim()) return null;
                    return (
                      <p key={index} className="text-gray-400">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
                
                {certificate_url && (
                  <motion.a
                    href={certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center bg-gradient-to-r from-primary to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
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
