const {test, beforeEach, afterEach} = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {Readable} = require('node:stream');
const checkout = require('../api/create-checkout');
const portal = require('../api/billing-portal');
const webhook = require('../api/stripe-webhook');
const ops = require('../api/ops-subs');
const originalFetch = global.fetch;
const originalEnv = {...process.env};
const response = (data, status = 200) => ({ok: status < 300, status, json: async () => data});
async function call(handler, overrides = {}) {
  const res = {code: 200, headers: {}, setHeader(k,v) {this.headers[k]=v;}, status(code) {this.code=code;return this;}, json(body) {this.body=body;return this;}};
  await handler({method: 'POST', headers: {}, ...overrides}, res); return res;
}
const future = Math.floor(Date.now()/1000)+86400;
const subscription = {id: 'sub_test', customer: 'cus_test', metadata: {user_id: 'user-verified'}, status: 'active', current_period_end: future};
function signedEvent(type, object, id='evt_test') {
  const body=Buffer.from(JSON.stringify({id, type, data: {object}}));
  const t=Math.floor(Date.now()/1000);
  const sig=crypto.createHmac('sha256',process.env.STRIPE_WEBHOOK_SECRET).update(t+'.').update(body).digest('hex');
  return {body, headers: {'stripe-signature': `t=${t},v1=${sig}`}};
}
beforeEach(() => {
  Object.assign(process.env, {SUPABASE_URL:'https://db.example', SUPABASE_ANON_KEY:'test-public', SUPABASE_SERVICE_ROLE_KEY:crypto.randomUUID(), STRIPE_SECRET_KEY:crypto.randomUUID(), STRIPE_WEBHOOK_SECRET:crypto.randomUUID(), SITE_URL:'https://chronoself.example', STRIPE_PRICE_ID:'price_test'});
  delete process.env.ADMIN_SECRET;
  global.fetch=async () => {throw new Error('Unexpected network request');};
});
afterEach(() => {global.fetch=originalFetch; process.env= {...originalEnv};});
test('checkout and portal require Bearer authentication', async () => {
  for (const handler of [checkout,portal]) assert.equal((await call(handler,{body:{email:'other@example.com',user_id:'other'}})).code,401);
});
test('invalid token cannot create checkout', async () => {
  global.fetch=async () => response({},401);
  assert.equal((await call(checkout,{headers:{authorization:'Bearer invalid'}})).code,401);
});
test('checkout takes identity from verified session and redirects from SITE_URL', async () => {
  global.fetch=async (url,options) => {
    if(url.endsWith('/auth/v1/user')) return response({id:'user-verified',email:'verified@example.com'});
    if(url.includes('chronoself_entitlements')) return response([]);
    assert.equal(options.body.get('mode'),'subscription');
    assert.equal(options.body.get('customer_email'),'verified@example.com');
    for (const key of ['client_reference_id','metadata[user_id]','subscription_data[metadata][user_id]']) assert.equal(options.body.get(key),'user-verified');
    assert.equal(options.body.get('success_url'),'https://chronoself.example/?checkout=success');
    assert.equal(options.body.get('line_items[0][price]'),'price_test');
    assert.ok(options.headers['Idempotency-Key']);
    return response({url:'https://checkout.stripe.com/test'});
  };
  assert.equal((await call(checkout,{headers:{authorization:'Bearer valid',origin:'https://attacker.example'},body:{email:'other@example.com',user_id:'other'}})).code,200);
});
test('active subscriber cannot accidentally open a second checkout', async () => {
  global.fetch=async url => url.endsWith('/user')?response({id:'u',email:'e@example.com'}):response([{status:'active',current_period_end:new Date(future*1000).toISOString()}]);
  assert.equal((await call(checkout,{headers:{authorization:'Bearer valid'}})).code,409);
});
test('portal uses only the authenticated account customer', async () => {
  global.fetch=async (url, options) => {
    if(url.endsWith('/user')) return response({id:'verified',email:'verified@example.com'});
    if(url.includes('chronoself_entitlements')) {assert.match(url,/user_id=eq.verified/);return response([{stripe_customer_id:'cus_verified'}]);}
    assert.equal(options.body.get('customer'),'cus_verified');assert.equal(options.body.get('return_url'),'https://chronoself.example/');
    return response({url:'https://billing.stripe.com/test'});
  };
  assert.equal((await call(portal,{headers:{authorization:'Bearer valid'},body:{email:'attacker@example.com',customer:'cus_other'}})).code,200);
});
test('admin is disabled without configured secret and rejects wrong secret', async () => {
  assert.equal((await call(ops,{headers:{authorization:'Bearer anything'}})).code,503);
  process.env.ADMIN_SECRET=crypto.randomUUID();
  assert.equal((await call(ops,{headers:{authorization:'Bearer wrong'}})).code,401);
});
test('webhook rejects unsigned, tampered, stale, and parsed bodies', async () => {
  const req=signedEvent('invoice.paid',{subscription:'sub_test'});
  assert.equal((await call(webhook,{body:req.body})).code,400);
  assert.equal((await call(webhook,{...req,body:Buffer.concat([req.body,Buffer.from(' ')])})).code,400);
  assert.equal((await call(webhook,{...req,body:JSON.parse(req.body)})).code,400);
  const t=Math.floor(Date.now()/1000)-600;
  const sig=crypto.createHmac('sha256',process.env.STRIPE_WEBHOOK_SECRET).update(t+'.').update(req.body).digest('hex');
  assert.equal(webhook.verify(req.body,`t=${t},v1=${sig}`,process.env.STRIPE_WEBHOOK_SECRET),false);
  assert.equal(webhook.verify(req.body,req.headers['stripe-signature']+',v1=bad',process.env.STRIPE_WEBHOOK_SECRET),true);
});
for(const type of ['checkout.session.completed','customer.subscription.created','customer.subscription.updated','customer.subscription.deleted','invoice.paid','invoice.payment_failed']) {
  test(type+' synchronizes through existing atomic RPC',async () => {
    const status=type.endsWith('deleted')?'canceled':type==='invoice.payment_failed'?'past_due':'active';
    let applied;
    global.fetch=async (url,options) => {
      if(url.includes('chronoself_billing_events')) return response([]);
      if(url.includes('api.stripe.com')) return response({...subscription,status});
      assert.ok(url.endsWith('/rpc/apply_chronoself_billing_event'));
      applied=JSON.parse(options.body);return response(true);
    };
    const object=type.startsWith('customer.subscription.')?{id:'sub_test'}:{subscription:'sub_test'};
    const result=await call(webhook,signedEvent(type,object));
    assert.equal(result.code,200); assert.equal(applied.p_user_id,'user-verified'); assert.equal(applied.p_status,status);
    assert.equal(applied.p_event_id,'evt_test');assert.equal(applied.p_current_period_end,new Date(future*1000).toISOString());
  });
}
test('duplicate events do not apply again',async () => {
  let calls=0; global.fetch=async () => {calls++;return response([{event_id:'evt_test'}]);};
  assert.equal((await call(webhook,signedEvent('invoice.paid',{subscription:'sub_test'}))).body.duplicate,true);assert.equal(calls,1);
});
test('RPC failure returns an error so Stripe retries',async () => {
  global.fetch=async url => url.includes('chronoself_billing_events')?response([]):url.includes('api.stripe.com')?response(subscription):response({},500);
  assert.equal((await call(webhook,signedEvent('invoice.paid',{subscription:'sub_test'}))).code,502);
});
test('new invoice shape and item-level period end are supported',async () => {
  let applied;
  global.fetch=async (url,options) => {
    if(url.includes('chronoself_billing_events'))return response([]);
    if(url.includes('api.stripe.com'))return response({...subscription,current_period_end:undefined,items:{data:[{current_period_end:future}]}});
    applied=JSON.parse(options.body);return response(true);
  };
  assert.equal((await call(webhook,signedEvent('invoice.paid',{parent:{subscription_details:{subscription:'sub_test'}}}))).code,200);
  assert.equal(applied.p_current_period_end,new Date(future*1000).toISOString());
});
test('raw request stream is verified and unknown types are ignored',async () => {
  const req=signedEvent('unhandled.event',{});const stream=Readable.from([req.body]);stream.method='POST';stream.headers=req.headers;
  const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await webhook(stream,res);assert.equal(res.code,200);assert.equal(res.body.ignored,true);
});
test('Vercel lazy body parser is never invoked',async () => {
  const req=signedEvent('unhandled.event',{});const stream=Readable.from([req.body]);stream.method='POST';stream.headers=req.headers;
  Object.defineProperty(stream,'body',{get(){throw new Error('Vercel parser was invoked');}});
  const res={setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await webhook(stream,res);assert.equal(res.code,200);
});
test('webhook fails closed when signing secret is missing',async () => {
  delete process.env.STRIPE_WEBHOOK_SECRET;
  assert.equal((await call(webhook)).code,503);
});
test('concurrent duplicate delivery relies on atomic RPC uniqueness',async () => {
  const events=new Set();let writes=0;
  global.fetch=async (url,options) => {
    if(url.includes('chronoself_billing_events'))return response([]);
    if(url.includes('api.stripe.com'))return response(subscription);
    const event=JSON.parse(options.body);const duplicate=events.has(event.p_event_id);
    if(!duplicate){events.add(event.p_event_id);writes++;}return response(!duplicate);
  };
  const req=signedEvent('invoice.paid',{subscription:'sub_test'});
  const results=await Promise.all([call(webhook,req),call(webhook,req)]);
  assert.equal(writes,1);assert.equal(results.filter(r=>r.body.duplicate).length,1);
});
