export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [
          { to: [{ email: env.TO_EMAIL }] }
        ],
        from: {
          email: env.FROM_EMAIL,
          name: "Fencing Orlando Lead"
        },
        reply_to: { email, name },
        subject: "New Lead - Fencing Orlando",
        content: [{
          type: "text/plain",
          value:
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n\n` +
            `Message:\n${message}`
        }]
      }),
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: "Mail send failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
