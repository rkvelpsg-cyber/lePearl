import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    /* ── verify caller is an authenticated student ── */
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

    /* ── validate input ── */
    const body = await req.json();
    const amount = Number(body.amount);
    if (!amount || isNaN(amount) || amount <= 0 || amount > 500000) {
      return NextResponse.json(
        { error: "Invalid amount. Must be between ₹1 and ₹5,00,000." },
        { status: 400 },
      );
    }

    /* ── check Razorpay keys are configured ── */
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (
      !keyId ||
      !keySecret ||
      keyId.includes("REPLACE") ||
      keySecret.includes("REPLACE")
    ) {
      return NextResponse.json(
        { error: "Payment gateway is not configured. Contact support." },
        { status: 503 },
      );
    }

    /* ── create Razorpay order ── */
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${userData.user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        description: String(body.description || "Course fee payment").slice(
          0,
          255,
        ),
        student_id: userData.user.id,
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Order creation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
