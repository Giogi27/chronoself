const CS_SB_URL = "https://soskkfqeudtqfarzjlal.supabase.co";
const CS_SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvc2trZnFldWR0cWZhcnpqbGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODg5NzIsImV4cCI6MjEwNDE2NDk3Mn0.zxvsRI0_PHU5-xCvpgJlWySnBbCemxbPuI6Zpx7HQLw";
const CS_KEY = "chronoself.v2";
const CS_SITE = "https://mychronoself.vercel.app";
window.CS = window.CS || {};
window.CS.sb = window.supabase ? window.supabase.createClient(CS_SB_URL, CS_SB_KEY) : null;
window.CS.user = null;
window.CS.status = "";

async function csRefresh() {
  if (!CS.sb) return;
  const { data } = await CS.sb.auth.getUser();
  CS.user = data && data.user ? data.user : null;
}
async function csPull() {
  if (!CS.sb || !CS.user) return;
  const { data, error } = await CS.sb.from("chronoself_saves").select("payload").eq("user_id", CS.user.id).maybeSingle();
  if (error) { CS.status = "Crea la tabella: incolla chronoself.sql in Supabase SQL Editor."; return; }
  if (data && data.payload) {
    localStorage.setItem(CS_KEY, JSON.stringify(data.payload));
    CS.status = "Dati scaricati dal cloud.";
  }
}
async function csPush() {
  if (!CS.sb || !CS.user) return;
  let payload = {};
  try { payload = JSON.parse(localStorage.getItem(CS_KEY) || "{}"); } catch (e) {}
  const { error } = await CS.sb.from("chronoself_saves").upsert({ user_id: CS.user.id, payload, updated_at: new Date().toISOString() });
  CS.status = error ? "Crea la tabella chronoself_saves in Supabase (file chronoself.sql)." : "Salvato nel cloud.";
}
window.CS.pull = csPull;
window.CS.push = csPush;
window.CS.refresh = csRefresh;

window.CS.renderAccount = function () {
  const app = document.getElementById("app");
  if (!app) return;
  const mail = CS.user ? CS.user.email : "";
  app.innerHTML = `<main class="step">
    <p class="meta">Account</p>
    <h1 class="q">${CS.user ? "Il tuo account." : "Entra per salvare i tuoi dati."}</h1>
    <p class="lede">${CS.user ? mail : "Email e password. Ti arriva una mail di conferma, poi torni qui."}</p>
    ${CS.user ? "" : `<label class="field">Email<input id="csEmail" type="email" /></label>
    <label class="field">Password (min 6)<input id="csPass" type="password" /></label>`}
    <p class="meta" id="csMsg">${CS.status || ""}</p>
    <div class="row">
      ${CS.user
        ? `<button class="cta" id="csPush" style="margin-top:0">Salva ora</button><button class="btn" id="csPull">Recupera</button><button class="btn" id="csOut">Esci</button>`
        : `<button class="cta" id="csIn" style="margin-top:0">Accedi</button><button class="btn" id="csUp">Crea account</button>`}
    </div>
  </main>`;
  const msg = document.getElementById("csMsg");
  const set = (t) => { CS.status = t; if (msg) msg.textContent = t; };
  if (!CS.user) {
    document.getElementById("csIn").onclick = async () => {
      const email = document.getElementById("csEmail").value.trim();
      const password = document.getElementById("csPass").value;
      const { error } = await CS.sb.auth.signInWithPassword({ email, password });
      if (error) return set(error.message);
      await csRefresh(); await csPull(); location.href = CS_SITE + "/";
    };
    document.getElementById("csUp").onclick = async () => {
      const email = document.getElementById("csEmail").value.trim();
      const password = document.getElementById("csPass").value;
      const { error } = await CS.sb.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: CS_SITE + "/" }
      });
      if (error) return set(error.message);
      set("Account creato. Apri la mail e clicca conferma. Poi torna qui e accedi.");
    };
  } else {
    document.getElementById("csPush").onclick = async () => { await csPush(); set(CS.status); };
    document.getElementById("csPull").onclick = async () => { await csPull(); set(CS.status); location.reload(); };
    document.getElementById("csOut").onclick = async () => { await CS.sb.auth.signOut(); location.reload(); };
  }
};

(async function bootCloud() {
  await csRefresh();
  if (CS.user) await csPull();
  if (location.hash && location.hash.includes("access_token")) {
    CS.status = "Email confermata. Ora puoi accedere.";
    history.replaceState(null, "", location.pathname);
  }
  document.querySelectorAll('[data-go="account"]').forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      CS.renderAccount();
    }, true);
  });
  setInterval(() => { if (CS.user) csPush(); }, 20000);
})();
