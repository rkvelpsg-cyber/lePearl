alter table public.profiles
  add column if not exists must_reset_password boolean not null default false;

update public.profiles
set must_reset_password = false
where must_reset_password is null;
