-- ============================================================
-- Study Materials for faculty/student dashboards
-- ============================================================

create table if not exists public.study_materials (
  id bigserial primary key,
  batch_id bigint references public.batches(id) on delete cascade,
  faculty_user_id uuid references public.profiles(user_id) on delete set null,
  title text not null,
  description text,
  subject text,
  drive_link text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.study_materials enable row level security;

drop policy if exists study_materials_read on public.study_materials;
create policy study_materials_read on public.study_materials
  for select to authenticated using (is_active = true);

drop policy if exists study_materials_faculty_manage on public.study_materials;
create policy study_materials_faculty_manage on public.study_materials
  for all
  using (public.current_user_role() in ('faculty', 'admin'))
  with check (public.current_user_role() in ('faculty', 'admin'));

drop trigger if exists trg_study_materials_updated_at on public.study_materials;
create trigger trg_study_materials_updated_at
  before update on public.study_materials
  for each row execute function public.set_updated_at();

create index if not exists idx_study_materials_batch_id
  on public.study_materials(batch_id);

create index if not exists idx_study_materials_faculty_user_id
  on public.study_materials(faculty_user_id);
