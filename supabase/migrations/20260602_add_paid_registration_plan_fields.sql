alter table public.student_registrations
  add column if not exists payment_tenure text,
  add column if not exists selected_fee_label text;

create index if not exists idx_student_registrations_payment_tenure
  on public.student_registrations (payment_tenure);

create index if not exists idx_student_registrations_selected_fee_label
  on public.student_registrations (selected_fee_label);