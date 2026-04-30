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
      : { auth: { storageKey: storageKeyByScope[scope] } };

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options,
  );
};
