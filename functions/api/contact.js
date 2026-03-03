export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim(); // optional
    const phone = (body.phone || "").trim(); // required (per your form)
    const message = (body.message || "").trim(); // optional
    const service = (body.service || "").trim(); // optional

    if (!name || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!env.TO_EMAIL || !env.FROM_EMAIL) {
      return new Response(JSON.stringify({ error: "Email env vars not set" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const text =
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email || "(not provided)"}\n` +
      `Service: ${service || "(not selected)"}\n\n` +
      `Message:\n${message || "(no message)"}`;

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: env.TO_EMAIL }] }],
        from: { email: env.FROM_EMAIL, name: "Fencing Orlando Lead" },
        reply_to: { email: email || env.TO_EMAIL, name },
        subject: "New Lead - Fencing Orlando",
        content: [{ type: "text/plain", value: text }],
      }),
    });

    if (!resp.ok) {
  const detail = await resp.text().catch(() => "");
  return new Response(JSON.stringify({ error: "Mail send failed", detail }), {
    status: 502,
    headers: { "Content-Type": "application/json" },
  });
}

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
  return new Response(JSON.stringify({ error: "Server error", detail: String(err) }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
