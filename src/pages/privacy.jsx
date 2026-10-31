import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

// Metin sitenin gerçekte kullandığı servislere dayanır. Yeni bir servis (ör. analitik)
// eklenirse bu sayfa ve gerekirse bir onay banner'ı birlikte güncellenmeli.
const UPDATED = '2026-10-31';
const EMAIL = 'turguterkan55@gmail.com';

const CONTENT = {
  tr: {
    seoTitle: 'Gizlilik ve Çerezler',
    seoDesc: 'erkanturgut.com hangi verileri işler, hangi üçüncü taraf servisleri kullanır ve çerez kullanımı.',
    title: 'Gizlilik ve Çerezler',
    updated: 'Son güncelleme',
    intro: 'Bu sayfa, erkanturgut.com\'u ziyaret ettiğinde hangi verilerin işlendiğini ve nereye gittiğini açıklar. Veri sorumlusu Erkan Turgut\'tur.',
    sections: [
      {
        h: 'Çerezler',
        p: ['Bu site izleme, analitik veya reklam amaçlı çerez kullanmaz. Ziyaretlerini takip eden bir istatistik aracı (Google Analytics vb.) yoktur.'],
      },
      {
        h: 'Tarayıcında saklanan bilgi',
        p: ['Seçtiğin dil (Türkçe / İngilizce) tarayıcının yerel depolamasında "portfolio-lang" adıyla saklanır. Bu bilgi sunucuya gönderilmez ve yalnızca siteyi senin seçtiğin dilde göstermek için kullanılır. Tarayıcı ayarlarından istediğin zaman silebilirsin.'],
      },
      {
        h: 'İletişim formu',
        p: [
          'İletişim formunu doldurduğunda adın, e-posta adresin, konu ve mesajın Formspree (Formspree, Inc., ABD) aracılığıyla e-posta adresime iletilir. Bu bilgileri yalnızca sana yanıt vermek için kullanırım; üçüncü kişilerle paylaşmam ve pazarlama amacıyla kullanmam.',
          'Formu göndererek bu bilgilerin yurt dışında bulunan Formspree sunucuları üzerinden iletilmesini kabul etmiş olursun. Formspree\'nin kendi gizlilik politikası:',
        ],
        link: { href: 'https://formspree.io/legal/privacy-policy', label: 'formspree.io/legal/privacy-policy' },
      },
      {
        h: 'Üçüncü taraf hizmetler',
        p: ['Site çalışırken aşağıdaki servislerden içerik yüklenir. Bu servisler, teknik olarak gerekli olduğu için IP adresin gibi bağlantı bilgilerini görebilir:'],
        list: [
          'Netlify: sitenin barındırıldığı sunucular (sunucu kayıtları).',
          'Supabase: blog, proje ve görsel içeriklerinin geldiği veritabanı ve depolama.',
          'Google Fonts: yazı tiplerinin yüklendiği Google sunucuları.',
          'Kaggle: bazı blog yazılarındaki gömülü notebook\'lar kaggle.com\'dan yüklenir; Kaggle (Google) bu sayfalarda kendi çerezlerini kullanabilir.',
        ],
      },
      {
        h: 'Hakların',
        p: ['6698 sayılı KVKK\'nın 11. maddesi kapsamında, hakkında işlenen veriler olup olmadığını öğrenme, düzeltilmesini veya silinmesini isteme gibi haklara sahipsin. Bunun için bana {mail} ile ulaşabilirsin.'],
        mailLabel: 'mail',
      },
    ],
    back: 'Ana sayfaya dön',
  },
  en: {
    seoTitle: 'Privacy & Cookies',
    seoDesc: 'What data erkanturgut.com processes, which third-party services it uses, and its cookie usage.',
    title: 'Privacy & Cookies',
    updated: 'Last updated',
    intro: 'This page explains what data is processed when you visit erkanturgut.com and where it goes. The data controller is Erkan Turgut.',
    sections: [
      {
        h: 'Cookies',
        p: ['This site does not use tracking, analytics or advertising cookies. There is no visitor statistics tool (such as Google Analytics).'],
      },
      {
        h: 'Data stored in your browser',
        p: ['Your language choice (Turkish / English) is stored in your browser\'s local storage as "portfolio-lang". It is never sent to a server and is only used to show the site in your chosen language. You can clear it from your browser settings at any time.'],
      },
      {
        h: 'Contact form',
        p: [
          'When you submit the contact form, your name, email address, subject and message are forwarded to my email through Formspree (Formspree, Inc., USA). I only use this information to reply to you; I do not share it with third parties or use it for marketing.',
          'By submitting the form you agree that this information is transmitted through Formspree\'s servers outside Türkiye. Formspree\'s own privacy policy:',
        ],
        link: { href: 'https://formspree.io/legal/privacy-policy', label: 'formspree.io/legal/privacy-policy' },
      },
      {
        h: 'Third-party services',
        p: ['Content is loaded from the following services. Because it is technically necessary, they may see connection data such as your IP address:'],
        list: [
          'Netlify: the servers hosting this site (server logs).',
          'Supabase: the database and storage serving blog posts, projects and images.',
          'Google Fonts: Google servers that deliver the typefaces.',
          'Kaggle: embedded notebooks in some blog posts load from kaggle.com; Kaggle (Google) may set its own cookies on those pages.',
        ],
      },
      {
        h: 'Your rights',
        p: ['Under Article 11 of the Turkish Personal Data Protection Law (KVKK) you can ask whether data about you is processed and request its correction or deletion. You can reach me by {mail}.'],
        mailLabel: 'mail',
      },
    ],
    back: 'Back to home',
  },
};

const Privacy = () => {
  const { lang } = useLanguage();
  const c = CONTENT[lang] || CONTENT.tr;
  const date = new Date(`${UPDATED}T00:00:00`).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <SEOHead title={c.seoTitle} description={c.seoDesc} />
      <article className="max-w-2xl mx-auto px-4 sm:px-8 py-14">
        <h1 className="font-display font-extrabold text-white text-4xl tracking-tight">{c.title}</h1>
        <p className="font-mono text-xs text-zinc-500 mt-3">{c.updated}: {date}</p>
        <p className="text-zinc-300 font-body text-base leading-7 mt-8">{c.intro}</p>

        {c.sections.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="font-display font-bold text-white text-xl mb-3">{s.h}</h2>
            {s.p.map((para) => (
              <p key={para} className="text-zinc-400 font-body text-[15px] leading-7 mb-3">
                {/* {mail} adresin kendisi yerine tıklanabilir bir etiket olarak gösterilir */}
                {para.split('{mail}').map((part, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <a href={`mailto:${EMAIL}`} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 decoration-emerald-400/40">
                        {s.mailLabel}
                      </a>
                    )}
                    {part}
                  </React.Fragment>
                ))}
              </p>
            ))}
            {s.link && (
              <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-body text-[15px] underline underline-offset-2 decoration-emerald-400/40">
                {s.link.label}
              </a>
            )}
            {s.list && (
              <ul className="list-disc pl-5 space-y-1.5">
                {s.list.map((li) => <li key={li} className="text-zinc-400 font-body text-[15px] leading-7">{li}</li>)}
              </ul>
            )}
          </section>
        ))}

        <Link to="/" className="inline-block mt-12 text-sm font-body text-zinc-400 hover:text-white transition-colors">← {c.back}</Link>
      </article>
    </div>
  );
};

export default Privacy;
