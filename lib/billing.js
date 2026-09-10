'use strict';
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
function env(name) {
  const value = process.env[name];
  if (!value) throw new HttpError(503, 'Servizio non configurato.');
  return value;
}
function siteURL() {
  const url = new URL(env('SITE_URL'));
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost')) throw new HttpError(503, 'SITE_URL non valida.');
  return url.origin;
}
async function supabase(path, options = {}) {
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  const response = await fetch(env('SUPABASE_URL').replace(/\/$/, '') + '/rest/v1/' + path, {
    ...options, headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', ...options.headers }, signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new HttpError(502, 'Sincronizzazione billing non disponibile.');
  return response.status === 204 ? null : response.json();
}
async function authenticatedUser(req) {
  const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
  if (!match) throw new HttpError(401, 'Accedi al tuo account.');
  const response = await fetch(env('SUPABASE_URL').replace(/\/$/, '') + '/auth/v1/user', {
    headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: 'Bearer ' + match[1] }, signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new HttpError(response.status >= 500 ? 502 : 401, 'Sessione non verificata. Accedi di nuovo.');
  const user = await response.json();
  if (!user.id || !user.email) throw new HttpError(401, 'Account non verificato.');
  return user;
}
async function stripe(path, params, idempotencyKey) {
  const response = await fetch('https://api.stripe.com/v1/' + path, {
    method: params ? 'POST' : 'GET',
    headers: { Authorization: 'Bearer ' + env('STRIPE_SECRET_KEY'), ...(params ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}), ...(idempotencyKey ? {'Idempotency-Key': idempotencyKey} : {}) },
    ...(params ? {body: new URLSearchParams(params)} : {}), signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new HttpError(502, 'Stripe non disponibile. Riprova.');
  return response.json();
}
function endpoint(fn) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({error: 'POST only'}); }
    try { return await fn(req, res); }
    catch (error) { return res.status(error.status || 500).json({error: error.status ? error.message : 'Servizio temporaneamente non disponibile.'}); }
  };
}
const idOf = value => typeof value === 'string' ? value : value && value.id;
module.exports = { HttpError, env, siteURL, supabase, authenticatedUser, stripe, endpoint, idOf };
