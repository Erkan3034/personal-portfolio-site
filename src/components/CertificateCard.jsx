import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CertificateCard = ({ certificate }) => {
  const [expanded, setExpanded] = useState(false);
  const { title, issuer, description, certificate_date, image, certificate_url } = certificate;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => setExpanded(!expanded)}
      className="rounded-xl overflow-hidden bg-surface border border-white/[0.07] hover:border-white/[0.14] transition-all duration-300 group cursor-pointer"
    >
      {/* Image / Placeholder */}
      <div className="relative h-40 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-surface-2 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <span className="text-zinc-600 text-xs font-body">Sertifika</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1.5">
          <h3 className="text-base font-semibold font-body text-white group-hover:text-emerald-400 transition-colors line-clamp-1 flex-1">
            {title}
          </h3>
          {certificate_date && (
            <span className="text-[11px] text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded-full ml-2 whitespace-nowrap font-body">
              {new Date(certificate_date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        <p className="text-sm text-emerald-400 font-medium font-body mb-2">{issuer}</p>
        <p className="text-sm text-zinc-500 font-body mb-4 line-clamp-2 leading-relaxed">{description}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500 font-body">{expanded ? 'Kapat' : 'Detaylar'}</span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/[0.07]">
                <div className="text-sm text-zinc-500 font-body leading-relaxed mb-4">
                  {description?.split('\n').filter(Boolean).map((p, i) => (
                    <p key={i} className="mb-2">{p}</p>
                  ))}
                </div>
                {certificate_url && (
                  <motion.a
                    href={certificate_url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg text-sm font-semibold font-body transition-colors duration-150 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Sertifikayı Gör
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
