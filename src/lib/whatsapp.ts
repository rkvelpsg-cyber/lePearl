type StudentPaymentWhatsAppPayload = {
  studentName: string;
  phone: string;
  course: string;
  amount: number;
  registrationNo?: string | null;
  username?: string | null;
  temporaryPassword?: string | null;
  transactionId?: string | null;
  orderId?: string | null;
};

type WhatsAppSendResult = {
  attempted: boolean;
  sent: boolean;
  provider: "webhook" | "twilio" | "none";
  reason?: string;
};

function normalizeToE164India(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (phone.startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }

  return null;
}

function buildStudentPaymentWhatsAppMessage(
  payload: StudentPaymentWhatsAppPayload,
) {
  const amountLabel = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(payload.amount);

  const lines = [
    `Dear ${payload.studentName},`,
    "Your payment is successful and verified.",
    `Course: ${payload.course}`,
    `Amount Paid: ${amountLabel}`,
    payload.registrationNo ? `Registration No: ${payload.registrationNo}` : "",
    payload.username ? `Username: ${payload.username}` : "",
    payload.temporaryPassword
      ? `Temporary Password: ${payload.temporaryPassword}`
      : "",
    payload.transactionId ? `Transaction ID: ${payload.transactionId}` : "",
    payload.orderId ? `Order ID: ${payload.orderId}` : "",
    "LePearl Education",
  ].filter(Boolean);

  return lines.join("\n");
}

async function sendViaWebhook(
  endpoint: string,
  payload: StudentPaymentWhatsAppPayload,
  e164Phone: string,
) {
  const authToken = process.env.WHATSAPP_WEBHOOK_AUTH_TOKEN;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({
      to: e164Phone,
      channel: "whatsapp",
      type: "text",
      text: buildStudentPaymentWhatsAppMessage(payload),
      context: {
        event: "student_payment_verified",
        transaction_id: payload.transactionId ?? null,
        order_id: payload.orderId ?? null,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Webhook send failed (${response.status}): ${body}`);
  }
}

async function sendViaTwilio(
  payload: StudentPaymentWhatsAppPayload,
  e164Phone: string,
) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    throw new Error("Twilio WhatsApp credentials are incomplete.");
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
    To: `whatsapp:${e164Phone}`,
    Body: buildStudentPaymentWhatsAppMessage(payload),
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Twilio send failed (${response.status}): ${text}`);
  }
}

export async function sendStudentPaymentWhatsAppNotification(
  payload: StudentPaymentWhatsAppPayload,
): Promise<WhatsAppSendResult> {
  const e164Phone = normalizeToE164India(payload.phone);
  if (!e164Phone) {
    return {
      attempted: false,
      sent: false,
      provider: "none",
      reason: "Invalid student phone for WhatsApp notification.",
    };
  }

  const webhookEndpoint = process.env.WHATSAPP_WEBHOOK_URL;
  if (webhookEndpoint) {
    try {
      await sendViaWebhook(webhookEndpoint, payload, e164Phone);
      return { attempted: true, sent: true, provider: "webhook" };
    } catch (error) {
      return {
        attempted: true,
        sent: false,
        provider: "webhook",
        reason:
          error instanceof Error
            ? error.message
            : "WhatsApp webhook send failed.",
      };
    }
  }

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM
  ) {
    try {
      await sendViaTwilio(payload, e164Phone);
      return { attempted: true, sent: true, provider: "twilio" };
    } catch (error) {
      return {
        attempted: true,
        sent: false,
        provider: "twilio",
        reason:
          error instanceof Error
            ? error.message
            : "Twilio WhatsApp send failed.",
      };
    }
  }

  return {
    attempted: false,
    sent: false,
    provider: "none",
    reason:
      "No WhatsApp provider configured. Set WHATSAPP_WEBHOOK_URL or Twilio WhatsApp env vars.",
  };
}
