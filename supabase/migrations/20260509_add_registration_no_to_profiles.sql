alter table public.profiles
  add column if not exists registration_no text;

update public.profiles p
set registration_no = sp.registration_no
from public.student_profiles sp
where p.user_id = sp.user_id
  and (p.registration_no is null or p.registration_no = '')
  and sp.registration_no is not null
  and sp.registration_no <> '';
