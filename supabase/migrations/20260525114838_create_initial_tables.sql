-- users テーブルはSupabase Authが自動生成するため作成不要

-- profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  account_name varchar(50) unique,
  display_name varchar(50),
  bio text,
  avatar_url text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(50) not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- books
create table public.books (
  id uuid primary key default gen_random_uuid(),
  google_books_id varchar(20) unique,
  title text not null,
  author varchar(100),
  thumbnail_url text,
  isbn varchar(13),
  page_count int,
  description text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- user_books
create table public.user_books (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  status int not null default 0,
  is_favorite boolean not null default false,
  started_at date,
  finished_at date,
  progress_page int,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- memos
create table public.memos (
  id uuid primary key default gen_random_uuid(),
  user_book_id uuid references public.user_books(id) on delete cascade not null,
  content text not null,
  is_important boolean not null default false,
  page_number int,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- tags
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  name varchar(50) not null,
  color varchar(7) not null default '#3B82F6',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- memo_tags
create table public.memo_tags (
  memo_id uuid references public.memos(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  primary key (memo_id, tag_id)
);

-- studies
create table public.studies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  duration_minutes int not null,
  note text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- updated_at 自動更新トリガー
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.categories for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.books for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.user_books for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.memos for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.tags for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.memo_tags for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.studies for each row execute function public.update_updated_at();

-- RLS有効化
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.books enable row level security;
alter table public.user_books enable row level security;
alter table public.memos enable row level security;
alter table public.tags enable row level security;
alter table public.memo_tags enable row level security;
alter table public.studies enable row level security;

-- categoriesの初期データ
insert into public.categories (name) values
  ('プログラミング'),
  ('読書'),
  ('資格'),
  ('その他');