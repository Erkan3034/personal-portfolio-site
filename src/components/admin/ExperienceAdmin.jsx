import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addExperience, updateExperience, deleteExperience } from '../../lib/supabase';
import { CATEGORIES, sortExperiences, formatPeriod, isCurrent } from '../../lib/experience';

// Admin panelindeki Deneyimler sekmesi. Ortak arayüz parçaları (Modal, Field, TagInput, ...)
// admin.jsx'te tanımlı olduğu için `ui` prop'u ile gelir.

const EMPTY = {
  category: 'work',
  role_tr: '', role_en: '',
  org_tr: '', org_en: '', org_url: '',
  location_tr: '', location_en: '',
  start: '', end: '', ongoing: false, date_precision: 'month',
  summary_tr: '', summary_en: '',
  highlights_tr: '', highlights_en: '',
  tags: [],
  link_url: '', link_label_tr: '', link_label_en: '',
  sort_order: 0,
};

// <input type="month"> "YYYY-MM" ister; veritabanında ayın ilk günü olarak saklanır.
const toMonth = (date) => (date ? String(date).slice(0, 7) : '');
const toDate = (month) => (month ? `${month}-01` : null);
const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);
const orNull = (v) => (v && String(v).trim() ? String(v).trim() : null);

const rowToForm = (row) => ({
  ...EMPTY,
  ...Object.fromEntries(Object.entries(row).filter(([, v]) => v !== null)),
  start: toMonth(row.start_date),
  end: toMonth(row.end_date),
  ongoing: !row.end_date,
  highlights_tr: (row.highlights_tr || []).join('\n'),
  highlights_en: (row.highlights_en || []).join('\n'),
  tags: row.tags || [],
});

const formToRow = (f) => ({
  category: f.category,
  role_tr: f.role_tr.trim(),
  role_en: orNull(f.role_en),
  org_tr: f.org_tr.trim(),
  org_en: orNull(f.org_en),
  org_url: orNull(f.org_url),
  location_tr: orNull(f.location_tr),
  location_en: orNull(f.location_en),
  start_date: toDate(f.start),
  end_date: f.ongoing ? null : toDate(f.end),
  date_precision: f.date_precision,
  summary_tr: orNull(f.summary_tr),
  summary_en: orNull(f.summary_en),
  highlights_tr: lines(f.highlights_tr),
  highlights_en: lines(f.highlights_en),
  tags: f.tags,
  link_url: orNull(f.link_url),
  link_label_tr: orNull(f.link_label_tr),
  link_label_en: orNull(f.link_label_en),
  sort_order: Number(f.sort_order) || 0,
});

