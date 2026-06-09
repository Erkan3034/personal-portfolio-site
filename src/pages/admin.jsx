import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  signIn, signOut, getCurrentUser,
  getProjects, getCertificates, getBlogs,
  addProject, addCertificate, addBlog,
  deleteProject, deleteCertificate, deleteBlog,
  uploadProjectImage, uploadCertificateImage, uploadBlogImage,
  updateProject, updateCertificate, updateBlog,
} from '../lib/supabase';

/* ─── TagInput ─── */
const TagInput = ({ tags = [], onChange, placeholder = 'Yazıp Enter\'a basın...' }) => {
  const [input, setInput] = useState('');

  const add = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  };

  const remove = (i) => onChange(tags.filter((_, idx) => idx !== i));

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
    if (e.key === 'Backspace' && !input && tags.length) remove(tags.length - 1);
  };

  return (
    <div className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 bg-white transition-all">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-sm font-medium">
            {tag}
            <button type="button" onClick={() => remove(i)} className="text-emerald-400 hover:text-red-500 transition-colors ml-0.5 font-bold leading-none">&times;</button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(',', ''))}
          onKeyDown={onKey}
          onBlur={() => { if (input.trim()) add(); }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent py-0.5"
        />
      </div>
    </div>
  );
};

/* ─── RichEditor ─── */
const TOOLBAR = [
  { cmd: 'bold', label: 'B', title: 'Kalın', cls: 'font-bold' },
  { cmd: 'italic', label: 'I', title: 'İtalik', cls: 'italic' },
  { cmd: 'underline', label: 'U', title: 'Altı Çizili', cls: 'underline' },
  { type: 'sep' },
  { cmd: 'formatBlock', val: '<h2>', label: 'H2', title: 'Başlık 2', cls: 'font-bold text-xs' },
  { cmd: 'formatBlock', val: '<h3>', label: 'H3', title: 'Başlık 3', cls: 'font-bold text-xs' },
  { cmd: 'formatBlock', val: '<p>', label: 'P', title: 'Paragraf', cls: 'text-xs' },
  { type: 'sep' },
  { cmd: 'insertUnorderedList', label: '• Liste', title: 'Madde İşaretli Liste', cls: 'text-xs' },
  { cmd: 'insertOrderedList', label: '1. Liste', title: 'Numaralı Liste', cls: 'text-xs' },
  { type: 'sep' },
  { cmd: 'formatBlock', val: '<blockquote>', label: '" Alıntı', title: 'Alıntı Bloğu', cls: 'text-xs italic' },
  { type: 'link', label: 'Link', title: 'Bağlantı Ekle', cls: 'text-xs' },
];

const RichEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [source, setSource] = useState(false);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = value || '';
  }, [source]);

  const exec = (cmd, val = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current.innerHTML);
  };

  const btnCls = 'h-7 px-2 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer select-none';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {!source && TOOLBAR.map((t, i) => {
          if (t.type === 'sep') return <div key={i} className="w-px h-5 bg-gray-300 mx-0.5" />;
          if (t.type === 'link') {
            return (
              <button key={i} type="button" title={t.title} className={`${btnCls} ${t.cls || ''}`}
                onClick={() => { const url = prompt('URL girin:'); if (url) exec('createLink', url); }}>
                {t.label}
              </button>
            );
          }
          return (
            <button key={i} type="button" title={t.title} className={`${btnCls} ${t.cls || ''}`}
              onClick={() => exec(t.cmd, t.val)}>
              {t.label}
            </button>
          );
        })}
        <button type="button"
          onClick={() => setSource(!source)}
          className={`ml-auto h-7 px-2 rounded text-xs font-mono cursor-pointer transition-colors ${source ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-800'}`}
          title="HTML kaynağını göster/gizle">
          {'</>'}
        </button>
      </div>

      {source ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 min-h-[220px] outline-none font-mono text-sm resize-y bg-gray-900 text-green-400"
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className="min-h-[220px] p-3 outline-none text-sm leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_a]:text-blue-600 [&_a]:underline"
        />
      )}
    </div>
  );
};

