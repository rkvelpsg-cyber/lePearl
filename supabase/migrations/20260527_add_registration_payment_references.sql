-- Store paid-registration payment verification references on student_registrations.

alter table public.student_registrations
  add column if not exists payment_mode text,
  add column if not exists payment_status text,
  add column if not exists payment_amount numeric(12,2),
  add column if not exists razorpay_order_id text,
  add column if not exists razorpay_payment_id text,
  add column if not exists razorpay_signature text,
  add column if not exists payment_verified_at timestamptz;

create index if not exists idx_student_registrations_payment_status
  on public.student_registrations (payment_status);

create index if not exists idx_student_registrations_razorpay_payment_id
  on public.student_registrations (razorpay_payment_id);
