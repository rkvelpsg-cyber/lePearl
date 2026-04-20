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
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password.trim(),
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
    const errorMessage =
      error instanceof Error ? error.message : "Sign in failed";
    const isInvalidCredentials = errorMessage
      .toLowerCase()
      .includes("invalid login credentials");

    // Invalid credentials are expected user input errors, so avoid noisy console errors.
    if (!isInvalidCredentials) {
      console.error("Sign in error:", error);
    }

    return {
      user: null,
      role: null,
      sessionError: isInvalidCredentials
        ? "Invalid email or password. Please check and try again."
        : errorMessage,
    };
  }
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  return error;
}

export async function signOutIfRoleMismatch(
  actualRole: string | null,
  expectedRole: "student" | "faculty" | "admin",
) {
  if (!actualRole || actualRole !== expectedRole) {
    await signOut();
    return true;
  }

  return false;
}