const ExperienceAdmin = ({ items, search, tableMissing, onChanged, toast, askConfirm, ui }) => {
  const { Modal, Field, TagInput, Badge, Ico, inputCls } = ui;
  const [form, setForm] = useState(null); // null: kapalı; { id? ...alanlar }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e });

  const q = search.toLowerCase();
  const visible = sortExperiences(items).filter((r) => !q
    || [r.role_tr, r.role_en, r.org_tr, r.org_en, ...(r.tags || [])].some((v) => v?.toLowerCase().includes(q)));

  const openNew = () => { setForm({ ...EMPTY }); setError(''); };
  const openEdit = (row) => { setForm({ ...rowToForm(row), id: row.id }); setError(''); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.start) { setError('Başlangıç tarihi gerekli.'); return; }
    if (!form.ongoing && form.end && form.end < form.start) { setError('Bitiş tarihi başlangıçtan önce olamaz.'); return; }
    if (!form.ongoing && !form.end) { setError('Bitiş tarihi girin ya da "Devam ediyor"u işaretleyin.'); return; }
    setSaving(true); setError('');
    try {
      const row = formToRow(form);
      const { error: err } = form.id ? await updateExperience(form.id, row) : await addExperience(row);
      if (err) throw err;
      toast(form.id ? 'Deneyim güncellendi.' : 'Deneyim eklendi.');
      setForm(null);
      onChanged();
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = (row) => askConfirm(
    'Deneyimi Sil',
    `"${row.role_tr} — ${row.org_tr}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
    async () => {
      try {
        const { error: err } = await deleteExperience(row.id);
        if (err) throw err;
        toast('Deneyim silindi.');
        onChanged();
      } catch (err) {
        toast('Silme hatası: ' + (err.message || err), 'error');
      }
    },
  );

  const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label.tr || id;

  return (
    <>
      {tableMissing && (
        <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-300 leading-relaxed">
          <p className="font-semibold mb-1">Deneyimler tablosu henüz oluşturulmamış.</p>
          <p className="text-amber-200/80">
            Supabase Dashboard → SQL Editor'de depodaki <code className="font-mono">supabase/experiences.sql</code> dosyasını bir kez çalıştırın.
            O zamana kadar sitede yedek veri gösterilir; buradan ekleme yapılamaz.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-600">Sitede başlangıç tarihine göre otomatik sıralanır: en son başlanan en üstte.</p>
        <button
          type="button" onClick={openNew} disabled={tableMissing}
          className="flex items-center gap-1.5 bg-primary text-canvas px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold cursor-pointer shadow-lg shadow-primary/10 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Ico.Plus className="w-3.5 h-3.5" /> Deneyim Ekle
        </button>
      </div>

      <div className="space-y-2">
        {visible.map((row, i) => (
          <motion.div key={row.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="group bg-surface border border-white/[0.06] rounded-xl p-4 hover:border-white/10 hover:bg-surface-2/50 transition-all">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="font-mono text-[11px] text-gray-500 mr-1">{formatPeriod(row, 'tr')}</span>
                  <Badge color={row.category === 'work' ? 'green' : row.category === 'education' ? 'blue' : 'purple'}>{categoryLabel(row.category)}</Badge>
                  {isCurrent(row) && <Badge color="yellow">Devam ediyor</Badge>}
                </div>
                <h3 className="font-semibold text-gray-100 text-sm truncate">{row.role_tr}</h3>
                <p className="text-gray-500 text-xs mt-0.5 truncate">{row.org_tr}{row.location_tr ? ` · ${row.location_tr}` : ''}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => openEdit(row)} title="Düzenle"
                  className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                  <Ico.Edit className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => remove(row)} title="Sil"
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                  <Ico.Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {visible.length === 0 && !tableMissing && (
          <p className="text-center text-gray-600 text-sm py-12">{search ? 'Eşleşen deneyim yok.' : 'Henüz deneyim eklenmemiş.'}</p>
        )}
      </div>

      {form && (
        <Modal title={form.id ? 'Deneyimi Düzenle' : 'Yeni Deneyim'} onClose={() => setForm(null)} wide>
          <form onSubmit={save} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <Ico.Warn className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Field label="Kategori" required>
              <select value={form.category} onChange={set('category')} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label.tr}</option>)}
              </select>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Rol / Pozisyon (TR)" required><input value={form.role_tr} onChange={set('role_tr')} required className={inputCls} placeholder="Yapay Zekâ Stajyeri" /></Field>
              <Field label="Rol / Pozisyon (EN)"><input value={form.role_en} onChange={set('role_en')} className={inputCls} placeholder="AI Intern" /></Field>
              <Field label="Kurum (TR)" required><input value={form.org_tr} onChange={set('org_tr')} required className={inputCls} placeholder="Microsoft" /></Field>
              <Field label="Kurum (EN)"><input value={form.org_en} onChange={set('org_en')} className={inputCls} /></Field>
            </div>
            <Field label="Kurum web sitesi"><input type="url" value={form.org_url} onChange={set('org_url')} className={inputCls} placeholder="https://..." /></Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Konum (TR)"><input value={form.location_tr} onChange={set('location_tr')} className={inputCls} placeholder="Online · İstanbul" /></Field>
              <Field label="Konum (EN)"><input value={form.location_en} onChange={set('location_en')} className={inputCls} placeholder="Remote · Istanbul" /></Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <Field label="Başlangıç" required><input type="month" value={form.start} onChange={set('start')} required className={inputCls} /></Field>
              <Field label="Bitiş"><input type="month" value={form.ongoing ? '' : form.end} onChange={set('end')} disabled={form.ongoing} className={`${inputCls} disabled:opacity-40`} /></Field>
              <label className="flex items-center gap-2 h-[42px] cursor-pointer select-none">
                <input type="checkbox" checked={form.ongoing} onChange={set('ongoing')} className="w-4 h-4 rounded border-white/20 bg-surface-2 text-primary focus:ring-primary/40" />
                <span className="text-sm text-gray-300">Devam ediyor</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Tarih gösterimi">
                <select value={form.date_precision} onChange={set('date_precision')} className={inputCls}>
                  <option value="month">Ay ve yıl (Tem 2026)</option>
                  <option value="year">Sadece yıl (2026)</option>
                </select>
              </Field>
              <Field label="Sıra" hint="Yalnızca aynı tarihli kayıtlar arasında geçerli; küçük olan önce.">
                <input type="number" value={form.sort_order} onChange={set('sort_order')} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Özet (TR)"><textarea rows={4} value={form.summary_tr} onChange={set('summary_tr')} className={`${inputCls} resize-y`} /></Field>
              <Field label="Özet (EN)"><textarea rows={4} value={form.summary_en} onChange={set('summary_en')} className={`${inputCls} resize-y`} /></Field>
              <Field label="Öne çıkanlar (TR)" hint="Her satır bir madde."><textarea rows={4} value={form.highlights_tr} onChange={set('highlights_tr')} className={`${inputCls} resize-y`} /></Field>
              <Field label="Öne çıkanlar (EN)" hint="Each line is one bullet."><textarea rows={4} value={form.highlights_en} onChange={set('highlights_en')} className={`${inputCls} resize-y`} /></Field>
            </div>

            <Field label="Etiketler" hint="Yazıp Enter'a basarak ekleyin"><TagInput tags={form.tags} onChange={set('tags')} placeholder="Python, RAG..." /></Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Bağlantı" hint="Site içi için /blog/... gibi"><input value={form.link_url} onChange={set('link_url')} className={inputCls} placeholder="/blog/... veya https://..." /></Field>
              <Field label="Bağlantı metni (TR)"><input value={form.link_label_tr} onChange={set('link_label_tr')} className={inputCls} placeholder="Yazıyı oku" /></Field>
              <Field label="Bağlantı metni (EN)"><input value={form.link_label_en} onChange={set('link_label_en')} className={inputCls} placeholder="Read more" /></Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setForm(null)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors cursor-pointer">Vazgeç</button>
              <button type="submit" disabled={saving}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${saving ? 'bg-primary/30 text-primary/50 cursor-not-allowed' : 'bg-primary text-canvas hover:bg-primary/90'}`}>
                {saving ? 'Kaydediliyor...' : form.id ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ExperienceAdmin;
