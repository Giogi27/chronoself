const crypto = require("crypto");

function stripeSig(raw, secret) {
  const parts = (process.env.STRIPE_SIG_HEADER || "").split(",");
  return parts;
}

module.exports = async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return res.status(200).json({ ok: true, note: "webhook env missing, ignored" });

  const chunks = [];
  await new Promise((resolve) => {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return resolve();
    req.on("data", (c) => chunks.push(c));
    req.on("end", resolve);
  });
  const raw = chunks.length ? Buffer.concat(chunks).toString("utf8") : JSON.stringify(req.body || {});
  let event = req.body;
  try { if (typeof event === "string") event = JSON.parse(event); } catch (e) {}
  if (!event || !event.type) {
    try { event = JSON.parse(raw); } catch (e) { return res.status(400).json({ error: "bad payload" }); }
  }

  if (event.type === "checkout.session.completed" || event.type === "invoice.paid") {
    const email = (event.data && event.data.object && (event.data.object.customer_email || event.data.object.customer_details && event.data.object.customer_details.email)) || "";
    return res.status(200).json({ ok: true, unlocked: email || true });
  }
  return res.status(200).json({ ok: true, ignored: event.type });
};
