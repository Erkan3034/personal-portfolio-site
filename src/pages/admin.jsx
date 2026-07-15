import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  signIn, signOut, getCurrentUser,
  getProjects, getCertificates, getBlogs,
  addProject, addCertificate, addBlog,
  deleteProject, deleteCertificate, deleteBlog,
  uploadProjectImage, uploadCertificateImage, uploadBlogImage,
  updateProject, updateCertificate, updateBlog,
} from '../lib/supabase';

const slugify = (text) => {
  if (!text) return '';
  const trMap = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
  return text.toString().toLowerCase()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => trMap[m])
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

/* ─── Icons ─── */
const Ico = {
  Folder: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h3.5L10 7h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>,
  Badge: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Doc: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Kaggle: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2M8 4v2m8-2v2m-4 2v8m0 0l-3-3m3 3l3-3"/></svg>,
  Logout: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Edit: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Search: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Home: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Check: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  X: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Warn: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Plus: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Refresh: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Link: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Menu: (p) => <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Star: (p) => <svg {...p} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
};

/* ─── TagInput ─── */
const TagInput = ({ tags = [], onChange, placeholder = 'Yazıp Enter\'a basın...' }) => {
  const [input, setInput] = useState('');
  const add = () => { const t = input.trim(); if (t && !tags.includes(t)) onChange([...tags, t]); setInput(''); };
  const remove = (i) => onChange(tags.filter((_, idx) => idx !== i));
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
    if (e.key === 'Backspace' && !input && tags.length) remove(tags.length - 1);
  };
  return (
    <div className="w-full min-h-[42px] px-3 py-2 border border-white/10 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 bg-surface-2 transition-all">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {tag}
            <button type="button" onClick={() => remove(i)} className="text-primary/50 hover:text-red-400 transition-colors ml-0.5 font-bold leading-none cursor-pointer">&times;</button>
          </span>
        ))}
        <input type="text" value={input}
          onChange={(e) => setInput(e.target.value.replace(',', ''))}
          onKeyDown={onKey} onBlur={() => { if (input.trim()) add(); }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent py-0.5 text-gray-200 placeholder-gray-600" />
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
  { type: 'link', label: '⛓ Link', title: 'Bağlantı Ekle', cls: 'text-xs' },
  { type: 'code', label: '</> Kod', title: 'Kod Bloğu Ekle', cls: 'text-xs font-mono' },
  { type: 'sep' },
  { type: 'image', label: '⬆ Görsel', title: 'İçine Görsel Ekle', cls: 'text-xs' },
];

