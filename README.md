# Personal Portfolio Website

Modern, animasyonlu, duyarlı (responsive) ve veritabanı bağlantılı kişisel portföy web sitesi. Bu site Netlify üzerinde sorunsuz çalışacak şekilde tasarlanmıştır.

## 🚀 Özellikler

- **Modern Tasarım**: Tailwind CSS ile responsive ve modern UI
- **Animasyonlar**: Framer Motion ile smooth animasyonlar
- **Veritabanı**: Supabase entegrasyonu
- **Admin Panel**: Güvenli admin paneli ile içerik yönetimi
- **SEO Dostu**: Optimize edilmiş meta etiketleri

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── ProjectCard.jsx
│   ├── CertificateCard.jsx
│   └── ContactForm.jsx
├── pages/
│   ├── index.jsx (Ana Sayfa)
│   ├── about.jsx
│   ├── projects.jsx
│   ├── certificates.jsx
│   ├── contact.jsx
│   └── admin.jsx
└── lib/
    └── supabase.js
```

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Supabase yapılandırması:**
`.env` dosyası oluşturun:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm start
```

## 📱 Sayfalar

### 🏠 Ana Sayfa
- Etkileyici hero section
- Dinamik yetenek animasyonu
- Sosyal medya linkleri

### 👤 Hakkımda
- Kişisel hikaye
- Yetenekler (progress bar'lar)
- Deneyim ve eğitim bilgileri
- Hedefler

### 💼 Projeler
- Proje kartları
- Teknoloji filtreleme
- GitHub ve canlı demo linkleri
- Responsive grid layout

### 🏆 Sertifikalar
- Sertifika kartları
- Genişletilebilir detaylar
- İstatistikler
- Sürekli öğrenme vurgusu

### 📞 İletişim
- İletişim formu (Supabase entegrasyonu)
- İletişim bilgileri
- Sosyal medya linkleri
- Müsaitlik durumu
- SSS bölümü

### 🔐 Admin Panel
- Güvenli giriş (Supabase Auth)
- Proje yönetimi
- Sertifika yönetimi
- CRUD işlemleri

## 🎨 Tasarım Özellikleri

- **Renk Paleti**: Modern mavi ve mor tonlari
- **Tipografi**: Inter font ailesi
- **Animasyonlar**: Framer Motion ile smooth geçişler
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Accessibility**: Erişilebilirlik standartlarına uygun

## 🔧 Teknolojiler

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage)
- **Routing**: React Router DOM
- **Deployment**: Netlify

## 📦 Netlify Deployment

1. **netlify.toml** dosyası oluşturun:
```toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/admin"
  to = "/admin"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Environment Variables** ayarlayın:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## 🔒 Güvenlik

- Admin paneli Supabase Auth ile korunur
- Environment variables ile hassas bilgiler gizlenir
- CORS ve güvenlik başlıkları yapılandırılmış

## ⚡ Performans

- Lazy loading
- Optimize edilmiş görseller
- Code splitting
- Minimal bundle size

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Herhangi bir sorunuz varsa, lütfen iletişime geçin:
- Email: turguterkan1306@gmail.com
- GitHub: [https://github.com/Erkan3034]
- LinkedIn: [https://www.linkedin.com/in/erkanturgut1205]

---

**Not**: Bu proje geliştirme aşamasındadır. Supabase yapılandırması ve environment variables ayarlanması gerekmektedir.
