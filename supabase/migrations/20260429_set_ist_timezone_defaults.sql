-- ============================================================
-- Set IST timezone defaults for DB sessions
-- ============================================================

-- Prefer database-wide default timezone (applies to new sessions)
do $$
begin
  begin
    execute 'alter database postgres set timezone to ''Asia/Kolkata''';
  exception
    when insufficient_privilege then
      raise notice 'Skipping alter database timezone: insufficient privilege';
    when undefined_object then
      raise notice 'Skipping alter database timezone: database not found';
  end;
end
$$;

-- Try role-level defaults used in Supabase environments
-- Wrapped so migration stays safe if role privileges are restricted
do $$
declare
  r text;
begin
  foreach r in array array['authenticator', 'anon', 'authenticated', 'service_role']
  loop
    begin
      execute format('alter role %I set timezone to ''Asia/Kolkata''', r);
    exception
      when undefined_object then
        raise notice 'Skipping timezone for role %: role missing', r;
      when insufficient_privilege then
        raise notice 'Skipping timezone for role %: insufficient privilege', r;
    end;
  end loop;
end
$$;