const RichEditor = ({ value, onChange, onImageUpload }) => {
  const editorRef = useRef(null);
  const imgInputRef = useRef(null);
  const [source, setSource] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [selImg, setSelImg] = useState(null);

  useEffect(() => {
    if (editorRef.current && !source) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
        setSelImg(null);
      }
    }
  }, [value, source]);

  const exec = (cmd, val = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current.innerHTML);
  };

  /* Görsel seçim / deseçim */
  const selectImg = (img) => {
    if (selImg && selImg !== img) selImg.style.outline = '';
    img.style.outline = '2px solid #22C55E';
    img.style.outlineOffset = '3px';
    setSelImg(img);
  };

  const deselectImg = () => {
    if (selImg) { selImg.style.outline = ''; selImg.style.outlineOffset = ''; }
    setSelImg(null);
  };

  const handleEditorClick = (e) => {
    if (e.target.tagName === 'IMG') { selectImg(e.target); }
    else { deselectImg(); }
  };

  /* Görsel yükleme + DOM'a doğru cursor konumlaması */
  const handleImageFile = async (file) => {
    if (!file || !onImageUpload) return;
    setImgUploading(true);
    try {
      const url = await onImageUpload(file);
      if (!url) return;

      editorRef.current.focus();

      const figure = document.createElement('figure');
      figure.style.cssText = 'margin:16px auto;text-align:center;';

      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.style.cssText = 'width:100%;max-width:100%;border-radius:10px;display:inline-block;';
      figure.appendChild(img);

      /* cursor'u taşıyacak boş paragraf */
      const after = document.createElement('p');
      after.appendChild(document.createElement('br'));

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.collapse(false);
        range.insertNode(after);
        range.insertNode(figure);

        /* cursor'u figure'dan sonraki <p>'ye taşı */
        const newRange = document.createRange();
        newRange.setStart(after, 0);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      } else {
        editorRef.current.appendChild(figure);
        editorRef.current.appendChild(after);
      }

      onChange(editorRef.current.innerHTML);
    } finally {
      setImgUploading(false);
      if (imgInputRef.current) imgInputRef.current.value = '';
    }
  };

  /* Seçili görselin boyutu */
  const setImgWidth = (w) => {
    if (!selImg) return;
    selImg.style.width = w;
    onChange(editorRef.current.innerHTML);
  };

  /* Seçili görselin hizası */
  const setImgAlign = (align) => {
    if (!selImg) return;
    const fig = selImg.closest('figure') || selImg.parentElement;
    if (fig) fig.style.textAlign = align;
    onChange(editorRef.current.innerHTML);
  };

  /* Seçili görseli sil */
  const deleteSelImg = () => {
    if (!selImg) return;
    const fig = selImg.closest('figure') || selImg.parentElement;
    (fig?.tagName === 'FIGURE' ? fig : selImg).remove();
    setSelImg(null);
    onChange(editorRef.current.innerHTML);
  };

  const insertCodeBlock = () => {
    editorRef.current.focus();
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.appendChild(document.createTextNode('​'));
    pre.appendChild(code);
    const after = document.createElement('p');
    after.appendChild(document.createElement('br'));
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.collapse(false);
      range.insertNode(after);
      range.insertNode(pre);
      const newRange = document.createRange();
      newRange.setStart(code, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      editorRef.current.appendChild(pre);
      editorRef.current.appendChild(after);
    }
    onChange(editorRef.current.innerHTML);
  };

  const btn = 'h-7 px-2 flex items-center justify-center rounded text-gray-400 hover:bg-white/10 hover:text-gray-100 transition-colors cursor-pointer select-none text-sm';
  const ibtn = (active) => `h-6 px-2 rounded text-xs font-medium cursor-pointer transition-colors select-none ${active ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'}`;

  const curW = selImg?.style.width;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all">

      {/* Ana toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-surface border-b border-white/10">
        {!source && TOOLBAR.map((t, i) => {
          if (t.type === 'sep') return <div key={i} className="w-px h-5 bg-white/10 mx-0.5" />;
          if (t.type === 'link') return (
            <button key={i} type="button" title={t.title} className={`${btn} ${t.cls || ''}`}
              onClick={() => { const url = prompt('URL girin:'); if (url) exec('createLink', url); }}>{t.label}</button>
          );
          if (t.type === 'code') return (
            <button key={i} type="button" title={t.title} className={`${btn} ${t.cls || ''}`}
              onClick={insertCodeBlock}>{t.label}</button>
          );
          if (t.type === 'image') return (
            <span key={i}>
              <button type="button" title={t.title}
                className={`${btn} ${t.cls || ''} ${imgUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={imgUploading || !onImageUpload}
                onClick={() => imgInputRef.current?.click()}>
                {imgUploading ? 'Yükleniyor...' : t.label}
              </button>
              <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            </span>
          );
          return <button key={i} type="button" title={t.title} className={`${btn} ${t.cls || ''}`} onClick={() => exec(t.cmd, t.val)}>{t.label}</button>;
        })}
        <button type="button" onClick={() => { setSource(!source); deselectImg(); }}
          className={`ml-auto h-7 px-2 rounded text-xs font-mono cursor-pointer transition-colors ${source ? 'bg-white/10 text-primary' : 'text-gray-500 hover:bg-white/10 hover:text-gray-300'}`} title="HTML kaynağı">{'</>'}</button>
      </div>

      {/* Görsel kontrol toolbar'ı — sadece seçili görsel varken */}
      {selImg && !source && (
        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-primary/[0.04] border-b border-primary/10">
          <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wide mr-0.5">Boyut</span>
          <button type="button" onClick={() => setImgWidth('30%')} className={ibtn(curW === '30%')}>S</button>
          <button type="button" onClick={() => setImgWidth('55%')} className={ibtn(curW === '55%')}>M</button>
          <button type="button" onClick={() => setImgWidth('80%')} className={ibtn(curW === '80%')}>L</button>
          <button type="button" onClick={() => setImgWidth('100%')} className={ibtn(!curW || curW === '100%')}>Tam</button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wide mr-0.5">Hizala</span>
          <button type="button" onClick={() => setImgAlign('left')} title="Sola hizala" className={ibtn(false)}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h12" /></svg>
          </button>
          <button type="button" onClick={() => setImgAlign('center')} title="Ortala" className={ibtn(false)}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M6 18h12" /></svg>
          </button>
          <button type="button" onClick={() => setImgAlign('right')} title="Sağa hizala" className={ibtn(false)}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M8 18h12" /></svg>
          </button>
          <button type="button" onClick={deleteSelImg}
            className="ml-auto h-6 px-2 rounded text-xs text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors">
            Görseli Kaldır
          </button>
        </div>
      )}

      {/* Editor alanı */}
      {source ? (
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 min-h-[220px] outline-none font-mono text-sm resize-y bg-[#0a0a0c] text-primary" spellCheck={false} />
      ) : (
        <div ref={editorRef} contentEditable suppressContentEditableWarning
          onClick={handleEditorClick}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className="min-h-[220px] p-3 outline-none text-sm leading-relaxed text-gray-200 bg-surface-2
            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:text-white
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:text-white
            [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-400
            [&_pre]:bg-black/40 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:my-2 [&_pre]:border [&_pre]:border-white/10 [&_pre]:overflow-x-auto
            [&_code]:font-mono [&_code]:text-sm [&_code]:text-green-300
            [&_a]:text-primary [&_a]:underline
            [&_figure]:my-4 [&_figure]:text-center [&_img]:rounded-xl [&_img]:max-w-full [&_img]:inline-block [&_img]:transition-all" />
      )}
    </div>
  );
};

/* ─── Toast system ─── */
const ToastContainer = ({ toasts, remove }) => (
  <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div key={t.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium backdrop-blur-sm max-w-xs
            ${t.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' : t.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-300' : 'bg-surface border-white/10 text-gray-300'}`}>
          <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${t.type === 'success' ? 'bg-emerald-500/20' : t.type === 'error' ? 'bg-red-500/20' : 'bg-white/10'}`}>
            {t.type === 'success' ? <Ico.Check className="w-3 h-3" /> : <Ico.X className="w-3 h-3" />}
          </span>
          <span className="flex-1">{t.msg}</span>
          <button onClick={() => remove(t.id)} className="text-current opacity-50 hover:opacity-100 cursor-pointer"><Ico.X className="w-3.5 h-3.5" /></button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

/* ─── Confirm Modal ─── */
const ConfirmModal = ({ confirm, onCancel, onConfirm }) => {
  if (!confirm) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <Ico.Warn className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="font-semibold text-gray-100 text-lg">{confirm.title}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6 ml-[52px]">{confirm.msg}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors cursor-pointer">İptal</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer">Sil</button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Modal ─── */
const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-surface border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} relative my-4`}>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <h2 className="text-lg font-bold text-gray-100">{title}</h2>
        <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"><Ico.X className="w-4 h-4" /></button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin">{children}</div>
    </motion.div>
  </div>
);

/* ─── Field ─── */
const Field = ({ label, required, hint, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
  </div>
);

const inputCls = 'w-full px-3 py-2.5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all outline-none text-sm bg-surface-2 text-gray-200 placeholder-gray-600';

/* ─── Badge ─── */
const Badge = ({ children, color = 'gray' }) => {
  const c = { green: 'bg-primary/10 text-primary border-primary/20', blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20', gray: 'bg-white/5 text-gray-400 border-white/10', yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20', purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${c[color] || c.gray}`}>{children}</span>;
};