/* ─── Modal wrapper ─── */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-lg relative my-4 sm:my-0">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
        <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl cursor-pointer">&times;</button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
    </div>
  </div>
);

/* ─── Field wrapper ─── */
const Field = ({ label, required, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all outline-none text-sm';

/* ─── Admin ─── */
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

  const emptyProject = { title: '', description: '', technologies: [], github_url: '', live_url: '', project_date: '', featured: false, image: null };
  const emptyCert = { title: '', issuer: '', description: '', certificate_date: '', certificate_url: '', image: null };
  const emptyBlog = { title: '', summary: '', content: '', tags: [], is_external: false, external_url: '', image: null, published_at: '' };

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState(emptyProject);
  const [imagePreview, setImagePreview] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [editProject, setEditProject] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [newCertificate, setNewCertificate] = useState(emptyCert);
  const [certificateImagePreview, setCertificateImagePreview] = useState(null);
  const [addCertificateLoading, setAddCertificateLoading] = useState(false);
  const [addCertificateError, setAddCertificateError] = useState('');
  const [editCertificate, setEditCertificate] = useState(null);
  const [editCertificateLoading, setEditCertificateLoading] = useState(false);
  const [editCertificateError, setEditCertificateError] = useState('');

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState(emptyBlog);
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [addBlogLoading, setAddBlogLoading] = useState(false);
  const [addBlogError, setAddBlogError] = useState('');
  const [editBlog, setEditBlog] = useState(null);
  const [editBlogLoading, setEditBlogLoading] = useState(false);
  const [editBlogError, setEditBlogError] = useState('');

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [p, c, b] = await Promise.all([getProjects(), getCertificates(), getBlogs()]);
      setProjects(p.data || []);
      setCertificates(c.data || []);
      setBlogs(b.data || []);
    } catch (err) { console.error('Veri yükleme hatası:', err); }
  };

  const checkAuth = useCallback(async () => {
    try {
      const u = await getCurrentUser();
      if (u) { setUser(u); setShowLogin(false); fetchData(); }
      else setShowLogin(true);
    } catch { setShowLogin(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { data, error } = await signIn(loginData.email, loginData.password);
      if (error) throw error;
      setUser(data.user);
      setShowLogin(false);
      fetchData();
    } catch { setLoginError('Giriş başarısız. E-posta ve şifrenizi kontrol edin.'); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = async () => {
    try { await signOut(); setUser(null); setShowLogin(true); navigate('/'); }
    catch (err) { console.error('Çıkış hatası:', err); }
  };

  const confirmDelete = (msg, fn) => async (id) => {
    if (!window.confirm(msg)) return;
    try { await fn(id); fetchData(); }
    catch (err) { alert('Silme hatası: ' + (err.message || err)); }
  };

  const handleDeleteProject = confirmDelete('Bu projeyi silmek istediğine emin misin?', deleteProject);
  const handleDeleteCert = confirmDelete('Bu sertifikayı silmek istediğine emin misin?', deleteCertificate);
  const handleDeleteBlog = confirmDelete('Bu blogu silmek istediğine emin misin?', deleteBlog);

  const convertToWebP = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        c.getContext('2d').drawImage(img, 0, 0);
        c.toBlob((blob) => {
          if (!blob) { reject(new Error('WebP dönüşümü başarısız.')); return; }
          resolve(new File([blob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' }));
        }, 'image/webp', 0.9);
      };
      img.onerror = () => reject(new Error('Görsel yüklenemedi.'));
      img.src = URL.createObjectURL(file);
    });

  const ensureArray = (v) => (Array.isArray(v) ? v : []);

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/30 border-t-primary mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  /* ─── Login ─── */
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-md mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Admin Girişi</h1>
            {loginError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{loginError}</p>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="E-posta">
                <input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required className={inputCls} placeholder="admin@example.com" />
              </Field>
              <Field label="Şifre">
                <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required className={inputCls} placeholder="********" />
              </Field>
              <button type="submit" disabled={loginLoading}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${loginLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'}`}>
                {loginLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
            <div className="mt-5 text-center">
              <button onClick={() => navigate('/')} className="text-primary hover:text-primary/80 text-sm cursor-pointer">Ana sayfaya dön</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── Helpers for list cards ─── */
  const Badge = ({ children, color = 'gray' }) => {
    const colors = {
      green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      gray: 'bg-gray-50 text-gray-600 border-gray-200',
      yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${colors[color]}`}>{children}</span>;
  };

  /* ─── Main Panel ─── */
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Paneli</h1>
            <p className="text-gray-500 text-sm truncate max-w-[260px] sm:max-w-none">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium cursor-pointer shrink-0">Çıkış Yap</button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Proje', count: projects.length, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Sertifika', count: certificates.length, color: 'text-blue-600 bg-blue-50' },
            { label: 'Blog', count: blogs.length, color: 'text-amber-600 bg-amber-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 text-center">
              <div className={`text-2xl sm:text-3xl font-bold ${s.color.split(' ')[0]}`}>{s.count}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {[
            { id: 'projects', label: 'Projeler' },
            { id: 'certificates', label: 'Sertifikalar' },
            { id: 'blogs', label: 'Blog' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ Projects Tab ══ */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <h2 className="text-xl font-bold text-gray-900">Projeler</h2>
              <button onClick={() => { setShowProjectModal(true); setNewProject(emptyProject); setImagePreview(null); setAddError(''); }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer">
                + Yeni Proje
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <div className="flex gap-4">
                    {p.image && <img src={p.image} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 hidden sm:block" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                            {p.featured && <Badge color="yellow">Öne Çıkan</Badge>}
                          </div>
                          <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{p.description}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setEditProject({ ...p, technologies: Array.isArray(p.technologies) ? p.technologies : [] })}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">Düzenle</button>
                          <button onClick={() => handleDeleteProject(p.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer">Sil</button>
                        </div>
                      </div>
                      {ensureArray(p.technologies).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ensureArray(p.technologies).map((t) => <Badge key={t} color="green">{t}</Badge>)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-gray-400 text-center py-10 text-sm">Henüz proje eklenmedi.</p>}
            </div>
          </div>
        )}

        {/* ══ Certificates Tab ══ */}
        {activeTab === 'certificates' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <h2 className="text-xl font-bold text-gray-900">Sertifikalar</h2>
              <button onClick={() => { setShowCertificateModal(true); setNewCertificate(emptyCert); setCertificateImagePreview(null); setAddCertificateError(''); }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer">
                + Yeni Sertifika
              </button>
            </div>

            <div className="space-y-3">
              {certificates.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <div className="flex gap-4">
                    {c.image && <img src={c.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 hidden sm:block" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{c.title}</h3>
                          <p className="text-gray-500 text-sm">{c.issuer}</p>
                          {c.certificate_date && <p className="text-gray-400 text-xs mt-0.5">{new Date(c.certificate_date).toLocaleDateString('tr-TR')}</p>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setEditCertificate(c)} className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">Düzenle</button>
                          <button onClick={() => handleDeleteCert(c.id)} className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer">Sil</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {certificates.length === 0 && <p className="text-gray-400 text-center py-10 text-sm">Henüz sertifika eklenmedi.</p>}
            </div>
          </div>
        )}

        {/* ══ Blogs Tab ══ */}
        {activeTab === 'blogs' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
              <h2 className="text-xl font-bold text-gray-900">Blog</h2>
              <button onClick={() => { setShowBlogModal(true); setNewBlog(emptyBlog); setBlogImagePreview(null); setAddBlogError(''); }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium cursor-pointer">
                + Yeni Blog
              </button>
            </div>

            <div className="space-y-3">
              {blogs.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <div className="flex gap-4">
                    {b.image && <img src={b.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 hidden sm:block" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 truncate">{b.title}</h3>
                            <Badge color={b.is_external ? 'blue' : 'green'}>{b.is_external ? 'External' : 'Site İçi'}</Badge>
                          </div>
                          <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{b.summary}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {b.published_at && <span className="text-gray-400 text-xs">{new Date(b.published_at).toLocaleDateString('tr-TR')}</span>}
                            {ensureArray(b.tags).length > 0 && ensureArray(b.tags).slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setEditBlog({ ...b, tags: ensureArray(b.tags) })}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer">Düzenle</button>
                          <button onClick={() => handleDeleteBlog(b.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer">Sil</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && <p className="text-gray-400 text-center py-10 text-sm">Henüz blog eklenmedi.</p>}
            </div>
          </div>
        )}
      </div>

      {/* ════════════════ MODALS ════════════════ */}

      {/* ── Add Project ── */}
      {showProjectModal && (
        <Modal title="Yeni Proje Ekle" onClose={() => setShowProjectModal(false)}>
          {addError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{addError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setAddLoading(true); setAddError('');
            if (!newProject.title) { setAddError('Başlık zorunlu!'); setAddLoading(false); return; }
            let imageUrl = null;
            try {
              if (newProject.image) {
                const { data: d, error: e2 } = await uploadProjectImage(newProject.image);
                if (e2) throw e2;
                imageUrl = d.publicUrl;
              }
              const { error } = await addProject({ ...newProject, technologies: newProject.technologies, image: imageUrl });
              if (error) throw error;
              setShowProjectModal(false); setNewProject(emptyProject); setImagePreview(null); fetchData();
            } catch (err) { setAddError('Proje eklenemedi: ' + (err.message || err)); }
            finally { setAddLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required>
              <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required className={inputCls} placeholder="Proje başlığı" />
            </Field>
            <Field label="Açıklama">
              <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="Proje açıklaması" />
            </Field>
            <Field label="Teknolojiler" hint="Yazıp Enter'a basarak ekleyin">
              <TagInput tags={newProject.technologies} onChange={(t) => setNewProject({ ...newProject, technologies: t })} placeholder="React, Node.js..." />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <input type="url" value={newProject.github_url} onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })} className={inputCls} placeholder="https://github.com/..." />
              </Field>
              <Field label="Canlı Demo URL">
                <input type="url" value={newProject.live_url} onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })} className={inputCls} placeholder="https://..." />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Proje Tarihi">
                <input type="date" value={newProject.project_date} onChange={(e) => setNewProject({ ...newProject, project_date: e.target.value })} className={inputCls} />
              </Field>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newProject.featured} onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/40" />
                  <span className="text-sm font-medium text-gray-700">Öne Çıkan Proje</span>
                </label>
              </div>
            </div>
            <Field label="Görsel">
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                setNewProject({ ...newProject, image: f });
                setImagePreview(f ? URL.createObjectURL(f) : null);
              }} className={inputCls} />
              {imagePreview && <img src={imagePreview} alt="Önizleme" className="mt-2 rounded-lg max-h-32 mx-auto" />}
            </Field>
            <button type="submit" disabled={addLoading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${addLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg'}`}>
              {addLoading ? 'Ekleniyor...' : 'Projeyi Ekle'}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Edit Project ── */}
      {editProject && (
        <Modal title="Projeyi Düzenle" onClose={() => { setEditProject(null); setEditError(''); }}>
          {editError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{editError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setEditLoading(true); setEditError('');
            if (!editProject.title) { setEditError('Başlık zorunlu!'); setEditLoading(false); return; }
            try {
              const { error } = await updateProject(editProject.id, {
                title: editProject.title, description: editProject.description,
                technologies: editProject.technologies,
                github_url: editProject.github_url, live_url: editProject.live_url,
                project_date: editProject.project_date, featured: editProject.featured, image: editProject.image,
              });
              if (error) throw error;
              setEditProject(null); fetchData();
            } catch (err) { setEditError('Güncellenemedi: ' + (err.message || err)); }
            finally { setEditLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required>
              <input type="text" value={editProject.title} onChange={(e) => setEditProject({ ...editProject, title: e.target.value })} required className={inputCls} />
            </Field>
            <Field label="Açıklama">
              <textarea value={editProject.description} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} />
            </Field>
            <Field label="Teknolojiler" hint="Yazıp Enter'a basarak ekleyin">
              <TagInput tags={ensureArray(editProject.technologies)} onChange={(t) => setEditProject({ ...editProject, technologies: t })} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <input type="url" value={editProject.github_url || ''} onChange={(e) => setEditProject({ ...editProject, github_url: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Canlı Demo URL">
                <input type="url" value={editProject.live_url || ''} onChange={(e) => setEditProject({ ...editProject, live_url: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Proje Tarihi">
                <input type="date" value={editProject.project_date || ''} onChange={(e) => setEditProject({ ...editProject, project_date: e.target.value })} className={inputCls} />
              </Field>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!editProject.featured} onChange={(e) => setEditProject({ ...editProject, featured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/40" />
                  <span className="text-sm font-medium text-gray-700">Öne Çıkan Proje</span>
                </label>
              </div>
            </div>
            <Field label="Görsel">
              <input type="file" accept="image/*" onChange={async (e) => {
                const f = e.target.files[0];
                if (f) {
                  const { data: d, error: e2 } = await uploadProjectImage(f);
                  if (e2) { setEditError('Görsel yüklenemedi: ' + e2.message); return; }
                  setEditProject({ ...editProject, image: d.publicUrl });
                }
              }} className={inputCls} />
              {editProject.image && <img src={editProject.image} alt="" className="mt-2 rounded-lg max-h-32 mx-auto" />}
            </Field>
            <button type="submit" disabled={editLoading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${editLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg'}`}>
              {editLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Add Certificate ── */}
      {showCertificateModal && (
        <Modal title="Yeni Sertifika Ekle" onClose={() => setShowCertificateModal(false)}>
          {addCertificateError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{addCertificateError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setAddCertificateLoading(true); setAddCertificateError('');
            if (!newCertificate.title) { setAddCertificateError('Başlık zorunlu!'); setAddCertificateLoading(false); return; }
            let imageUrl = null;
            try {
              if (newCertificate.image) {
                const { data: d, error: e2 } = await uploadCertificateImage(newCertificate.image);
                if (e2) throw e2;
                imageUrl = d.publicUrl;
              }
              const { error } = await addCertificate({ title: newCertificate.title, issuer: newCertificate.issuer, description: newCertificate.description, certificate_date: newCertificate.certificate_date, certificate_url: newCertificate.certificate_url, image: imageUrl });
              if (error) throw error;
              setShowCertificateModal(false); setNewCertificate(emptyCert); setCertificateImagePreview(null); fetchData();
            } catch (err) { setAddCertificateError('Eklenemedi: ' + (err.message || err)); }
            finally { setAddCertificateLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required>
              <input type="text" value={newCertificate.title} onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })} required className={inputCls} placeholder="Sertifika başlığı" />
            </Field>
            <Field label="Kurum">
              <input type="text" value={newCertificate.issuer} onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })} className={inputCls} placeholder="Veren kurum" />
            </Field>
            <Field label="Açıklama">
              <textarea value={newCertificate.description} onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="Sertifika açıklaması" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tarih">
                <input type="date" value={newCertificate.certificate_date} onChange={(e) => setNewCertificate({ ...newCertificate, certificate_date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Sertifika URL">
                <input type="url" value={newCertificate.certificate_url} onChange={(e) => setNewCertificate({ ...newCertificate, certificate_url: e.target.value })} className={inputCls} placeholder="https://..." />
              </Field>
            </div>
            <Field label="Görsel">
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                setNewCertificate({ ...newCertificate, image: f });
                setCertificateImagePreview(f ? URL.createObjectURL(f) : null);
              }} className={inputCls} />
              {certificateImagePreview && <img src={certificateImagePreview} alt="Önizleme" className="mt-2 rounded-lg max-h-32 mx-auto" />}
            </Field>
            <button type="submit" disabled={addCertificateLoading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${addCertificateLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg'}`}>
              {addCertificateLoading ? 'Ekleniyor...' : 'Sertifikayı Ekle'}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Edit Certificate ── */}
      {editCertificate && (
        <Modal title="Sertifikayı Düzenle" onClose={() => { setEditCertificate(null); setEditCertificateError(''); }}>
          {editCertificateError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{editCertificateError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setEditCertificateLoading(true); setEditCertificateError('');
            if (!editCertificate.title) { setEditCertificateError('Başlık zorunlu!'); setEditCertificateLoading(false); return; }
            try {
              let imageUrl = editCertificate.image;
              if (editCertificate.newImage) {
                const { data: d, error: e2 } = await uploadCertificateImage(editCertificate.newImage);
                if (e2) throw e2;
                imageUrl = d.publicUrl;
              }
              const { error } = await updateCertificate(editCertificate.id, { title: editCertificate.title, issuer: editCertificate.issuer, description: editCertificate.description, certificate_date: editCertificate.certificate_date, certificate_url: editCertificate.certificate_url, image: imageUrl });
              if (error) throw error;
              setEditCertificate(null); fetchData();
            } catch (err) { setEditCertificateError('Güncellenemedi: ' + (err.message || err)); }
            finally { setEditCertificateLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required>
              <input type="text" value={editCertificate.title} onChange={(e) => setEditCertificate({ ...editCertificate, title: e.target.value })} required className={inputCls} />
            </Field>
            <Field label="Kurum">
              <input type="text" value={editCertificate.issuer || ''} onChange={(e) => setEditCertificate({ ...editCertificate, issuer: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Açıklama">
              <textarea value={editCertificate.description || ''} onChange={(e) => setEditCertificate({ ...editCertificate, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tarih">
                <input type="date" value={editCertificate.certificate_date || ''} onChange={(e) => setEditCertificate({ ...editCertificate, certificate_date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Sertifika URL">
                <input type="url" value={editCertificate.certificate_url || ''} onChange={(e) => setEditCertificate({ ...editCertificate, certificate_url: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label="Görsel">
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) setEditCertificate({ ...editCertificate, newImage: f }); }} className={inputCls} />
              {editCertificate.image && <img src={editCertificate.image} alt="" className="mt-2 rounded-lg max-h-32 mx-auto" />}
            </Field>
            <button type="submit" disabled={editCertificateLoading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${editCertificateLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg'}`}>
              {editCertificateLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Add Blog ── */}
      {showBlogModal && (
        <Modal title="Yeni Blog Ekle" onClose={() => setShowBlogModal(false)}>
          {addBlogError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{addBlogError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setAddBlogLoading(true); setAddBlogError('');
            if (!newBlog.title) { setAddBlogError('Başlık zorunlu!'); setAddBlogLoading(false); return; }
            let imageUrl = null;
            try {
              if (newBlog.image) {
                const webp = await convertToWebP(newBlog.image);
                const { data: d, error: e2 } = await uploadBlogImage(webp);
                if (e2) throw e2;
                imageUrl = d.publicUrl;
              }
              const { error } = await addBlog({ title: newBlog.title, summary: newBlog.summary, content: newBlog.content, tags: newBlog.tags, is_external: newBlog.is_external, external_url: newBlog.external_url, image: imageUrl, published_at: newBlog.published_at || null });
              if (error) throw error;
              setShowBlogModal(false); setNewBlog(emptyBlog); setBlogImagePreview(null); fetchData();
            } catch (err) { setAddBlogError('Eklenemedi: ' + (err.message || err)); }
            finally { setAddBlogLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required>
              <input type="text" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} required className={inputCls} placeholder="Blog başlığı" />
            </Field>
            <Field label="Özet">
              <textarea value={newBlog.summary} onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })} className={`${inputCls} resize-none`} rows={2} placeholder="Kısa özet" />
            </Field>
            <Field label="İçerik">
              <RichEditor key="new-blog" value={newBlog.content} onChange={(v) => setNewBlog({ ...newBlog, content: v })} />
            </Field>
            <Field label="Etiketler" hint="Yazıp Enter'a basarak ekleyin">
              <TagInput tags={newBlog.tags} onChange={(t) => setNewBlog({ ...newBlog, tags: t })} placeholder="React, Supabase..." />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newBlog.is_external} onChange={(e) => setNewBlog({ ...newBlog, is_external: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/40" />
              <span className="text-sm font-medium text-gray-700">Dış bağlantı (Medium vb.)</span>
            </label>
            {newBlog.is_external && (
              <Field label="External URL">
                <input type="url" value={newBlog.external_url} onChange={(e) => setNewBlog({ ...newBlog, external_url: e.target.value })} className={inputCls} placeholder="https://medium.com/..." />
              </Field>
            )}
            <Field label="Yayın Tarihi">
              <input type="date" value={newBlog.published_at} onChange={(e) => setNewBlog({ ...newBlog, published_at: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Kapak Görseli">
              <input type="file" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                setNewBlog({ ...newBlog, image: f });
                setBlogImagePreview(f ? URL.createObjectURL(f) : null);
              }} className={inputCls} />
              {blogImagePreview && <img src={blogImagePreview} alt="Önizleme" className="mt-2 rounded-lg max-h-32 mx-auto" />}
            </Field>
            <button type="submit" disabled={addBlogLoading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${addBlogLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg'}`}>
              {addBlogLoading ? 'Ekleniyor...' : 'Blogu Yayınla'}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Edit Blog ── */}
      {editBlog && (
        <Modal title="Blogu Düzenle" onClose={() => { setEditBlog(null); setEditBlogError(''); }}>
          {editBlogError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{editBlogError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setEditBlogLoading(true); setEditBlogError('');
            if (!editBlog.title) { setEditBlogError('Başlık zorunlu!'); setEditBlogLoading(false); return; }
            try {
              let imageUrl = editBlog.image;
              if (editBlog.newImage) {
                const webp = await convertToWebP(editBlog.newImage);
                const { data: d, error: e2 } = await uploadBlogImage(webp);
                if (e2) throw e2;
                imageUrl = d.publicUrl;
              }
              const { error } = await updateBlog(editBlog.id, { title: editBlog.title, summary: editBlog.summary, content: editBlog.content, tags: ensureArray(editBlog.tags), is_external: editBlog.is_external, external_url: editBlog.external_url, image: imageUrl, published_at: editBlog.published_at || null });
              if (error) throw error;
              setEditBlog(null); fetchData();
            } catch (err) { setEditBlogError('Güncellenemedi: ' + (err.message || err)); }
            finally { setEditBlogLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required>
              <input type="text" value={editBlog.title} onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })} required className={inputCls} />
            </Field>
            <Field label="Özet">
              <textarea value={editBlog.summary || ''} onChange={(e) => setEditBlog({ ...editBlog, summary: e.target.value })} className={`${inputCls} resize-none`} rows={2} />
            </Field>
            <Field label="İçerik">
              <RichEditor key={editBlog.id} value={editBlog.content || ''} onChange={(v) => setEditBlog({ ...editBlog, content: v })} />
            </Field>
            <Field label="Etiketler" hint="Yazıp Enter'a basarak ekleyin">
              <TagInput tags={ensureArray(editBlog.tags)} onChange={(t) => setEditBlog({ ...editBlog, tags: t })} />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!editBlog.is_external} onChange={(e) => setEditBlog({ ...editBlog, is_external: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/40" />
              <span className="text-sm font-medium text-gray-700">Dış bağlantı (Medium vb.)</span>
            </label>
            {editBlog.is_external && (
              <Field label="External URL">
                <input type="url" value={editBlog.external_url || ''} onChange={(e) => setEditBlog({ ...editBlog, external_url: e.target.value })} className={inputCls} />
              </Field>
            )}
            <Field label="Yayın Tarihi">
              <input type="date" value={editBlog.published_at ? editBlog.published_at.substring(0, 10) : ''} onChange={(e) => setEditBlog({ ...editBlog, published_at: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Kapak Görseli">
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) setEditBlog({ ...editBlog, newImage: f }); }} className={inputCls} />
              {editBlog.image && <img src={editBlog.image} alt="" className="mt-2 rounded-lg max-h-32 mx-auto" />}
            </Field>
            <button type="submit" disabled={editBlogLoading}
              className={`w-full py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${editBlogLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-lg'}`}>
              {editBlogLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
