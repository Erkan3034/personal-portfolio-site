// Production deploy'u başarıyla yayına girdikten sonra yeni veya güncellenen adresleri
// IndexNow'a bildirir (Bing, Yandex, Seznam, Naver bu protokolü paylaşır).
// Google IndexNow'u desteklemez; Google sitemap.xml'i Search Console üzerinden okur.
//
// Neyin değiştiğini bulmak için build başlamadan canlı sitemap'i okur, deploy sonrası
// yeni sitemap ile karşılaştırır. Bu eklenti hiçbir durumda build'i düşürmez.

const fs = require('fs');
const path = require('path');

let previous = null;

const parseSitemap = (xml) => {
  const entries = new Map();
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || '';
    if (loc) entries.set(loc.replace(/&amp;/g, '&'), lastmod);
  }
  return entries;
};

const isProduction = () => process.env.CONTEXT === 'production';

module.exports = {
  async onPreBuild({ inputs }) {
    if (!isProduction()) return;
    try {
      const res = await fetch(`https://${inputs.host}/sitemap.xml`);
      if (res.ok) previous = parseSitemap(await res.text());
    } catch (err) {
      console.log(`[indexnow] Canlı sitemap okunamadı, tüm adresler bildirilecek: ${err.message}`);
    }
  },

  async onSuccess({ inputs, constants, utils }) {
    if (!isProduction()) {
      console.log('[indexnow] Production dışı deploy, atlandı');
      return;
    }
    try {
      const xml = fs.readFileSync(path.join(constants.PUBLISH_DIR, 'sitemap.xml'), 'utf8');
      const current = parseSitemap(xml);
      const changed = [...current].filter(([loc, lastmod]) => !previous || previous.get(loc) !== lastmod).map(([loc]) => loc);

      if (changed.length === 0) {
        utils.status.show({ title: 'IndexNow', summary: 'Değişen adres yok' });
        return;
      }

      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: inputs.host,
          key: inputs.key,
          keyLocation: `https://${inputs.host}/${inputs.key}.txt`,
          urlList: changed.slice(0, 10000),
        }),
      });
      const summary = `${changed.length} adres bildirildi (HTTP ${res.status})`;
      console.log(`[indexnow] ${summary}\n${changed.join('\n')}`);
      utils.status.show({ title: 'IndexNow', summary });
    } catch (err) {
      console.log(`[indexnow] Bildirim başarısız: ${err.message}`);
    }
  },
};
