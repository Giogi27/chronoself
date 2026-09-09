const QUESTIONS=[
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
const KIND_TITLE={deriva:"Se scivoli",inerzia:"Se continui così",miglioramento:"Se muovi 2-3 leve"};
const SUGGEST={salute:["Dormire prima delle 23:30","30 minuti di movimento"],soldi:["Bonifico / no spesa impulsiva","Annotare le uscite"],lavoro:["4 ore sulla competenza","Un blocco senza notifiche"],relazioni:["Una chiamata vera","Niente scroll durante i pasti"],abitudini:["Niente telefono i primi 20 min","Sera senza social dopo le 22"]};
const KEY="chronoself.v2";
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const esc=s=>{const d=document.createElement("div"); d.textContent=String(s); return d.innerHTML;};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function save(db){localStorage.setItem(KEY,JSON.stringify(db)); if(window.CS&&CS.user&&CS.push) CS.push();}
const qstr=new URLSearchParams(location.search);
const db=Object.assign({profile:{nome:"",eta:"",contesto:"citta"},answers:Object.fromEntries(QUESTIONS.map(q=>[q.id,50])),sim:null,history:[],checks:{},journal:[],habits:[],habitLog:{},pro:false,planStart:null}, load());
if(qstr.get("paid")==="1"){db.pro=true; db.planStart=db.planStart||new Date().toISOString(); save(db); history.replaceState(null,"",location.pathname);}
function scoresFrom(a){const acc={}; AXES.forEach(x=>acc[x]={s:0,n:0}); QUESTIONS.forEach(q=>{acc[q.axis].s+=(a[q.id]??50);acc[q.axis].n++;}); const out={}; AXES.forEach(x=>out[x]=Math.round(acc[x].s/acc[x].n)); return out;}
function project(score,y,kind){const d={inerzia:score>=60?0.35:-1.15,miglioramento:2.35,deriva:-2.9}[kind]; return clamp(score+d*y*(1+y*0.08));}
function weakest(base){return [...AXES].sort((a,b)=>base[a]-base[b])[0];}
function lever(axis){return {salute:"Sonno fisso + 3 movimenti da 30 minuti a settimana.",soldi:"Bonifico automatico il giorno dello stipendio. Anche 50€.",lavoro:"4 ore a settimana su una competenza che il lavoro futuro chiede.",relazioni:"Una chiamata o cena vera a settimana, in agenda.",abitudini:"Togli 45 minuti di scroll serale."}[axis];}
function story(p,y,kind){const avg=AXES.reduce((s,a)=>s+p[a],0)/5;const year=new Date().getFullYear()+y;const open={miglioramento:`Nel ${year} non sei un'altra persona. Sei la stessa, con due o tre leve tenute.`,deriva:`Nel ${year} niente è crollato in un giorno. È scivolato.`,inerzia:avg<50?`Nel ${year} la vita è riconoscibile: stessi problemi, un po' più stretti.`:`Nel ${year} è andato avanti da solo.`}[kind];const bits=[p.salute<45?"Il corpo ha poco margine.":p.salute<70?"L'energia tiene a singhiozzo.":"Salute con riserva.",p.soldi<45?"Un imprevisto ti mette in difficoltà in settimane.":p.soldi<70?"Tieni il passo, ma non composti.":"C'è un cuscinetto.",p.lavoro<45?"Dipendi da un ruolo che non controlli.":p.lavoro<70?"Produci, ma la direzione è di altri.":"Competenze in movimento.",p.relazioni<45?"I giorni pesanti li fai da solo.":p.relazioni<70?"I rapporti vivono di inerzia.":"Hai gente a cui dire la verità.",p.abitudini<45?"La giornata la decide lo schermo.":p.abitudini<70?"Routine a metà.":"Tieni abbastanza promesse da accumulare."];return [open,...bits].join(" ");}
function facts(p,y){return [["Energia", p.salute>=70?"Buona":p.salute>=45?"Instabile":"Bassa"],["Cuscinetto", p.soldi>=75?(Math.max(6,y*3)+"+ mesi"):p.soldi>=50?(Math.max(1,Math.round(y*.8))+"–"+Math.max(2,y)+" mesi"):"Poche settimane"],["Competenze", p.lavoro>=70?"In crescita":p.lavoro>=45?"Stabili":"In ritardo"],["Rete", p.relazioni>=70?"Solida":p.relazioni>=45?"Sottile":"Isolamento"]];}
function simulate(answers,profile){const base=scoresFrom(answers); const horizons={}; [1,5,10].forEach(y=>{ horizons[y]={}; ["deriva","inerzia","miglioramento"].forEach(k=>{ const p={}; AXES.forEach(a=>p[a]=project(base[a],y,k)); horizons[y][k]={title:KIND_TITLE[k],narrative:story(p,y,k),facts:facts(p,y),scores:p}; }); }); return {at:new Date().toISOString(),profile,answers,scores:base,weak:weakest(base),horizons};}
function planItems(weak){return {focus:lever(weak),weeks:[["Settimane 1–2","Una sola leva. Nient'altro."],["Settimane 3–4","Rendi automatica quella leva."],["Settimane 5–8","Tieni + check domenicale."],["Settimane 9–12","Rifai la simulazione."]]};}
function dayN(){ if(!db.planStart) return 1; return Math.min(90, Math.max(1, Math.floor((Date.now()-new Date(db.planStart))/86400000)+1)); }
function currentPhase(day){ if(day<=14) return 0; if(day<=28) return 1; if(day<=56) return 2; return 3; }
function today(){return new Date().toISOString().slice(0,10);}
function daysBack(n){const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10);}
function tone(n){return n>=70?"good":n>=45?"mid":"low";}
function seedHabits(weak){return (SUGGEST[weak]||SUGGEST.abitudini).map((name,i)=>({id:"h"+(i+1),name}));}
function streak(log,id){let n=0; for(let i=0;i<90;i++){const day=daysBack(i); if(log[day]&&log[day][id]) n++; else if(i===0) continue; else break;} return n;}
function weekDone(log,id){let c=0; for(let i=0;i<7;i++){const day=daysBack(i); if(log[day]&&log[day][id]) c++;} return c;}
function unlockPro(){db.pro=true; db.planStart=db.planStart||new Date().toISOString(); if(db.sim&&!db.habits.length) db.habits=seedHabits(db.sim.weak); save(db);}
async function startCheckout(){try{const res=await fetch("/api/create-checkout",{method:"POST"}); const data=await res.json(); if(data.url){location.href=data.url;return;} if(data.preview||!res.ok){unlockPro(); go("oggi"); return;} alert(data.error||"Stripe non configurato.");}catch(e){unlockPro(); go("oggi");}}
function axisBars(scores){return AXES.map(a=>`<div class="axisbar"><span>${AXIS_LABEL[a]}</span><div class="bar ${tone(scores[a])}"><span style="width:${scores[a]}%"></span></div><span class="num">${scores[a]}</span></div>`).join("");}
function radar(scores){const SIZE=280,CX=140,CY=140,R=104; const pt=(i,r)=>{const ang=-Math.PI/2+(i*2*Math.PI)/5; return [CX+r*Math.cos(ang),CY+r*Math.sin(ang)];}; const ring=f=>AXES.map((_,i)=>pt(i,R*f).join(",")).join(" "); const poly=AXES.map((a,i)=>pt(i,(scores[a]/100)*R).join(",")).join(" "); const labels=AXES.map((a,i)=>{const [x,y]=pt(i,R+22); return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#9a958c" font-size="11" font-family="Outfit,sans-serif">${AXIS_LABEL[a]}</text>`;}).join(""); return `<svg class="radar-wrap" viewBox="0 0 ${SIZE} ${SIZE}" role="img">${[0.25,0.5,0.75,1].map(f=>`<polygon points="${ring(f)}" fill="none" stroke="#f2efe8" stroke-opacity=".12"/>`).join("")}${AXES.map((_,i)=>{const [x,y]=pt(i,R); return `<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="#f2efe8" stroke-opacity=".12"/>`;}).join("")}<polygon points="${poly}" fill="#f2efe8" fill-opacity=".12" stroke="#f2efe8" stroke-opacity=".7" stroke-width="1.5"/>${labels}</svg>`;}
function dayRing(day){const r=42,c=2*Math.PI*r,pct=day/90; return `<div class="dayring"><svg viewBox="0 0 108 108"><circle cx="54" cy="54" r="${r}" fill="none" stroke="#1c1c1f" stroke-width="6"/><circle cx="54" cy="54" r="${r}" fill="none" stroke="#ece7dc" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c*pct} ${c}"/></svg><div class="n"><div><div class="q" style="font-size:28px">${day}</div><div class="meta">di 90</div></div></div></div>`;}
const MARK=`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 7.2v5.1l3.2 1.9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
const state={view:"home",i:0,h:1};
const app=document.getElementById("app");
function chrome(){
  const nav=document.getElementById("nav");
  const dock=document.getElementById("dock");
  const links=db.pro?[["oggi","Oggi"],["futuri","Futuri"]]:(db.sim?[["futuri","I tuoi futuri"]]:[]);
  const extra=db.pro?[]:[["prezzi","Piano 90"]];
  const right=db.pro?`<button class="ghost" data-go="account">Account</button>`:`<button class="ghost" data-go="account">Accedi</button>${db.sim?"":`<button class="cta" data-go="profilo" style="height:36px;padding:0 14px">Simula</button>`}`;
  nav.innerHTML=`<button class="brand" data-go="home">${MARK} ChronoSelf</button><div class="navlinks">${[...links,...extra].map(([v,l])=>`<button class="ghost ${state.view===v?"on":""}" data-go="${v}">${l}</button>`).join("")}</div><div>${right}</div>`;
  const dockItems=db.pro?[["oggi","Oggi"],["futuri","Futuri"],["account","Account"]]:[["home","Home"],[db.sim?"futuri":"profilo",db.sim?"Futuri":"Simula"],["prezzi","Piano 90"]];
  dock.innerHTML=dockItems.map(([v,l])=>`<button class="${state.view===v?"on":""}" data-go="${v}">${l}</button>`).join("");
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelector("footer").style.display=state.view==="simula"?"none":"";
  dock.style.display=state.view==="simula"?"none":"";
}
function go(v){
  if(v==="account" && window.CS && CS.renderAccount){ state.view="account"; chrome(); CS.renderAccount(); return; }
  if(v==="piano"||v==="diario"||v==="habits"){ v=db.pro?"oggi":"prezzi"; }
  if((v==="futuri"||v==="oggi") && !db.sim){ v="profilo"; }
  state.view=v; render();
}
function paywall(title,lede,leverText){
  return `<main class="step"><p class="meta">Piano 90</p><h1 class="q" style="font-size:40px">${title}</h1><p class="lede">${lede}</p>${leverText?`<p class="lock">${esc(leverText)}</p>`:""}<p class="lede">4,99 € al mese. Abitudini, diario, calendario a 90 giorni e i futuri a 5 e 10 anni.</p><div class="row"><button class="cta" id="pay">Attiva Piano 90</button><button class="btn" data-go="prezzi">Vedi i piani</button></div></main>`;
}
function render(){
  chrome();
  if(state.view==="home"){
    app.innerHTML=`<section class="hero"><p class="meta">Simulatore di compounding personale</p><h1>Chi diventi se continui così.</h1><p class="lede">Non un oracolo. Un modello su salute, soldi, lavoro, relazioni e abitudini — poi un piano a 90 giorni che si paga solo se lo vuoi tenere.</p><div class="row"><button class="cta" id="start">${db.pro?"Apri oggi":db.sim?"Apri i tuoi futuri":"Fai la simulazione gratis"}</button>${db.pro?"":`<button class="btn" data-go="prezzi">Piano 90 · 4,99 €</button>`}</div></section>
      <section class="grid three"><article class="card"><p class="k">01</p><h3>18 domande</h3><p>Slider onesti. Niente diagnosi, niente guru.</p></article><article class="card"><p class="k">02</p><h3>Tre futuri</h3><p>Deriva, inerzia, miglioramento — a 1, 5 e 10 anni.</p></article><article class="card"><p class="k">03</p><h3>Una leva</h3><p>Se tieni, il Piano 90 diventa il tuo giorno: abitudini e diario.</p></article></section>`;
    document.getElementById("start").onclick=()=>go(db.pro?"oggi":db.sim?"futuri":"profilo");
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="privacy"){ app.innerHTML=`<main class="step"><p class="meta">Privacy</p><h1 class="q" style="font-size:40px">I dati restano tuoi.</h1><p class="lede">Simulazione, diario e abitudini stanno nel browser. I pagamenti passano da Stripe. Non è terapia.</p></main>`; return; }
  if(state.view==="prezzi"){
    app.innerHTML=`<main class="step wide"><p class="meta">Piani</p><h1 class="q" style="font-size:40px">Due livelli. Basta.</h1><p class="lede">La simulazione è gratis. Il Piano 90 è il posto in cui tieni la leva — non un altro menu pieno di cose.</p>
      <section class="grid three"><article class="card"><p class="meta">Gratis</p><p class="price">0 €</p><h3>Simulazione</h3><ul class="ok"><li>18 domande</li><li>I tuoi assi, oggi</li><li>Tre futuri a 1 anno</li></ul><div class="row"><button class="btn" data-go="profilo">Inizia</button></div></article>
      <article class="card" style="border-color:var(--border-strong)"><p class="meta">Piano 90</p><p class="price">4,99 € <span>/ mese</span></p><h3>Il giorno per giorno</h3><ul class="ok"><li>Futuri a 5 e 10 anni</li><li>Schermata Oggi: una leva</li><li>Abitudini e streak</li><li>Diario serale</li></ul><div class="row"><button class="cta" id="pay">${db.pro?"Già attivo — vai a oggi":"Attiva Piano 90"}</button></div></article>
      <article class="card"><p class="meta">Cosa non è</p><h3>Non è terapia</h3><p>Né consulenza finanziaria o medica. È un binario per 90 giorni.</p></article></section></main>`;
    document.getElementById("pay").onclick=()=> db.pro?go("oggi"):startCheckout();
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="profilo"){
    const p=db.profile;
    app.innerHTML=`<main class="step"><p class="meta">Passo 1 di 2</p><h1 class="q" style="font-size:40px">Chi sta simulando.</h1><p class="lede">Serve solo per scrivere i futuri. Resta sul dispositivo.</p>
      <label class="field">Nome<input id="nome" value="${esc(p.nome||"")}" /></label>
      <label class="field">Età<input id="eta" type="number" value="${esc(p.eta||"")}" /></label>
      <label class="field">Contesto<select id="contesto"><option value="citta">Città</option><option value="paese">Paese</option><option value="estero">Estero</option></select></label>
      <div class="row"><button class="cta" id="next">Alle 18 domande</button></div></main>`;
    document.getElementById("contesto").value=p.contesto||"citta";
    document.getElementById("next").onclick=()=>{db.profile={nome:document.getElementById("nome").value.trim(),eta:document.getElementById("eta").value,contesto:document.getElementById("contesto").value}; save(db); state.i=0; go("simula");};
    return;
  }
  if(state.view==="simula"){
    const q=QUESTIONS[state.i]; const pct=Math.round(((state.i+1)/QUESTIONS.length)*100); const val=db.answers[q.id];
    app.innerHTML=`<main class="step"><p class="meta">${state.i+1} / ${QUESTIONS.length} · ${AXIS_LABEL[q.axis]}</p><div class="prog"><span style="width:${pct}%"></span></div>
      <h1 class="q" style="font-size:36px;margin-top:28px">${q.text}</h1>
      ${q.hint?`<p class="lede">${q.hint}</p>`:""}
      <p class="lede num"><strong style="font-size:28px;color:var(--fg)">${val}</strong> / 100</p>
      <input class="range" id="rng" type="range" min="0" max="100" value="${val}" />
      <div class="labels"><span>${q.min}</span><span>${q.max}</span></div>
      <div class="row"><button class="btn" id="back" ${state.i===0?"disabled":""}>Indietro</button><button class="cta" id="next">${state.i<QUESTIONS.length-1?"Avanti":"Genera i futuri"}</button></div></main>`;
    document.getElementById("rng").oninput=e=>{const n=Number(e.target.value); db.answers[q.id]=n; e.target.previousElementSibling.innerHTML=`<strong style="font-size:28px;color:var(--fg)">${n}</strong> / 100`;};
    document.getElementById("back").onclick=()=>{if(state.i>0){state.i--;render();}};
    document.getElementById("next").onclick=()=>{ if(state.i<QUESTIONS.length-1){state.i++;render();return;} const sim=simulate(db.answers,db.profile); db.sim=sim; db.history.unshift({at:sim.at,scores:sim.scores,weak:sim.weak}); db.history=db.history.slice(0,12); if(!db.habits.length) db.habits=seedHabits(sim.weak); save(db); go("futuri"); };
    return;
  }
  if(state.view==="futuri"){
    if(!db.sim){go("profilo");return;}
    const s=db.sim; const who=s.profile.nome||"Tu"; if(!db.pro && state.h!==1) {/* keep */}
    const locked=!db.pro && state.h>1;
    const pack=s.horizons[locked?1:state.h];
    const cols=["deriva","inerzia","miglioramento"].map(id=>{const x=pack[id]; return `<article class="card"><h3>${x.title}</h3><p>${x.narrative}</p><ul class="facts">${x.facts.map(([l,v])=>`<li><span>${l}</span><strong>${v}</strong></li>`).join("")}</ul></article>`;}).join("");
    app.innerHTML=`<main class="step wide"><p class="meta">${esc(who)} · leva: ${AXIS_LABEL[s.weak]}${db.pro?" · Piano 90":""}</p>
      <h1 class="q" style="font-size:40px">I tuoi assi, oggi</h1>
      <p class="lede">Tre versioni di te. Quella che scivola, quella che resta, quella che muove due leve e basta.</p>
      <div class="grid" style="grid-template-columns:minmax(0,18rem) 1fr;align-items:center">${radar(s.scores)}<div>${axisBars(s.scores)}</div></div>
      <div class="tabs">${[1,5,10].map(y=>`<button class="tab ${y===state.h?"on":""}" data-y="${y}">Tra ${y} ann${y===1?"o":"i"}${(!db.pro&&y>1)?" · bloccati":""}</button>`).join("")}</div>
      ${locked?paywall(`I ${state.h} anni restano coperti.`,"Gratis vedi un anno. Il Piano 90 apre 5 e 10 anni, e il giorno per giorno.",lever(s.weak)): `<div class="cols">${cols}</div>`}
      <div class="row">${db.pro?`<button class="cta" data-go="oggi">Vai a oggi</button>`:`<button class="cta" data-go="prezzi">Piano 90 giorni</button>`}<button class="btn" data-go="profilo">Rifai la simulazione</button></div>
      ${s && db.history.length>1?`<section style="margin-top:48px"><h2>Storico</h2>${db.history.slice(0,6).map(h=>`<div class="hist"><strong>${new Date(h.at).toLocaleDateString("it-IT")}</strong> · ${AXIS_LABEL[h.weak]}${axisBars(h.scores)}</div>`).join("")}</section>`:""}
    </main>`;
    app.querySelectorAll("[data-y]").forEach(b=>b.onclick=()=>{state.h=Number(b.dataset.y);render();});
    const pay=document.getElementById("pay"); if(pay) pay.onclick=startCheckout;
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="oggi"){
    if(!db.sim){go("profilo");return;}
    if(!db.pro){ app.innerHTML=paywall("Una leva. Novanta giorni.","Abitudini, diario e il calendario restano chiusi finché non attivi il Piano 90.",lever(db.sim.weak)); document.getElementById("pay").onclick=startCheckout; document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go)); return; }
    if(!db.planStart){db.planStart=new Date().toISOString();save(db);}
    if(!db.habits.length) db.habits=seedHabits(db.sim.weak);
    const pl=planItems(db.sim.weak); const day=dayN(); const phase=currentPhase(day); const t=today();
    if(!db.habitLog[t]) db.habitLog[t]={};
    const list=db.habits.map(h=>{
      const on=!!(db.habitLog[t]&&db.habitLog[t][h.id]); const st=streak(db.habitLog,h.id); const w=weekDone(db.habitLog,h.id);
      const dots=Array.from({length:14},(_,i)=>{const dayK=daysBack(13-i); const ok=db.habitLog[dayK]&&db.habitLog[dayK][h.id]; return `<i class="${ok?"on":""}"></i>`;}).join("");
      return `<article class="card"><label class="check"><input type="checkbox" data-h="${h.id}" ${on?"checked":""}/> <strong>${esc(h.name)}</strong> <span class="pill">streak ${st} · ${w}/7</span></label><div class="dots">${dots}</div></article>`;
    }).join("");
    const notes=(db.journal||[]).slice(0,6).map(j=>`<div class="hist"><p class="meta" style="letter-spacing:0">${new Date(j.at).toLocaleDateString("it-IT",{day:"numeric",month:"long"})}</p><p>${esc(j.text)}</p></div>`).join("")||`<p class="lede">Nessuna nota ancora.</p>`;
    const tasks=[["t1","Leva in calendario"],["t2","Fatta almeno 3 volte"],["t3","Tolto uno spreco serale"],["t4","Detto a qualcuno"]];
    app.innerHTML=`<main class="step wide">
      <div class="flex-head"><div><p class="meta">Oggi · ${AXIS_LABEL[db.sim.weak]}</p><h1 class="q" style="font-size:36px;max-width:22ch">${esc(pl.focus)}</h1><p class="lede">${pl.weeks[phase][0]} — ${pl.weeks[phase][1]}</p></div>${dayRing(day)}</div>
      <h2 style="margin:36px 0 12px">Leve di oggi</h2>
      <div class="grid">${list}</div>
      <div class="row"><input id="newHabit" maxlength="60" placeholder="Aggiungi un'abitudine" style="flex:1;min-width:180px;background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:12px 14px"/><button class="btn" id="addH">Aggiungi</button></div>
      <div class="grid" style="grid-template-columns:1.2fr .8fr;margin-top:36px">
        <div><h2>Due righe, stasera</h2><label class="field"><textarea id="note" rows="4" placeholder="Cosa hai tenuto. Cosa hai lasciato."></textarea></label><button class="cta" id="saveN">Salva nota</button>${notes}</div>
        <div><h2>Fasi</h2>${pl.weeks.map(([t,d],i)=>`<article class="card" style="margin-top:10px;${i===phase?"border-color:var(--border-strong)":""}"><h3>${t}</h3><p>${d}</p></article>`).join("")}${tasks.map(([id,label])=>`<label class="check"><input type="checkbox" data-c="${id}" ${db.checks[id]?"checked":""}/> ${label}</label>`).join("")}<div class="row"><button class="ghost" data-go="futuri">Rivedi i futuri</button></div></div>
      </div>
    </main>`;
    app.querySelectorAll("[data-h]").forEach(el=>el.onchange=()=>{if(!db.habitLog[t]) db.habitLog[t]={}; db.habitLog[t][el.dataset.h]=el.checked; save(db); render();});
    app.querySelectorAll("[data-c]").forEach(c=>c.onchange=()=>{db.checks[c.dataset.c]=c.checked;save(db);});
    document.getElementById("saveN").onclick=()=>{const text=document.getElementById("note").value.trim(); if(!text) return; db.journal.unshift({at:new Date().toISOString(),text}); db.journal=db.journal.slice(0,60); save(db); render();};
    document.getElementById("addH").onclick=()=>{const name=(document.getElementById("newHabit").value||"").trim(); if(!name) return; if(db.habits.length>=6) return alert("Massimo 6 abitudini."); db.habits.push({id:"h"+Date.now(),name}); save(db); render();};
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  }
}
render();
