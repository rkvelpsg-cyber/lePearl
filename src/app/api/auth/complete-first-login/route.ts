import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function getUserFromToken(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase client configuration is missing.");
  }

  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: userData, error: userError } = await anon.auth.getUser(token);
  if (userError || !userData.user) {
    return null;
  }

  const { data: profile, error: profileError } = await anon
    .from("profiles")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (profileError || !profile?.role) {
    return null;
  }

  return { userId: userData.user.id, role: profile.role as string };
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokenUser = await getUserFromToken(token);
    if (!tokenUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = createServerClient();
    const normalizedRole = tokenUser.role.toLowerCase();

    if (normalizedRole !== "student" && normalizedRole !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tableName =
      normalizedRole === "faculty" ? "profiles" : "student_profiles";

    const { error: updateError } = await service
      .from(tableName)
      .update({ must_reset_password: false })
      .eq("user_id", tokenUser.userId);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("complete-first-login error:", error);
    return NextResponse.json(
      { error: "Failed to complete first-login setup." },
      { status: 500 },
    );
  }
}
