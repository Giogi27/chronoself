const QUESTIONS = [
  {id:"sonno",axis:"salute",text:"Quante ore dormi, in media, a notte?",min:"Meno di 5",max:"7-9 ore stabili"},
  {id:"movimento",axis:"salute",text:"Quanti giorni a settimana ti muovi almeno 30 minuti?",min:"Mai",max:"5+ giorni"},
  {id:"energia",axis:"salute",text:"Come valuti la tua energia nelle giornate normali?",min:"Sempre stanco",max:"Stabile e buona"},
  {id:"risparmio",axis:"soldi",text:"Quanto riesci a mettere da parte ogni mese?",hint:"Anche una stima va bene.",min:"Niente / vado in rosso",max:"Risparmio in modo costante"},
  {id:"debiti",axis:"soldi",text:"Quanto pesano debiti, rate e spese fisse sul tuo mese?",min:"Mi soffocano",max:"Sono sotto controllo"},
  {id:"cuscinetto",axis:"soldi",text:"Se perdessi il reddito principale, per quanto terresti?",min:"Pochi giorni",max:"6+ mesi"},
  {id:"competenza",axis:"lavoro",text:"Le tue competenze stanno crescendo o sono ferme da un po'?",min:"Ferme da anni",max:"Imparo ogni mese"},
  {id:"autonomia",axis:"lavoro",text:"Quanto controllo hai su orari, reddito e direzione del lavoro?",min:"Quasi nessuno",max:"Molto alto"},
  {id:"senso",axis:"lavoro",text:"Il lavoro che fai ha senso per te?",min:"Per niente",max:"Molto"},
  {id:"legami",axis:"relazioni",text:"Quante persone vedi o senti davvero, ogni settimana?",min:"Quasi nessuno",max:"Una rete solida"},
  {id:"conflitti",axis:"relazioni",text:"Quanto spazio occupano litigi, distanza o rapporti tossici?",min:"Occupano tutto",max:"Poco o niente"},
  {id:"cura",axis:"relazioni",text:"Ti senti visto e sostenuto da almeno una persona?",min:"No",max:"Sì, in modo stabile"},
  {id:"schermo",axis:"abitudini",text:"Quante ore al giorno passi su telefono e social senza uno scopo?",min:"4+ ore perse",max:"Poco e intenzionale"},
  {id:"routine",axis:"abitudini",text:"Hai una routine mattutina o serale che tieni davvero?",min:"Mai",max:"Quasi sempre"},
  {id:"promesse",axis:"abitudini",text:"Quante delle promesse che fai a te stesso tieni, in un mese?",min:"Quasi nessuna",max:"La maggior parte"}
];
const AXES=["salute","soldi","lavoro","relazioni","abitudini"];
const AXIS_LABEL={salute:"Salute",soldi:"Soldi",lavoro:"Lavoro",relazioni:"Relazioni",abitudini:"Abitudini"};
const KEY="chronoself.simulation.v1";
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));

