-- Add username + first-login password reset flags for student credential provisioning.

alter table public.profiles
  add column if not exists username text;

create unique index if not exists idx_profiles_username_unique
  on public.profiles (lower(username))
  where username is not null;

alter table public.student_profiles
  add column if not exists must_reset_password boolean not null default false;
