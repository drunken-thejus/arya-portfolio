-- ================================================================
-- Portfolio CMS -- Supabase Schema
-- Run this in Supabase -> SQL Editor -> New query -> Run
-- ================================================================

-- ===  TABLES  ===================================================

create table if not exists hero (
  id                    serial primary key,
  name                  text default '',
  headline              text default '',
  intro                 text default '',
  profile_image         text,
  background_image      text,
  cta_primary_label     text,
  cta_primary_href      text,
  cta_secondary_label   text,
  cta_secondary_href    text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create table if not exists about (
  id                  serial primary key,
  biography           text default '',
  philosophy          text default '',
  experience_summary  text default '',
  profile_image       text,
  years_experience    int default 0,
  articles_published  int default 0,
  clients_count       int default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create table if not exists services (
  id          serial primary key,
  title       text not null,
  description text default '',
  icon        text,
  "order"     int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists categories (
  id          serial primary key,
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists works (
  id             serial primary key,
  title          text not null,
  slug           text not null unique,
  description    text default '',
  cover_image    text,
  content        text default '',
  external_link  text,
  published_date date,
  tags           text default '',
  is_featured    boolean default false,
  is_published   boolean default true,
  "order"        int default 0,
  category_id    int references categories(id) on delete set null,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists work_images (
  id          serial primary key,
  work_id     int not null references works(id) on delete cascade,
  url         text not null,
  caption     text,
  "order"     int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists experience (
  id          serial primary key,
  company     text not null,
  role        text not null,
  description text default '',
  start_date  text,
  end_date    text,
  logo        text,
  "order"     int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists testimonials (
  id            serial primary key,
  client_name   text not null,
  profile_image text,
  company       text,
  role          text,
  message       text not null,
  "order"       int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists messages (
  id          serial primary key,
  name        text not null,
  email       text not null,
  subject     text,
  body        text not null,
  is_read     boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists social_links (
  id          serial primary key,
  platform    text not null,
  url         text not null,
  icon        text,
  "order"     int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ===  PATCH EXISTING COLUMNS  ===================================
-- Safe to run on tables that were created without defaults.

alter table hero          alter column created_at      set default now();
alter table hero          alter column updated_at      set default now();
alter table about         alter column created_at      set default now();
alter table about         alter column updated_at      set default now();
alter table services      alter column created_at      set default now();
alter table services      alter column updated_at      set default now();
alter table services      alter column description     set default '';
alter table services      alter column "order"         set default 0;
alter table categories    alter column created_at      set default now();
alter table categories    alter column updated_at      set default now();
alter table works         alter column created_at      set default now();
alter table works         alter column updated_at      set default now();
alter table works         alter column description     set default '';
alter table works         alter column content         set default '';
alter table works         alter column tags            set default '';
alter table works         alter column is_featured     set default false;
alter table works         alter column is_published    set default true;
alter table works         alter column "order"         set default 0;
alter table work_images   alter column created_at      set default now();
alter table work_images   alter column updated_at      set default now();
alter table work_images   alter column "order"         set default 0;
alter table experience    alter column created_at      set default now();
alter table experience    alter column updated_at      set default now();
alter table experience    alter column description     set default '';
alter table experience    alter column "order"         set default 0;
alter table testimonials  alter column created_at      set default now();
alter table testimonials  alter column updated_at      set default now();
alter table testimonials  alter column "order"         set default 0;
alter table messages      alter column created_at      set default now();
alter table messages      alter column updated_at      set default now();
alter table messages      alter column is_read         set default false;
alter table social_links  alter column created_at      set default now();
alter table social_links  alter column updated_at      set default now();
alter table social_links  alter column "order"         set default 0;

-- ===  ROW LEVEL SECURITY  =======================================

alter table hero          enable row level security;
alter table about         enable row level security;
alter table services      enable row level security;
alter table categories    enable row level security;
alter table works         enable row level security;
alter table work_images   enable row level security;
alter table experience    enable row level security;
alter table testimonials  enable row level security;
alter table messages      enable row level security;
alter table social_links  enable row level security;

-- Public read (portfolio visitors)
create policy "public_read" on hero         for select using (true);
create policy "public_read" on about        for select using (true);
create policy "public_read" on services     for select using (true);
create policy "public_read" on categories   for select using (true);
create policy "public_read" on works        for select using (true);
create policy "public_read" on work_images  for select using (true);
create policy "public_read" on experience   for select using (true);
create policy "public_read" on testimonials for select using (true);
create policy "public_read" on social_links for select using (true);

-- Anyone can submit the contact form
create policy "public_insert" on messages for insert with check (true);

-- Authenticated admin has full access
create policy "admin_all" on hero         for all using (auth.role() = 'authenticated');
create policy "admin_all" on about        for all using (auth.role() = 'authenticated');
create policy "admin_all" on services     for all using (auth.role() = 'authenticated');
create policy "admin_all" on categories   for all using (auth.role() = 'authenticated');
create policy "admin_all" on works        for all using (auth.role() = 'authenticated');
create policy "admin_all" on work_images  for all using (auth.role() = 'authenticated');
create policy "admin_all" on experience   for all using (auth.role() = 'authenticated');
create policy "admin_all" on testimonials for all using (auth.role() = 'authenticated');
create policy "admin_all" on messages     for all using (auth.role() = 'authenticated');
create policy "admin_all" on social_links for all using (auth.role() = 'authenticated');

-- ===  SEED DATA  ================================================
-- Explicit id=1 for singletons so ON CONFLICT (id) is safe.
-- WHERE NOT EXISTS guards prevent duplicate rows on re-runs.
-- No HTML, no apostrophes, no em dashes -- avoids editor encoding bugs.

insert into hero (
  id, name, headline, intro,
  cta_primary_label, cta_primary_href,
  cta_secondary_label, cta_secondary_href
) values (
  1,
  'Arya Suresh',
  'Technical Content Writer turning complex engineering into content people actually read.',
  'Technical Web Content Writer specialising in engineering, developer-focused, and SEO/AEO-optimised content. Helping software companies explain what they build - clearly, credibly, and in a way that ranks.',
  'View My Work', '#works',
  'Get in Touch', '#contact'
) on conflict (id) do nothing;

insert into about (
  id, biography, philosophy, experience_summary,
  years_experience, articles_published, clients_count
) values (
  1,
  'Technical Web Content Writer based in Mangaluru, India, with a focus on engineering and developer-focused content. As the first in-house Technical Writer at Cubet, the content function was built from the ground up - researching unfamiliar subjects deeply, structuring them clearly, and turning them into impactful, search-optimised content. This work helped bring 100+ transactional keywords into SERP ranking and powered a full website revamp.',
  'Good technical content is not about sounding clever - it is about being useful. Writing to meet both the reader intent and the search engine, so the result is clear, credible, and impossible to ignore.',
  'Specialising in technical writing, SEO/AEO content strategy, and developer-focused documentation across web, mobile, and cloud technologies.',
  5, 250, 100
) on conflict (id) do nothing;

insert into services (title, description, "order")
select title, description, ord from (values
  ('Technical Writing',         'Documentation, guides, and explainers that make complex engineering products easy to understand.',   0),
  ('SEO and AEO Content',       'Search and answer-engine-optimised content built to rank and to win AI-driven search results.',     1),
  ('Developer-Focused Content', 'Tutorials, API content, and deep-dives written for technical audiences.',                           2),
  ('Website Copy and Revamp',   'End-to-end website content from information architecture to conversion-focused page copy.',         3),
  ('Blog and Article Writing',  'Long-form editorial that builds authority and drives organic, intent-led traffic.',                  4),
  ('Content Strategy',          'Keyword research, content planning, and polished publish-ready editing.',                           5)
) as v(title, description, ord)
where not exists (select 1 from services limit 1);

insert into categories (name, slug) values
  ('Technical Articles', 'technical-articles'),
  ('Case Studies',       'case-studies'),
  ('Developer Guides',   'developer-guides'),
  ('SEO Content',        'seo-content'),
  ('Blog Articles',      'blog-articles')
on conflict (slug) do nothing;

insert into works (title, slug, description, tags, is_featured, is_published, "order", category_id, published_date)
select
  'Ranking 100+ Transactional Keywords',
  'ranking-100-transactional-keywords',
  'How a content-first strategy took a software company from invisible to first-page rankings across 100+ high-intent keywords.',
  'seo,content-strategy,case-study,saas',
  true, true, 0, c.id, '2025-01-14'
from categories c where c.slug = 'case-studies'
on conflict (slug) do nothing;

insert into works (title, slug, description, tags, is_featured, is_published, "order", category_id, published_date)
select
  'Building Scalable Laravel Applications',
  'building-scalable-laravel-applications',
  'Practical patterns for structuring Laravel apps that stay maintainable as teams and traffic grow.',
  'laravel,php,backend,developer',
  true, true, 1, c.id, '2025-02-14'
from categories c where c.slug = 'developer-guides'
on conflict (slug) do nothing;

insert into works (title, slug, description, tags, is_featured, is_published, "order", category_id, published_date)
select
  'AEO vs SEO: Writing Content That Wins in AI Search',
  'aeo-vs-seo-writing-content-for-ai-search',
  'Search is shifting from links to answers. Here is how to write content that earns the citation, not just the click.',
  'aeo,seo,ai-search,strategy',
  false, true, 2, c.id, '2025-03-14'
from categories c where c.slug = 'seo-content'
on conflict (slug) do nothing;

insert into experience (company, role, description, start_date, end_date, "order")
select company, role, description, start_date, end_date, ord from (values
  ('Cubet',    'Technical Content Writer',
   'First in-house technical writer at Cubet. Built the content function from scratch - delivering SEO/AEO-optimised content that brought 100+ transactional keywords into SERP ranking, and taking full ownership of the company website revamp.',
   '2022', 'Present', 0),
  ('Freelance', 'Content Writer',
   'Wrote web and marketing content for technology and engineering clients across web, mobile, and cloud domains.',
   '2020', '2022', 1)
) as v(company, role, description, start_date, end_date, ord)
where not exists (select 1 from experience limit 1);

insert into testimonials (client_name, company, role, message, "order")
select client_name, company, role, message, ord from (values
  ('Kiran R', 'Cubet', 'Engineering Leader',
   'Arya was our first in-house Technical Writer, and she set the benchmark extremely high. Give her a topic and she will dig into the details, understand the subject thoroughly, and turn it into clear, structured, impactful content. Her SEO/AEO work brought 100+ transactional keywords into SERP ranking. Any team would be fortunate to have her.',
   0)
) as v(client_name, company, role, message, ord)
where not exists (select 1 from testimonials limit 1);

insert into social_links (platform, url, icon, "order")
select platform, url, icon, ord from (values
  ('LinkedIn', 'https://www.linkedin.com/in/arya-suresh', 'linkedin', 0),
  ('Email',    'mailto:aryasuresh0987@gmail.com',          'mail',     1),
  ('Medium',   'https://medium.com',                       'medium',   2)
) as v(platform, url, icon, ord)
where not exists (select 1 from social_links limit 1);
