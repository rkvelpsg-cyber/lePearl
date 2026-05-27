import { createClient } from "@supabase/supabase-js";

function sanitizeEnv(value?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  // Many .env mistakes wrap values in quotes; strip one outer pair.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function isPlaceholderKey(value: string) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("replace_with_your_service_role_key") ||
    normalized.includes("replace_with_your_secret") ||
    normalized.includes("your_service_role_key") ||
    normalized.includes("your_secret_key")
  );
}

export function createServerClient() {
  const url = sanitizeEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      process.env.SUPABASE_PROJECT_URL,
  );
  const serviceKey = sanitizeEnv(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SECRET ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  );

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase environment variables are not configured (SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  if (isPlaceholderKey(serviceKey)) {
    throw new Error(
      "Supabase service key is still a placeholder in .env.local. Replace SUPABASE_SERVICE_ROLE_KEY with the real service_role key from the same Supabase project, then restart the dev server.",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
