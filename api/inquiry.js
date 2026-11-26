// Vercel serverless function: receives the enquiry form and forwards it to Telegram.
// Set these in Vercel → Project → Settings → Environment Variables:
//   TELEGRAM_BOT_TOKEN  (from @BotFather)
//   TELEGRAM_CHAT_ID    (your chat id, or a group id)
// Optional: FORM_WEBHOOK_URL (any webhook, for example Zapier / Make / Google Apps Script) gets the same JSON.

const clip = (v, n) => String(v ?? "").slice(0, n);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  const b = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  // honeypot: bots fill this hidden field, people do not
  if (b.website) return res.status(200).json({ ok: true });

  const lead = {
    name: clip(b.name, 120),
    contact: clip(b.contact, 160),
    message: clip(b.message, 2000),
    subject: clip(b.subject, 200),
    propertyId: b.propertyId ?? null,
    page: clip(b.page, 300),
    lang: clip(b.lang, 5),
  };
  const emailOk = /^\S+@\S+\.\S+$/.test(lead.contact);
  const phoneOk = lead.contact.replace(/\D/g, "").length >= 9;
  if (lead.name.length < 2 || !(emailOk || phoneOk)) return res.status(400).json({ ok: false, error: "invalid" });

  const text = [
    "🏠 New enquiry — Verra Estates",
    `Request: ${lead.subject || "General"}`,
    `Name: ${lead.name}`,
    `Contact: ${lead.contact}`,
    lead.message ? `Message: ${lead.message}` : "",
    `Page: ${lead.page}`,
    `Language: ${lead.lang}`,
  ]
    .filter(Boolean)
    .join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  const hook = process.env.FORM_WEBHOOK_URL;
  let delivered = false;

  try {
    if (token && chat) {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text }),
      });
      delivered = r.ok;
    }
    if (hook) {
      const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
      delivered = delivered || r.ok;
    }
  } catch (e) {
    console.error("inquiry delivery failed", e);
  }

  if (!delivered) console.log("INQUIRY (no delivery channel configured):", JSON.stringify(lead));
  return res.status(200).json({ ok: true, delivered });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
