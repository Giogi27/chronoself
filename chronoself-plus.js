(function () {
  const INTRO = [
    { k: "01", t: "Il futuro non arriva.", d: "Si accumula. Ogni notte, ogni bonifico, ogni cosa che non fai." },
    { k: "02", t: "Tre versioni di te.", d: "Quella che scivola. Quella che resta. Quella che muove due leve e basta." },
    { k: "03", t: "Novanta giorni.", d: "Non un nuovo te. Lo stesso, con una sola promessa tenuta." }
  ];
  function wrap() {
    const start = document.getElementById("start");
    if (!start || start.dataset.cine) return;
    start.dataset.cine = "1";
    const orig = start.onclick;
    start.onclick = function (e) {
      if (localStorage.getItem("chronoself.intro") === "1") {
        if (orig) return orig.call(start, e);
        return;
      }
      let i = 0;
      const box = document.getElementById("app");
      function slide() {
        const s = INTRO[i];
        box.innerHTML = `<main class="step" style="min-height:58vh;display:flex;flex-direction:column;justify-content:center">
          <p class="meta">${s.k} / 03</p>
          <h1 class="q">${s.t}</h1>
          <p class="lede">${s.d}</p>
          <div class="row"><button class="cta" id="cineNext" style="margin-top:0">${i < 2 ? "Continua" : "Inizia"}</button></div>
        </main>`;
        document.getElementById("cineNext").onclick = function () {
          if (i < 2) { i++; slide(); }
          else { localStorage.setItem("chronoself.intro", "1"); location.reload(); }
        };
      }
      slide();
    };
  }
  function banner() {
    try {
      const raw = JSON.parse(localStorage.getItem("chronoself.v2") || "{}");
      if (!raw.pro || !raw.planStart) return;
      const day = Math.min(90, Math.max(1, Math.floor((Date.now() - new Date(raw.planStart)) / 86400000) + 1));
      const marks = { 7: "Giorno 7. La novità è finita. Resta solo se la leva è in calendario.", 30: "Giorno 30. Un terzo del piano. Rifai i check, non le intenzioni.", 90: "Giorno 90. Rifai la simulazione." };
      if (!marks[day] || sessionStorage.getItem("cs.mark." + day)) return;
      const bar = document.createElement("div");
      bar.className = "lock";
      bar.style.margin = "12px 0 0";
      bar.textContent = marks[day];
      bar.onclick = function () { sessionStorage.setItem("cs.mark." + day, "1"); bar.remove(); };
      const nav = document.querySelector(".nav");
      if (nav && nav.parentNode) nav.parentNode.insertBefore(bar, nav.nextSibling);
    } catch (e) {}
  }
  setTimeout(wrap, 80);
  setInterval(wrap, 800);
  banner();
})();
