-- Deneyimler tablosu. Supabase Dashboard > SQL Editor'de bir kez çalıştırın.
-- Site tablo yokken src/data/experiences.js'deki yedek veriyi gösterir; bu betik
-- aynı kayıtları tabloya ekler, sonrası admin panelden yönetilir.

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'work' check (category in ('work', 'education', 'community')),
  role_tr text not null,
  role_en text,
  org_tr text not null,
  org_en text,
  org_url text,
  location_tr text,
  location_en text,
  start_date date not null,
  end_date date,                       -- boşsa "devam ediyor"
  date_precision text not null default 'month' check (date_precision in ('month', 'year')),
  summary_tr text,
  summary_en text,
  highlights_tr text[] not null default '{}',
  highlights_en text[] not null default '{}',
  tags text[] not null default '{}',
  link_url text,
  link_label_tr text,
  link_label_en text,
  sort_order integer not null default 0, -- aynı tarihli kayıtlar arasında sıra
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_experiences_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists experiences_set_updated_at on public.experiences;
create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function public.set_experiences_updated_at();

-- Herkes okuyabilir; yalnızca giriş yapmış kullanıcı (admin) yazabilir.
alter table public.experiences enable row level security;

drop policy if exists "experiences are public" on public.experiences;
create policy "experiences are public"
  on public.experiences for select
  using (true);

drop policy if exists "authenticated can manage experiences" on public.experiences;
create policy "authenticated can manage experiences"
  on public.experiences for all
  to authenticated
  using (true)
  with check (true);

-- Başlangıç kayıtları (tablo boşsa eklenir)
do $$ begin if not exists (select 1 from public.experiences) then
  insert into public.experiences (category, role_tr, role_en, org_tr, org_en, org_url, location_tr, location_en, start_date, end_date, date_precision, summary_tr, summary_en, highlights_tr, highlights_en, tags, link_url, link_label_tr, link_label_en, sort_order)
  values
    ('work', 'Yapay Zekâ Stajyeri', 'AI Intern', 'Microsoft Summer School', 'Microsoft Summer School', 'https://www.microsoft.com/tr-tr', 'Online · İstanbul ofis ziyaretleri', 'Remote · Istanbul office visits', '2026-07-01', '2026-08-01', 'month', 'Microsoft Foundry Local üzerinde tamamen cihaz içi çalışan Türkçe bir RAG asistanı (Foundry Core AI) geliştirdim. Program boyunca Microsoft Türkiye üst düzey yöneticileriyle haftalık toplantılarda projeyi aşama aşama sundum.', 'Built Foundry Core AI, a fully on-device Turkish RAG assistant on Microsoft Foundry Local. Presented progress weekly to senior leaders of Microsoft Türkiye throughout the program.', array['Dense + BM25 hibrit arama ve RRF ile Türkçeye uygun retrieval katmanı', 'Cevapları puanlayan değerlendirme seti; uydurma oranını düşürüp başarıyı %60''tan %79''a çıkardım', '2 GB VRAM''de model–cihaz dağılımıyla yanıt süresini 80 sn''den 12–17 sn''ye indirdim'], array['Turkish-aware retrieval with dense + BM25 hybrid search fused by RRF', 'Built an answer-level eval set; cut hallucinations and raised accuracy from 60% to 79%', 'Reduced latency from 80 s to 12–17 s on a 2 GB GPU by splitting models across devices'], array['RAG', 'LLM', 'Foundry Local', 'Python', 'FastAPI', 'SQLite'], '/blog/testler-yesildi-asistan-uyduruyordu-microsoft-stajinda-rag-sistemi-kurarken-ogrendiklerim', 'Staj yazısını oku', 'Read the write-up', 0),
    ('work', 'Kurucu & Geliştirici', 'Founder & Developer', 'ŞantiyeOS · YurtMarket', 'ŞantiyeOS · YurtMarket', 'https://santiyeos.com.tr/', 'Bağımsız', 'Independent', '2025-01-01', null, 'year', 'İnşaat firmalarına yönelik çok kiracılı SaaS ürünü ŞantiyeOS''u ve Bartın''da 4 öğrenci yurdunda kullanılan e-ticaret platformu YurtMarket''i tek başıma geliştirip işletiyorum.', 'I build and run ŞantiyeOS, a multi-tenant SaaS for construction firms, and YurtMarket, an e-commerce platform used across four student dorms in Bartın.', array['5 rollü erişim denetimiyle çok kiracılı mimari; ORM''siz Spring JDBC katmanı', 'Supabase Row Level Security ile kiracı izolasyonu ve gerçek zamanlı envanter'], array['Multi-tenant architecture with 5-role access control on an ORM-less Spring JDBC layer', 'Tenant isolation with Supabase Row Level Security and real-time inventory'], array['Spring Boot', 'React', 'Django', 'Supabase', 'MariaDB'], null, null, null, 0),
    ('work', 'Yazılım Geliştirici (Serbest)', 'Freelance Software Developer', 'Doğrudan müşteri projeleri', 'Direct client projects', null, null, null, '2023-07-01', null, 'month', 'Tıbbi ekipman sektöründe bir firmaya özel servis yönetim platformu geliştirdim; sistem canlıda 1.000+ servis formu, teklif ve cihaz kaydını yönetiyor.', 'Built a custom field-service platform for a medical equipment company; it manages 1,000+ service forms, quotes and device records in production.', array['Next.js + PostgreSQL ile cihaz kaydı, servis takibi, teknisyen ataması ve raporlama', 'React / Next.js + Supabase ile SSR kimlik doğrulama ve gerçek zamanlı veri'], array['Device registry, service tracking, technician dispatch and reporting with Next.js + PostgreSQL', 'SSR authentication and real-time data with React / Next.js + Supabase'], array['Next.js', 'PostgreSQL', 'Supabase'], null, null, null, 1),
    ('education', 'Veri Analizi Uzmanlık Programı', 'Data Analysis Specialization Program', 'Marmara Üniversitesi — Nüfus ve Sosyal Araştırmalar Enstitüsü (YÖK)', 'Marmara University — Institute of Population and Social Research (YÖK)', null, null, null, '2025-10-01', '2026-05-01', 'month', null, null, '{}', '{}', '{}', null, null, null, 0),
    ('education', 'Lisans — Bilgisayar Teknolojisi ve Bilişim Sistemleri', 'B.Sc. — Computer Technology and Information Systems', 'Bartın Üniversitesi', 'Bartın University', null, null, null, '2022-09-01', null, 'month', null, null, '{}', '{}', '{}', null, null, null, 0),
    ('community', 'Kurucu & İçerik Üreticisi', 'Founder & Content Creator', 'Codenthia', 'Codenthia', null, null, null, '2024-01-01', null, 'year', '7.200+ takipçili yazılım ve teknoloji içerik hesabını yönetiyorum; 330+ gönderiyle düzenli içerik üretiyorum.', 'I run a software and tech content account with 7,200+ followers and 330+ posts.', '{}', '{}', '{}', null, null, null, 0),
    ('community', 'Yönetim Ekibi Üyesi', 'Board Member', 'BartınChain — Blockchain Topluluğu', 'BartınChain — Blockchain Community', null, null, null, '2023-11-01', '2025-12-01', 'month', 'Teknik içerik üretimi (Medium), etkinlik organizasyonu ve seminerler.', 'Technical writing on Medium, event organization and seminars.', '{}', '{}', '{}', null, null, null, 0);
end if; end $$;
