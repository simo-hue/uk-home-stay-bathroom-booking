-- Profiles table to store user information
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  display_name text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reservations table
create table if not exists reservations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  duration_minutes integer not null default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table reservations enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Reservations policies
create policy "Reservations are viewable by everyone." on reservations
  for select using (true);

create policy "Users can insert their own reservations." on reservations
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own reservations." on reservations
  for delete using (auth.uid() = user_id);

-- Simple function to get profiles
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
