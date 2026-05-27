-- Expand student_registrations to support the paid/free workflow snapshot.

alter table public.student_registrations
  add column if not exists mode text,
  add column if not exists registration_no text,
  add column if not exists username text,
  add column if not exists accepted_terms boolean not null default false,
  add column if not exists accepted_privacy boolean not null default false,
  add column if not exists accepted_refund boolean not null default false,
  add column if not exists is_pearlian boolean not null default false,
  add column if not exists pearlian_eligible boolean not null default false,
  add column if not exists include_books_addon boolean not null default false,
  add column if not exists base_course_fee numeric(12,2),
  add column if not exists discount_amount numeric(12,2),
  add column if not exists books_fee numeric(12,2),
  add column if not exists final_payable numeric(12,2),
  add column if not exists heard_about_us text;

do $$
begin
  alter table public.student_registrations
    add constraint student_registrations_mode_check
    check (mode is null or mode in ('paid', 'free'));
exception
  when duplicate_object then null;
end $$;

create index if not exists idx_student_registrations_mode
  on public.student_registrations (mode);

create index if not exists idx_student_registrations_registration_no
  on public.student_registrations (registration_no);
