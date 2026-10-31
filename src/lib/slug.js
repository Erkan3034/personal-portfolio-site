// URL yardımcıları. scripts/generate-seo.js de aynı kuralları kullanır;
// birini değiştirirsen ikisini birlikte değiştir.

const TR_MAP = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };

export const slugify = (text) => {
  if (!text) return '';
  return text.toString()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => TR_MAP[m])
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// /projects/13-santiyeos — id başta kaldığı için eski /projects/13 adresleri de çalışır.
export const projectPath = (project) => {
  const slug = slugify(project.title);
  return `/projects/${project.id}${slug ? `-${slug}` : ''}`;
};

export const blogPath = (blog) => `/blog/${blog.slug || slugify(blog.title)}`;

export const parseProjectId = (param) => parseInt(param, 10);
