import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type IncomingWebhookBody = {
  to?: string;
  channel?: string;
  type?: string;
  text?: string;
  context?: Record<string, unknown>;
};

function getBearerToken(header: string | null) {
  if (!header) return "";
  const trimmed = header.trim();
  if (!trimmed.toLowerCase().startsWith("bearer ")) return "";
  return trimmed.slice(7).trim();
}

function maskPhone(phone: string) {
  if (phone.length < 4) return phone;
  return `${"*".repeat(Math.max(phone.length - 4, 0))}${phone.slice(-4)}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Local WhatsApp webhook endpoint is running.",
  });
}

export async function POST(req: NextRequest) {
  try {
    const expectedToken = process.env.WHATSAPP_WEBHOOK_AUTH_TOKEN?.trim() || "";
    const incomingToken = getBearerToken(req.headers.get("authorization"));

    if (expectedToken && incomingToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as IncomingWebhookBody;

    if (!body?.to || !body?.text) {
      return NextResponse.json(
        { error: "Payload must include 'to' and 'text'." },
        { status: 400 },
      );
    }

    // Local debugging endpoint: confirms webhook payload format and auth.
    console.info("[whatsapp-webhook] payload received", {
      to: maskPhone(String(body.to)),
      channel: body.channel ?? "whatsapp",
      type: body.type ?? "text",
      event:
        body.context && typeof body.context.event === "string"
          ? body.context.event
          : null,
    });

    return NextResponse.json({
      ok: true,
      accepted: true,
      provider: "local-webhook",
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid webhook request body.",
      },
      { status: 400 },
    );
  }
}