function scoresFrom(answers){
  const acc={};
  AXES.forEach(a=>acc[a]={s:0,n:0});
  QUESTIONS.forEach(q=>{acc[q.axis].s+=(answers[q.id]??50);acc[q.axis].n++;});
  const out={};
  AXES.forEach(a=>out[a]=Math.round(acc[a].s/acc[a].n));
  return out;
}
function project(score,years,kind){
  const drift={inerzia:score>=60?0.4:-1.1,miglioramento:2.4,deriva:-2.8}[kind];
  return clamp(score+drift*years*(1+years*0.08));
}
function money(score,y){
  const w=y===1?"o":"i";
  if(score<35) return `A ${y} ann${w} il cuscinetto è fragile: un imprevisto ti mette in difficoltà in poche settimane.`;
  if(score<60) return `A ${y} ann${w} tieni il passo, ma non costruisci margine.`;
  if(score<80) return `A ${y} ann${w} hai un cuscinetto. Non sei ricco, ma dormi.`;
  return `A ${y} ann${w} il compounding ha fatto il lavoro sporco: più scelte aperte.`;
}
function health(s){return s<40?"Energia bassa, sonno irregolare, il corpo chiede il conto.":s<65?"Stai in piedi, ma senza riserva.":"Sonno e movimento tengono.";}
function work(s){return s<40?"Le competenze sono invecchiate. Dipendi da un ruolo che non controlli.":s<65?"Lavori, produci, ma la direzione la decide qualcun altro.":"Competenze in movimento e più autonomia.";}
function rel(s){return s<40?"La rete si è assottigliata. I giorni pesanti li affronti da solo.":s<65?"Hai qualcuno, ma i rapporti vivono di inerzia.":"Ci sono persone a cui puoi dire la verità.";}
function habit(s){return s<40?"Le giornate le decide lo schermo.":s<65?"Alcune routine tengono, altre no.":"La giornata ha un binario. Tieni abbastanza promesse da accumulare.";}
function opener(avg,y,kind){
  if(kind==="miglioramento") return `Nel ${2026+y} non sei un'altra persona. Sei la stessa, con due o tre leve tenute per anni.`;
  if(kind==="deriva") return `Nel ${2026+y} niente è crollato in un giorno. È scivolato.`;
  return avg<50?`Nel ${2026+y} la vita è riconoscibile: stessi problemi, un po' più stretti.`:`Nel ${2026+y} è andato avanti da solo, senza che tu scegliessi molto.`;
}
function facts(scores,y){
  return [
    {l:"Energia",v:scores.salute>=70?"Buona":scores.salute>=45?"Instabile":"Bassa"},
    {l:"Cuscinetto",v:scores.soldi>=75?(Math.max(6,y*3)+"+ mesi"):scores.soldi>=50?(Math.max(1,Math.round(y*0.8))+"–"+Math.max(2,y)+" mesi"):"Poche settimane"},
    {l:"Competenze",v:scores.lavoro>=70?"In crescita":scores.lavoro>=45?"Stabili":"In ritardo"},
    {l:"Rete",v:scores.relazioni>=70?"Solida":scores.relazioni>=45?"Sottile":"Isolamento"},
    {l:"Orizzonte",v:y+" ann"+(y===1?"o":"i")}
  ];
}
function levers(kind,base){
  const weakest=[...AXES].sort((a,b)=>base[a]-base[b])[0];
  const map={
    salute:"Fissa un'ora di sonno e 3 sessioni di movimento da 30 minuti, per 90 giorni.",
    soldi:"Trasferisci il 10% dello stipendio il giorno dello stipendio. Anche 50 euro, se automatici.",
    lavoro:"Un blocco di 4 ore a settimana solo per una competenza che il lavoro futuro chiede.",
    relazioni:"Una chiamata o una cena vera a settimana. In agenda, non a voce.",
    abitudini:"Togli 45 minuti di scroll serale. Mettili prima di una cosa che hai detto di voler fare."
  };
  if(kind==="miglioramento") return [map[weakest],"Check ogni domenica: una riga per asse.","Proteggi una sola leva per 90 giorni."];
  if(kind==="deriva") return ["Il rischio non è un crollo: è non accorgertene. Rifai questa simulazione tra 90 giorni.",map[weakest],"Togli una abitudine che ti costa energia ogni sera."];
  return [map[weakest],"Rendi automatica una leva (calendario, bonifico, allarme).","Tra 90 giorni rifai il questionario."];
}
function simulate(answers){
  const base=scoresFrom(answers);
  const horizons={};
  [1,5,10].forEach(y=>{
    horizons[y]={};
    ["inerzia","miglioramento","deriva"].forEach(kind=>{
      const p={}; AXES.forEach(a=>p[a]=project(base[a],y,kind));
      horizons[y][kind]={
        title:{inerzia:"Se continui così",miglioramento:"Se muovi 2-3 leve",deriva:"Se scivoli"}[kind],
        narrative:[opener(AXES.reduce((s,a)=>s+p[a],0)/5,y,kind),health(p.salute),money(p.soldi,y),work(p.lavoro),rel(p.relazioni),habit(p.abitudini)].join(" "),
        facts:facts(p,y),
        levers:levers(kind,base)
      };
    });
  });
  return {scores:base,horizons};
}

const state={view:"home",i:0,answers:Object.fromEntries(QUESTIONS.map(q=>[q.id,50])),sim:null,h:5};
try{const raw=localStorage.getItem(KEY); if(raw) state.sim=JSON.parse(raw);}catch(e){}
const app=document.getElementById("app");
function go(view){state.view=view; render();}
document.getElementById("goHome").onclick=()=>go("home");
document.getElementById("goPrivacy").onclick=()=>go("privacy");

