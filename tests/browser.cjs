/* Isolated browser fixtures: no calls or writes to the production database. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req,res) => {
  const file = path.resolve(root, '.' + new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));
  if(!file.startsWith(root + path.sep) || !fs.existsSync(file)) {res.writeHead(404);res.end();return;}
  const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'}[path.extname(file)]||'text/plain';
  res.writeHead(200,{'Content-Type':type});fs.createReadStream(file).pipe(res);
});
const stub = `window.__fixture={user:null,entitlement:null,saved:null,writes:[],pullError:false};
window.supabase={createClient:()=>({auth:{
 getUser:async()=>({data:{user:__fixture.user}}),
 getSession:async()=>({data:{session:__fixture.user?{access_token:'isolated-test-token'}:null}}),
 signInWithPassword:async()=>{__fixture.user={id:'test-user',email:'test@example.com'};return{};},
 signUp:async()=>({}),signOut:async()=>{__fixture.user=null;return{};},onAuthStateChange:()=>({})},
 from:table=>({select(){return this;},eq(){return this;},async maybeSingle(){return table==='chronoself_entitlements'?{data:__fixture.entitlement}:{data:__fixture.saved?{payload:__fixture.saved}:null,error:__fixture.pullError?{}:null};},
 async upsert(value){__fixture.writes.push(value);__fixture.saved=value.payload;return{};}})})};`;
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({contentType:'text/javascript',body:stub}));
 // Load the actual editorial fonts for visual inspection.
 // External traffic is denied apart from intercepted fixtures.
 await context.route('https://**supabase.co/**',route=>route.abort());
 const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
 try {
  await page.goto(base);await page.evaluate(()=>CS.ready);await page.evaluate(()=>document.fonts.ready);
  assert.match(await page.locator('h1').innerText(),/Chi diventi/);
  assert.equal(await page.locator('.time-line li').count(),4);
  for (const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:900});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'home overflow '+width);
  }
  await page.screenshot({path:path.join(root,'test-results/home-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(root,'test-results/home-mobile.png'),fullPage:true});
  await page.locator('#start').click();await page.locator('#nome').fill('');await page.locator('#next').click();
  for(let i=0;i<18;i++) {
   assert.equal(await page.locator('.choice').count(),5);
   await page.locator('.choice').nth(i%5).click();await page.locator('#next').click();
  }
  assert.equal(await page.locator('.imprint-row').count(),5);
  await page.screenshot({path:path.join(root,'test-results/imprint-mobile.png'),fullPage:true});
  await page.locator('#enter').click();assert.equal(await page.locator('.cols .letter').count(),3);
  assert.equal(await page.locator('.letter-number').allTextContents().then(v=>v.join(',')),'01,02,03');
  assert.equal(await page.locator('.cols').evaluate(el=>getComputedStyle(el).scrollSnapType),'x mandatory');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'future overflow');
  await page.screenshot({path:path.join(root,'test-results/futures-mobile.png'),fullPage:true});
  await page.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.__shared=data;}});});
  await page.getByRole('button',{name:'Condividi ChronoSelf'}).click();
  assert.equal(await page.evaluate(()=>__shared.url),base+'/');
  assert.deepEqual(await page.evaluate(()=>Object.keys(__shared).sort()),['text','title','url']);
  await page.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:undefined});Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text;}}});});
  await page.getByRole('button',{name:'Condividi ChronoSelf'}).click();assert.equal(await page.evaluate(()=>__copied),base+'/');
  for(const width of [320,390,768,1440]) {await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'futures overflow '+width);}
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-y="5"]').click();assert.equal(await page.locator('.sealed').count(),1);
  // URL and stored pro must never grant entitlement.
  await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('chronoself.v2'));p.pro=true;localStorage.setItem('chronoself.v2',JSON.stringify(p));});
  await page.goto(base+'/?paid='+1);await page.evaluate(()=>CS.ready);
  assert.equal(await page.evaluate(()=>db.pro),false);
  await page.evaluate(()=>{CS.applyPayload({pro:true});db.pro=true;});assert.equal(await page.evaluate(()=>inPlan()),false);
  // Login through actual UI, then verify cloud and plan using an isolated entitlement fixture.
  await page.evaluate(()=>go('prezzi'));await page.locator('#pay').click();
  assert.equal(await page.locator('#csIn').count(),1);
  await page.evaluate(()=>{__fixture.entitlement={status:'active',current_period_end:new Date(Date.now()+86400000).toISOString()};});
  await page.locator('#csEmail').fill('test@example.com');await page.locator('#csPass').fill('test-password');await page.locator('#csIn').click();
  await page.locator('.oggi-pills').waitFor();await page.screenshot({path:path.join(root,'test-results/today-mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>inPlan()),true);
  await page.locator('[data-h]').first().click();
  assert.ok(await page.evaluate(()=>__fixture.writes.length)>0);
  assert.equal(await page.evaluate(()=>Object.hasOwn(__fixture.writes.at(-1).payload,'pro')),false);
  await page.locator('.oggi-pills [data-tab="percorso"]').click();await page.screenshot({path:path.join(root,'test-results/plan-mobile.png'),fullPage:true});
  await page.locator('.oggi-pills [data-tab="diario"]').click();await page.locator('#note').fill('Nota di test locale');await page.locator('#saveN').click();
  assert.match(await page.locator('#app').innerText(),/Nota di test locale/);
  await page.evaluate(()=>{__fixture.entitlement={status:'past_due',current_period_end:new Date(Date.now()+86400000).toISOString()};return CS.refreshEntitlement();});
  assert.equal(await page.evaluate(()=>inPlan()),false);
  await page.evaluate(()=>{__fixture.entitlement={status:'trialing',current_period_end:new Date(Date.now()-1000).toISOString()};return CS.refreshEntitlement();});assert.equal(await page.evaluate(()=>db.pro),false);
  await page.evaluate(()=>{__fixture.entitlement={status:'trialing',current_period_end:new Date(Date.now()+86400000).toISOString()};return CS.refreshEntitlement();});assert.equal(await page.evaluate(()=>db.pro),true);
  // Cloud recovery restores saved content, while a failed pull never pushes stale state.
  await page.evaluate(async()=>{await CS.push();db.journal=[];await CS.pull();});
  assert.equal(await page.evaluate(()=>db.journal[0].text.includes('Nota di test locale')),true);
  assert.equal(await page.evaluate(async()=>{__fixture.pullError=true;await CS.pull();const n=__fixture.writes.length;await CS.push();return n===__fixture.writes.length;}),true);
  await page.evaluate(async()=>{__fixture.pullError=false;await CS.pull();});
  // Browser sends a Bearer token, never an email or user ID to billing APIs.
  let billingRequest;
  await page.route('**/api/billing-portal',route=>{billingRequest=route.request();return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Test: portale non disponibile'})});});
  await page.evaluate(()=>go('account'));await page.locator('#csPortal').click();await page.getByText('Test: portale non disponibile',{exact:true}).waitFor();
  assert.equal(billingRequest.headers().authorization,'Bearer isolated-test-token');assert.equal(billingRequest.postData(),null);
  await page.locator('#csOut').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('chronoself.v2')),null);
  assert.equal(await page.evaluate(()=>db.journal.length),0);
  // Reduced motion turns off experience animations.
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.hero-photo img').evaluate(el=>getComputedStyle(el).animationName),'none');
  // Checkout return polls the entitlement, then cleans the URL; it never trusts the URL itself.
  await page.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({contentType:'text/javascript',body:stub+`;__fixture.user={id:'test-user',email:'test@example.com'};__fixture.entitlement={status:'active',current_period_end:new Date(Date.now()+86400000).toISOString()};`}));
  await page.goto(base+'/?checkout=success&keep=yes');await page.evaluate(()=>CS.ready);
  assert.equal(new URL(page.url()).searchParams.has('checkout'),false);
  assert.equal(new URL(page.url()).searchParams.get('keep'),'yes');assert.equal(await page.evaluate(()=>db.pro),true);
  assert.deepEqual(errors,[]);
  console.log('Browser passed: 18 questions, imprint, futures/swipe, 4 viewport widths, URL/storage bypass rejected, login, entitlement, cloud, plan, diary, logout, reduced motion.');
 } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
