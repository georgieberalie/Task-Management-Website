-- ==============================================================
-- KAN.BN / TASKS SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY
-- Run this in your Supabase project -> "SQL Editor" -> "Run"
-- ==============================================================

-- 1. USER PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Automatically create profile row when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'https://api.dicebear.com/7.x/initials/svg?seed=' || encode(new.email::bytea, 'hex')
  )
  on conflict (id) do update set
    email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. PROJECTS / BOARDS TABLE
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text default '',
  visibility text default 'private' check (visibility in ('public', 'workspace', 'private')),
  is_starred boolean default false,
  created_by uuid references auth.users on delete cascade not null,
  created_at timestamptz default now()
);

-- 3. PROJECT MEMBERS TABLE (Controls who has access to which project)
create table if not exists public.project_members (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text default 'member' check (role in ('owner', 'admin', 'member', 'viewer')),
  joined_at timestamptz default now(),
  unique(project_id, user_id)
);

-- 4. LISTS TABLE
create table if not exists public.lists (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  position integer default 0,
  created_at timestamptz default now()
);

-- Auto-add project creator as 'owner' in project_members
create or replace function public.handle_new_project()
returns trigger as $$
begin
  insert into public.project_members (project_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict do nothing;

  -- Create default 3 starter lists for the new project
  insert into public.lists (project_id, name, position) values
    (new.id, 'To Do', 0),
    (new.id, 'In Progress', 1),
    (new.id, 'Done', 2);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_project_created on public.projects;
create trigger on_project_created
  after insert on public.projects
  for each row execute procedure public.handle_new_project();

-- 5. PROJECT INVITES TABLE (Unique tokens for shareable join links)
create table if not exists public.project_invites (
  id uuid default gen_random_uuid() primary key,
  token text unique not null,
  project_id uuid references public.projects on delete cascade not null,
  created_by uuid references auth.users on delete cascade not null,
  role text default 'member' check (role in ('admin', 'member', 'viewer')),
  created_at timestamptz default now()
);

-- 6. CARDS TABLE
create table if not exists public.cards (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  list_id uuid references public.lists on delete cascade not null,
  title text not null,
  description text default '',
  position integer default 0,
  due_date timestamptz,
  labels jsonb default '[]'::jsonb,
  members jsonb default '[]'::jsonb,
  checklists jsonb default '[]'::jsonb,
  comments jsonb default '[]'::jsonb,
  attachments jsonb default '[]'::jsonb,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

-- ==============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation: Users can only see projects they belong to
-- ==============================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.project_invites enable row level security;
alter table public.lists enable row level security;
alter table public.cards enable row level security;

-- PROFILES
create policy "Allow authenticated users to read profiles" on public.profiles
  for select to authenticated using (true);

create policy "Allow users to update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- PROJECTS
create policy "Users can view projects they are members of" on public.projects
  for select to authenticated using (
    id in (select project_id from public.project_members where user_id = auth.uid())
    or created_by = auth.uid()
    or visibility = 'public'
  );

create policy "Users can create projects" on public.projects
  for insert to authenticated with check (auth.uid() = created_by);

create policy "Members can update their projects" on public.projects
  for update to authenticated using (
    id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Owners can delete their projects" on public.projects
  for delete to authenticated using (
    id in (select project_id from public.project_members where user_id = auth.uid() and role = 'owner')
  );

-- PROJECT MEMBERS
create policy "Members can view colleagues in same project" on public.project_members
  for select to authenticated using (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Allow joining project via invite" on public.project_members
  for insert to authenticated with check (user_id = auth.uid());

-- PROJECT INVITES
create policy "Members can create invite links" on public.project_invites
  for insert to authenticated with check (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Anyone authenticated can lookup an invite" on public.project_invites
  for select to authenticated using (true);

-- LISTS
create policy "Members can read lists" on public.lists
  for select to authenticated using (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Members can insert lists" on public.lists
  for insert to authenticated with check (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Members can update lists" on public.lists
  for update to authenticated using (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Members can delete lists" on public.lists
  for delete to authenticated using (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

-- CARDS
create policy "Members can read cards" on public.cards
  for select to authenticated using (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Members can insert cards" on public.cards
  for insert to authenticated with check (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Members can update cards" on public.cards
  for update to authenticated using (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

create policy "Members can delete cards" on public.cards
  for delete to authenticated using (
    project_id in (select project_id from public.project_members where user_id = auth.uid())
  );

-- Enable Realtime for live card moves
alter publication supabase_realtime add table public.cards;
alter publication supabase_realtime add table public.lists;
alter publication supabase_realtime add table public.projects;
