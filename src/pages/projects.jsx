import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await getProjects();
        if (error) {
          console.error('Error fetching projects:', error);
          setProjects(sampleProjects);
        } else {
          setProjects(data || sampleProjects);
        }
      } catch (error) {
        console.error('Error:', error);
        setProjects(sampleProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const sampleProjects = [
    {
      id: 1,
      title: 'E-Ticaret Platformu',
      description: 'Modern React ve Node.js ile geliştirilmiş tam özellikli e-ticaret platformu.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      github_url: 'https://github.com',
      live_url: 'https://example.com',
      project_date: '2024-01-15',
      featured: true,
      image: null
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Takım çalışması için geliştirilmiş görev yönetim uygulaması.',
      technologies: ['React', 'Firebase', 'Tailwind CSS'],
      github_url: 'https://github.com',
      live_url: 'https://example.com',
      project_date: '2023-12-20',
      featured: false,
      image: null
    }
  ];

  const allTechnologies = [...new Set(
    projects.flatMap(project => project.technologies || [])
  )];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => 
        project.technologies?.includes(filter)
      );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto" />
          </div>
          <p className="text-gray-400">Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pt-24">
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
            <span className="text-sm font-medium text-primary">Portfolyo</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span className="text-white">Proje</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-purple-500">lerim</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Geliştirdiğim projeler ve kullandığım teknolojiler. 
            Her proje, öğrenme sürecimin bir parçası.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-primary to-cyan-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              Tümü
            </motion.button>
            
            {allTechnologies.slice(0, 8).map((tech) => (
              <motion.button
                key={tech}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(tech)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === tech
                    ? 'bg-gradient-to-r from-primary to-cyan-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {tech}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="cursor-pointer"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Bu teknoloji ile proje bulunamadı
            </h3>
            <p className="text-gray-400">
              Farklı bir teknoloji seçin veya tüm projeleri görüntüleyin.
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'Toplam Proje', value: projects.length, icon: '📁' },
            { label: 'Teknoloji', value: allTechnologies.length, icon: '🛠️' },
            { label: 'Öne Çıkan', value: projects.filter(p => p.featured).length, icon: '⭐' },
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
      </div>
    </div>
  );
};

export default Projects;
