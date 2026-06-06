exports.config = {
  schedule: "30 3 * * *",
};

exports.handler = async () => {
  const baseUrl =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.DEPLOY_URL ||
    "";

  if (!baseUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing Netlify site URL environment variable.",
      }),
    };
  }

  const endpoint = `${baseUrl.replace(/\/$/, "")}/api/student-registration/installment-reminders`;
  const reminderSecret = process.env.INSTALLMENT_REMINDER_CRON_SECRET;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(reminderSecret
        ? { "x-installment-reminder-secret": reminderSecret }
        : {}),
    },
    body: JSON.stringify({ trigger: "netlify-schedule" }),
  });

  const text = await response.text();

  return {
    statusCode: response.status,
    body: text,
  };
};
