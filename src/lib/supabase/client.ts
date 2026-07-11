import { createBrowserClient } from "@supabase/ssr";

export type AuthScope = "default" | "student" | "faculty" | "admin";

const storageKeyByScope: Record<Exclude<AuthScope, "default">, string> = {
  student: "lepearl-sb-student-auth",
  faculty: "lepearl-sb-faculty-auth",
  admin: "lepearl-sb-admin-auth",
};

export const createClient = (scope: AuthScope = "default") => {
  const options =
    scope === "default"
      ? undefined
      : {
          auth: {
            storageKey: storageKeyByScope[scope],
            storage:
              typeof window !== "undefined" ? window.sessionStorage : undefined,
            autoRefreshToken: scope === "admin" ? false : true,
            persistSession: true,
            detectSessionInUrl: false,
          },
        };

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options,
  );
};

export function clearScopedAuthStorage(scope: AuthScope = "default") {
  if (typeof window === "undefined") return;
  if (scope === "default") return;

  window.sessionStorage.removeItem(storageKeyByScope[scope]);
}

export function clearAllAuthStorage() {
  if (typeof window === "undefined") return;

  const scopedKeys = Object.values(storageKeyByScope);

  // Clear sessionStorage and localStorage (legacy / direct storage paths).
  for (const key of scopedKeys) {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
    // Also clear chunked variants used by @supabase/ssr v0.10+
    for (let i = 0; i < 10; i++) {
      window.sessionStorage.removeItem(`${key}.${i}`);
      window.localStorage.removeItem(`${key}.${i}`);
    }
  }

  // Clear cookies used by @supabase/ssr v0.10+ browser client.
  for (const key of scopedKeys) {
    clearCookieKey(key);
    for (let i = 0; i < 10; i++) {
      clearCookieKey(`${key}.${i}`);
    }
  }

  const legacyKeyPattern = /^sb-.*-auth-token/;
  for (let i = window.localStorage.length - 1; i >= 0; i -= 1) {
    const key = window.localStorage.key(i);
    if (key && legacyKeyPattern.test(key)) {
      window.localStorage.removeItem(key);
    }
  }

  for (let i = window.sessionStorage.length - 1; i >= 0; i -= 1) {
    const key = window.sessionStorage.key(i);
    if (key && legacyKeyPattern.test(key)) {
      window.sessionStorage.removeItem(key);
    }
  }
}

function clearCookieKey(name: string) {
  // Expire the cookie on both the current path and root path.
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=/`;
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=/; SameSite=Lax`;
}
