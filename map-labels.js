const CITY_LABELS = [
  { lat: 25.7907, lng: -80.1340, key: "RIVA", kind: "zone", z: 11 },
  { lat: 25.7617, lng: -80.1918, key: "CENTRO", kind: "zone", z: 11 },
  { lat: 25.8065, lng: -80.1250, key: "NEON", kind: "zone", z: 11 },
  { lat: 25.7780, lng: -80.1870, key: "DARSENA", kind: "zone", z: 11 },
  { lat: 25.7950, lng: -80.2760, key: "PISTA", kind: "zone", z: 11 },
  { lat: 25.7320, lng: -80.2440, key: "GIARDINI", kind: "zone", z: 12 },
  { lat: 25.8500, lng: -80.1750, key: "DUNE", kind: "zone", z: 12 },
  { lat: 25.7310, lng: -80.1620, key: "ISOLE", kind: "zone", z: 12 },
  { lat: 25.8680, lng: -80.1220, key: "NORD", kind: "zone", z: 12 },
  { lat: 25.7880, lng: -80.1320, key: "CORAL", kind: "road", z: 14, rot: 88 },
  { lat: 25.7805, lng: -80.1305, key: "RIVA_DR", kind: "road", z: 14, rot: 88 },
  { lat: 25.7750, lng: -80.1890, key: "BAIA", kind: "road", z: 14, rot: 8 },
  { lat: 25.7900, lng: -80.2080, key: "HW7", kind: "road", z: 13, rot: 6 },
  { lat: 25.7845, lng: -80.1550, key: "PONTE", kind: "road", z: 13, rot: -12 },
  { lat: 25.7680, lng: -80.1895, key: "TORRI", kind: "road", z: 14, rot: 90 },
  { lat: 25.8010, lng: -80.1410, key: "PALME", kind: "road", z: 14, rot: 70 },
  { lat: 25.8100, lng: -80.1228, key: "LITO", kind: "road", z: 14, rot: 88 },
  { lat: 25.7570, lng: -80.1980, key: "SUD", kind: "road", z: 14, rot: 20 },
  { lat: 25.7935, lng: -80.2500, key: "VIA_PISTA", kind: "road", z: 14, rot: -8 },
  { lat: 25.7812, lng: -80.1308, key: "CLUB", kind: "spot", z: 15 },
  { lat: 25.7756, lng: -80.1390, key: "MOLO", kind: "spot", z: 15 },
  { lat: 25.7902, lng: -80.1288, key: "HOTEL", kind: "spot", z: 15 },
  { lat: 25.7704, lng: -80.1855, key: "STAT", kind: "spot", z: 15 },
  { lat: 25.8078, lng: -80.1235, key: "INS", kind: "spot", z: 15 },
  { lat: 25.7688, lng: -80.1340, key: "SPIA", kind: "spot", z: 15 },
  { lat: 25.7948, lng: -80.2735, key: "TERM", kind: "spot", z: 15 },
  { lat: 25.7788, lng: -80.1860, key: "PORTO", kind: "spot", z: 15 }
];

