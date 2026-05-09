import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type AdminFacultyManageBody = {
  action?: "create" | "update" | "delete";
  facultyUserId?: string;
  facultyName?: string;
  phone?: string | null;
  facultyEmail?: string;
  username?: string;
  defaultPassword?: string;
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUsername(value: string) {
  return /^[a-zA-Z0-9._-]{4,32}$/.test(value);
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
  let createdUserId: string | null = null;

  try {
    const body = (await req.json()) as AdminFacultyManageBody;
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

    const action = body.action;
    if (action !== "create" && action !== "update" && action !== "delete") {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const service = createServerClient();

    const facultyUserId = body.facultyUserId?.trim() || null;

    if (action === "delete") {
      if (!facultyUserId) {
        return NextResponse.json(
          { error: "Faculty user ID is required for delete." },
          { status: 400 },
        );
      }

      const { error: deleteError } =
        await service.auth.admin.deleteUser(facultyUserId);

      if (deleteError) throw deleteError;

      await service.from("activity_logs").insert({
        actor_user_id: adminUserId,
        actor_role: "admin",
        action: "delete_faculty_credentials",
        entity_name: "profiles",
        entity_id: facultyUserId,
        details: { facultyUserId },
      });

      return NextResponse.json({
        ok: true,
        message: "Faculty removed successfully.",
      });
    }

    const facultyName = body.facultyName?.trim() || "";
    const phone = body.phone?.trim() || null;
    const facultyEmail = body.facultyEmail?.trim().toLowerCase() || "";
    const username = body.username?.trim().toLowerCase() || "";
    const defaultPassword = body.defaultPassword?.trim() || "";

    if (!facultyName || facultyName.length < 2) {
      return NextResponse.json(
        { error: "Faculty name is required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(facultyEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid faculty email ID." },
        { status: 400 },
      );
    }

    if (!isValidUsername(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 4-32 characters and can contain letters, numbers, dot, underscore, or hyphen.",
        },
        { status: 400 },
      );
    }

    if (action === "create" && defaultPassword.length < 8) {
      return NextResponse.json(
        { error: "Default password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const { data: usernameConflict } = await service
      .from("profiles")
      .select("user_id")
      .ilike("username", username)
      .neq("user_id", facultyUserId || "00000000-0000-0000-0000-000000000000")
      .maybeSingle();

    if (usernameConflict) {
      return NextResponse.json(
        { error: "Username already exists. Please choose another username." },
        { status: 409 },
      );
    }

    if (action === "create") {
      const { data: createdAuthUser, error: createUserError } =
        await service.auth.admin.createUser({
          email: facultyEmail,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            full_name: facultyName,
            username,
          },
        });

      if (createUserError || !createdAuthUser.user) {
        return NextResponse.json(
          {
            error: createUserError?.message || "Failed to create faculty user.",
          },
          { status: 400 },
        );
      }

      createdUserId = createdAuthUser.user.id;

      const { error: profileInsertError } = await service
        .from("profiles")
        .insert({
          user_id: createdUserId,
          role: "faculty",
          full_name: facultyName,
          phone,
          email: facultyEmail,
          username,
          must_reset_password: true,
          is_active: true,
        });

      if (profileInsertError) throw profileInsertError;

      await service.from("activity_logs").insert({
        actor_user_id: adminUserId,
        actor_role: "admin",
        action: "create_faculty_credentials",
        entity_name: "profiles",
        entity_id: createdUserId,
        details: {
          faculty_name: facultyName,
          username,
          email: facultyEmail,
        },
      });

      return NextResponse.json({
        ok: true,
        message:
          "Faculty created successfully. Faculty must change password on first login.",
      });
    }

    if (!facultyUserId) {
      return NextResponse.json(
        { error: "Faculty user ID is required for update." },
        { status: 400 },
      );
    }

    const password = defaultPassword || undefined;
    const { error: authUpdateError } = await service.auth.admin.updateUserById(
      facultyUserId,
      {
        email: facultyEmail,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: facultyName,
          username,
        },
      },
    );

    if (authUpdateError) throw authUpdateError;

    const { error: profileUpdateError } = await service
      .from("profiles")
      .update({
        full_name: facultyName,
        phone,
        email: facultyEmail,
        username,
        must_reset_password: Boolean(password),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", facultyUserId)
      .eq("role", "faculty");

    if (profileUpdateError) throw profileUpdateError;

    await service.from("activity_logs").insert({
      actor_user_id: adminUserId,
      actor_role: "admin",
      action: "update_faculty_credentials",
      entity_name: "profiles",
      entity_id: facultyUserId,
      details: {
        faculty_name: facultyName,
        username,
        email: facultyEmail,
        passwordUpdated: Boolean(password),
      },
    });

    return NextResponse.json({
      ok: true,
      message: Boolean(password)
        ? "Faculty updated. New password set and must be changed on next login."
        : "Faculty details updated successfully.",
    });
  } catch (error) {
    if (createdUserId) {
      try {
        const service = createServerClient();
        await service.auth.admin.deleteUser(createdUserId);
      } catch {
        // Ignore rollback error.
      }
    }

    console.error("admin faculty manage error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to manage faculty.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
