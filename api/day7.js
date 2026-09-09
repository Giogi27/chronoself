module.exports = async function (req, res) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return res.status(200).json({
      ok: true,
      sent: 0,
      note: "Aggiungi RESEND_API_KEY su Vercel per mandare la mail del giorno 7. Intanto il banner nel sito c'è già."
    });
  }
  return res.status(200).json({ ok: true, sent: 0, note: "Cron attiva. Collega una lista utenti per spedire." });
};
