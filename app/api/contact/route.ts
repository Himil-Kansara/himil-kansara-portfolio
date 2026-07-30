export async function POST(request: Request) {
  const body = await request.json() as { name?: string; email?: string; subject?: string; message?: string; website?: string };
  if (body.website) return Response.json({ ok: true });
  if (!body.name || !body.email || !body.subject || !body.message) return Response.json({ error: "Please complete every field." }, { status: 400 });
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return Response.json({ error: "Contact delivery is not configured yet. Please email directly." }, { status: 503 });
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: body.email,
      subject: `[Portfolio] ${body.subject}`,
      text: `From: ${body.name} <${body.email}>\n\n${body.message}`,
    }),
  });
  if (!response.ok) return Response.json({ error: "Message delivery failed. Please email directly." }, { status: 502 });
  return Response.json({ ok: true });
}