/* ─── Image Upload ─── */
const ImageUpload = ({ value, preview, onChange, onClear }) => (
  <div>
    <label className={`flex flex-col items-center gap-2 w-full border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${preview ? 'border-primary/30 bg-primary/5' : 'border-white/10 bg-surface-2 hover:border-white/20'}`}>
      {preview ? (
        <div className="relative w-full">
          <img src={preview} alt="Önizleme" className="rounded-lg max-h-36 mx-auto object-cover" />
          <button type="button" onClick={(e) => { e.preventDefault(); onClear?.(); }}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors cursor-pointer">
            <Ico.X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <span className="text-sm text-gray-500"><span className="text-primary font-medium">Dosya seç</span> veya sürükle</span>
          <span className="text-xs text-gray-600">PNG, JPG, WEBP</span>
        </>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
    {value && typeof value === 'string' && !preview && (
      <img src={value} alt="" className="mt-2 rounded-lg max-h-24 mx-auto opacity-60" />
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════ Admin ═══ */
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
  const [search, setSearch] = useState('');

  /* toasts */
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  /* confirm */
  const [confirm, setConfirm] = useState(null);
  const askConfirm = (title, msg, onOk) => setConfirm({ title, msg, onOk });

  /* ─── form state ─── */
  const emptyProject = { title: '', description: '', technologies: [], github_url: '', live_url: '', project_date: '', featured: false, image: null };
  const emptyCert = { title: '', issuer: '', description: '', certificate_date: '', certificate_url: '', image: null };
  const emptyBlog = { title: '', summary: '', content: '', tags: [], is_external: false, blog_type: 'blog', external_url: '', kaggle_notebook_id: '', image: null, published_at: '' };

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
  const [certImagePreview, setCertImagePreview] = useState(null);
  const [addCertLoading, setAddCertLoading] = useState(false);
  const [addCertError, setAddCertError] = useState('');
  const [editCertificate, setEditCertificate] = useState(null);
  const [editCertLoading, setEditCertLoading] = useState(false);
  const [editCertError, setEditCertError] = useState('');

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState(emptyBlog);
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [addBlogLoading, setAddBlogLoading] = useState(false);
  const [addBlogError, setAddBlogError] = useState('');
  const [editBlog, setEditBlog] = useState(null);
  const [editBlogLoading, setEditBlogLoading] = useState(false);
  const [editBlogError, setEditBlogError] = useState('');

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const [p, c, b] = await Promise.all([getProjects(), getCertificates(), getBlogs()]);
      setProjects(p.data || []);
      setCertificates(c.data || []);
      setBlogs(b.data || []);
    } catch (err) { console.error('Veri yükleme hatası:', err); }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const u = await getCurrentUser();
      if (u) { setUser(u); setShowLogin(false); fetchData(); }
      else setShowLogin(true);
    } catch { setShowLogin(true); }
    finally { setLoading(false); }
  }, [fetchData]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true); setLoginError('');
    try {
      const { data, error } = await signIn(loginData.email, loginData.password);
      if (error) throw error;
      setUser(data.user); setShowLogin(false); fetchData();
    } catch { setLoginError('Giriş başarısız. E-posta ve şifrenizi kontrol edin.'); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = async () => {
    try { await signOut(); setUser(null); setShowLogin(true); navigate('/'); }
    catch (err) { console.error('Çıkış hatası:', err); }
  };

  const handleDelete = (label, fn) => (id) => {
    askConfirm(`${label} Sil`, `Bu ${label.toLowerCase()}ı kalıcı olarak silmek istediğine emin misin? Bu işlem geri alınamaz.`, async () => {
      setConfirm(null);
      try { await fn(id); fetchData(); toast(`${label} silindi.`); }
      catch (err) { toast('Silme hatası: ' + (err.message || err), 'error'); }
    });
  };

  const handleDeleteProject = handleDelete('Proje', deleteProject);
  const handleDeleteCert = handleDelete('Sertifika', deleteCertificate);
  const handleDeleteBlog = handleDelete('Blog', deleteBlog);

  const convertToWebP = (file) => new Promise((resolve, reject) => {
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

  /* filtered lists */
  const q = search.toLowerCase();
  const filteredProjects = projects.filter((p) => !q || p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || ensureArray(p.technologies).some((t) => t.toLowerCase().includes(q)));
  const filteredCerts = certificates.filter((c) => !q || c.title?.toLowerCase().includes(q) || c.issuer?.toLowerCase().includes(q));
  const filteredBlogs = blogs.filter((b) => !q || b.title?.toLowerCase().includes(q) || b.summary?.toLowerCase().includes(q) || ensureArray(b.tags).some((t) => t.toLowerCase().includes(q)));

  const tabs = [
    { id: 'projects', label: 'Projeler', Icon: Ico.Folder, count: projects.length },
    { id: 'certificates', label: 'Sertifikalar', Icon: Ico.Badge, count: certificates.length },
    { id: 'blogs', label: 'Blog', Icon: Ico.Doc, count: blogs.length },
  ];

  /* ─── Loading ─── */
  if (loading) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto mb-3" />
        <p className="text-gray-600 text-sm">Yükleniyor...</p>
      </div>
    </div>
  );

  /* ─── Login ─── */
  if (showLogin) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-100 font-display">Admin Paneli</h1>
          <p className="text-gray-500 text-sm mt-1">Devam etmek için giriş yapın</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl">
          {loginError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <Ico.Warn className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{loginError}</p>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="E-posta">
              <input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required className={inputCls} placeholder="admin@example.com" autoFocus />
            </Field>
            <Field label="Şifre">
              <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required className={inputCls} placeholder="••••••••" />
            </Field>
            <button type="submit" disabled={loginLoading}
              className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer mt-2 ${loginLoading ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90 shadow-lg shadow-primary/20'}`}>
              {loginLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
        <div className="mt-4 text-center">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-400 text-sm transition-colors cursor-pointer">← Ana sayfaya dön</button>
        </div>
      </motion.div>
    </div>
  );

  /* ─── Main Panel ─── */
  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-canvas">

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex fixed top-0 left-0 w-64 h-screen bg-surface border-r border-white/[0.06] z-40 flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-bold font-mono">ET</span>
            </div>
            <div>
              <p className="text-gray-100 text-sm font-semibold leading-none">Admin Panel</p>
              <p className="text-gray-600 text-xs mt-0.5 truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-gray-700 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">İçerik</p>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer group ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
              <tab.Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{tab.label}</span>
              <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-600'}`}>{tab.count}</span>
            </button>
          ))}

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-gray-700 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">Özet</p>
            <div className="grid grid-cols-3 gap-2 px-1">
              {[
                { label: 'Proje', val: projects.length, color: 'text-primary' },
                { label: 'Sert.', val: certificates.length, color: 'text-blue-400' },
                { label: 'Blog', val: blogs.length, color: 'text-amber-400' },
              ].map((s) => (
                <div key={s.label} className="bg-surface-2 rounded-lg p-2 text-center border border-white/5">
                  <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-gray-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all cursor-pointer">
            <Ico.Home className="w-4 h-4" /> Siteye Git
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer">
            <Ico.Logout className="w-4 h-4" /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary text-[10px] font-bold font-mono">ET</span>
          </div>
          <span className="text-gray-200 text-sm font-semibold">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
            <Ico.Home className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
            <Ico.Logout className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Mobile Tabs ── */}
      <div className="lg:hidden flex border-b border-white/[0.06] bg-surface/80 backdrop-blur sticky top-[53px] z-20">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors cursor-pointer ${activeTab === tab.id ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-300'}`}>
            <tab.Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="lg:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Page Header */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 font-display">{activeTabData?.label}</h1>
              <p className="text-gray-600 text-sm mt-0.5">
                {activeTab === 'projects' ? filteredProjects.length : activeTab === 'certificates' ? filteredCerts.length : filteredBlogs.length} kayıt
                {search && <span className="ml-1 text-primary">"{search}" için</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-56">
                <Ico.Search className="w-4 h-4 text-gray-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara..."
                  className="w-full pl-9 pr-3 py-2 bg-surface border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-600 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />
              </div>
              {/* Refresh */}
              <button onClick={fetchData} className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-white/10 transition-colors cursor-pointer" title="Yenile">
                <Ico.Refresh className="w-4 h-4" />
              </button>
              {/* Add button */}
              {activeTab === 'projects' && (
                <button onClick={() => { setShowProjectModal(true); setNewProject(emptyProject); setImagePreview(null); setAddError(''); }}
                  className="flex items-center gap-1.5 bg-primary text-canvas px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold cursor-pointer shadow-lg shadow-primary/10 whitespace-nowrap">
                  <Ico.Plus className="w-3.5 h-3.5" /> Proje Ekle
                </button>
              )}
              {activeTab === 'certificates' && (
                <button onClick={() => { setShowCertificateModal(true); setNewCertificate(emptyCert); setCertImagePreview(null); setAddCertError(''); }}
                  className="flex items-center gap-1.5 bg-primary text-canvas px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold cursor-pointer shadow-lg shadow-primary/10 whitespace-nowrap">
                  <Ico.Plus className="w-3.5 h-3.5" /> Sertifika Ekle
                </button>
              )}
              {activeTab === 'blogs' && (
                <button onClick={() => { setShowBlogModal(true); setNewBlog(emptyBlog); setBlogImagePreview(null); setAddBlogError(''); }}
                  className="flex items-center gap-1.5 bg-primary text-canvas px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold cursor-pointer shadow-lg shadow-primary/10 whitespace-nowrap">
                  <Ico.Plus className="w-3.5 h-3.5" /> Blog Ekle
                </button>
              )}
            </div>
          </motion.div>

          {/* ── Projects List ── */}
          {activeTab === 'projects' && (
            <div className="space-y-2">
              {filteredProjects.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="group bg-surface border border-white/[0.06] rounded-xl p-4 hover:border-white/10 hover:bg-surface-2/50 transition-all">
                  <div className="flex gap-3 sm:gap-4">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 hidden sm:block ring-1 ring-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-surface-2 border border-white/10 flex items-center justify-center shrink-0 hidden sm:flex">
                        <Ico.Folder className="w-6 h-6 text-gray-700" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-100 text-sm truncate">{p.title}</h3>
                            {p.featured && <Badge color="yellow"><Ico.Star className="w-2.5 h-2.5 inline mr-0.5" />Öne Çıkan</Badge>}
                          </div>
                          {p.description && <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{p.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(p.github_url || p.live_url) && (
                            <a href={p.live_url || p.github_url} target="_blank" rel="noreferrer"
                              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
                              <Ico.Link className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button onClick={() => setEditProject({ ...p, technologies: ensureArray(p.technologies) })}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
                            <Ico.Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteProject(p.id)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                            <Ico.Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {ensureArray(p.technologies).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ensureArray(p.technologies).map((t) => <Badge key={t} color="green">{t}</Badge>)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredProjects.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Ico.Folder className="w-7 h-7 text-gray-700" />
                  </div>
                  <p className="text-gray-600 text-sm">{search ? `"${search}" için sonuç bulunamadı.` : 'Henüz proje eklenmedi.'}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Certificates List ── */}
          {activeTab === 'certificates' && (
            <div className="space-y-2">
              {filteredCerts.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="group bg-surface border border-white/[0.06] rounded-xl p-4 hover:border-white/10 hover:bg-surface-2/50 transition-all">
                  <div className="flex gap-3 sm:gap-4">
                    {c.image ? (
                      <img src={c.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 hidden sm:block ring-1 ring-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-surface-2 border border-white/10 flex items-center justify-center shrink-0 hidden sm:flex">
                        <Ico.Badge className="w-6 h-6 text-gray-700" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-100 text-sm truncate">{c.title}</h3>
                          {c.issuer && <p className="text-gray-500 text-xs mt-0.5">{c.issuer}</p>}
                          {c.certificate_date && <p className="text-gray-700 text-xs mt-0.5">{new Date(c.certificate_date).toLocaleDateString('tr-TR')}</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {c.certificate_url && (
                            <a href={c.certificate_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
                              <Ico.Link className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button onClick={() => setEditCertificate(c)} className="p-1.5 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
                            <Ico.Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteCert(c.id)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                            <Ico.Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredCerts.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Ico.Badge className="w-7 h-7 text-gray-700" />
                  </div>
                  <p className="text-gray-600 text-sm">{search ? `"${search}" için sonuç bulunamadı.` : 'Henüz sertifika eklenmedi.'}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Blogs List ── */}
          {activeTab === 'blogs' && (
            <div className="space-y-2">
              {filteredBlogs.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="group bg-surface border border-white/[0.06] rounded-xl p-4 hover:border-white/10 hover:bg-surface-2/50 transition-all">
                  <div className="flex gap-3 sm:gap-4">
                    {b.image ? (
                      <img src={b.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 hidden sm:block ring-1 ring-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-surface-2 border border-white/10 flex items-center justify-center shrink-0 hidden sm:flex">
                        <Ico.Doc className="w-6 h-6 text-gray-700" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-100 text-sm truncate">{b.title}</h3>
                            <Badge color={b.kaggle_notebook_id ? 'purple' : b.is_external ? 'blue' : 'green'}>{b.kaggle_notebook_id ? 'Kaggle' : b.is_external ? 'External' : 'Site İçi'}</Badge>
                          </div>
                          {b.summary && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{b.summary}</p>}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {b.published_at && <span className="text-gray-700 text-xs">{new Date(b.published_at).toLocaleDateString('tr-TR')}</span>}
                            {ensureArray(b.tags).slice(0, 3).map((t) => <Badge key={t}>{t}</Badge>)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(b.is_external && b.external_url) || b.kaggle_notebook_id ? (
                            <a href={b.kaggle_notebook_id ? `https://www.kaggle.com/${b.kaggle_notebook_id}` : b.external_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">
                              <Ico.Link className="w-3.5 h-3.5" />
                            </a>
                          ) : null}
                          <button onClick={() => {
                            const inferredType = b.kaggle_notebook_id ? 'kaggle' : b.is_external ? 'medium' : 'blog';
                            setEditBlog({ ...b, tags: ensureArray(b.tags), blog_type: inferredType });
                          }}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer">
                            <Ico.Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteBlog(b.id)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                            <Ico.Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredBlogs.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Ico.Doc className="w-7 h-7 text-gray-700" />
                  </div>
                  <p className="text-gray-600 text-sm">{search ? `"${search}" için sonuç bulunamadı.` : 'Henüz blog eklenmedi.'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════ MODALS ════ */}

      {/* Add Project */}
      {showProjectModal && (
        <Modal title="Yeni Proje Ekle" onClose={() => setShowProjectModal(false)}>
          {addError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex gap-2"><Ico.Warn className="w-4 h-4 shrink-0 mt-0.5" />{addError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault(); setAddLoading(true); setAddError('');
            if (!newProject.title) { setAddError('Başlık zorunlu!'); setAddLoading(false); return; }
            let imageUrl = null;
            try {
              if (newProject.image) { const { data: d, error: e2 } = await uploadProjectImage(newProject.image); if (e2) throw e2; imageUrl = d.publicUrl; }
              const { error } = await addProject({ ...newProject, image: imageUrl });
              if (error) throw error;
              setShowProjectModal(false); setNewProject(emptyProject); setImagePreview(null); fetchData(); toast('Proje başarıyla eklendi!');
            } catch (err) { setAddError('Proje eklenemedi: ' + (err.message || err)); }
            finally { setAddLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required><input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required className={inputCls} placeholder="Proje başlığı" autoFocus /></Field>
            <Field label="Açıklama"><textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="Proje açıklaması" /></Field>
            <Field label="Teknolojiler" hint="Yazıp Enter'a basarak ekleyin"><TagInput tags={newProject.technologies} onChange={(t) => setNewProject({ ...newProject, technologies: t })} placeholder="React, Node.js..." /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GitHub URL"><input type="url" value={newProject.github_url} onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })} className={inputCls} placeholder="https://github.com/..." /></Field>
              <Field label="Canlı Demo"><input type="url" value={newProject.live_url} onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })} className={inputCls} placeholder="https://..." /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Proje Tarihi"><input type="date" value={newProject.project_date} onChange={(e) => setNewProject({ ...newProject, project_date: e.target.value })} className={inputCls} /></Field>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newProject.featured} onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-surface-2 text-primary focus:ring-primary/40" />
                  <span className="text-sm font-medium text-gray-300">Öne Çıkan</span>
                </label>
              </div>
            </div>
            <Field label="Görsel">
              <ImageUpload preview={imagePreview} onChange={(e) => { const f = e.target.files[0]; setNewProject({ ...newProject, image: f }); setImagePreview(f ? URL.createObjectURL(f) : null); }} onClear={() => { setNewProject({ ...newProject, image: null }); setImagePreview(null); }} />
            </Field>
            <button type="submit" disabled={addLoading} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${addLoading ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90 shadow-lg shadow-primary/10'}`}>
              {addLoading ? 'Ekleniyor...' : 'Projeyi Ekle'}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Project */}
      {editProject && (
        <Modal title="Projeyi Düzenle" onClose={() => { setEditProject(null); setEditError(''); }}>
          {editError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex gap-2"><Ico.Warn className="w-4 h-4 shrink-0 mt-0.5" />{editError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault(); setEditLoading(true); setEditError('');
            if (!editProject.title) { setEditError('Başlık zorunlu!'); setEditLoading(false); return; }
            try {
              const { error } = await updateProject(editProject.id, { title: editProject.title, description: editProject.description, technologies: editProject.technologies, github_url: editProject.github_url, live_url: editProject.live_url, project_date: editProject.project_date, featured: editProject.featured, image: editProject.image });
              if (error) throw error;
              setEditProject(null); fetchData(); toast('Proje güncellendi!');
            } catch (err) { setEditError('Güncellenemedi: ' + (err.message || err)); }
            finally { setEditLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required><input type="text" value={editProject.title} onChange={(e) => setEditProject({ ...editProject, title: e.target.value })} required className={inputCls} /></Field>
            <Field label="Açıklama"><textarea value={editProject.description || ''} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} /></Field>
            <Field label="Teknolojiler" hint="Yazıp Enter'a basarak ekleyin"><TagInput tags={ensureArray(editProject.technologies)} onChange={(t) => setEditProject({ ...editProject, technologies: t })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="GitHub URL"><input type="url" value={editProject.github_url || ''} onChange={(e) => setEditProject({ ...editProject, github_url: e.target.value })} className={inputCls} /></Field>
              <Field label="Canlı Demo"><input type="url" value={editProject.live_url || ''} onChange={(e) => setEditProject({ ...editProject, live_url: e.target.value })} className={inputCls} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Proje Tarihi"><input type="date" value={editProject.project_date || ''} onChange={(e) => setEditProject({ ...editProject, project_date: e.target.value })} className={inputCls} /></Field>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!!editProject.featured} onChange={(e) => setEditProject({ ...editProject, featured: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-surface-2 text-primary focus:ring-primary/40" />
                  <span className="text-sm font-medium text-gray-300">Öne Çıkan</span>
                </label>
              </div>
            </div>
            <Field label="Görsel">
              <ImageUpload value={editProject.image} onChange={async (e) => {
                const f = e.target.files[0];
                if (f) { const { data: d, error: e2 } = await uploadProjectImage(f); if (e2) { setEditError('Görsel yüklenemedi: ' + e2.message); return; } setEditProject({ ...editProject, image: d.publicUrl }); }
              }} />
              {editProject.image && <img src={editProject.image} alt="" className="mt-2 rounded-lg max-h-28 mx-auto ring-1 ring-white/10" />}
            </Field>
            <button type="submit" disabled={editLoading} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${editLoading ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90 shadow-lg shadow-primary/10'}`}>
              {editLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </Modal>
      )}

      {/* Add Certificate */}
      {showCertificateModal && (
        <Modal title="Yeni Sertifika Ekle" onClose={() => setShowCertificateModal(false)}>
          {addCertError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex gap-2"><Ico.Warn className="w-4 h-4 shrink-0 mt-0.5" />{addCertError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault(); setAddCertLoading(true); setAddCertError('');
            if (!newCertificate.title) { setAddCertError('Başlık zorunlu!'); setAddCertLoading(false); return; }
            let imageUrl = null;
            try {
              if (newCertificate.image) { const { data: d, error: e2 } = await uploadCertificateImage(newCertificate.image); if (e2) throw e2; imageUrl = d.publicUrl; }
              const { error } = await addCertificate({ title: newCertificate.title, issuer: newCertificate.issuer, description: newCertificate.description, certificate_date: newCertificate.certificate_date, certificate_url: newCertificate.certificate_url, image: imageUrl });
              if (error) throw error;
              setShowCertificateModal(false); setNewCertificate(emptyCert); setCertImagePreview(null); fetchData(); toast('Sertifika başarıyla eklendi!');
            } catch (err) { setAddCertError('Eklenemedi: ' + (err.message || err)); }
            finally { setAddCertLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required><input type="text" value={newCertificate.title} onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })} required className={inputCls} placeholder="Sertifika başlığı" autoFocus /></Field>
            <Field label="Kurum"><input type="text" value={newCertificate.issuer} onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })} className={inputCls} placeholder="Veren kurum" /></Field>
            <Field label="Açıklama"><textarea value={newCertificate.description} onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} placeholder="Sertifika açıklaması" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tarih"><input type="date" value={newCertificate.certificate_date} onChange={(e) => setNewCertificate({ ...newCertificate, certificate_date: e.target.value })} className={inputCls} /></Field>
              <Field label="Sertifika URL"><input type="url" value={newCertificate.certificate_url} onChange={(e) => setNewCertificate({ ...newCertificate, certificate_url: e.target.value })} className={inputCls} placeholder="https://..." /></Field>
            </div>
            <Field label="Görsel">
              <ImageUpload preview={certImagePreview} onChange={(e) => { const f = e.target.files[0]; setNewCertificate({ ...newCertificate, image: f }); setCertImagePreview(f ? URL.createObjectURL(f) : null); }} onClear={() => { setNewCertificate({ ...newCertificate, image: null }); setCertImagePreview(null); }} />
            </Field>
            <button type="submit" disabled={addCertLoading} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${addCertLoading ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90 shadow-lg shadow-primary/10'}`}>
              {addCertLoading ? 'Ekleniyor...' : 'Sertifikayı Ekle'}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Certificate */}
      {editCertificate && (
        <Modal title="Sertifikayı Düzenle" onClose={() => { setEditCertificate(null); setEditCertError(''); }}>
          {editCertError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex gap-2"><Ico.Warn className="w-4 h-4 shrink-0 mt-0.5" />{editCertError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault(); setEditCertLoading(true); setEditCertError('');
            if (!editCertificate.title) { setEditCertError('Başlık zorunlu!'); setEditCertLoading(false); return; }
            try {
              let imageUrl = editCertificate.image;
              if (editCertificate.newImage) { const { data: d, error: e2 } = await uploadCertificateImage(editCertificate.newImage); if (e2) throw e2; imageUrl = d.publicUrl; }
              const { error } = await updateCertificate(editCertificate.id, { title: editCertificate.title, issuer: editCertificate.issuer, description: editCertificate.description, certificate_date: editCertificate.certificate_date, certificate_url: editCertificate.certificate_url, image: imageUrl });
              if (error) throw error;
              setEditCertificate(null); fetchData(); toast('Sertifika güncellendi!');
            } catch (err) { setEditCertError('Güncellenemedi: ' + (err.message || err)); }
            finally { setEditCertLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required><input type="text" value={editCertificate.title} onChange={(e) => setEditCertificate({ ...editCertificate, title: e.target.value })} required className={inputCls} /></Field>
            <Field label="Kurum"><input type="text" value={editCertificate.issuer || ''} onChange={(e) => setEditCertificate({ ...editCertificate, issuer: e.target.value })} className={inputCls} /></Field>
            <Field label="Açıklama"><textarea value={editCertificate.description || ''} onChange={(e) => setEditCertificate({ ...editCertificate, description: e.target.value })} className={`${inputCls} resize-none`} rows={3} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tarih"><input type="date" value={editCertificate.certificate_date || ''} onChange={(e) => setEditCertificate({ ...editCertificate, certificate_date: e.target.value })} className={inputCls} /></Field>
              <Field label="Sertifika URL"><input type="url" value={editCertificate.certificate_url || ''} onChange={(e) => setEditCertificate({ ...editCertificate, certificate_url: e.target.value })} className={inputCls} /></Field>
            </div>
            <Field label="Görsel">
              <ImageUpload onChange={(e) => { const f = e.target.files[0]; if (f) setEditCertificate({ ...editCertificate, newImage: f }); }} />
              {editCertificate.image && <img src={editCertificate.image} alt="" className="mt-2 rounded-lg max-h-28 mx-auto ring-1 ring-white/10" />}
            </Field>
            <button type="submit" disabled={editCertLoading} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${editCertLoading ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90 shadow-lg shadow-primary/10'}`}>
              {editCertLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </Modal>
      )}

      {/* Add Blog */}
      {showBlogModal && (
        <Modal title="Yeni Blog Ekle" onClose={() => setShowBlogModal(false)} wide>
          {addBlogError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex gap-2"><Ico.Warn className="w-4 h-4 shrink-0 mt-0.5" />{addBlogError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault(); setAddBlogLoading(true); setAddBlogError('');
            if (!newBlog.title) { setAddBlogError('Başlık zorunlu!'); setAddBlogLoading(false); return; }
            let imageUrl = null;
            try {
              if (newBlog.image) { const webp = await convertToWebP(newBlog.image); const { data: d, error: e2 } = await uploadBlogImage(webp); if (e2) throw e2; imageUrl = d.publicUrl; }
              const isKaggle = newBlog.blog_type === 'kaggle';
              const isMedium = newBlog.blog_type === 'medium';
              const getKaggleId = (code) => {
                const m = code?.match(/src="https:\/\/www\.kaggle\.com\/embed\/([^?"\s]+)/);
                return m ? m[1] : null;
              };
              const { error } = await addBlog({
                title: newBlog.title, slug: slugify(newBlog.title), summary: newBlog.summary,
                tags: newBlog.tags, image: imageUrl, published_at: newBlog.published_at || null,
                is_external: isMedium,
                external_url: isMedium ? newBlog.external_url : null,
                kaggle_notebook_id: isKaggle ? getKaggleId(newBlog.content) : null,
                content: isMedium ? null : newBlog.content,
              });
              if (error) throw error;
              setShowBlogModal(false); setNewBlog(emptyBlog); setBlogImagePreview(null); fetchData(); toast('Blog başarıyla yayınlandı!');
            } catch (err) { setAddBlogError('Eklenemedi: ' + (err.message || err)); }
            finally { setAddBlogLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required><input type="text" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} required className={inputCls} placeholder="Blog başlığı" autoFocus /></Field>
            <Field label="Özet"><textarea value={newBlog.summary} onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })} className={`${inputCls} resize-none`} rows={2} placeholder="Kısa özet" /></Field>
            <Field label="Etiketler" hint="Yazıp Enter'a basarak ekleyin"><TagInput tags={newBlog.tags} onChange={(t) => setNewBlog({ ...newBlog, tags: t })} placeholder="React, Supabase..." /></Field>

            {/* İçerik Türü */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">İçerik Türü</label>
              <div className="flex gap-2">
                {[
                  { id: 'blog', label: 'Blog Yazısı', icon: Ico.Doc },
                  { id: 'medium', label: 'Medium', icon: Ico.Link },
                  { id: 'kaggle', label: 'Kaggle Notebook', icon: Ico.Kaggle },
                ].map((t) => (
                  <button key={t.id} type="button" onClick={() => setNewBlog({ ...newBlog, blog_type: t.id })}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                      newBlog.blog_type === t.id ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface-2 text-gray-400 border-white/10 hover:border-white/20'
                    }`}>
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {newBlog.blog_type === 'blog' && (
              <Field label="İçerik"><RichEditor key="new-blog" value={newBlog.content} onChange={(v) => setNewBlog({ ...newBlog, content: v })} onImageUpload={async (file) => { const webp = await convertToWebP(file); const { data: d, error: e2 } = await uploadBlogImage(webp); if (e2) { toast('Görsel yüklenemedi.', 'error'); return null; } return d.publicUrl; }} /></Field>
            )}
            {newBlog.blog_type === 'medium' && (
              <Field label="Medium URL" hint="Medium'daki yazınızın tam bağlantısı">
                <input type="url" value={newBlog.external_url} onChange={(e) => setNewBlog({ ...newBlog, external_url: e.target.value })}
                  className={inputCls} placeholder="https://medium.com/..." />
              </Field>
            )}
            {newBlog.blog_type === 'kaggle' && (
              <Field label="Kaggle Embed Kodu" hint="Kaggle not defterinizden aldığınız iframe kodunu yapıştırın">
                <textarea rows={4} value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  className={`${inputCls} font-mono text-xs resize-y`} placeholder='<iframe src="https://www.kaggle.com/embed/..." ...>' />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Yayın Tarihi"><input type="date" value={newBlog.published_at} onChange={(e) => setNewBlog({ ...newBlog, published_at: e.target.value })} className={inputCls} /></Field>
            </div>
            <Field label="Kapak Görseli">
              <ImageUpload preview={blogImagePreview} onChange={(e) => { const f = e.target.files[0]; setNewBlog({ ...newBlog, image: f }); setBlogImagePreview(f ? URL.createObjectURL(f) : null); }} onClear={() => { setNewBlog({ ...newBlog, image: null }); setBlogImagePreview(null); }} />
            </Field>
            <button type="submit" disabled={addBlogLoading} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${addBlogLoading ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90 shadow-lg shadow-primary/10'}`}>
              {addBlogLoading ? 'Yayınlanıyor...' : 'Blogu Yayınla'}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit Blog */}
      {editBlog && (
        <Modal title="Blogu Düzenle" onClose={() => { setEditBlog(null); setEditBlogError(''); }} wide>
          {editBlogError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex gap-2"><Ico.Warn className="w-4 h-4 shrink-0 mt-0.5" />{editBlogError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault(); setEditBlogLoading(true); setEditBlogError('');
            if (!editBlog.title) { setEditBlogError('Başlık zorunlu!'); setEditBlogLoading(false); return; }
            try {
              let imageUrl = editBlog.image;
              if (editBlog.newImage) { const webp = await convertToWebP(editBlog.newImage); const { data: d, error: e2 } = await uploadBlogImage(webp); if (e2) throw e2; imageUrl = d.publicUrl; }
              const isKaggle = editBlog.blog_type === 'kaggle';
              const isMedium = editBlog.blog_type === 'medium';
              const getKaggleId = (code) => {
                const m = code?.match(/src="https:\/\/www\.kaggle\.com\/embed\/([^?"\s]+)/);
                return m ? m[1] : null;
              };
              const { error } = await updateBlog(editBlog.id, {
                title: editBlog.title, slug: slugify(editBlog.title), summary: editBlog.summary,
                tags: ensureArray(editBlog.tags), image: imageUrl, published_at: editBlog.published_at || null,
                is_external: isMedium,
                external_url: isMedium ? editBlog.external_url : null,
                kaggle_notebook_id: isKaggle ? getKaggleId(editBlog.content) : null,
                content: isMedium ? null : editBlog.content,
              });
              if (error) throw error;
              setEditBlog(null); fetchData(); toast('Blog güncellendi!');
            } catch (err) { setEditBlogError('Güncellenemedi: ' + (err.message || err)); }
            finally { setEditBlogLoading(false); }
          }} className="space-y-4">
            <Field label="Başlık" required><input type="text" value={editBlog.title} onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })} required className={inputCls} /></Field>
            <Field label="Özet"><textarea value={editBlog.summary || ''} onChange={(e) => setEditBlog({ ...editBlog, summary: e.target.value })} className={`${inputCls} resize-none`} rows={2} /></Field>
            <Field label="Etiketler" hint="Yazıp Enter'a basarak ekleyin"><TagInput tags={ensureArray(editBlog.tags)} onChange={(t) => setEditBlog({ ...editBlog, tags: t })} /></Field>

            {/* İçerik Türü */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">İçerik Türü</label>
              <div className="flex gap-2">
                {[
                  { id: 'blog', label: 'Blog Yazısı', icon: Ico.Doc },
                  { id: 'medium', label: 'Medium', icon: Ico.Link },
                  { id: 'kaggle', label: 'Kaggle Notebook', icon: Ico.Kaggle },
                ].map((t) => (
                  <button key={t.id} type="button" onClick={() => setEditBlog({ ...editBlog, blog_type: t.id })}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                      editBlog.blog_type === t.id ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surface-2 text-gray-400 border-white/10 hover:border-white/20'
                    }`}>
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {editBlog.blog_type === 'blog' && (
              <Field label="İçerik"><RichEditor key={editBlog.id} value={editBlog.content || ''} onChange={(v) => setEditBlog({ ...editBlog, content: v })} onImageUpload={async (file) => { const webp = await convertToWebP(file); const { data: d, error: e2 } = await uploadBlogImage(webp); if (e2) { toast('Görsel yüklenemedi.', 'error'); return null; } return d.publicUrl; }} /></Field>
            )}
            {editBlog.blog_type === 'medium' && (
              <Field label="Medium URL" hint="Medium'daki yazınızın tam bağlantısı">
                <input type="url" value={editBlog.external_url || ''} onChange={(e) => setEditBlog({ ...editBlog, external_url: e.target.value })}
                  className={inputCls} placeholder="https://medium.com/..." />
              </Field>
            )}
            {editBlog.blog_type === 'kaggle' && (
              <Field label="Kaggle Embed Kodu" hint="Kaggle not defterinizden aldığınız iframe kodunu yapıştırın">
                <textarea rows={4} value={editBlog.content || ''} onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                  className={`${inputCls} font-mono text-xs resize-y`} placeholder='<iframe src="https://www.kaggle.com/embed/..." ...>' />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Yayın Tarihi"><input type="date" value={editBlog.published_at ? editBlog.published_at.substring(0, 10) : ''} onChange={(e) => setEditBlog({ ...editBlog, published_at: e.target.value })} className={inputCls} /></Field>
            </div>
            <Field label="Kapak Görseli">
              <ImageUpload onChange={(e) => { const f = e.target.files[0]; if (f) setEditBlog({ ...editBlog, newImage: f }); }} />
              {editBlog.image && <img src={editBlog.image} alt="" className="mt-2 rounded-lg max-h-28 mx-auto ring-1 ring-white/10" />}
            </Field>
            <button type="submit" disabled={editBlogLoading} className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer ${editBlogLoading ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90 shadow-lg shadow-primary/10'}`}>
              {editBlogLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Modal */}
      <ConfirmModal confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={() => confirm?.onOk?.()} />

      {/* Toasts */}
      <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
};

export default Admin;