const LAB = {
  it: { RIVA:"RIVA", CENTRO:"CENTRO", NEON:"NEON", DARSENA:"DARSENA", PISTA:"PISTA", GIARDINI:"GIARDINI", DUNE:"DUNE", ISOLE:"ISOLE", NORD:"NORD", CORAL:"CORAL AVE", RIVA_DR:"RIVA DRIVE", BAIA:"BAIA BLVD", HW7:"AUTOSTRADA 7", PONTE:"PONTE EST", TORRI:"VIA DELLE TORRI", PALME:"STRADA PALME", LITO:"LITORANEA", SUD:"ANELLO SUD", VIA_PISTA:"VIA PISTA", CLUB:"Club Palme", MOLO:"Molo 12", HOTEL:"Hotel Rosa", STAT:"Stazione", INS:"Insegne", SPIA:"Spiaggia Sud", TERM:"Terminal", PORTO:"Porto" },
  en: { RIVA:"SHORE", CENTRO:"DOWNTOWN", NEON:"NEON", DARSENA:"DOCKS", PISTA:"AIRFIELD", GIARDINI:"GARDENS", DUNE:"DUNES", ISOLE:"ISLANDS", NORD:"NORTH", CORAL:"CORAL AVE", RIVA_DR:"SHORE DRIVE", BAIA:"BAY BLVD", HW7:"HIGHWAY 7", PONTE:"EAST BRIDGE", TORRI:"TOWER ST", PALME:"PALM ROAD", LITO:"COASTLINE", SUD:"SOUTH LOOP", VIA_PISTA:"AIRFIELD RD", CLUB:"Palm Club", MOLO:"Pier 12", HOTEL:"Rosa Hotel", STAT:"Station", INS:"Signs", SPIA:"South Beach", TERM:"Terminal", PORTO:"Port" },
  es: { RIVA:"ORILLA", CENTRO:"CENTRO", NEON:"NEON", DARSENA:"MUELLE", PISTA:"PISTA", GIARDINI:"JARDINES", DUNE:"DUNAS", ISOLE:"ISLAS", NORD:"NORTE", CORAL:"CORAL AVE", RIVA_DR:"ORILLA DR", BAIA:"BAHIA BLVD", HW7:"AUTOPISTA 7", PONTE:"PUENTE ESTE", TORRI:"VIA TORRES", PALME:"CALLE PALMAS", LITO:"LITORAL", SUD:"ANILLO SUR", VIA_PISTA:"VIA PISTA", CLUB:"Club Palma", MOLO:"Muelle 12", HOTEL:"Hotel Rosa", STAT:"Estación", INS:"Letreros", SPIA:"Playa Sur", TERM:"Terminal", PORTO:"Puerto" },
  fr: { RIVA:"RIVE", CENTRO:"CENTRE", NEON:"NÉON", DARSENA:"QUAIS", PISTA:"PISTE", GIARDINI:"JARDINS", DUNE:"DUNES", ISOLE:"ÎLES", NORD:"NORD", CORAL:"CORAL AVE", RIVA_DR:"RIVE DRIVE", BAIA:"BAIE BLVD", HW7:"AUTOROUTE 7", PONTE:"PONT EST", TORRI:"RUE TOURS", PALME:"RUE PALMIERS", LITO:"LITTORAL", SUD:"BOUCLE SUD", VIA_PISTA:"VOIE PISTE", CLUB:"Club Palme", MOLO:"Môle 12", HOTEL:"Hôtel Rosa", STAT:"Gare", INS:"Enseignes", SPIA:"Plage Sud", TERM:"Terminal", PORTO:"Port" },
  de: { RIVA:"UFER", CENTRO:"ZENTRUM", NEON:"NEON", DARSENA:"HAFEN", PISTA:"PISTE", GIARDINI:"GÄRTEN", DUNE:"DÜNEN", ISOLE:"INSELN", NORD:"NORD", CORAL:"CORAL AVE", RIVA_DR:"UFER DRIVE", BAIA:"BAY BLVD", HW7:"AUTOBAHN 7", PONTE:"OSTBRÜCKE", TORRI:"TURMSTR", PALME:"PALMENSTR", LITO:"KÜSTE", SUD:"SÜDRING", VIA_PISTA:"PISTENWEG", CLUB:"Palm Club", MOLO:"Pier 12", HOTEL:"Hotel Rosa", STAT:"Bahnhof", INS:"Schilder", SPIA:"Südstrand", TERM:"Terminal", PORTO:"Hafen" },
  pt: { RIVA:"MARGEM", CENTRO:"CENTRO", NEON:"NEON", DARSENA:"DOCAS", PISTA:"PISTA", GIARDINI:"JARDINS", DUNE:"DUNAS", ISOLE:"ILHAS", NORD:"NORTE", CORAL:"CORAL AVE", RIVA_DR:"MARGEM DR", BAIA:"BAÍA BLVD", HW7:"AUTOESTRADA 7", PONTE:"PONTE ESTE", TORRI:"RUA TORRES", PALME:"ESTRADA PALMAS", LITO:"LITORAL", SUD:"ANEL SUL", VIA_PISTA:"VIA PISTA", CLUB:"Clube Palma", MOLO:"Cais 12", HOTEL:"Hotel Rosa", STAT:"Estação", INS:"Letreiros", SPIA:"Praia Sul", TERM:"Terminal", PORTO:"Porto" },
  ja: { RIVA:"ショア", CENTRO:"ダウンタウン", NEON:"ネオン", DARSENA:"ドック", PISTA:"空港", GIARDINI:"園", DUNE:"砂丘", ISOLE:"島", NORD:"北", CORAL:"CORAL AVE", RIVA_DR:"SHORE DR", BAIA:"BAY BLVD", HW7:"HWY 7", PONTE:"東橋", TORRI:"タワー通り", PALME:"ヤシの道", LITO:"沿岸", SUD:"南ループ", VIA_PISTA:"空港通り", CLUB:"Palm Club", MOLO:"ピア 12", HOTEL:"Hotel Rosa", STAT:"駅", INS:"ネオン", SPIA:"南ビーチ", TERM:"ターミナル", PORTO:"港" }
};

function labName(item) {
  const lang = localStorage.getItem("p72_lang") || "it";
  return (LAB[lang] && LAB[lang][item.key]) || (LAB.it && LAB.it[item.key]) || item.key;
}

function labelIcon(item) {
  const rot = item.rot ? "transform:rotate(" + item.rot + "deg)" : "";
  return L.divIcon({
    className: "map-lab wrap-" + item.kind,
    html: '<span class="map-lab " data-kind="' + item.kind + '" style="' + rot + '">' + labName(item) + "</span>",
    iconSize: [1, 1],
    iconAnchor: [0, 0]
  });
}

function clearLabels(target) {
  if (!target || !target._labels) return;
  target._labels.forEach(function (mk) {
    if (target.hasLayer(mk)) target.removeLayer(mk);
  });
  target._labels = null;
}

function addCityLabels(target) {
  if (!target) return;
  clearLabels(target);
  target._labels = [];
  CITY_LABELS.forEach(function (item) {
    const mk = L.marker([item.lat, item.lng], {
      icon: labelIcon(item),
      interactive: false,
      keyboard: false,
      zIndexOffset: -200
    });
    mk._needZ = item.z;
    target._labels.push(mk);
  });
  function sync() {
    const z = target.getZoom();
    target._labels.forEach(function (mk) {
      const on = z >= mk._needZ;
      if (on && !target.hasLayer(mk)) mk.addTo(target);
      if (!on && target.hasLayer(mk)) target.removeLayer(mk);
    });
  }
  target.off("zoomend", target._labelSync);
  target._labelSync = sync;
  target.on("zoomend", sync);
  sync();
}

window.addCityLabels = addCityLabels;
const prevLangL = window.setLang;
window.setLang = function (lang) {
  if (typeof prevLangL === "function") prevLangL(lang);
  if (window.map) addCityLabels(window.map);
};
