// Deneyim kayıtları için ortak yardımcılar. Kayıtlar Supabase `experiences` tablosundaki
// satır biçimindedir: dile bağlı alanlar `role_tr` / `role_en` gibi çiftler hâlinde tutulur.

export const CATEGORIES = [
  { id: 'work', label: { tr: 'İş & Staj', en: 'Work & Internships' } },
  { id: 'education', label: { tr: 'Eğitim', en: 'Education' } },
  { id: 'community', label: { tr: 'Topluluk', en: 'Community' } },
];

// Aktif dildeki değeri döndürür; İngilizcesi boşsa Türkçeye düşer.
export const loc = (row, field, lang) => row?.[`${field}_${lang}`] || row?.[`${field}_tr`] || '';

export const locList = (row, field, lang) => {
  const list = row?.[`${field}_${lang}`];
  return Array.isArray(list) && list.length ? list : (Array.isArray(row?.[`${field}_tr`]) ? row[`${field}_tr`] : []);
};

export const isCurrent = (row) => !row.end_date;

// Ters kronolojik sıra (CV düzeni): en son başlanan en üstte. Başlangıçlar aynıysa devam eden,
// sonra daha geç biten önce gelir; hâlâ eşitse sort_order küçük olan önce.
export const sortExperiences = (rows) => [...(rows || [])].sort((a, b) => {
  const byStart = String(b.start_date || '').localeCompare(String(a.start_date || ''));
  if (byStart) return byStart;
  if (isCurrent(a) !== isCurrent(b)) return isCurrent(a) ? -1 : 1;
  const byEnd = String(b.end_date || '').localeCompare(String(a.end_date || ''));
  if (byEnd) return byEnd;
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
});

const formatDate = (iso, precision, lang) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  return precision === 'year'
    ? String(d.getFullYear())
    : d.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
};

export const formatPeriod = (row, lang) => {
  if (!row.start_date) return '';
  const start = formatDate(row.start_date, row.date_precision, lang);
  const end = row.end_date ? formatDate(row.end_date, row.date_precision, lang) : (lang === 'tr' ? 'Günümüz' : 'Present');
  return start === end ? start : `${start} – ${end}`;
};

export const groupExperiences = (rows) => {
  const sorted = sortExperiences(rows);
  return CATEGORIES
    .map((c) => ({ ...c, items: sorted.filter((r) => r.category === c.id) }))
    .filter((g) => g.items.length > 0);
};
