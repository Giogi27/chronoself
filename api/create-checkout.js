const { authenticatedUser, stripe, supabase, siteURL, endpoint, HttpError } = require('../lib/billing');
module.exports = endpoint(async (req, res) => {
  const user = await authenticatedUser(req);
  const site = siteURL();
  const [entitlement] = await supabase('chronoself_entitlements?user_id=eq.' + encodeURIComponent(user.id) + '&select=stripe_customer_id,status,current_period_end');
  if (entitlement && ['active', 'trialing'].includes(entitlement.status) && (!entitlement.current_period_end || Date.parse(entitlement.current_period_end) > Date.now())) {
    throw new HttpError(409, 'Piano già attivo. Gestiscilo dal tuo account.');
  }
  const params = {
    mode: 'subscription', success_url: site + '/?checkout=success', cancel_url: site + '/?checkout=cancel',
    client_reference_id: user.id, 'metadata[user_id]': user.id, 'subscription_data[metadata][user_id]': user.id,
    'line_items[0][quantity]': '1'
  };
  if (entitlement && entitlement.stripe_customer_id) params.customer = entitlement.stripe_customer_id;
  else params.customer_email = user.email;
  if (process.env.STRIPE_PRICE_ID) params['line_items[0][price]'] = process.env.STRIPE_PRICE_ID;
  else Object.assign(params, {
    'line_items[0][price_data][currency]': 'eur', 'line_items[0][price_data][unit_amount]': '499',
    'line_items[0][price_data][recurring][interval]': 'month',
    'line_items[0][price_data][product_data][name]': 'ChronoSelf Piano 90'
  });
  const session = await stripe('checkout/sessions', params, 'checkout-' + user.id + '-' + Math.floor(Date.now() / 300000));
  if (!session.url) throw new HttpError(502, 'Checkout non disponibile.');
  return res.status(200).json({url: session.url});
});
