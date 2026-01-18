import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  signIn,
  signOut,
  getCurrentUser,
  getProjects,
  getCertificates,
  getBlogs,
  addProject,
  addCertificate,
  addBlog,
  deleteProject,
  deleteCertificate,
  deleteBlog,
  uploadProjectImage,
  uploadCertificateImage,
  uploadBlogImage,
  updateProject,
  updateCertificate,
  updateBlog,
} from '../lib/supabase';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [blogs, setBlogs] = useState([]);
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
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    issuer: '',
    description: '',
    certificate_date: '',
    certificate_url: '',
    image: null
  });
  const [certificateImagePreview, setCertificateImagePreview] = useState(null);
  const [addCertificateLoading, setAddCertificateLoading] = useState(false);
  const [addCertificateError, setAddCertificateError] = useState('');
  const [editCertificate, setEditCertificate] = useState(null);
  const [editCertificateLoading, setEditCertificateLoading] = useState(false);
  const [editCertificateError, setEditCertificateError] = useState('');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '[]',
    is_external: false,
    external_url: '',
    image: null,
    published_at: '',
  });
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [addBlogLoading, setAddBlogLoading] = useState(false);
  const [addBlogError, setAddBlogError] = useState('');
  const [editBlog, setEditBlog] = useState(null);
  const [editBlogLoading, setEditBlogLoading] = useState(false);
  const [editBlogError, setEditBlogError] = useState('');
  
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
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
  }, []);

  const fetchData = async () => {
    try {
      const [projectsData, certificatesData, blogsData] = await Promise.all([
        getProjects(),
        getCertificates(),
        getBlogs()
      ]);
      
      setProjects(projectsData.data || []);
      setCertificates(certificatesData.data || []);
      setBlogs(blogsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Bu blogu silmek istediğine emin misin?')) return;
    try {
      await deleteBlog(id);
      fetchData();
    } catch (err) {
      alert('Blog silinemedi: ' + (err.message || err));
    }
  };

  const parseTagsSafe = (value) => {
    try {
      const parsed = JSON.parse(value || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const convertToWebP = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('WebP dönüşümü başarısız.'));
              return;
            }
            resolve(new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' }));
          },
          'image/webp',
          0.9
        );
      };
      img.onerror = () => reject(new Error('Görsel yüklenemedi.'));
      img.src = URL.createObjectURL(file);
    });

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
            <button
              onClick={() => setActiveTab('blogs')}
              className={`py-2 px-4 font-medium transition-colors duration-200 ${
                activeTab === 'blogs'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Blog ({blogs.length})
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {activeTab === 'projects' && (
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
          )}

          {activeTab === 'certificates' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sertifikalar</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  onClick={() => {
                    setShowCertificateModal(true);
                    setNewCertificate({ title: '', issuer: '', description: '', certificate_date: '', certificate_url: '', image: null });
                    setCertificateImagePreview(null);
                    setAddCertificateError('');
                  }}
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
                        <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={() => setEditCertificate(certificate)}>Düzenle</button>
                        <button className="text-red-600 hover:text-red-800 text-sm" onClick={async () => {
                          if (!window.confirm('Bu sertifikayı silmek istediğine emin misin?')) return;
                          try {
                            await deleteCertificate(certificate.id);
                            fetchData();
                          } catch (err) {
                            alert('Sertifika silinemedi: ' + (err.message || err));
                          }
                        }}>Sil</button>
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

          {activeTab === 'blogs' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Blog</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  onClick={() => {
                    setShowBlogModal(true);
                    setNewBlog({ title: '', summary: '', content: '', tags: '[]', is_external: false, external_url: '', image: null, published_at: '' });
                    setBlogImagePreview(null);
                    setAddBlogError('');
                  }}
                >
                  Yeni Blog Ekle
                </motion.button>
              </div>

              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{blog.summary}</p>
                        <div className="text-xs text-gray-500">
                          {blog.is_external ? 'External' : 'Site içi'} •{' '}
                          {blog.published_at
                            ? new Date(blog.published_at).toLocaleDateString('tr-TR')
                            : 'Tarih yok'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={() => setEditBlog(blog)}>Düzenle</button>
                        <button className="text-red-600 hover:text-red-800 text-sm" onClick={() => handleDeleteBlog(blog.id)}>Sil</button>
                      </div>
                    </div>
                  </div>
                ))}

                {blogs.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Henüz blog bulunmuyor.</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {/* Modal for adding new project */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
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
                  const { error } = await addProject({
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
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setShowCertificateModal(false); setNewCertificate({ title: '', issuer: '', description: '', certificate_date: '', certificate_url: '', image: null }); setCertificateImagePreview(null); setAddCertificateError(''); }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Yeni Sertifika Ekle</h2>
            {addCertificateError && <div className="mb-4 text-red-600 text-sm">{addCertificateError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAddCertificateLoading(true);
                setAddCertificateError('');
                if (!newCertificate.title) {
                  setAddCertificateError('Başlık zorunlu!');
                  setAddCertificateLoading(false);
                  return;
                }
                let imageUrl = null;
                try {
                  if (newCertificate.image) {
                    const { data: uploadData, error: uploadError } = await uploadCertificateImage(newCertificate.image);
                    if (uploadError) throw uploadError;
                    imageUrl = uploadData.publicUrl;
                  }
                  const { error } = await addCertificate({
                    title: newCertificate.title,
                    issuer: newCertificate.issuer,
                    description: newCertificate.description,
                    certificate_date: newCertificate.certificate_date,
                    certificate_url: newCertificate.certificate_url,
                    image: imageUrl,
                  });
                  if (error) throw error;
                  setShowCertificateModal(false);
                  setNewCertificate({ title: '', issuer: '', description: '', certificate_date: '', certificate_url: '', image: null });
                  setCertificateImagePreview(null);
                  fetchData();
                } catch (err) {
                  setAddCertificateError('Sertifika eklenemedi: ' + (err.message || err));
                } finally {
                  setAddCertificateLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={newCertificate.title}
                  onChange={e => setNewCertificate({ ...newCertificate, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Sertifika başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kurum</label>
                <input
                  type="text"
                  value={newCertificate.issuer}
                  onChange={e => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Sertifikayı veren kurum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={newCertificate.description}
                  onChange={e => setNewCertificate({ ...newCertificate, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Sertifika açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                <input
                  type="date"
                  value={newCertificate.certificate_date}
                  onChange={e => setNewCertificate({ ...newCertificate, certificate_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sertifika URL</label>
                <input
                  type="text"
                  value={newCertificate.certificate_url}
                  onChange={e => setNewCertificate({ ...newCertificate, certificate_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://sertifika.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setNewCertificate({ ...newCertificate, image: file });
                    setCertificateImagePreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {certificateImagePreview && (
                  <img src={certificateImagePreview} alt="Önizleme" className="mt-2 rounded-lg max-h-40 mx-auto" />
                )}
              </div>
              <button
                type="submit"
                disabled={addCertificateLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${addCertificateLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'}`}
              >
                {addCertificateLoading ? 'Ekleniyor...' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setShowBlogModal(false); setAddBlogError(''); setBlogImagePreview(null); }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Yeni Blog Ekle</h2>
            {addBlogError && <div className="mb-4 text-red-600 text-sm">{addBlogError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAddBlogLoading(true);
                setAddBlogError('');
                if (!newBlog.title) {
                  setAddBlogError('Başlık zorunlu!');
                  setAddBlogLoading(false);
                  return;
                }
                let imageUrl = null;
                try {
                  if (newBlog.image) {
                    const webpFile = await convertToWebP(newBlog.image);
                    const { data: uploadData, error: uploadError } = await uploadBlogImage(webpFile);
                    if (uploadError) throw uploadError;
                    imageUrl = uploadData.publicUrl;
                  }
                  const { error } = await addBlog({
                    title: newBlog.title,
                    summary: newBlog.summary,
                    content: newBlog.content,
                    tags: parseTagsSafe(newBlog.tags),
                    is_external: newBlog.is_external,
                    external_url: newBlog.external_url,
                    image: imageUrl,
                    published_at: newBlog.published_at || null,
                  });
                  if (error) throw error;
                  setShowBlogModal(false);
                  setNewBlog({ title: '', summary: '', content: '', tags: '[]', is_external: false, external_url: '', image: null, published_at: '' });
                  setBlogImagePreview(null);
                  fetchData();
                } catch (err) {
                  setAddBlogError('Blog eklenemedi: ' + (err.message || err));
                } finally {
                  setAddBlogLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Blog başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Özet</label>
                <textarea
                  value={newBlog.summary}
                  onChange={e => setNewBlog({ ...newBlog, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Kısa özet"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik (HTML)</label>
                <textarea
                  value={newBlog.content}
                  onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="<p>İçerik...</p>"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler (JSON dizi)</label>
                <input
                  type="text"
                  value={newBlog.tags}
                  onChange={e => setNewBlog({ ...newBlog, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder='["React","Supabase"]'
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newBlog.is_external}
                  onChange={e => setNewBlog({ ...newBlog, is_external: e.target.checked })}
                  id="blog_is_external"
                />
                <label htmlFor="blog_is_external" className="text-sm font-medium text-gray-700">Dış bağlantı (Medium vb.)</label>
              </div>
              {newBlog.is_external && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">External URL</label>
                  <input
                    type="text"
                    value={newBlog.external_url}
                    onChange={e => setNewBlog({ ...newBlog, external_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://medium.com/..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yayın Tarihi</label>
                <input
                  type="date"
                  value={newBlog.published_at}
                  onChange={e => setNewBlog({ ...newBlog, published_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setNewBlog({ ...newBlog, image: file });
                    setBlogImagePreview(file ? URL.createObjectURL(file) : null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {blogImagePreview && (
                  <img src={blogImagePreview} alt="Önizleme" className="mt-2 rounded-lg max-h-40 mx-auto" />
                )}
              </div>
              <button
                type="submit"
                disabled={addBlogLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${addBlogLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'}`}
              >
                {addBlogLoading ? 'Ekleniyor...' : 'Ekle'}
              </button>
            </form>
          </div>
        </div>
      )}
      {editBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setEditBlog(null); setEditBlogError(''); }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Blogu Düzenle</h2>
            {editBlogError && <div className="mb-4 text-red-600 text-sm">{editBlogError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditBlogLoading(true);
                setEditBlogError('');
                if (!editBlog.title) {
                  setEditBlogError('Başlık zorunlu!');
                  setEditBlogLoading(false);
                  return;
                }
                try {
                  let imageUrl = editBlog.image;
                  if (editBlog.newImage) {
                    const webpFile = await convertToWebP(editBlog.newImage);
                    const { data: uploadData, error: uploadError } = await uploadBlogImage(webpFile);
                    if (uploadError) throw uploadError;
                    imageUrl = uploadData.publicUrl;
                  }
                  const { error } = await updateBlog(editBlog.id, {
                    title: editBlog.title,
                    summary: editBlog.summary,
                    content: editBlog.content,
                    tags: parseTagsSafe(typeof editBlog.tags === 'string' ? editBlog.tags : JSON.stringify(editBlog.tags || [])),
                    is_external: editBlog.is_external,
                    external_url: editBlog.external_url,
                    image: imageUrl,
                    published_at: editBlog.published_at || null,
                  });
                  if (error) throw error;
                  setEditBlog(null);
                  fetchData();
                } catch (err) {
                  setEditBlogError('Blog güncellenemedi: ' + (err.message || err));
                } finally {
                  setEditBlogLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={editBlog.title}
                  onChange={e => setEditBlog({ ...editBlog, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Blog başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Özet</label>
                <textarea
                  value={editBlog.summary || ''}
                  onChange={e => setEditBlog({ ...editBlog, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik (HTML)</label>
                <textarea
                  value={editBlog.content || ''}
                  onChange={e => setEditBlog({ ...editBlog, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler (JSON dizi)</label>
                <input
                  type="text"
                  value={typeof editBlog.tags === 'string' ? editBlog.tags : JSON.stringify(editBlog.tags || [])}
                  onChange={e => setEditBlog({ ...editBlog, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!!editBlog.is_external}
                  onChange={e => setEditBlog({ ...editBlog, is_external: e.target.checked })}
                  id="edit_blog_is_external"
                />
                <label htmlFor="edit_blog_is_external" className="text-sm font-medium text-gray-700">Dış bağlantı (Medium vb.)</label>
              </div>
              {editBlog.is_external && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">External URL</label>
                  <input
                    type="text"
                    value={editBlog.external_url || ''}
                    onChange={e => setEditBlog({ ...editBlog, external_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="https://medium.com/..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yayın Tarihi</label>
                <input
                  type="date"
                  value={editBlog.published_at ? editBlog.published_at.substring(0, 10) : ''}
                  onChange={e => setEditBlog({ ...editBlog, published_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setEditBlog({ ...editBlog, newImage: file });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {editBlog.image && (
                  <img src={editBlog.image} alt="Blog görseli" className="mt-2 rounded-lg max-h-40 mx-auto" />
                )}
              </div>
              <button
                type="submit"
                disabled={editBlogLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${editBlogLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'}`}
              >
                {editBlogLoading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
      {editCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => { setEditCertificate(null); setEditCertificateError(''); }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">Sertifikayı Düzenle</h2>
            {editCertificateError && <div className="mb-4 text-red-600 text-sm">{editCertificateError}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditCertificateLoading(true);
                setEditCertificateError('');
                if (!editCertificate.title) {
                  setEditCertificateError('Başlık zorunlu!');
                  setEditCertificateLoading(false);
                  return;
                }
                try {
                  let imageUrl = editCertificate.image;
                  if (editCertificate.newImage) {
                    const { data: uploadData, error: uploadError } = await uploadCertificateImage(editCertificate.newImage);
                    if (uploadError) throw uploadError;
                    imageUrl = uploadData.publicUrl;
                  }
                  const { error } = await updateCertificate(editCertificate.id, {
                    title: editCertificate.title,
                    issuer: editCertificate.issuer,
                    description: editCertificate.description,
                    certificate_date: editCertificate.certificate_date,
                    certificate_url: editCertificate.certificate_url,
                    image: imageUrl,
                  });
                  if (error) throw error;
                  setEditCertificate(null);
                  fetchData();
                } catch (err) {
                  setEditCertificateError('Sertifika güncellenemedi: ' + (err.message || err));
                } finally {
                  setEditCertificateLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={editCertificate.title}
                  onChange={e => setEditCertificate({ ...editCertificate, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Sertifika başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kurum</label>
                <input
                  type="text"
                  value={editCertificate.issuer || ''}
                  onChange={e => setEditCertificate({ ...editCertificate, issuer: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Sertifikayı veren kurum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={editCertificate.description || ''}
                  onChange={e => setEditCertificate({ ...editCertificate, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Sertifika açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                <input
                  type="date"
                  value={editCertificate.certificate_date || ''}
                  onChange={e => setEditCertificate({ ...editCertificate, certificate_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sertifika URL</label>
                <input
                  type="text"
                  value={editCertificate.certificate_url || ''}
                  onChange={e => setEditCertificate({ ...editCertificate, certificate_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://sertifika.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    setEditCertificate({ ...editCertificate, newImage: file });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {editCertificate.image && (
                  <img src={editCertificate.image} alt="Sertifika görseli" className="mt-2 rounded-lg max-h-40 mx-auto" />
                )}
              </div>
              <button
                type="submit"
                disabled={editCertificateLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${editCertificateLoading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'}`}
              >
                {editCertificateLoading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 