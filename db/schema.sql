-- Strix Production content on Neon (Postgres), served to the browser by the
-- Neon Data API with Neon Auth.
--
-- Each table keeps the former Firestore document as `data` (same field names
-- the site and the studio already map) under the same document id, so
-- /blog/:id and /case-study/:id URLs keep working. Columns the site filters
-- on are generated from `data`, so writes only ever send `data`.
--
-- Run order (see README → "Neon database"):
--   1. Enable the Data API with Neon Auth on the branch (creates the
--      `anonymous` / `authenticated` roles and auth.user_id()).
--   2. Run this file (npm run db:schema, or paste it into the SQL Editor).
--   3. Add each studio user to `admins` after they exist in Neon Auth.
-- Safe to run again.

create table if not exists projects (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  data jsonb not null default '{}'::jsonb,
  status text generated always as (coalesce(data->>'status', 'draft')) stored,
  link text generated always as (data->>'link') stored
);
create index if not exists projects_status_idx on projects (status);
create index if not exists projects_link_idx on projects (link);

create table if not exists case_studies (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  data jsonb not null default '{}'::jsonb,
  status text generated always as (coalesce(data->>'status', 'draft')) stored,
  project_id text generated always as (data->>'projectId') stored
);
create index if not exists case_studies_project_idx on case_studies (project_id, status);

create table if not exists blogs (
  id text primary key default replace(gen_random_uuid()::text, '-', ''),
  data jsonb not null default '{}'::jsonb,
  status text generated always as (coalesce(data->>'status', 'draft')) stored
);
create index if not exists blogs_status_idx on blogs (status);

-- Studio allow-list: Neon Auth user ids (neon_auth.user.id). Managed in SQL only.
create table if not exists admins (
  user_id text primary key,
  email text,
  created_at timestamptz not null default now()
);

create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.user_id())
$$;

grant usage on schema public to anonymous, authenticated;
grant execute on function is_admin() to anonymous, authenticated;
grant select on projects, case_studies, blogs to anonymous, authenticated;
grant insert, update, delete on projects, case_studies, blogs to authenticated;
revoke all on admins from anonymous, authenticated;

alter table projects enable row level security;
alter table case_studies enable row level security;
alter table blogs enable row level security;
alter table admins enable row level security;

-- Visitors (and signed-in non-admins) see published rows only.
drop policy if exists "published projects are public" on projects;
create policy "published projects are public" on projects
  for select to anonymous, authenticated using (status = 'published');
drop policy if exists "admins manage projects" on projects;
create policy "admins manage projects" on projects
  for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "published case studies are public" on case_studies;
create policy "published case studies are public" on case_studies
  for select to anonymous, authenticated using (status = 'published');
drop policy if exists "admins manage case studies" on case_studies;
create policy "admins manage case studies" on case_studies
  for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "published blogs are public" on blogs;
create policy "published blogs are public" on blogs
  for select to anonymous, authenticated using (status = 'published');
drop policy if exists "admins manage blogs" on blogs;
create policy "admins manage blogs" on blogs
  for all to authenticated using (is_admin()) with check (is_admin());
