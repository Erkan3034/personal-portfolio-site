import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    title,
    description,
    image,
    technologies,
    github_url,
    live_url,
    project_date,
    featured = false
  } = project;

  const techList = Array.isArray(technologies) ? technologies : [];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 group ${
        featured ? 'ring-1 ring-primary/50' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-gradient-to-r from-primary to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            ⭐ Öne Çıkan
          </span>
        </div>
      )}

      {/* Project Image */}
      <div className="relative h-40 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center space-x-3"
        >
          {github_url && (
            <motion.a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </motion.a>
          )}
          
          {live_url && (
            <motion.a
              href={live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-primary/80 border border-primary flex items-center justify-center text-white hover:bg-primary transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
          )}
        </motion.div>
      </div>

      {/* Project Content */}
      <div className="p-4">
        {/* Title and Date */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {title}
          </h3>
          {project_date && (
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
              {new Date(project_date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'short'
              })}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5">
          {techList.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20"
            >
              {tech}
            </span>
          ))}
          {techList.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
              +{techList.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
