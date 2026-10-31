# SEO otomasyonu

Her build'de (her `git push` sonrası Netlify'da) şunlar otomatik çalışır:

| Adım | Ne yapar | Dosya |
|---|---|---|
| `prebuild` | Supabase'ten blog ve projeleri çeker; `sitemap.xml`, `rss.xml`, `llms.txt`, `llms-full.txt` ve prerender listesini üretir | `scripts/generate-seo.js` |
| `build` | React uygulamasını derler | — |
| `postbuild` | Sabit sayfalar + her blog ve proje detay sayfasını HTML'e çevirir (react-snap) | `scripts/prerender.js` |
| Deploy sonrası | Değişen adresleri IndexNow'a bildirir (Bing, Yandex, Seznam, Naver) | `netlify/plugins/indexnow` |

`llms.txt`'nin sabit kısmı `scripts/llms-base.md` içinde; proje ve blog listeleri her build'de eklenir.

## Admin panelden içerik eklenince otomatik yeniden build

Blog veya proje admin panelden eklendiğinde kod değişmediği için push olmaz; sitemap, RSS ve
prerender sayfaları bir sonraki build'e kadar eski kalır. Bunu otomatikleştirmek için bir kez:

1. **Netlify:** Site configuration → Build & deploy → Build hooks → *Add build hook*
   (ad: `supabase-content`, dal: `main`). Verilen URL'yi kopyala.
2. **Supabase:** Database → Webhooks → *Create a new hook*
   - Tablo: `blogs`, olaylar: Insert, Update, Delete
   - Tür: HTTP Request, yöntem: `POST`, URL: 1. adımdaki build hook adresi
   - Aynısını `projects` ve `experiences` tabloları için de oluştur.

Build hook URL'si gizli tutulmalı (herkes build tetikleyebilir); bu yüzden istemci koduna değil,
yalnızca Supabase webhook'una yazılır.

## Google

Google IndexNow'u desteklemiyor ve sitemap "ping" uç noktasını 2023'te kapattı. Google için:

1. [Search Console](https://search.google.com/search-console) → Sitemaps → `https://erkanturgut.com/sitemap.xml` ekle (bir kez).
2. Google sitemap'i düzenli olarak kendisi okur; yeni bir yazıyı hızlandırmak için
   URL Denetimi → *Dizine eklenmesini iste*.

Bing için [Bing Webmaster Tools](https://www.bing.com/webmasters) → *Import from Google Search Console*
ile tek tıkta eklenebilir; IndexNow bildirimleri orada görünür.

## Yerelde

```bash
npm run generate:seo   # yalnızca SEO dosyalarını üretir
npm run build          # tam build + prerender
```
