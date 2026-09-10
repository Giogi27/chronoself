const crypto = require('node:crypto');
const { stripe, endpoint, HttpError } = require('../lib/billing');
module.exports = endpoint(async (req, res) => {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) throw new HttpError(503, 'Endpoint disabilitato.');
  const supplied = (req.headers.authorization || '').replace(/^Bearer /, '');
  const hash = value => crypto.createHash('sha256').update(value).digest();
  if (!supplied || !crypto.timingSafeEqual(hash(supplied), hash(expected))) throw new HttpError(401, 'Accesso negato.');
  const data = await stripe('subscriptions?status=all&limit=40&expand[]=data.customer');
  const rows = (data.data || []).map(s => ({id: s.id, status: s.status, email: s.customer?.email || '', name: s.customer?.name || '', period_end: s.current_period_end || s.items?.data?.[0]?.current_period_end || 0}));
  return res.status(200).json({rows, count: rows.length});
});
