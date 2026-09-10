const CS_SB_URL = "https://soskkfqeudtqfarzjlal.supabase.co";
const CS_SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvc2trZnFldWR0cWZhcnpqbGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODg5NzIsImV4cCI6MjEwNDE2NDk3Mn0.zxvsRI0_PHU5-xCvpgJlWySnBbCemxbPuI6Zpx7HQLw";
const CS_KEY = "chronoself.v2";
const CS_SITE = location.origin;
window.CS = window.CS || {};
window.CS.sb = window.supabase ? window.supabase.createClient(CS_SB_URL, CS_SB_KEY) : null;
(function () {
  let entitlement = null;
  let owner = null;
  let ready = false;
  let revision = 0;
  let queue = Promise.resolve();
  let expiryTimer;
  const clean = payload => { const copy = {...payload}; delete copy.pro; return copy; };
  const read = () => { try { return clean(JSON.parse(localStorage.getItem(CS_KEY) || '{}')); } catch { return {}; } };
  const escape = value => { const el = document.createElement('span'); el.textContent = value || ''; return el.innerHTML; };
  CS.hasEntitlement = () => !!(CS.user && entitlement && ['active', 'trialing'].includes(entitlement.status) &&
    (entitlement.current_period_end === null || Date.parse(entitlement.current_period_end) > Date.now()));
  function publish() {
    if (typeof CS.syncEntitlement === 'function') CS.syncEntitlement();
    clearTimeout(expiryTimer);
    const end = entitlement && Date.parse(entitlement.current_period_end);
    if (end > Date.now()) expiryTimer = setTimeout(() => { publish(); if (typeof render === 'function') render(); }, Math.min(end - Date.now() + 30, 2147483647));
  }
  function clearLocal() {
    revision++; ready = false; owner = null; entitlement = null;
    localStorage.removeItem(CS_KEY); localStorage.removeItem('chronoself.owner');
    Object.keys(sessionStorage).filter(k => k.startsWith('cs.')).forEach(k => sessionStorage.removeItem(k));
    if (typeof CS.resetLocal === 'function') CS.resetLocal();
    publish();
  }
  CS.refresh = async function () {
    if (!CS.sb) return;
    const {data, error} = await CS.sb.auth.getUser();
    CS.authUnavailable = !!(error && error.name !== "AuthSessionMissingError" && error.status !== 401);
    const user = !error && data ? data.user : null;
    if (CS.user && CS.user.id !== user?.id) clearLocal();
    CS.user = user;
  };
  CS.refreshEntitlement = async function () {
    const userId = CS.user?.id;
    if (!CS.sb || !userId) { entitlement = null; publish(); return false; }
    try {
      const {data, error} = await CS.sb.from('chronoself_entitlements').select('status,current_period_end,stripe_customer_id').eq('user_id', userId).maybeSingle();
      if (CS.user?.id !== userId) return false;
      entitlement = error ? null : data;
      if (error) CS.status = 'Non riesco a verificare il piano. Riprova tra poco.';
    } catch { entitlement = null; }
    publish();
    return CS.hasEntitlement();
  };
  CS.pull = async function () {
    if (!CS.sb || !CS.user) return;
    const userId = CS.user.id, version = revision;
    ready = false;
    const storedOwner = localStorage.getItem('chronoself.owner');
    if (storedOwner && storedOwner !== userId) {
      localStorage.removeItem(CS_KEY);
      if (typeof CS.resetLocal === 'function') CS.resetLocal();
    }
    const {data, error} = await CS.sb.from('chronoself_saves').select('payload').eq('user_id', userId).maybeSingle();
    if (version !== revision || CS.user?.id !== userId) return;
    if (error) { CS.status = 'Recupero cloud non riuscito. I dati locali restano disponibili; riprova.'; return; }
    if (data?.payload) {
      const payload = clean(data.payload);
      localStorage.setItem(CS_KEY, JSON.stringify(payload));
      if (typeof CS.applyPayload === 'function') CS.applyPayload(payload);
    }
    owner = userId; ready = true;
    localStorage.setItem('chronoself.owner', userId);
    CS.status = data ? 'Dati recuperati dal cloud.' : 'Account pronto per salvare.';
    publish();
  };
  CS.push = function () {
    if (!CS.sb || !CS.user || !ready || owner !== CS.user.id) return Promise.resolve();
    const userId = owner, version = revision, payload = read();
    queue = queue.catch(() => {}).then(async () => {
      if (version !== revision || CS.user?.id !== userId || !ready) return;
      const {error} = await CS.sb.from('chronoself_saves').upsert({user_id: userId, payload, updated_at: new Date().toISOString()});
      CS.status = error ? 'Salvataggio cloud non riuscito. Riprova.' : 'Salvato nel cloud.';
    }).catch(() => { CS.status = 'Cloud non raggiungibile. I dati restano su questo dispositivo.'; });
    return queue;
  };
  CS.billing = async function (path) {
    if (!CS.user || !CS.sb) throw new Error('Accedi al tuo account.');
    const {data, error} = await CS.sb.auth.getSession();
    if (error || !data.session?.access_token) throw new Error('Sessione scaduta. Accedi di nuovo.');
    const response = await fetch(path, {method: 'POST', headers: {Authorization: 'Bearer ' + data.session.access_token}});
    const result = await response.json();
    if (!response.ok || !result.url) throw new Error(result.error || 'Servizio non disponibile.');
    const url = new URL(result.url);
    if (url.protocol !== 'https:' || !['checkout.stripe.com', 'billing.stripe.com'].includes(url.hostname)) throw new Error('Indirizzo pagamento non valido.');
    location.assign(url.href);
  };
  CS.renderAccount = function () {
    const app = document.getElementById('app');
    app.innerHTML = `<main class="step"><p class="meta">Account</p>
      <h1 class="q">${CS.user ? 'Il tuo account.' : 'Entra per salvare i tuoi dati.'}</h1>
      <p class="lede">${CS.user ? escape(CS.user.email) + '. Uscendo, i dati vengono rimossi da questo dispositivo.' : 'Email e password. Le tue risposte restano tue.'}</p>
      ${CS.user ? `<p class="lede">${CS.hasEntitlement() ? 'Piano 90 attivo.' : 'Piano 90 non attivo.'}</p>` : '<label class="field">Email<input id="csEmail" type="email" autocomplete="email" /></label><label class="field">Password (min 6)<input id="csPass" type="password" minlength="6" autocomplete="current-password" /></label>'}
      <p class="meta" id="csMsg" role="status">${escape(CS.status)}</p><div class="row">
      ${CS.user ? '<button class="cta" id="csPush">Salva ora</button><button class="btn" id="csPull">Recupera</button><button class="btn" id="csPortal">Gestisci abbonamento</button><button class="btn" id="csOut">Esci</button>' : '<button class="cta" id="csIn">Accedi</button><button class="btn" id="csUp">Crea account</button>'}</div></main>`;
    const set = text => { CS.status = text; const msg = document.getElementById('csMsg'); if (msg) msg.textContent = text; };
    const bind = (id, action) => { const b = document.getElementById(id); if (b) b.onclick = async () => {
      b.disabled = true;
      try { if (!CS.sb) throw new Error('Connessione account non disponibile. Ricarica la pagina.'); await action(); }
      catch (e) { set(e.message || 'Connessione non disponibile. Riprova.'); }
      finally { b.disabled = false; }
    }; };
    bind('csIn', async () => {
      const {error} = await CS.sb.auth.signInWithPassword({email: document.getElementById('csEmail').value.trim(), password: document.getElementById('csPass').value});
      if (error) throw error;
      await CS.refresh(); await CS.pull(); await CS.refreshEntitlement();
      const p = read(); go(CS.hasEntitlement() && p.sim ? 'oggi' : p.sim ? 'futuri' : 'home');
    });
    bind('csUp', async () => {
      const {error} = await CS.sb.auth.signUp({email: document.getElementById('csEmail').value.trim(), password: document.getElementById('csPass').value, options: {emailRedirectTo: CS_SITE + '/'}});
      if (error) throw error;
      set('Account creato. Apri la mail di conferma, poi accedi.');
    });
    bind('csPush', async () => { await CS.push(); set(CS.status); });
    bind('csPull', async () => { await CS.pull(); await CS.refreshEntitlement(); CS.renderAccount(); });
    bind('csPortal', () => CS.billing('/api/billing-portal'));
    bind('csOut', async () => {
      await CS.push();
      const {error} = await CS.sb.auth.signOut();
      if (error) throw error;
      CS.user = null; clearLocal(); CS.status = ''; go('home');
    });
  };
  async function boot() {
    await CS.refresh();
    if (CS.user) { await CS.pull(); await CS.refreshEntitlement(); }
    else if (!CS.authUnavailable && localStorage.getItem('chronoself.owner')) clearLocal();
    if (typeof render === 'function') render();
    const url = new URL(location.href);
    if (url.searchParams.get('checkout') === 'success') {
      CS.status = 'Pagamento ricevuto. Verifico il Piano 90…';
      go('account');
      try {
        for (let i = 0; i < 8 && CS.user; i++) {
          if (await CS.refreshEntitlement()) { CS.status = 'Piano 90 attivo.'; break; }
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        if (!CS.hasEntitlement()) CS.status = 'La conferma è ancora in arrivo. Riprova tra poco dal tuo account.';
        if (state.view === 'account') CS.renderAccount();
      } finally { url.searchParams.delete('checkout'); history.replaceState(null, '', url.pathname + url.search + url.hash); }
    } else if (url.searchParams.has('checkout')) {
      url.searchParams.delete('checkout'); history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }
  if (CS.sb) CS.sb.auth.onAuthStateChange((event, session) => {
    // Never await Supabase calls inside its auth callback.
    if (event === 'SIGNED_OUT') { CS.user = null; clearLocal(); if (typeof go === 'function') go('home'); }
    else if (event === 'SIGNED_IN' && CS.user && CS.user.id !== session?.user.id) {
      clearLocal(); CS.user = null;
      setTimeout(() => boot().catch(() => { CS.status = 'Account non raggiungibile.'; }), 0);
    }
  });
  CS.ready = new Promise(resolve => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resolve, {once: true});
    else resolve();
  }).then(boot).catch(() => { entitlement = null; publish(); CS.status = 'Cloud non raggiungibile. Riprova dal tuo account.'; });
  setInterval(async () => {
    if (!CS.user || document.hidden) return;
    const before = CS.hasEntitlement();
    await CS.refreshEntitlement(); await CS.push();
    if (before !== CS.hasEntitlement() && typeof render === 'function') render();
  }, 20000);
})();
