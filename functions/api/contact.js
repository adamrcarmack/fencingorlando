export async function onRequestPost(context) {
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });

  try {
    const { request, env } = context;

    // Guard: only accept JSON
    const ct = request.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return json({ error: "Expected application/json" }, 415);
    }

    const body = await request.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const message = (body.message || "").trim();
    const service = (body.service || "").trim();

    if (!name || !phone) {
      return json({ error: "Missing required fields", got: { name: !!name, phone: !!phone } }, 400);
    }

    if (!env.TO_EMAIL || !env.FROM_EMAIL) {
      return json({ error: "Email env vars not set", has: { TO_EMAIL: !!env.TO_EMAIL, FROM_EMAIL: !!env.FROM_EMAIL } }, 500);
    }

    const text =
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email || "(not provided)"}\n` +
      `Service: ${service || "(not selected)"}\n\n` +
      `Message:\n${message || "(no message)"}`;

    const payload = {
      personalizations: [{ to: [{ email: env.TO_EMAIL }] }],
      from: { email: env.FROM_EMAIL, name: "Fencing Orlando Lead" },
      reply_to: { email: email || env.TO_EMAIL, name },
      subject: "New Lead - Fencing Orlando",
      content: [{ type: "text/plain", value: text }],
    };

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "X-Api-Key": "null"
  },
  body: JSON.stringify(payload),
});

    const respText = await resp.text().catch(() => "");

    if (!resp.ok) {
  return new Response(
    JSON.stringify({
      mail_ok: false,
      mail_status: resp.status,
      mail_response: respText,
      from: env.FROM_EMAIL,
      to: env.TO_EMAIL
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
    return json({ success: true, response: respText }, 200);
  } catch (err) {
    // This is the key: always return JSON
    return json({ error: "Unhandled exception", detail: String(err) }, 500);
  }
}
