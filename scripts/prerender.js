// Build sonrası (postbuild) çalışır. Sabit sayfaların yanında scripts/generate-seo.js'in
// yazdığı prerender-routes.json'daki blog ve proje detay sayfalarını da HTML'e çevirir.
// Böylece arama motorları ve sosyal medya önizlemeleri her sayfanın kendi içeriğini görür.

const fs = require('fs');
const path = require('path');
const { run } = require('react-snap');

const ROOT = path.resolve(__dirname, '..');
const config = require(path.join(ROOT, 'package.json')).reactSnap || {};

let include = config.include || ['/'];
try {
  include = JSON.parse(fs.readFileSync(path.join(ROOT, 'prerender-routes.json'), 'utf8'));
} catch {
  console.warn('[prerender] prerender-routes.json yok, package.json listesi kullanılıyor');
}

run({ ...config, include, crawl: false })
  .then(() => console.log(`[prerender] ${include.length} sayfa üretildi`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
