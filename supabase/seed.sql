-- ================================================================
-- Portfolio CMS -- QUERY 2 of 2: Seed data
-- Run this AFTER schema.sql succeeds.
-- Supabase -> SQL Editor -> New query -> paste -> Run
--
-- Strings are kept short on purpose.
-- Add full bio / descriptions via the Admin dashboard (/admin).
-- ================================================================

insert into hero (id, name, headline, cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href)
values (1, 'Arya Suresh', 'Technical Content Writer', 'View My Work', '#works', 'Get in Touch', '#contact')
on conflict (id) do nothing;

insert into about (id, years_experience, articles_published, clients_count)
values (1, 5, 250, 100)
on conflict (id) do nothing;

insert into categories (name, slug) values
  ('Technical Articles', 'technical-articles'),
  ('Case Studies',       'case-studies'),
  ('Developer Guides',   'developer-guides'),
  ('SEO Content',        'seo-content'),
  ('Blog Articles',      'blog-articles')
on conflict (slug) do nothing;

do $guard$ begin
  if not exists (select 1 from services limit 1) then
    insert into services (title, "order") values
      ('Technical Writing',         0),
      ('SEO and AEO Content',       1),
      ('Developer-Focused Content', 2),
      ('Website Copy and Revamp',   3),
      ('Blog and Article Writing',  4),
      ('Content Strategy',          5);
  end if;
end $guard$;

insert into works (title, slug, tags, is_featured, is_published, "order", category_id, published_date)
select 'Ranking 100+ Transactional Keywords', 'ranking-100-transactional-keywords',
       'seo,content-strategy,case-study', true, true, 0, c.id, '2025-01-14'
from categories c where c.slug = 'case-studies'
on conflict (slug) do nothing;

insert into works (title, slug, tags, is_featured, is_published, "order", category_id, published_date)
select 'Building Scalable Laravel Apps', 'building-scalable-laravel-apps',
       'laravel,php,backend,developer', true, true, 1, c.id, '2025-02-14'
from categories c where c.slug = 'developer-guides'
on conflict (slug) do nothing;

insert into works (title, slug, tags, is_featured, is_published, "order", category_id, published_date)
select 'AEO vs SEO in AI Search', 'aeo-vs-seo-in-ai-search',
       'aeo,seo,ai-search,strategy', false, true, 2, c.id, '2025-03-14'
from categories c where c.slug = 'seo-content'
on conflict (slug) do nothing;

do $guard2$ begin
  if not exists (select 1 from experience limit 1) then
    insert into experience (company, role, start_date, end_date, "order") values
      ('Cubet',    'Technical Content Writer', '2022', 'Present', 0),
      ('Freelance','Content Writer',           '2020', '2022',    1);
  end if;
end $guard2$;

do $guard3$ begin
  if not exists (select 1 from testimonials limit 1) then
    insert into testimonials (client_name, company, role, message, "order") values
      ('Kiran R', 'Cubet', 'Engineering Leader', 'Outstanding technical writer who raised the bar for everyone.', 0);
  end if;
end $guard3$;

do $guard4$ begin
  if not exists (select 1 from social_links limit 1) then
    insert into social_links (platform, url, icon, "order") values
      ('LinkedIn', 'https://www.linkedin.com/in/arya-suresh', 'linkedin', 0),
      ('Email',    'mailto:aryasuresh0987@gmail.com',          'mail',     1),
      ('Medium',   'https://medium.com',                       'medium',   2);
  end if;
end $guard4$;
