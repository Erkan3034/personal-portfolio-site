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
          // Fallback to sample data
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
  }, []); // sampleProjects sabit; bağımlılık gerekmiyor

  // Sample projects for fallback
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Projeler yükleniyor...</p>
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
            Projelerim
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Geliştirdiğim projeler ve kullandığım teknolojiler. 
            Her proje, öğrenme sürecimin bir parçası ve yeteneklerimin gelişimini yansıtıyor.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              Tümü
            </motion.button>
            
            {allTechnologies.map((tech) => (
              <motion.button
                key={tech}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(tech)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  filter === tech
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {tech}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Bu teknoloji ile proje bulunamadı
            </h3>
            <p className="text-gray-600">
              Farklı bir teknoloji seçin veya tüm projeleri görüntüleyin.
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {projects.length}
              </div>
              <div className="text-gray-600">Toplam Proje</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {allTechnologies.length}
              </div>
              <div className="text-gray-600">Kullanılan Teknoloji</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {projects.filter(p => p.featured).length}
              </div>
              <div className="text-gray-600">Öne Çıkan Proje</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects; 