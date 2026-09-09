(function () {
  const KEY = "chronoself.v2";
  const SUGGEST = {
    salute: ["Dormire prima delle 23:30", "30 minuti di movimento"],
    soldi: ["Bonifico / no spesa impulsiva", "Annotare le uscite"],
    lavoro: ["4 ore sulla competenza", "Un blocco senza notifiche"],
    relazioni: ["Una chiamata vera", "Niente scroll durante i pasti"],
    abitudini: ["Niente telefono i primi 20 min", "Sera senza social dopo le 22"]
  };
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function save(db) {
    localStorage.setItem(KEY, JSON.stringify(db));
    if (window.CS && CS.user && CS.push) CS.push();
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function daysBack(n) {
    const d = new Date(); d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }
  function ensure(db) {
    if (!db.habits) db.habits = [];
    if (!db.habitLog) db.habitLog = {};
    if (!db.habits.length) {
      const weak = (db.sim && db.sim.weak) || "abitudini";
      const names = SUGGEST[weak] || SUGGEST.abitudini;
      db.habits = names.map((name, i) => ({ id: "h" + (i + 1), name }));
    }
    return db;
  }
  function streak(log, id) {
    let n = 0;
    for (let i = 0; i < 90; i++) {
      const day = daysBack(i);
      if (log[day] && log[day][id]) n++;
      else if (i === 0) continue;
      else break;
    }
    if (!(log[today()] && log[today()][id]) && n) {
      /* oggi non spuntato: streak tiene se ieri sì */
    }
    return n;
  }
  function weekDone(log, id) {
    let c = 0;
    for (let i = 0; i < 7; i++) {
      const day = daysBack(i);
      if (log[day] && log[day][id]) c++;
    }
    return c;
  }
  function renderHabits() {
    const app = document.getElementById("app");
    if (!app) return;
    let db = ensure(load());
    const t = today();
    if (!db.habitLog[t]) db.habitLog[t] = {};
    const locked = !db.pro && db.habits.length > 1;
    const list = db.habits.map((h) => {
      const on = !!(db.habitLog[t] && db.habitLog[t][h.id]);
      const st = streak(db.habitLog, h.id);
      const w = weekDone(db.habitLog, h.id);
      const dots = Array.from({ length: 14 }, (_, i) => {
        const day = daysBack(13 - i);
        const ok = db.habitLog[day] && db.habitLog[day][h.id];
        return `<i class="dot ${ok ? "on" : ""}" title="${day}"></i>`;
      }).join("");
      return `<article class="card habit-card">
        <label class="check"><input type="checkbox" data-h="${h.id}" ${on ? "checked" : ""}/> <strong>${h.name}</strong></label>
        <p class="meta">Streak ${st} · ${w}/7 questa settimana</p>
        <div class="dots">${dots}</div>
      </article>`;
    }).join("");
    app.innerHTML = `<main class="step">
      <p class="meta">Abitudini · oggi ${new Date().toLocaleDateString("it-IT")}</p>
      <h1 class="q">Tieni le leve. Ogni giorno.</h1>
      <p class="lede">Due abitudini, non dieci. Lo streak conta solo se è vero.</p>
      ${list}
      <label class="field">Aggiungi un'abitudine
        <input id="newHabit" maxlength="60" placeholder="Es. Acqua al risveglio" />
      </label>
      <div class="row">
        <button class="cta" id="addH" style="margin-top:0">Aggiungi</button>
        <button class="btn" id="resetH">Reset settimana</button>
      </div>
      ${!db.pro ? `<p class="lock">Il Piano 90 tiene lo storico nel cloud. In locale resta comunque.</p>` : ""}
    </main>`;
    app.querySelectorAll("[data-h]").forEach((el) => {
      el.onchange = function () {
        db = ensure(load());
        if (!db.habitLog[t]) db.habitLog[t] = {};
        db.habitLog[t][el.dataset.h] = el.checked;
        save(db);
        renderHabits();
      };
    });
    document.getElementById("addH").onclick = function () {
      const name = (document.getElementById("newHabit").value || "").trim();
      if (!name) return;
      db = ensure(load());
      if (!db.pro && db.habits.length >= 3) {
        alert("Gratis: massimo 3 abitudini. Piano 90 per di più.");
        return;
      }
      if (db.habits.length >= 8) return alert("Massimo 8 abitudini.");
      db.habits.push({ id: "h" + Date.now(), name });
      save(db);
      renderHabits();
    };
    document.getElementById("resetH").onclick = function () {
      if (!confirm("Togliere i check degli ultimi 7 giorni?")) return;
      db = ensure(load());
      for (let i = 0; i < 7; i++) delete db.habitLog[daysBack(i)];
      save(db);
      renderHabits();
    };
  }
  window.CSHabits = { render: renderHabits };
  document.querySelectorAll("[data-go='habits']").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      renderHabits();
    }, true);
  });
})();
