import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signIn, signOut, getCurrentUser, getProjects, getCertificates, addProject, addCertificate, deleteProject, deleteCertificate, uploadProjectImage, updateProject } from '../lib/supabase';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    project_date: '',
    featured: false,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [editProject, setEditProject] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setShowLogin(false);
        fetchData();
      } else {
        setShowLogin(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setShowLogin(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [projectsData, certificatesData] = await Promise.all([
        getProjects(),
        getCertificates()
      ]);
      
      setProjects(projectsData.data || []);
      setCertificates(certificatesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const { data, error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        throw error;
      }

      setUser(data.user);
      setShowLogin(false);
      fetchData();
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Giriş başarısız. E-posta ve şifrenizi kontrol edin.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setShowLogin(true);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Bu projeyi silmek istediğine emin misin?')) return;
    try {
      await deleteProject(id);
      fetchData();
    } catch (err) {
      alert('Proje silinemedi: ' + (err.message || err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Admin Girişi
            </h1>
            
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loginLoading}
                whileHover={!loginLoading ? { scale: 1.02 } : {}}
                whileTap={!loginLoading ? { scale: 0.98 } : {}}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  loginLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
                }`}
              >
                {loginLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-primary hover:text-primary/80 text-sm"
              >
                Ana sayfaya dön
              </button>
            </div>
          </motion.div>
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
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
            <p className="text-gray-600">Hoş geldiniz, {user?.email}</p>
          </div>
          
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Çıkış Yap
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-4 font-medium transition-colors duration-200 ${
                activeTab === 'projects'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Projeler ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`py-2 px-4 font-medium transition-colors duration-200 ${
                activeTab === 'certificates'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sertifikalar ({certificates.length})
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {activeTab === 'projects' ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Projeler</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  onClick={() => setShowProjectModal(true)}
                >
                  Yeni Proje Ekle
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-gray-600 text-sm">{project.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={() => setEditProject(project)}>Düzenle</button>
                        <button className="text-red-600 hover:text-red-800 text-sm" onClick={() => handleDeleteProject(project.id)}>Sil</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Henüz proje bulunmuyor.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sertifikalar</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Yeni Sertifika Ekle
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{certificate.title}</h3>
                        <p className="text-gray-600 text-sm">{certificate.issuer}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Düzenle</button>
                        <button className="text-red-600 hover:text-red-800 text-sm">Sil</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {certificates.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Henüz sertifika bulunmuyor.</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {/* Modal for adding new project */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setShowProjectModal(false); setNewProject({ title: '', description: '', image: null }); setAddError(''); }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Yeni Proje Ekle</h2>
            {addError && <div className="mb-4 text-red-600 text-sm">{addError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAddLoading(true);
                setAddError('');
                if (!newProject.title) {
                  setAddError('Başlık zorunlu!');
                  setAddLoading(false);
                  return;
                }
                let imageUrl = null;
                try {
                  if (newProject.image) {
                    const { data: uploadData, error: uploadError } = await uploadProjectImage(newProject.image);
                    if (uploadError) throw uploadError;
                    imageUrl = uploadData.publicUrl;
                  }
                  const { data, error } = await addProject({
                    title: newProject.title,
                    description: newProject.description,
                    technologies: JSON.parse(newProject.technologies),
                    github_url: newProject.github_url,
                    live_url: newProject.live_url,
                    project_date: newProject.project_date,
                    featured: newProject.featured,
                    image: imageUrl,
                  });
                  if (error) throw error;
                  setShowProjectModal(false);
                  setNewProject({ title: '', description: '', image: null });
                  setImagePreview(null);
                  fetchData();
                } catch (err) {
                  setAddError('Proje eklenemedi: ' + (err.message || err));
                } finally {
                  setAddLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Proje başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Proje açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teknolojiler (JSON formatında giriniz)</label>
                <input
                  type="text"
                  value={newProject.technologies}
                  onChange={e => setNewProject({ ...newProject, technologies: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder='["React", "Node.js"]'
                />
                <span className="text-xs text-gray-500">Örnek: ["React", "Node.js"]</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="text"
                  value={newProject.github_url}
                  onChange={e => setNewProject({ ...newProject, github_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://github.com/kullanici/proje"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canlı Demo URL</label>
                <input
                  type="text"
                  value={newProject.live_url}
                  onChange={e => setNewProject({ ...newProject, live_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://proje.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proje Tarihi</label>
                <input
                  type="date"
                  value={newProject.project_date}
                  onChange={e => setNewProject({ ...newProject, project_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newProject.featured}
                  onChange={e => setNewProject({ ...newProject, featured: e.target.checked })}
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Öne Çıkan Proje</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setNewProject({ ...newProject, image: file });
                    setImagePreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Önizleme" className="mt-2 rounded-lg max-h-40 mx-auto" />
                )}
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${addLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'}`}
              >
                {addLoading ? 'Ekleniyor...' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Project Modal */}
      {editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setEditProject(null); setEditError(''); }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Projeyi Düzenle</h2>
            {editError && <div className="mb-4 text-red-600 text-sm">{editError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditLoading(true);
                setEditError('');
                if (!editProject.title) {
                  setEditError('Başlık zorunlu!');
                  setEditLoading(false);
                  return;
                }
                try {
                  const { error } = await updateProject(editProject.id, {
                    title: editProject.title,
                    description: editProject.description,
                    technologies: JSON.parse(editProject.technologies),
                    github_url: editProject.github_url,
                    live_url: editProject.live_url,
                    project_date: editProject.project_date,
                    featured: editProject.featured,
                    image: editProject.image,
                  });
                  if (error) throw error;
                  setEditProject(null);
                  fetchData();
                } catch (err) {
                  setEditError('Proje güncellenemedi: ' + (err.message || err));
                } finally {
                  setEditLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={editProject.title}
                  onChange={e => setEditProject({ ...editProject, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Proje başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={editProject.description}
                  onChange={e => setEditProject({ ...editProject, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Proje açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teknolojiler (JSON formatında giriniz)</label>
                <input
                  type="text"
                  value={typeof editProject.technologies === 'string' ? editProject.technologies : JSON.stringify(editProject.technologies || [])}
                  onChange={e => setEditProject({ ...editProject, technologies: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder='["React", "Node.js"]'
                />
                <span className="text-xs text-gray-500">Örnek: ["React", "Node.js"]</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="text"
                  value={editProject.github_url || ''}
                  onChange={e => setEditProject({ ...editProject, github_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://github.com/kullanici/proje"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canlı Demo URL</label>
                <input
                  type="text"
                  value={editProject.live_url || ''}
                  onChange={e => setEditProject({ ...editProject, live_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://proje.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proje Tarihi</label>
                <input
                  type="date"
                  value={editProject.project_date || ''}
                  onChange={e => setEditProject({ ...editProject, project_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!!editProject.featured}
                  onChange={e => setEditProject({ ...editProject, featured: e.target.checked })}
                  id="edit_featured"
                />
                <label htmlFor="edit_featured" className="text-sm font-medium text-gray-700">Öne Çıkan Proje</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const { data: uploadData, error: uploadError } = await uploadProjectImage(file);
                      if (uploadError) {
                        setEditError('Görsel yüklenemedi: ' + uploadError.message);
                        return;
                      }
                      setEditProject({ ...editProject, image: uploadData.publicUrl });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {editProject.image && (
                  <img src={editProject.image} alt="Proje görseli" className="mt-2 rounded-lg max-h-40 mx-auto" />
                )}
              </div>
              <button
                type="submit"
                disabled={editLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${editLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'}`}
              >
                {editLoading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 