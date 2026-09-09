const QUESTIONS = [
  {id:"sonno",axis:"salute",text:"Quante ore dormi, in media, a notte?",min:"Meno di 5",max:"7-9 ore stabili"},
  {id:"movimento",axis:"salute",text:"Quanti giorni a settimana ti muovi almeno 30 minuti?",min:"Mai",max:"5+ giorni"},
  {id:"energia",axis:"salute",text:"Come valuti la tua energia nelle giornate normali?",min:"Sempre stanco",max:"Stabile e buona"},
  {id:"cibo",axis:"salute",text:"Quante volte a settimana cucini o mangi con un minimo di attenzione?",min:"Quasi mai",max:"Quasi sempre"},
  {id:"risparmio",axis:"soldi",text:"Quanto riesci a mettere da parte ogni mese?",hint:"Basta una stima.",min:"Niente / in rosso",max:"Risparmio costante"},
  {id:"debiti",axis:"soldi",text:"Quanto pesano debiti, rate e spese fisse?",min:"Mi soffocano",max:"Sotto controllo"},
  {id:"cuscinetto",axis:"soldi",text:"Se perdessi il reddito principale, per quanto terresti?",min:"Pochi giorni",max:"6+ mesi"},
  {id:"spese",axis:"soldi",text:"Sai dove vanno i soldi ogni mese?",min:"No",max:"Sì, quasi tutto tracciato"},
  {id:"competenza",axis:"lavoro",text:"Le tue competenze stanno crescendo?",min:"Ferme da anni",max:"Imparo ogni mese"},
  {id:"autonomia",axis:"lavoro",text:"Quanto controllo hai su orari, reddito e direzione?",min:"Quasi nessuno",max:"Molto alto"},
  {id:"senso",axis:"lavoro",text:"Il lavoro che fai ha senso per te?",min:"Per niente",max:"Molto"},
  {id:"retepro",axis:"lavoro",text:"Hai persone con cui puoi parlare di lavoro senza recitare?",min:"Nessuna",max:"Sì, diverse"},
  {id:"legami",axis:"relazioni",text:"Quante persone vedi o senti davvero ogni settimana?",min:"Quasi nessuno",max:"Una rete solida"},
  {id:"conflitti",axis:"relazioni",text:"Quanto spazio occupano litigi o rapporti tossici?",min:"Occupano tutto",max:"Poco o niente"},
  {id:"cura",axis:"relazioni",text:"Ti senti visto da almeno una persona?",min:"No",max:"Sì, in modo stabile"},
  {id:"schermo",axis:"abitudini",text:"Ore al giorno su telefono e social senza scopo?",min:"4+ ore perse",max:"Poco e intenzionale"},
  {id:"routine",axis:"abitudini",text:"Hai una routine mattutina o serale che tieni?",min:"Mai",max:"Quasi sempre"},
  {id:"promesse",axis:"abitudini",text:"Quante promesse a te stesso tieni in un mese?",min:"Quasi nessuna",max:"La maggior parte"}
];
const AXES=["salute","soldi","lavoro","relazioni","abitudini"];
const AXIS_LABEL={salute:"Salute",soldi:"Soldi",lavoro:"Lavoro",relazioni:"Relazioni",abitudini:"Abitudini"};
const KEY="chronoself.v2";
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function save(db){localStorage.setItem(KEY,JSON.stringify(db));}
const db=Object.assign({profile:{nome:"",eta:"",contesto:"citta"},answers:Object.fromEntries(QUESTIONS.map(q=>[q.id,50])),sim:null,history:[],checks:{}}, load());
function scoresFrom(a){const acc={}; AXES.forEach(x=>acc[x]={s:0,n:0}); QUESTIONS.forEach(q=>{acc[q.axis].s+=(a[q.id]??50);acc[q.axis].n++;}); const out={}; AXES.forEach(x=>out[x]=Math.round(acc[x].s/acc[x].n)); return out;}
function project(score,y,kind){const d={inerzia:score>=60?0.35:-1.15,miglioramento:2.35,deriva:-2.9}[kind]; return clamp(score+d*y*(1+y*0.08));}
function weakest(base){return [...AXES].sort((a,b)=>base[a]-base[b])[0];}
function lever(axis){return {salute:"Sonno fisso + 3 movimenti da 30 minuti a settimana.",soldi:"Bonifico automatico il giorno dello stipendio. Anche 50€.",lavoro:"4 ore a settimana su una competenza che il lavoro futuro chiede.",relazioni:"Una chiamata o cena vera a settimana, in agenda.",abitudini:"Togli 45 minuti di scroll serale."}[axis];}
function story(p,y,kind){
  const avg=AXES.reduce((s,a)=>s+p[a],0)/5;
  const open={miglioramento:`Nel ${2026+y} non sei un'altra persona. Sei la stessa, con due o tre leve tenute.`,deriva:`Nel ${2026+y} niente è crollato in un giorno. È scivolato.`,inerzia: avg<50?`Nel ${2026+y} la vita è riconoscibile: stessi problemi, un po' più stretti.`:`Nel ${2026+y} è andato avanti da solo.`}[kind];
  const bits=[p.salute<45?"Il corpo ha poco margine.":p.salute<70?"L'energia tiene a singhiozzo.":"Salute con riserva.",p.soldi<45?"Un imprevisto ti mette in difficoltà in settimane.":p.soldi<70?"Tieni il passo, ma non composti.":"C'è un cuscinetto.",p.lavoro<45?"Dipendi da un ruolo che non controlli.":p.lavoro<70?"Produci, ma la direzione è di altri.":"Competenze in movimento.",p.relazioni<45?"I giorni pesanti li fai da solo.":p.relazioni<70?"I rapporti vivono di inerzia.":"Hai gente a cui dire la verità.",p.abitudini<45?"La giornata la decide lo schermo.":p.abitudini<70?"Routine a metà.":"Tieni abbastanza promesse da accumulare."];
  return [open,...bits].join(" ");
}
function facts(p,y){return [["Energia", p.salute>=70?"Buona":p.salute>=45?"Instabile":"Bassa"],["Cuscinetto", p.soldi>=75?(Math.max(6,y*3)+"+ mesi"):p.soldi>=50?(Math.max(1,Math.round(y*.8))+"–"+Math.max(2,y)+" mesi"):"Poche settimane"],["Competenze", p.lavoro>=70?"In crescita":p.lavoro>=45?"Stabili":"In ritardo"],["Rete", p.relazioni>=70?"Solida":p.relazioni>=45?"Sottile":"Isolamento"]];}
function simulate(answers,profile){
  const base=scoresFrom(answers); const horizons={};
  [1,5,10].forEach(y=>{ horizons[y]={}; ["deriva","inerzia","miglioramento"].forEach(k=>{ const p={}; AXES.forEach(a=>p[a]=project(base[a],y,k)); horizons[y][k]={title:{deriva:"Se scivoli",inerzia:"Se continui così",miglioramento:"Se muovi 2-3 leve"}[k],narrative:story(p,y,k),facts:facts(p,y),scores:p}; }); });
  return {at:new Date().toISOString(),profile,answers,scores:base,weak:weakest(base),horizons};
}
function planItems(weak){return {focus:lever(weak),weeks:[["Settimana 1-2","Parte solo la leva più debole. Nient'altro."],["Settimana 3-4","Rendi automatica quella leva (allarme, bonifico, calendario)."],["Settimana 5-8","Tieni la leva e aggiungi un check domenicale di 10 minuti."],["Settimana 9-12","Rifai la simulazione. Se i numeri sono fermi, l'inerzia ha vinto."]]};}
const state={view:"home",i:0,h:5}; const app=document.getElementById("app");
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
function go(v){state.view=v;render();}
function axisBars(scores){return AXES.map(a=>`<div class="axisbar"><span>${AXIS_LABEL[a]}</span><div class="bar"><span style="width:${scores[a]}%"></span></div><span>${scores[a]}</span></div>`).join("");}
function render(){
  if(state.view==="home"){
    app.innerHTML=`<section class="hero"><h1>Chi diventi se continui così.</h1><p class="lede">Non un oracolo. Un modello di compounding su salute, soldi, lavoro, relazioni e abitudini. Poi un piano a 90 giorni.</p><button class="cta" id="start">${db.sim?"Apri la dashboard":"Inizia"}</button></section><section class="grid"><article class="card"><h3>18 domande</h3><p>Basta uno slider. Niente importi, niente diagnosi.</p></article><article class="card"><h3>Tre futuri</h3><p>Deriva, inerzia, miglioramento. A 1, 5 e 10 anni.</p></article><article class="card"><h3>Piano e storico</h3><p>Leve, check settimanali, confronto tra una simulazione e la successiva.</p></article></section>`;
    document.getElementById("start").onclick=()=>go(db.sim?"dash":"profilo"); return;
  }
  if(state.view==="privacy"){ app.innerHTML=`<main class="step"><h1 class="q">Privacy</h1><p class="lede">Tutto resta nel browser. Nessun account, nessun server, nessuna vendita dati.</p></main>`; return; }
  if(state.view==="profilo"){
    const p=db.profile;
    app.innerHTML=`<main class="step"><p class="meta">Passo 1 di 2</p><h1 class="q">Chi sta simulando.</h1><label class="field">Nome o come vuoi essere chiamato<input id="nome" value="${p.nome||""}" placeholder="Opzionale" /></label><label class="field">Età<input id="eta" type="number" min="16" max="90" value="${p.eta||""}" placeholder="Es. 29" /></label><label class="field">Contesto<select id="contesto"><option value="citta" ${p.contesto==="citta"?"selected":""}>Città</option><option value="paese" ${p.contesto==="paese"?"selected":""}>Paese / provincia</option><option value="estero" ${p.contesto==="estero"?"selected":""}>All'estero</option></select></label><div class="row"><button class="cta" id="next" style="margin-top:0">Alle domande</button></div></main>`;
    document.getElementById("next").onclick=()=>{db.profile={nome:document.getElementById("nome").value.trim(),eta:document.getElementById("eta").value,contesto:document.getElementById("contesto").value}; save(db); state.i=0; go("simula");}; return;
  }
  if(state.view==="simula"){
    const q=QUESTIONS[state.i]; const pct=Math.round(((state.i+1)/QUESTIONS.length)*100);
    app.innerHTML=`<main class="step"><p class="meta">${state.i+1} / ${QUESTIONS.length} · ${pct}% · ${AXIS_LABEL[q.axis]}</p><h1 class="q">${q.text}</h1>${q.hint?`<p class="meta">${q.hint}</p>`:""}<input class="range" id="rng" type="range" min="0" max="100" value="${db.answers[q.id]}" /><div class="labels"><span>${q.min}</span><span>${q.max}</span></div><div class="row"><button class="btn" id="back" ${state.i===0?"disabled":""}>Indietro</button><button class="cta" id="next" style="margin-top:0">${state.i<QUESTIONS.length-1?"Avanti":"Genera i futuri"}</button></div></main>`;
    document.getElementById("rng").oninput=e=>db.answers[q.id]=Number(e.target.value);
    document.getElementById("back").onclick=()=>{if(state.i>0){state.i--;render();}};
    document.getElementById("next").onclick=()=>{ if(state.i<QUESTIONS.length-1){state.i++;render();return;} const sim=simulate(db.answers,db.profile); db.sim=sim; db.history.unshift({at:sim.at,scores:sim.scores,weak:sim.weak}); db.history=db.history.slice(0,12); db.checks={}; save(db); go("dash"); }; return;
  }
  if(state.view==="dash"){
    if(!db.sim){go("profilo");return;} const s=db.sim; const who=s.profile.nome?s.profile.nome:"Tu"; const pack=s.horizons[state.h];
    const cols=["deriva","inerzia","miglioramento"].map(id=>{const x=pack[id]; return `<article class="card"><h2>${x.title}</h2><p>${x.narrative}</p><ul class="facts">${x.facts.map(([l,v])=>`<li><span>${l}</span><strong>${v}</strong></li>`).join("")}</ul></article>`;}).join("");
    app.innerHTML=`<main class="step"><p class="meta">${who}${s.profile.eta?" · "+s.profile.eta+" anni":""} · leva debole: ${AXIS_LABEL[s.weak]}</p><h1 class="q">I tuoi assi, oggi</h1>${axisBars(s.scores)}<div class="tabs">${[1,5,10].map(y=>`<button class="tab ${y===state.h?"on":""}" data-y="${y}">Tra ${y} ann${y===1?"o":"i"}</button>`).join("")}</div><div class="cols">${cols}</div><div class="row"><button class="cta" id="piano" style="margin-top:0">Piano 90 giorni</button><button class="btn" id="redo">Rifai</button><button class="btn" id="wipe">Cancella dati</button></div><p class="disclaimer">Modello semplice di compounding, non una previsione.</p></main>`;
    app.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{state.h=Number(b.dataset.y);render();});
    document.getElementById("piano").onclick=()=>go("piano"); document.getElementById("redo").onclick=()=>go("profilo"); document.getElementById("wipe").onclick=()=>{localStorage.removeItem(KEY);location.reload();}; return;
  }
  if(state.view==="piano"){
    if(!db.sim){go("profilo");return;} const pl=planItems(db.sim.weak);
    const tasks=[["t1","Ho fissato la leva in calendario"],["t2","L'ho fatta almeno 3 volte questa settimana"],["t3","Ho tolto una cosa che mi ruba energia la sera"],["t4","Ho detto a una persona cosa sto tenendo"]];
    app.innerHTML=`<main class="step"><p class="meta">90 giorni · focus ${AXIS_LABEL[db.sim.weak]}</p><h1 class="q">${pl.focus}</h1><div class="grid" style="padding-top:16px">${pl.weeks.map(([t,d])=>`<article class="card"><h3>${t}</h3><p>${d}</p></article>`).join("")}</div><h3>Check di questa settimana</h3>${tasks.map(([id,label])=>`<label class="check"><input type="checkbox" data-c="${id}" ${db.checks[id]?"checked":""}/> ${label}</label>`).join("")}<div class="row"><button class="btn" id="back">Dashboard</button></div></main>`;
    app.querySelectorAll("[data-c]").forEach(c=>c.onchange=()=>{db.checks[c.dataset.c]=c.checked;save(db);}); document.getElementById("back").onclick=()=>go("dash"); return;
  }
  if(state.view==="storico"){
    if(!db.history.length){ app.innerHTML=`<main class="step"><h1 class="q">Ancora nessuno storico.</h1><p class="meta">Dopo due simulazioni vedi se stai componendo o scivolando.</p><button class="cta" id="go">Simula</button></main>`; document.getElementById("go").onclick=()=>go("profilo"); return; }
    app.innerHTML=`<main class="step"><h1 class="q">Storico</h1>${db.history.map(h=>`<div class="hist"><strong>${new Date(h.at).toLocaleDateString("it-IT")}</strong> · debole: ${AXIS_LABEL[h.weak]}<div>${axisBars(h.scores)}</div></div>`).join("")}</main>`;
  }
}
render();
