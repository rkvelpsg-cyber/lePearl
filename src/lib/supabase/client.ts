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
  for (const key of scopedKeys) {
    window.sessionStorage.removeItem(key);
    window.localStorage.removeItem(key);
  }

  const legacyKeyPattern = /^sb-.*-auth-token$/;
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
