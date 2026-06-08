import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const [hovered, setIsHovered] = useState(false);
  const { title, description, image, technologies = [], github_url, live_url, project_date, featured } = project;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-xl overflow-hidden bg-surface border transition-all duration-300 group ${
        featured
          ? 'border-emerald-500/25 hover:border-emerald-500/50'
          : 'border-white/[0.07] hover:border-white/[0.15]'
      }`}
    >
      {/* Featured indicator */}
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[11px] font-medium font-body">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Öne Çıkan
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {image ? (
          <img
            src={image} alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-surface-2 flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center gap-3"
        >
          {github_url && (
            <motion.a
              href={github_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </motion.a>
          )}
          {live_url && (
            <motion.a
              href={live_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-emerald-500/80 border border-emerald-400 flex items-center justify-center text-white hover:bg-emerald-500 transition-colors cursor-pointer"
              aria-label="Canlı Demo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          )}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold font-body text-white group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1 flex-1">
            {title}
          </h3>
          {project_date && (
            <span className="text-[11px] text-zinc-600 bg-white/[0.04] px-2 py-0.5 rounded-full ml-2 whitespace-nowrap font-body">
              {new Date(project_date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        <p className="text-sm text-zinc-500 font-body mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/[0.07] text-emerald-400 border border-emerald-500/20 font-body">
              {tech}
            </span>
          ))}
          {technologies.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-600 font-body">
              +{technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
