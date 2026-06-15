import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type LookupBody = {
  loginId?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeLoginId(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LookupBody;
    const loginId = normalizeLoginId(body.loginId ?? "");

    if (!loginId) {
      return NextResponse.json(
        { error: "Username or email is required." },
        { status: 400 },
      );
    }

    const service = createServerClient();

    if (isValidEmail(loginId)) {
      const { data: matchingProfiles, error: matchingProfilesError } =
        await service
          .from("profiles")
          .select("user_id")
          .eq("role", "student")
          .ilike("email", loginId)
          .order("created_at", { ascending: false })
          .limit(5);

      if (matchingProfilesError) throw matchingProfilesError;

      const matches = matchingProfiles ?? [];

      if (matches.length > 1) {
        return NextResponse.json(
          {
            error:
              "Multiple course accounts are linked to this email. Please login with your username for the selected course.",
          },
          { status: 409 },
        );
      }

      if (matches.length === 1 && matches[0].user_id) {
        const { data: userData, error: userError } =
          await service.auth.admin.getUserById(matches[0].user_id);

        if (userError || !userData.user?.email) {
          return NextResponse.json(
            { error: "Unable to resolve login email." },
            { status: 404 },
          );
        }

        return NextResponse.json({ email: userData.user.email.toLowerCase() });
      }

      // Backward compatibility for legacy direct email logins.
      return NextResponse.json({ email: loginId });
    }

    const { data: profile, error: profileError } = await service
      .from("profiles")
      .select("user_id")
      .eq("role", "student")
      .ilike("username", loginId)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile?.user_id) {
      return NextResponse.json(
        { error: "Invalid username or email." },
        { status: 404 },
      );
    }

    const { data: userData, error: userError } =
      await service.auth.admin.getUserById(profile.user_id);

    if (userError || !userData.user?.email) {
      return NextResponse.json(
        { error: "Unable to resolve login email." },
        { status: 404 },
      );
    }

    return NextResponse.json({ email: userData.user.email.toLowerCase() });
  } catch (error) {
    console.error("student-login-lookup error:", error);
    return NextResponse.json(
      { error: "Failed to resolve student login." },
      { status: 500 },
    );
  }
}
