import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function createUploadClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "Supabase environment variable is not configured (NEXT_PUBLIC_SUPABASE_URL)",
    );
  }

  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  if (!anonKey) {
    throw new Error(
      "Supabase environment variables are not configured (NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY)",
    );
  }

  // Fallback for local/dev setups without service role key.
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createUploadClient(token);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const mockTestId = formData.get("mockTestId");
    const scope = (formData.get("scope") as string | null) ?? "question";
    const questionId = formData.get("questionId");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (!mockTestId) {
      return NextResponse.json(
        { error: "Missing mock test id" },
        { status: 400 },
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (scope === "full" && !isPdf) {
      return NextResponse.json(
        { error: "Only PDF files are allowed for full sheet uploads" },
        { status: 400 },
      );
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const testId = String(mockTestId);
    const questionSegment =
      scope === "full" ? "full" : String(questionId ?? "general");
    const timestampedName = `${Date.now()}_${safeFileName}`;
    const pathCandidates = [
      `descriptive/${testId}/${user.id}/${questionSegment}/${timestampedName}`,
    ];

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let uploadedPath: string | null = null;
    let lastError: string | null = null;

    for (const candidatePath of pathCandidates) {
      const { error: uploadError } = await supabase.storage
        .from("test-submissions")
        .upload(candidatePath, buffer, {
          upsert: true,
          contentType: file.type || "application/octet-stream",
        });

      if (!uploadError) {
        uploadedPath = candidatePath;
        break;
      }

      lastError = uploadError.message;
    }

    if (!uploadedPath) {
      return NextResponse.json(
        { error: lastError || "Upload blocked by storage policy" },
        { status: 400 },
      );
    }

    const { data: publicData } = supabase.storage
      .from("test-submissions")
      .getPublicUrl(uploadedPath);

    return NextResponse.json({
      publicUrl: publicData.publicUrl,
      path: uploadedPath,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
