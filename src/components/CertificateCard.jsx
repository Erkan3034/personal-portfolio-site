import React from 'react';
import { motion } from 'framer-motion';

const CertificateCard = ({ certificate, onDetail, onImagePreview }) => {
  const { title, issuer, description, certificate_date, image, certificate_url } = certificate;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onDetail?.(certificate)}
      className="rounded-xl overflow-hidden bg-surface border border-white/[0.07] hover:border-white/[0.14] transition-all duration-300 group cursor-pointer"
    >
      {/* Image / Placeholder */}
      <div className="relative h-49 overflow-hidden">
        {image ? (
          <img
            src={image} alt={title}
            className="w-full h-full object-cover bg-surface-2 transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onClick={(e) => { e.stopPropagation(); onImagePreview?.(image); }}
          />
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
        {image && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[11px] bg-black/60 text-white px-2 py-1 rounded-md font-body">Büyüt</span>
          </div>
        )}
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
          <span className="text-sm text-emerald-400/80 font-body group-hover:text-emerald-400 transition-colors">
            Detayı Aç
          </span>
          <motion.div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
