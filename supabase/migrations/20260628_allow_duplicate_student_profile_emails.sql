-- Allow one contact email to be used across multiple student course accounts.
-- This keeps username-based login as the source of truth for multi-course students.

do $$
declare
  rec record;
begin
  -- Drop any UNIQUE constraints on profiles.email (legacy environments only).
  for rec in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    join unnest(c.conkey) as ck(attnum) on true
    join pg_attribute a on a.attrelid = t.oid and a.attnum = ck.attnum
    where n.nspname = 'public'
      and t.relname = 'profiles'
      and c.contype = 'u'
    group by c.conname
    having bool_or(a.attname = 'email')
  loop
    execute format('alter table public.profiles drop constraint if exists %I', rec.conname);
  end loop;

  -- Drop any legacy UNIQUE indexes on profiles.email / lower(email).
  for rec in
    select i.indexname
    from pg_indexes i
    where i.schemaname = 'public'
      and i.tablename = 'profiles'
      and i.indexdef ilike 'create unique index%'
      and i.indexdef ilike '%email%'
  loop
    execute format('drop index if exists public.%I', rec.indexname);
  end loop;
end
$$;

create index if not exists idx_profiles_role_email
  on public.profiles(role, email);
