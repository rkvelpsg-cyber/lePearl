import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ReviewBody = {
  id?: string;
  status?: "pending" | "approved" | "rejected";
  reviewNotes?: string;
};

function sanitizeEnv(value?: string) {
  if (!value) return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

async function verifyAdminFromToken(token: string) {
  const cleanedToken = token.trim();
  if (!cleanedToken) return null;

  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!url || !anonKey) return null;

  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${cleanedToken}` } },
  });

  const { data: tokenData, error: tokenError } = await anon.auth.getUser();
  if (tokenError || !tokenData.user) return null;

  const userId = tokenData.user.id;
  const { data: rpcRole } = await anon.rpc("current_user_role");
  const role = String(rpcRole || "").toLowerCase();
  if (role === "admin" || role === "super_admin" || role === "administrator") {
    return userId;
  }

  try {
    const service = createServerClient();
    const { data: adminProfile } = await service
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminProfile?.user_id) return userId;
  } catch {
    return null;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReviewBody;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUserId = await verifyAdminFromToken(token);
    if (!adminUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = body.id?.trim();
    if (!id) {
      return NextResponse.json(
        { error: "Faculty registration ID is required." },
        { status: 400 },
      );
    }

    const normalizedStatus = String(body.status || "").toLowerCase();
    if (
      normalizedStatus !== "pending" &&
      normalizedStatus !== "approved" &&
      normalizedStatus !== "rejected"
    ) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const service = createServerClient();
    const { error } = await service
      .from("faculty_registrations")
      .update({
        status: normalizedStatus,
        reviewed_by: adminUserId,
        reviewed_at: new Date().toISOString(),
        review_notes: body.reviewNotes?.trim() || null,
      })
      .eq("id", id);

    if (error) throw error;

    await service.from("activity_logs").insert({
      actor_user_id: adminUserId,
      actor_role: "admin",
      action: `faculty_registration_${normalizedStatus}`,
      entity_name: "faculty_registrations",
      entity_id: id,
      details: {
        status: normalizedStatus,
        reviewNotes: body.reviewNotes?.trim() || null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `Faculty registration marked as ${normalizedStatus}.`,
    });
  } catch (error) {
    console.error("faculty registration review error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to review request.",
      },
      { status: 500 },
    );
  }
}
