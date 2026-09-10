const { authenticatedUser, supabase, stripe, siteURL, endpoint, HttpError } = require('../lib/billing');
module.exports = endpoint(async (req, res) => {
  const user = await authenticatedUser(req);
  const [entitlement] = await supabase('chronoself_entitlements?user_id=eq.' + encodeURIComponent(user.id) + '&select=stripe_customer_id');
  if (!entitlement || !entitlement.stripe_customer_id) throw new HttpError(404, 'Nessun abbonamento associato al tuo account.');
  const session = await stripe('billing_portal/sessions', {customer: entitlement.stripe_customer_id, return_url: siteURL() + '/'});
  if (!session.url) throw new HttpError(502, 'Portale non disponibile.');
  return res.status(200).json({url: session.url});
});
