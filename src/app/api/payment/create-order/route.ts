import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  void req;
  return NextResponse.json(
    {
      error:
        "Online payment is temporarily disabled. Razorpay will be enabled later.",
    },
    { status: 503 },
  );
}
