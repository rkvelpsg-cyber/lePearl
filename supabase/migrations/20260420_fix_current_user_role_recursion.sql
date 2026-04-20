-- Fix recursive RLS evaluation for current_user_role().
-- The original function queried public.profiles under invoker rights,
-- while profiles policies also called current_user_role(), causing 54001 stack depth errors.

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.user_id = auth.uid()
  limit 1;
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to anon, authenticated, service_role;
