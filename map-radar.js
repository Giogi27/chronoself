let liveMarkers = [];
let mapFilter = "Tutti";
let ghostMark = null;

function typeLabel(type) {
  const lang = localStorage.getItem("p72_lang") || "it";
  const map = {
    it: { Locale: "Locale", Spiaggia: "Spiaggia", Quartiere: "Quartiere", Missione: "Missione", "Easter egg": "Easter egg" },
    en: { Locale: "Venue", Spiaggia: "Beach", Quartiere: "District", Missione: "Mission", "Easter egg": "Easter egg" },
    es: { Locale: "Local", Spiaggia: "Playa", Quartiere: "Barrio", Missione: "Misión", "Easter egg": "Easter egg" },
    fr: { Locale: "Lieu", Spiaggia: "Plage", Quartiere: "Quartier", Missione: "Mission", "Easter egg": "Easter egg" },
    de: { Locale: "Ort", Spiaggia: "Strand", Quartiere: "Viertel", Missione: "Mission", "Easter egg": "Easter egg" },
    pt: { Locale: "Local", Spiaggia: "Praia", Quartiere: "Bairro", Missione: "Missão", "Easter egg": "Easter egg" },
    ja: { Locale: "店", Spiaggia: "ビーチ", Quartiere: "街", Missione: "ミッション", "Easter egg": "Easter egg" }
  };
  return (map[lang] && map[lang][type]) || type || "";
}

function radarWord() {
  const lang = localStorage.getItem("p72_lang") || "it";
  return {
    it: "segnali",
    en: "signals",
    es: "señales",
    fr: "signaux",
    de: "signale",
    pt: "sinais",
    ja: "シグナル"
  }[lang] || "signals";
}

function radarEmpty() {
  const lang = localStorage.getItem("p72_lang") || "it";
  return {
    it: "Nessun segnale su questo filtro.",
    en: "No signals on this filter.",
    es: "Ninguna señal en este filtro.",
    fr: "Aucun signal sur ce filtre.",
    de: "Keine Signale in diesem Filter.",
    pt: "Nenhum sinal neste filtro.",
    ja: "このフィルターにシグナルはありません。"
  }[lang];
}

function renderRadarList() {
  const box = document.getElementById("radarList");
  const count = document.getElementById("radarCount");
  if (!box) return;
  const rows = liveMarkers
    .map(function (mk) { return mk._p72; })
    .filter(function (p) { return p && (mapFilter === "Tutti" || p.type === mapFilter); });
  if (count) count.textContent = rows.length + " " + radarWord();
  if (!rows.length) {
    box.innerHTML = "<p class='hint'>" + radarEmpty() + "</p>";
    return;
  }
  box.innerHTML = rows.map(function (p) {
    return '<button class="radar-item" type="button" onclick="focusRadar(' + p.lat + ',' + p.lng + ')">' +
      "<b>" + p.title + "</b><span>" + typeLabel(p.type) +
      (p.author ? " · " + p.author : "") + "</span></button>";
  }).join("");
}

function focusRadar(lat, lng) {
  if (map) map.setView([lat, lng], 15);
}

function setMapFilter(type) {
  mapFilter = type;
  liveMarkers.forEach(function (mk) {
    const show = mapFilter === "Tutti" || (mk._p72 && mk._p72.type === mapFilter);
    if (show) {
      if (!map.hasLayer(mk)) mk.addTo(map);
    } else if (map.hasLayer(mk)) map.removeLayer(mk);
  });
  document.querySelectorAll(".radar-bar button").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-filter") === type);
  });
  renderRadarList();
}

function hookMapClick() {
  if (!map || map._radarHooked) return;
  map._radarHooked = true;
  map.on("click", function (e) {
    pendingLatLng = e.latlng;
    if (ghostMark) map.removeLayer(ghostMark);
    ghostMark = L.circleMarker(e.latlng, {
      radius: 10, color: "#ff2d95", fillColor: "#3df0ff", fillOpacity: 0.7, weight: 2
    }).addTo(map);
    toast("ok");
  });
}

(function bootRadar() {
  const prevInit = window.initMap;
  window.initMap = function () {
    if (typeof prevInit === "function") prevInit();
    hookMapClick();
    setTimeout(renderRadarList, 400);
  };
  const prevPlace = window.placePin;
  window.placePin = function (p) {
    if (!map) return;
    const who = p.author ? "<br>" + (p.author) : "";
    const mk = L.marker([p.lat, p.lng], { icon: pinIcon(p.type) })
      .addTo(map)
      .bindPopup("<strong>" + p.title + "</strong><br><em>" + typeLabel(p.type) + "</em><br>" + (p.note || "") + who);
    mk._p72 = p;
    liveMarkers.push(mk);
    if (mapFilter !== "Tutti" && p.type !== mapFilter) map.removeLayer(mk);
    renderRadarList();
  };
  const prevLang = window.setLang;
  window.setLang = function (lang) {
    if (typeof prevLang === "function") prevLang(lang);
    renderRadarList();
  };
})();
