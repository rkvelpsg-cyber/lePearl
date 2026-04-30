import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    /* ── verify caller is authenticated ── */
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data: userData, error: userErr } =
      await supabaseAnon.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = userData.user.id;

    /* ── parse and validate body ── */
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      description,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 },
      );
    }

    /* ── verify Razorpay signature ── */
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || keySecret.includes("REPLACE")) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 503 },
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment signature mismatch. Possible tampering detected." },
        { status: 400 },
      );
    }

    /* ── save verified payment to database ── */
    const supabase = createServerClient();
    const { error: insertError } = await supabase.from("payments").insert({
      student_user_id: userId,
      amount: Number(amount) / 100, // convert paise → rupees
      status: "paid",
      payment_mode: "razorpay",
      razorpay_payment_id,
      description: String(description || "Course fee payment").slice(0, 255),
      payment_date: new Date().toISOString(),
    });

    if (insertError) {
      console.error("[payment/verify] DB insert error:", insertError);
      return NextResponse.json(
        {
          error:
            "Payment recorded by Razorpay but failed to save. Contact support with payment ID: " +
            razorpay_payment_id,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
