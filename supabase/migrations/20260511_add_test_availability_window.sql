-- Add 48-hour availability window for tests
-- Tests will be available from scheduled_at to scheduled_at + 48 hours

alter table public.mock_tests
add column if not exists available_until timestamptz;

-- Backfill available_until for existing tests with scheduled_at
update public.mock_tests
set available_until = scheduled_at + interval '48 hours'
where scheduled_at is not null
  and available_until is null;

-- Create an index for efficient queries on availability
create index if not exists idx_mock_tests_available_until 
on public.mock_tests(available_until);

-- Add comment to clarify the 48-hour window
comment on column public.mock_tests.available_until is '48-hour availability window: tests are available until this timestamp';
