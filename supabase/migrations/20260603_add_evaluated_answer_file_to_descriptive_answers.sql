alter table public.descriptive_student_answers
  add column if not exists evaluated_answer_file_url text;