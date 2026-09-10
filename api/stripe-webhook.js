const crypto = require('node:crypto');
const { env, supabase, stripe, endpoint, HttpError, idOf } = require('../lib/billing');
const EVENTS = new Set(['checkout.session.completed', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'invoice.paid', 'invoice.payment_failed']);
async function rawBody(req) {
  // Vercel installs a lazy JSON getter on req.body. Never invoke that getter.
  const descriptor = Object.getOwnPropertyDescriptor(req, 'body');
  const body = descriptor && 'value' in descriptor ? descriptor.value : undefined;
  if (Buffer.isBuffer(body) || typeof body === 'string') {
    const raw = Buffer.isBuffer(body) ? body : Buffer.from(body, 'utf8');
    if (raw.length > 1048576) throw new HttpError(413, 'Payload troppo grande.');
    return raw;
  }
  if (body != null) throw new HttpError(400, 'Raw body richiesto.');
  // The Node runtime restores the original stream even with request helpers enabled.
  return new Promise((resolve, reject) => {
    const chunks = []; let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 1048576) { reject(new HttpError(413, 'Payload troppo grande.')); return; }
      chunks.push(Buffer.from(chunk));
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', () => reject(new HttpError(400, 'Richiesta interrotta.')));
    req.on('aborted', () => reject(new HttpError(400, 'Richiesta interrotta.')));
  });
}
function verify(raw, header, secret) {
  const parts = String(header || '').split(',').map(p => p.trim().split('='));
  const timestamp = parts.find(([k]) => k === 't')?.[1];
  if (!/^\d+$/.test(timestamp || '') || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(timestamp + '.').update(raw).digest();
  return parts.some(([k, v]) => k === 'v1' && /^[a-f\d]{64}$/i.test(v || '') && crypto.timingSafeEqual(expected, Buffer.from(v, 'hex')));
}
module.exports = endpoint(async (req, res) => {
  const secret = env('STRIPE_WEBHOOK_SECRET');
  const raw = await rawBody(req);
  if (!verify(raw, req.headers['stripe-signature'], secret)) throw new HttpError(400, 'Firma non valida.');
  let event;
  try { event = JSON.parse(raw.toString('utf8')); } catch { throw new HttpError(400, 'Payload non valido.'); }
  if (!event.id || !event.type || !event.data?.object) throw new HttpError(400, 'Evento non valido.');
  if (!EVENTS.has(event.type)) return res.status(200).json({received: true, ignored: true});
  const prior = await supabase('chronoself_billing_events?event_id=eq.' + encodeURIComponent(event.id) + '&select=event_id');
  if (prior.length) return res.status(200).json({received: true, duplicate: true});
  const object = event.data.object;
  const subscriptionId = event.type.startsWith('customer.subscription.') ? object.id : idOf(object.subscription) || idOf(object.parent?.subscription_details?.subscription);
  if (!subscriptionId) return res.status(200).json({received: true, ignored: true});
  // Read the current Stripe state so a delayed invoice/checkout cannot restore an old status.
  const subscription = await stripe('subscriptions/' + encodeURIComponent(subscriptionId));
  const customerId = idOf(subscription.customer);
  let userId = subscription.metadata?.user_id;
  if (!userId && event.type === 'checkout.session.completed') userId = object.client_reference_id || object.metadata?.user_id;
  if (!userId) {
    const rows = await supabase('chronoself_entitlements?stripe_subscription_id=eq.' + encodeURIComponent(subscriptionId) + '&select=user_id');
    userId = rows[0]?.user_id;
  }
  // Unknown legacy subscriptions cannot be assigned by an arbitrary email.
  if (!userId) throw new HttpError(422, 'Abbonamento senza associazione account.');
  const periods = (subscription.items?.data || []).map(i => i.current_period_end).filter(Number.isFinite);
  const end = subscription.current_period_end || (periods.length ? Math.min(...periods) : null);
  if (['active', 'trialing'].includes(subscription.status) && !end) throw new HttpError(502, 'Periodo abbonamento non disponibile.');
  const applied = await supabase('rpc/apply_chronoself_billing_event', {method: 'POST', body: JSON.stringify({
    p_event_id: event.id, p_event_type: event.type, p_user_id: userId,
    p_stripe_customer_id: customerId, p_stripe_subscription_id: subscriptionId,
    p_status: subscription.status, p_current_period_end: end ? new Date(end * 1000).toISOString() : null,
    p_cancel_at_period_end: !!subscription.cancel_at_period_end
  })});
  return res.status(200).json({received: true, duplicate: applied === false});
});
module.exports.config = {api: {bodyParser: false}};
module.exports.verify = verify;
