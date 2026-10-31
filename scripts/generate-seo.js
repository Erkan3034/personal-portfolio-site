// Build öncesi (prebuild) çalışır. Supabase'ten blog ve projeleri çekip şunları üretir:
//   public/sitemap.xml      — tüm sayfalar + her blog/proje detay sayfası
//   public/rss.xml          — blog RSS beslemesi
//   public/llms.txt         — scripts/llms-base.md + güncel proje/blog listesi
//   public/llms-full.txt    — site içi blog yazılarının tam metni
//   public/data/*.json      — react-snap'in prerender sırasında okuduğu veri kopyası
//   prerender-routes.json   — scripts/prerender.js'in önceden üreteceği adresler
//
// Supabase'e ulaşılamazsa build'i düşürmez: statik sayfalarla devam eder.

const fs = require('fs');
const path = require('path');

const SITE = 'https://erkanturgut.com';
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

const STATIC_PAGES = [
  { path: '/', name: 'Ana Sayfa', changefreq: 'weekly', priority: '1.0' },
  { path: '/about/', name: 'Hakkımda', changefreq: 'monthly', priority: '0.8' },
  { path: '/experience/', name: 'Deneyimler', changefreq: 'monthly', priority: '0.8' },
  { path: '/projects/', name: 'Projeler', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog/', name: 'Blog', changefreq: 'weekly', priority: '0.9' },
  { path: '/certificates/', name: 'Sertifikalar', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact/', name: 'İletişim', changefreq: 'yearly', priority: '0.5' },
  { path: '/gizlilik/', name: 'Gizlilik ve Çerezler', changefreq: 'yearly', priority: '0.2' },
];

// src/lib/slug.js ile aynı kurallar.
const TR_MAP = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
const slugify = (text) => (text || '').toString()
  .replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => TR_MAP[m])
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/--+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');
const projectPath = (p) => `/projects/${p.id}${slugify(p.title) ? `-${slugify(p.title)}` : ''}/`;
const blogPath = (b) => `/blog/${b.slug || slugify(b.title)}/`;

const loadEnv = () => {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
};

const fetchTable = async (table, order) => {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase ortam değişkenleri yok');
  const res = await fetch(`${url}/rest/v1/${table}?select=*&order=${order}.desc.nullslast`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`);
  return res.json();
};

const xml = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const isoDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);

const htmlToText = (html) => String(html || '')
  .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(p|h[1-6]|li|tr|blockquote|pre|figure)>/gi, '\n')
  .replace(/<li[^>]*>/gi, '- ')
  .replace(/<h([23])[^>]*>/gi, (_, n) => `\n${'#'.repeat(Number(n))} `)
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
  .replace(/[ \t]+\n/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const oneLine = (s, max = 200) => {
  const t = htmlToText(s).replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};

// Site içinde sayfası olan yazılar (Medium'a yönlenenler hariç).
const isOnSite = (b) => !(b.is_external && b.external_url);

const buildSitemap = (blogs, projects, today) => {
  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: p.path, lastmod: today, changefreq: p.changefreq, priority: p.priority })),
    ...blogs.filter(isOnSite).map((b) => ({
      loc: blogPath(b),
      lastmod: isoDate(b.updated_at || b.published_at || b.created_at) || today,
      changefreq: 'monthly',
      priority: '0.8',
      image: b.image,
    })),
    ...projects.map((p) => ({
      loc: projectPath(p),
      lastmod: isoDate(p.updated_at || p.created_at) || today,
      changefreq: 'monthly',
      priority: p.featured ? '0.8' : '0.6',
      image: p.image,
    })),
  ];
  const abs = (u) => (u && u.startsWith('/') ? `${SITE}${u}` : u);
  const body = urls.map((u) => [
    '  <url>',
    `    <loc>${xml(SITE + u.loc)}</loc>`,
    `    <lastmod>${u.lastmod}</lastmod>`,
    `    <changefreq>${u.changefreq}</changefreq>`,
    `    <priority>${u.priority}</priority>`,
    u.image ? `    <image:image><image:loc>${xml(abs(u.image))}</image:loc></image:image>` : null,
    '  </url>',
  ].filter(Boolean).join('\n')).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`;
};

// Blog yazıları ve projeler tek beslemede, en yeniden eskiye.
// İnsanlar için okunur site haritası (/site-haritasi/). sitemap.xml arama motorları içindir.
// Not: Bu sayfa React uygulamasının bir rotası değildir; prerender listesine eklenmemeli.
const buildSitemapHtml = (blogs, projects) => {
  const esc = xml;
  const li = (href, label, meta) => `<li><a href="${esc(href)}">${esc(label)}</a>${meta ? `<span>${esc(meta)}</span>` : ''}</li>`;
  const pages = STATIC_PAGES.map((p) => li(p.path, p.name));
  const posts = blogs.map((b) => (isOnSite(b)
    ? li(blogPath(b), b.title, isoDate(b.published_at || b.created_at))
    : li(b.external_url, `${b.title} ↗`, 'Medium')));
  const projs = projects.map((p) => li(projectPath(p), p.title, isoDate(p.project_date || p.created_at)));
  const section = (title, items) => `<section><h2>${title} <small>${items.length}</small></h2><ul>${items.join('')}</ul></section>`;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Site Haritası | Erkan Turgut</title>
<meta name="description" content="erkanturgut.com üzerindeki tüm sayfalar, blog yazıları ve projeler.">
<link rel="canonical" href="${SITE}/site-haritasi/">
<link rel="icon" href="/logo-mark.svg" type="image/svg+xml">
<style>
  :root { color-scheme: dark; }
  body { margin: 0; padding: 48px 20px; background: #0C0C0E; color: #e4e4e7; font: 15px/1.6 system-ui, -apple-system, Segoe UI, sans-serif; }
  main { max-width: 860px; margin: 0 auto; }
  header a { color: #a1a1aa; text-decoration: none; font-size: 14px; }
  h1 { color: #fff; font-size: 30px; margin: 14px 0 6px; letter-spacing: -.02em; }
  header p { color: #71717a; margin: 0 0 36px; }
  h2 { color: #fff; font-size: 18px; margin: 32px 0 10px; }
  h2 small { color: #22C55E; font: 600 12px ui-monospace, Consolas, monospace; margin-left: 6px; }
  ul { list-style: none; margin: 0; padding: 0; border-top: 1px solid rgba(255,255,255,.07); }
  li { display: flex; justify-content: space-between; gap: 16px; padding: 10px 2px; border-bottom: 1px solid rgba(255,255,255,.07); }
  li a { color: #e4e4e7; text-decoration: none; }
  li a:hover { color: #4ade80; }
  li span { color: #71717a; font: 12px ui-monospace, Consolas, monospace; white-space: nowrap; }
</style>
</head>
<body>
<main>
  <header>
    <a href="/">← erkanturgut.com</a>
    <h1>Site Haritası</h1>
    <p>Sitedeki tüm sayfalar, blog yazıları ve projeler.</p>
  </header>
  ${section('Sayfalar', pages)}
  ${section('Blog Yazıları', posts)}
  ${section('Projeler', projs)}
</main>
</body>
</html>
`;
};

const buildRss = (blogs, projects = []) => {
  const blogItems = blogs.map((b) => {
    const link = isOnSite(b) ? `${SITE}${blogPath(b)}` : b.external_url;
    const date = new Date(b.published_at || b.created_at || 0);
    const tags = Array.isArray(b.tags) ? b.tags : [];
    const full = isOnSite(b) && b.content && !b.kaggle_notebook_id
      ? `\n      <content:encoded><![CDATA[${String(b.content).replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>`
      : '';
    const item = `    <item>
      <title>${xml(b.title)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="${isOnSite(b)}">${xml(isOnSite(b) ? link : `${SITE}/blog/#${b.id}`)}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <dc:creator>Erkan Turgut</dc:creator>
      <description>${xml(b.summary || oneLine(b.content, 300))}</description>
      <category>Blog</category>
${tags.map((t) => `      <category>${xml(t)}</category>`).join('\n')}${full}
    </item>`;
    return { date, item };
  });
  const projectItems = projects.map((p) => {
    const link = `${SITE}${projectPath(p)}`;
    const date = new Date(p.project_date || p.created_at || 0);
    const tech = Array.isArray(p.technologies) ? p.technologies : [];
    const item = `    <item>
      <title>${xml(`Proje: ${p.title}`)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="true">${xml(link)}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <dc:creator>Erkan Turgut</dc:creator>
      <description>${xml(oneLine(p.description, 300))}</description>
      <category>Proje</category>
${tech.map((t) => `      <category>${xml(t)}</category>`).join('\n')}
    </item>`;
    return { date, item };
  });
  const items = [...blogItems, ...projectItems]
    .sort((x, y) => y.date - x.date)
    .map((x) => x.item)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Erkan Turgut — Blog ve Projeler</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Yazılım geliştirme ve yapay zekâ üzerine yazılar ve projeler: RAG, LLM, makine öğrenmesi, web geliştirme.</description>
    <language>tr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${SITE}/logo512.png</url>
      <title>Erkan Turgut — Blog ve Projeler</title>
      <link>${SITE}/</link>
    </image>
${items}
  </channel>
</rss>
`;
};

const period = (e) => {
  const fmt = (d) => (e.date_precision === 'year' ? d.slice(0, 4) : d.slice(0, 7));
  return `${fmt(e.start_date)} – ${e.end_date ? fmt(e.end_date) : 'devam ediyor'}`;
};

const buildLlms = (blogs, projects, experiences = []) => {
  const base = fs.readFileSync(path.join(__dirname, 'llms-base.md'), 'utf8').trimEnd();
  // En son başlanan üstte (src/lib/experience.js → sortExperiences ile aynı ana kural).
  const expLines = [...experiences]
    .sort((a, b) => String(b.start_date).localeCompare(String(a.start_date)) || (a.end_date ? 1 : 0) - (b.end_date ? 1 : 0))
    .map((e) => `- ${e.role_tr} — ${e.org_tr} (${period(e)})${e.summary_tr ? `: ${oneLine(e.summary_tr, 200)}` : ''}`);
  const projLines = projects.map((p) => {
    const tech = Array.isArray(p.technologies) ? ` (${p.technologies.slice(0, 6).join(', ')})` : '';
    return `- [${p.title}](${SITE}${projectPath(p)}): ${oneLine(p.description, 220)}${tech}`;
  });
  const blogLines = blogs.map((b) => {
    const link = isOnSite(b) ? `${SITE}${blogPath(b)}` : b.external_url;
    return `- [${b.title}](${link}): ${oneLine(b.summary || b.content, 200)}`;
  });
  const expSection = expLines.length ? `\n\n## Deneyimler\n\n${expLines.join('\n')}` : '';
  return `${base}${expSection}

## Projeler

${projLines.join('\n') || '- (henüz proje yok)'}

## Blog Yazıları

${blogLines.join('\n') || '- (henüz yazı yok)'}
`;
};

const buildLlmsFull = (blogs) => {
  const posts = blogs.filter((b) => isOnSite(b) && b.content && !b.kaggle_notebook_id);
  return `# Erkan Turgut — Blog Yazıları (Tam Metin)

> erkanturgut.com üzerindeki site içi blog yazılarının düz metin hâli.

${posts.map((b) => `---

# ${b.title}

Kaynak: ${SITE}${blogPath(b)}
Tarih: ${isoDate(b.published_at || b.created_at) || '-'}

${b.summary ? `> ${b.summary}\n\n` : ''}${htmlToText(b.content)}
`).join('\n')}`;
};

const write = (rel, content) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

(async () => {
  loadEnv();
  const today = new Date().toISOString().slice(0, 10);
  let blogs = [];
  let projects = [];
  try {
    [blogs, projects] = await Promise.all([fetchTable('blogs', 'published_at'), fetchTable('projects', 'created_at')]);
  } catch (err) {
    console.warn(`[seo] Supabase verisi alınamadı, yalnızca statik sayfalar üretilecek: ${err.message}`);
  }
  // Tablo henüz oluşturulmamış olabilir (supabase/experiences.sql); o durumda sayfa yedek veriyi gösterir.
  let experiences = [];
  try {
    experiences = await fetchTable('experiences', 'start_date');
  } catch (err) {
    console.warn(`[seo] Deneyimler alınamadı, sayfa yedek veriyi kullanacak: ${err.message}`);
  }

  write('public/sitemap.xml', buildSitemap(blogs, projects, today));
  write('public/site-haritasi/index.html', buildSitemapHtml(blogs, projects));
  write('public/rss.xml', buildRss(blogs, projects));
  write('public/llms.txt', buildLlms(blogs, projects, experiences));
  write('public/llms-full.txt', buildLlmsFull(blogs));
  write('public/data/blogs.json', JSON.stringify(blogs));
  write('public/data/projects.json', JSON.stringify(projects));
  write('public/data/experiences.json', JSON.stringify(experiences));

  const routes = [
    ...STATIC_PAGES.map((p) => p.path),
    ...blogs.filter(isOnSite).map(blogPath),
    ...projects.map(projectPath),
  ];
  write('prerender-routes.json', JSON.stringify(routes, null, 2));

  console.log(`[seo] ${blogs.length} blog, ${projects.length} proje → sitemap (${routes.length} adres), rss, llms.txt üretildi`);
})();