function render(){
  if(state.view==="home"){
    app.innerHTML=`<section class="hero"><h1>Chi diventi se continui così.</h1><p class="lede">ChronoSelf prende le tue abitudini di oggi e ti mostra tre futuri: inerzia, miglioramento, deriva. Non è un oracolo. È il compounding, scritto in italiano.</p><button class="cta" id="start">Fai la simulazione</button></section><section class="grid"><article class="card"><h3>15 domande</h3><p>Salute, soldi, lavoro, relazioni, abitudini. Niente importi esatti, niente diagnosi.</p></article><article class="card"><h3>Tre scenari</h3><p>A 1, 5 e 10 anni. Stessa persona, leve diverse.</p></article><article class="card"><h3>Resta sul telefono</h3><p>I dati stanno solo nel tuo browser. Nessun account obbligatorio.</p></article></section>`;
    document.getElementById("start").onclick=()=>{state.i=0;go("simula");};
    return;
  }
  if(state.view==="privacy"){
    app.innerHTML=`<main class="step"><h1 class="q">Privacy</h1><p class="lede">Questa versione elabora le risposte solo nel browser (localStorage). Non c'è account e non vendiamo dati.</p></main>`;
    return;
  }
  if(state.view==="simula"){
    const q=QUESTIONS[state.i];
    const pct=Math.round(((state.i+1)/QUESTIONS.length)*100);
    app.innerHTML=`<main class="step"><p class="meta">${state.i+1} / ${QUESTIONS.length} · ${pct}%</p><h1 class="q">${q.text}</h1>${q.hint?`<p class="meta">${q.hint}</p>`:""}<input class="range" id="rng" type="range" min="0" max="100" value="${state.answers[q.id]}" /><div class="labels"><span>${q.min}</span><span>${q.max}</span></div><div class="row"><button class="btn" id="back" ${state.i===0?"disabled":""}>Indietro</button><button class="cta" id="next" style="margin-top:0">${state.i<QUESTIONS.length-1?"Avanti":"Vedi i tre futuri"}</button></div></main>`;
    document.getElementById("rng").oninput=e=>{state.answers[q.id]=Number(e.target.value);};
    document.getElementById("back").onclick=()=>{if(state.i>0){state.i--;render();}};
    document.getElementById("next").onclick=()=>{
      if(state.i<QUESTIONS.length-1){state.i++;render();}
      else{state.sim=simulate(state.answers);localStorage.setItem(KEY,JSON.stringify(state.sim));go("risultato");}
    };
    return;
  }
  if(!state.sim){
    app.innerHTML=`<main class="step"><h1 class="q">Nessuna simulazione salvata.</h1><button class="cta" id="start">Inizia</button></main>`;
    document.getElementById("start").onclick=()=>go("simula");
    return;
  }
  const pack=state.sim.horizons[state.h];
  const bars=AXES.map(a=>`<div class="axisbar"><span>${AXIS_LABEL[a]}</span><div class="bar"><span style="width:${state.sim.scores[a]}%"></span></div><span>${state.sim.scores[a]}</span></div>`).join("");
  const cols=["deriva","inerzia","miglioramento"].map(id=>{
    const s=pack[id];
    return `<article class="card scenario"><h2>${s.title}</h2><p>${s.narrative}</p><ul class="facts">${s.facts.map(f=>`<li><span>${f.l}</span><strong>${f.v}</strong></li>`).join("")}</ul><ol class="levers">${s.levers.map(l=>`<li>${l}</li>`).join("")}</ol></article>`;
  }).join("");
  app.innerHTML=`<main class="step"><p class="meta">I tuoi assi, oggi</p>${bars}<div class="tabs">${[1,5,10].map(y=>`<button class="tab ${y===state.h?"on":""}" data-y="${y}">Tra ${y} ann${y===1?"o":"i"}</button>`).join("")}</div><div class="cols">${cols}</div><p class="disclaimer">Questa non è una previsione. È un modello semplice di compounding. Tra 90 giorni rifai il questionario.</p><div class="row"><button class="cta" id="redo" style="margin-top:0">Rifai la simulazione</button></div></main>`;
  app.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{state.h=Number(b.dataset.y);render();});
  document.getElementById("redo").onclick=()=>{state.i=0;go("simula");};
}
render();
