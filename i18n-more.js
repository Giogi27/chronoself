(function () {
  const Q = {
    it: [
      { q: "Prima ora in Leonida?", a: ["Cabrio", "Tetto e piano", "Sparatoria", "Mappa e pin"] },
      { q: "Chi maini?", a: ["Lucia", "Jason", "Switch", "Meta"] },
      { q: "Soldi day-1?", a: ["Story", "Street", "Esploro", "Crew"] },
      { q: "Cosa ti serve?", a: ["Alert", "Mappa", "Prezzi", "Pack"] }
    ],
    en: [
      { q: "First hour in Leonida?", a: ["Cabrio", "Rooftop and plan", "Shootout", "Map and pins"] },
      { q: "Who do you main?", a: ["Lucia", "Jason", "Switch", "Meta"] },
      { q: "Day-1 money?", a: ["Story", "Street", "Explore", "Crew"] },
      { q: "What do you need?", a: ["Alerts", "Map", "Prices", "Pack"] }
    ],
    es: [
      { q: "¿Primera hora en Leonida?", a: ["Cabrio", "Azotea y plan", "Tiroteo", "Mapa y pines"] },
      { q: "¿A quién usas?", a: ["Lucia", "Jason", "Switch", "Meta"] },
      { q: "¿Dinero día 1?", a: ["Historia", "Calle", "Exploro", "Crew"] },
      { q: "¿Qué te hace falta?", a: ["Alertas", "Mapa", "Precios", "Pack"] }
    ],
    fr: [
      { q: "Première heure à Leonida ?", a: ["Cabriolet", "Toit et plan", "Fusillade", "Carte et pins"] },
      { q: "Qui tu joues ?", a: ["Lucia", "Jason", "Switch", "Meta"] },
      { q: "Argent jour 1 ?", a: ["Histoire", "Rue", "J’explore", "Crew"] },
      { q: "De quoi tu as besoin ?", a: ["Alertes", "Carte", "Prix", "Pack"] }
    ],
    de: [
      { q: "Erste Stunde in Leonida?", a: ["Cabrio", "Dach und Plan", "Schießerei", "Karte und Pins"] },
      { q: "Wen spielst du?", a: ["Lucia", "Jason", "Switch", "Meta"] },
      { q: "Geld an Tag 1?", a: ["Story", "Straße", "Erkunden", "Crew"] },
      { q: "Was brauchst du?", a: ["Alerts", "Karte", "Preise", "Pack"] }
    ],
    pt: [
      { q: "Primeira hora em Leonida?", a: ["Cabrio", "Telhado e plano", "Tiroteio", "Mapa e pins"] },
      { q: "Quem jogas?", a: ["Lucia", "Jason", "Switch", "Meta"] },
      { q: "Dinheiro no dia 1?", a: ["História", "Rua", "Exploro", "Crew"] },
      { q: "Do que precisas?", a: ["Alertas", "Mapa", "Preços", "Pack"] }
    ],
    ja: [
      { q: "Leonidaの最初の1時間？", a: ["カブリオ", "屋根と計画", "銃撃戦", "マップとピン"] },
      { q: "だれを使う？", a: ["Lucia", "Jason", "Switch", "Meta"] },
      { q: "1日目の金？", a: ["ストーリー", "街", "探索", "Crew"] },
      { q: "何が必要？", a: ["アラート", "マップ", "値段", "Pack"] }
    ]
  };
  const TYPES = {
    it: ["Locale", "Spiaggia", "Quartiere", "Missione", "Easter egg"],
    en: ["Venue", "Beach", "District", "Mission", "Easter egg"],
    es: ["Local", "Playa", "Barrio", "Misión", "Easter egg"],
    fr: ["Lieu", "Plage", "Quartier", "Mission", "Easter egg"],
    de: ["Ort", "Strand", "Viertel", "Mission", "Easter egg"],
    pt: ["Local", "Praia", "Bairro", "Missão", "Easter egg"],
    ja: ["店", "ビーチ", "街", "ミッション", "Easter egg"]
  };
  const VALUES = ["Locale", "Spiaggia", "Quartiere", "Missione", "Easter egg"];
  let qi2 = 0, score2 = [0, 0, 0, 0];

  window.answerLang = function (i) {
    score2[i]++;
    qi2++;
    drawQuiz();
  };

  function drawQuiz() {
    const box = document.getElementById("quizBox");
    if (!box) return;
    const lang = localStorage.getItem("p72_lang") || "it";
    const list = Q[lang] || Q.it;
    if (qi2 >= list.length) {
      box.innerHTML = '<div class="result"><h3>PRIME 72</h3><button class="btn primary" type="button" onclick="goConsoleOrPro()">Pro</button></div>';
      return;
    }
    const cur = list[qi2];
    box.innerHTML = '<div class="quiz-q"><h3>' + (qi2 + 1) + ". " + cur.q +
      '</h3><div class="opts">' +
      cur.a.map(function (opt, i) {
        return '<button type="button" onclick="answerLang(' + i + ')">' + opt + "</button>";
      }).join("") + "</div></div>";
  }

  function paint(lang) {
    lang = Q[lang] ? lang : "it";
    qi2 = 0;
    score2 = [0, 0, 0, 0];
    drawQuiz();
    const sel = document.getElementById("pinType");
    if (sel) {
      const cur = sel.value;
      sel.innerHTML = TYPES[lang].map(function (label, i) {
        return '<option value="' + VALUES[i] + '">' + label + "</option>";
      }).join("");
      if (VALUES.indexOf(cur) >= 0) sel.value = cur;
    }
  }

  const prev = window.setLang;
  window.setLang = function (lang) {
    if (typeof prev === "function") prev(lang);
    paint(lang || localStorage.getItem("p72_lang") || "it");
  };
  paint(localStorage.getItem("p72_lang") || "it");
  setTimeout(function () { paint(localStorage.getItem("p72_lang") || "it"); }, 150);
})();
