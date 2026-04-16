import { createClient } from "./client";

export async function getUserRole() {
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    return data?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user) throw new Error("No user returned from sign in");

    // Fetch user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    return {
      user: data.user,
      role: profile?.role || null,
      sessionError: null,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      user: null,
      role: null,
      sessionError: error instanceof Error ? error.message : "Sign in failed",
    };
  }
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return error;
}
