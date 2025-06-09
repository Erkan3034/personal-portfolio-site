import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) setError('Proje bulunamadı.');
      else setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || 'Proje bulunamadı.'}</p>
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">Geri Dön</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {project.image && (
            <img src={project.image} alt={project.title} className="w-full rounded-lg mb-6 max-h-96 object-cover" />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
          <p className="text-gray-700 mb-6">{project.description}</p>
          {/* Diğer alanlar eklenebilir */}
          <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg">Geri Dön</button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail; 