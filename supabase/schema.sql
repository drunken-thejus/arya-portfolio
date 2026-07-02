-- ================================================================
-- Portfolio CMS -- QUERY 1 of 2: Tables + RLS
-- Supabase -> SQL Editor -> New query -> paste -> Run
-- After this succeeds, run seed.sql as a second query.
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

alter table hero          alter column name         set default '';
alter table hero          alter column headline      set default '';
alter table hero          alter column intro         set default '';
alter table hero          alter column created_at   set default now();
alter table hero          alter column updated_at   set default now();
alter table about         alter column biography          set default '';
alter table about         alter column philosophy         set default '';
alter table about         alter column experience_summary set default '';
alter table about         alter column years_experience   set default 0;
alter table about         alter column articles_published set default 0;
alter table about         alter column clients_count      set default 0;
alter table about         alter column created_at   set default now();
alter table about         alter column updated_at   set default now();
alter table services      alter column created_at   set default now();
alter table services      alter column updated_at   set default now();
alter table services      alter column description  set default '';
alter table services      alter column "order"      set default 0;
alter table categories    alter column created_at   set default now();
alter table categories    alter column updated_at   set default now();
alter table works         alter column created_at   set default now();
alter table works         alter column updated_at   set default now();
alter table works         alter column description  set default '';
alter table works         alter column content      set default '';
alter table works         alter column tags         set default '';
alter table works         alter column is_featured  set default false;
alter table works         alter column is_published set default true;
alter table works         alter column "order"      set default 0;
alter table work_images   alter column created_at   set default now();
alter table work_images   alter column updated_at   set default now();
alter table work_images   alter column "order"      set default 0;
alter table experience    alter column created_at   set default now();
alter table experience    alter column updated_at   set default now();
alter table experience    alter column description  set default '';
alter table experience    alter column "order"      set default 0;
alter table testimonials  alter column created_at   set default now();
alter table testimonials  alter column updated_at   set default now();
alter table testimonials  alter column "order"      set default 0;
alter table messages      alter column created_at   set default now();
alter table messages      alter column updated_at   set default now();
alter table messages      alter column is_read      set default false;
alter table social_links  alter column created_at   set default now();
alter table social_links  alter column updated_at   set default now();
alter table social_links  alter column "order"      set default 0;

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

-- Drop then recreate policies so this script is safe to re-run
drop policy if exists "public_read"   on hero;
drop policy if exists "public_read"   on about;
drop policy if exists "public_read"   on services;
drop policy if exists "public_read"   on categories;
drop policy if exists "public_read"   on works;
drop policy if exists "public_read"   on work_images;
drop policy if exists "public_read"   on experience;
drop policy if exists "public_read"   on testimonials;
drop policy if exists "public_read"   on social_links;
drop policy if exists "public_insert" on messages;
drop policy if exists "admin_all"     on hero;
drop policy if exists "admin_all"     on about;
drop policy if exists "admin_all"     on services;
drop policy if exists "admin_all"     on categories;
drop policy if exists "admin_all"     on works;
drop policy if exists "admin_all"     on work_images;
drop policy if exists "admin_all"     on experience;
drop policy if exists "admin_all"     on testimonials;
drop policy if exists "admin_all"     on messages;
drop policy if exists "admin_all"     on social_links;

create policy "public_read"   on hero         for select using (true);
create policy "public_read"   on about        for select using (true);
create policy "public_read"   on services     for select using (true);
create policy "public_read"   on categories   for select using (true);
create policy "public_read"   on works        for select using (true);
create policy "public_read"   on work_images  for select using (true);
create policy "public_read"   on experience   for select using (true);
create policy "public_read"   on testimonials for select using (true);
create policy "public_read"   on social_links for select using (true);
create policy "public_insert" on messages     for insert with check (true);
create policy "admin_all"     on hero         for all using (auth.role() = 'authenticated');
create policy "admin_all"     on about        for all using (auth.role() = 'authenticated');
create policy "admin_all"     on services     for all using (auth.role() = 'authenticated');
create policy "admin_all"     on categories   for all using (auth.role() = 'authenticated');
create policy "admin_all"     on works        for all using (auth.role() = 'authenticated');
create policy "admin_all"     on work_images  for all using (auth.role() = 'authenticated');
create policy "admin_all"     on experience   for all using (auth.role() = 'authenticated');
create policy "admin_all"     on testimonials for all using (auth.role() = 'authenticated');
create policy "admin_all"     on messages     for all using (auth.role() = 'authenticated');
create policy "admin_all"     on social_links for all using (auth.role() = 'authenticated');
