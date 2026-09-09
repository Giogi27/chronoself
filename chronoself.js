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
const KIND_TITLE={deriva:"Se lasci andare",inerzia:"Se resti così",miglioramento:"Se cambi un po'"};
const SUGGEST={salute:["A letto prima delle 23:30","30 minuti di movimento"],soldi:["Bonifico automatico, anche 50€","Annotare le uscite"],lavoro:["4 ore a settimana a imparare","Un blocco senza notifiche"],relazioni:["Una chiamata vera a settimana","Niente telefono a tavola"],abitudini:["Niente telefono i primi 20 minuti","Niente social dopo le 22"]};
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
function story(p,y,kind){const avg=AXES.reduce((s,a)=>s+p[a],0)/5;const year=new Date().getFullYear()+y;const open={miglioramento:`Nel ${year} non sei un'altra persona. Sei la stessa, con due o tre abitudini tenute ogni giorno.`,deriva:`Nel ${year} niente è crollato in un giorno. È scivolato, un po' alla volta.`,inerzia:avg<50?`Nel ${year} la vita è riconoscibile: gli stessi problemi, un po' più stretti.`:`Nel ${year} è andato avanti da solo, senza grandi scossoni.`}[kind];const bits=[p.salute<45?"Il corpo ha poco margine: fatica, sonno corto, poca energia.":p.salute<70?"L'energia va e viene. Alcuni giorni tieni, altri no.":"Stai bene: hai energia di riserva.",p.soldi<45?"Un imprevisto ti mette in difficoltà in poche settimane.":p.soldi<70?"Tieni il passo, ma metti da parte poco.":"Hai dei risparmi a cui appoggiarti.",p.lavoro<45?"Dipendi da un lavoro che non controlli.":p.lavoro<70?"Lavori, ma la direzione la decidono altri.":"Stai imparando cose che ti serviranno.",p.relazioni<45?"I giorni pesanti li fai da solo.":p.relazioni<70?"I rapporti vanno avanti da soli, senza davvero tenersi.":"Hai persone a cui puoi dire la verità.",p.abitudini<45?"La giornata la decide il telefono.":p.abitudini<70?"Tieni alcune routine, altre le perdi.":"Tieni abbastanza promesse da vedere i risultati."];return [open,...bits].join(" ");}
function facts(p,y){return [["Energia", p.salute>=70?"Buona":p.salute>=45?"Alti e bassi":"Bassa"],["Risparmi", p.soldi>=75?(Math.max(6,y*3)+"+ mesi"):p.soldi>=50?(Math.max(1,Math.round(y*.8))+"–"+Math.max(2,y)+" mesi"):"Poche settimane"],["Lavoro", p.lavoro>=70?"In crescita":p.lavoro>=45?"Fermo":"In ritardo"],["Persone", p.relazioni>=70?"Ci sei":p.relazioni>=45?"Poche":"Quasi da solo"]];}
function simulate(answers,profile){const base=scoresFrom(answers); const horizons={}; [1,5,10].forEach(y=>{ horizons[y]={}; ["deriva","inerzia","miglioramento"].forEach(k=>{ const p={}; AXES.forEach(a=>p[a]=project(base[a],y,k)); horizons[y][k]={title:KIND_TITLE[k],narrative:story(p,y,k),facts:facts(p,y),scores:p}; }); }); return {at:new Date().toISOString(),profile,answers,scores:base,weak:weakest(base),horizons};}
function planItems(weak){return {focus:lever(weak),weeks:[["Settimane 1–2","Una sola abitudine. Nient'altro."],["Settimane 3–4","Rendila automatica: stesso orario, stesso posto."],["Settimane 5–8","Tienila. Una volta a settimana, guarda come sta andando."],["Settimane 9–12","Rifai le 18 domande. Vedi se qualcosa si è mosso."]]};}
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
function radar(scores){const SIZE=280,CX=140,CY=140,R=104; const pt=(i,r)=>{const ang=-Math.PI/2+(i*2*Math.PI)/5; return [CX+r*Math.cos(ang),CY+r*Math.sin(ang)];}; const ring=f=>AXES.map((_,i)=>pt(i,R*f).join(",")).join(" "); const poly=AXES.map((a,i)=>pt(i,(scores[a]/100)*R).join(",")).join(" "); const labels=AXES.map((a,i)=>{const [x,y]=pt(i,R+22); return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#6a6358" font-size="11" font-family="Outfit,sans-serif">${AXIS_LABEL[a]}</text>`;}).join(""); return `<svg class="radar-wrap" viewBox="0 0 ${SIZE} ${SIZE}" role="img">${[0.25,0.5,0.75,1].map(f=>`<polygon points="${ring(f)}" fill="none" stroke="#1b1914" stroke-opacity=".12"/>`).join("")}${AXES.map((_,i)=>{const [x,y]=pt(i,R); return `<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="#1b1914" stroke-opacity=".12"/>`;}).join("")}<polygon points="${poly}" fill="#2a332e" fill-opacity=".12" stroke="#2a332e" stroke-opacity=".75" stroke-width="1.5"/>${labels}</svg>`;}
function dayRing(day){const r=42,c=2*Math.PI*r,pct=day/90; return `<div class="dayring"><svg viewBox="0 0 108 108"><circle cx="54" cy="54" r="${r}" fill="none" stroke="#e7dfd0" stroke-width="6"/><circle cx="54" cy="54" r="${r}" fill="none" stroke="#2a332e" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c*pct} ${c}"/></svg><div class="n"><div><div class="q" style="font-size:28px">${day}</div><div class="meta">di 90</div></div></div></div>`;}
const MARK=`<span class="mark" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14.2" fill="none" stroke="currentColor" stroke-width="1" opacity=".28"/><circle cx="16" cy="16" r="9.6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-dasharray="46 16" transform="rotate(-28 16 16)"/><circle cx="16" cy="16" r="2.1" fill="currentColor"/></svg><span class="mark-sun"></span></span>`;
const state={view:"home",i:0,h:1};
const app=document.getElementById("app");
function chrome(){
  const nav=document.getElementById("nav");
  const dock=document.getElementById("dock");
  const links=db.pro?[["oggi","Oggi"],["futuri","Futuri"]]:(db.sim?[["futuri","I tuoi futuri"]]:[["profilo","Simula"]]);
  const extra=db.pro?[]:[["prezzi","Piano 90"]];
  const right=db.pro?`<button class="ghost" data-go="account">Account</button>`:`<button class="ghost" data-go="account">Accedi</button>${db.sim?"":`<button class="cta" data-go="profilo" style="height:36px;padding:0 14px">Inizia</button>`}`;
  nav.innerHTML=`<button class="brand" data-go="home">${MARK} Chrono<em>Self</em></button><div class="navlinks">${[...links,...extra].map(([v,l])=>`<button class="ghost ${state.view===v?"on":""}" data-go="${v}">${l}</button>`).join("")}</div><div>${right}</div>`;
  const dockItems=db.pro?[["oggi","Oggi"],["futuri","Futuri"],["account","Account"]]:[["home","Home"],[db.sim?"futuri":"profilo",db.sim?"Futuri":"Simula"],["prezzi","Piano 90"]];
  dock.innerHTML=dockItems.map(([v,l])=>`<button class="${state.view===v?"on":""}" data-go="${v}">${l}</button>`).join("");
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelector("footer").style.display=state.view==="simula"?"none":"";
  dock.style.display=state.view==="simula"?"none":"";
}
function go(v){
  if(window.__csClock){ cancelAnimationFrame(window.__csClock); window.__csClock=null; }
  if(v==="account" && window.CS && CS.renderAccount){ state.view="account"; chrome(); CS.renderAccount(); return; }
  if(v==="piano"||v==="diario"||v==="habits"){ v=db.pro?"oggi":"prezzi"; }
  if((v==="futuri"||v==="oggi") && !db.sim){ v="profilo"; }
  state.view=v; render();
}
function paywall(title,lede,leverText){
  return `<main class="step"><p class="meta">Piano 90</p><h1 class="q" style="font-size:40px">${title}</h1><p class="lede">${lede}</p>${leverText?`<p class="lock">${esc(leverText)}</p>`:""}<p class="lede">4,99 € al mese. Un'abitudine da tenere, un diario la sera, e vedi anche chi diventi tra 5 e 10 anni.</p><div class="row"><button class="cta" id="pay">Attiva Piano 90</button><button class="btn" data-go="prezzi">Vedi i piani</button></div></main>`;
}
function clockPhase(h){ if(h<5) return "notte"; if(h<8) return "alba"; if(h<12) return "mattina"; if(h<17) return "pomeriggio"; if(h<21) return "sera"; return "notte"; }
function polar(deg,r){ const a=(deg-90)*Math.PI/180; return [Math.round((160+Math.cos(a)*r)*10)/10, Math.round((160+Math.sin(a)*r)*10)/10]; }
function clockTicks(n,r1,r2,w,op){
  return Array.from({length:n},(_,i)=>{
    const [x1,y1]=polar(i*(360/n),r1); const [x2,y2]=polar(i*(360/n),r2);
    const major=n===60?i%5===0:n===24?i%6===0:true;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${major?w*1.35:w}" stroke-opacity="${major?op:op*0.4}"/>`;
  }).join("");
}
function clockFace(){
  return `<svg class="orbit-svg" id="orbit" viewBox="0 0 320 320" aria-hidden="true">
    <circle cx="160" cy="160" r="152" fill="none" stroke="currentColor" stroke-opacity=".32" stroke-width="1"/>
    <circle cx="160" cy="160" r="114" fill="none" stroke="currentColor" stroke-opacity=".22" stroke-width="1"/>
    ${clockTicks(24,146,152,1.15,.55)}
    ${clockTicks(12,100,114,1.7,.62)}
    ${clockTicks(60,110,114,.75,.38)}
    <circle id="dayFill" cx="160" cy="160" r="152" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-opacity=".5" transform="rotate(-90 160 160)"/>
    <g id="sun"><circle cx="160" cy="8" r="5.6" fill="currentColor"/><circle cx="160" cy="8" r="10" fill="currentColor" opacity=".16"/></g>
    <g id="hour"><line x1="160" y1="172" x2="160" y2="98" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></g>
    <g id="minute"><line x1="160" y1="178" x2="160" y2="56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></g>
    <g id="second">
      <line x1="160" y1="188" x2="160" y2="40" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-opacity=".82"/>
      <circle cx="160" cy="36" r="4.6" fill="currentColor"/>
    </g>
    <circle cx="160" cy="160" r="5.2" fill="currentColor"/>
    <circle cx="160" cy="160" r="2.1" fill="#f3eee4"/>
  </svg>
  <div class="clock-chip" id="clock"><span class="time" id="clockTime"></span><span class="sub" id="clockSub"></span></div>`;
}
function startClock(){
  if(window.__csClock){ cancelAnimationFrame(window.__csClock); window.__csClock=null; }
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const circ=2*Math.PI*152;
  function frame(){
    const now=new Date();
    const ms=reduce?0:now.getMilliseconds();
    const sec=now.getSeconds()+ms/1000;
    const min=now.getMinutes()+sec/60;
    const hr=(now.getHours()%12)+min/60;
    const day=(now.getHours()*3600+now.getMinutes()*60+sec)/86400;
    const h=document.getElementById("hour");
    if(!h){ window.__csClock=null; return; }
    h.setAttribute("transform",`rotate(${hr*30} 160 160)`);
    document.getElementById("minute").setAttribute("transform",`rotate(${min*6} 160 160)`);
    document.getElementById("second").setAttribute("transform",`rotate(${sec*6} 160 160)`);
    document.getElementById("sun").setAttribute("transform",`rotate(${day*360} 160 160)`);
    const fill=document.getElementById("dayFill");
    if(fill) fill.setAttribute("stroke-dasharray",`${(day*circ).toFixed(1)} ${circ.toFixed(1)}`);
    const t=document.getElementById("clockTime");
    const sub=document.getElementById("clockSub");
    if(t) t.textContent=now.toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
    if(sub) sub.textContent=clockPhase(now.getHours())+" · ora locale";
    window.__csClock=requestAnimationFrame(frame);
  }
  frame();
}
function render(){
  chrome();
  if(state.view==="home"){
    const cta=db.pro?"Vai a oggi":db.sim?"Apri i tuoi futuri":"Inizia, è gratis";
    const axes=["Salute","Soldi","Lavoro","Relazioni","Abitudini"];
    const marquee=[...axes,...axes,...axes,...axes].map(a=>`<span>${a}</span>`).join("");
    app.innerHTML=`<section class="hero-split">
      <div>
        <p class="meta">18 domande sulla tua vita</p>
        <h1>Chi diventi se continui così.</h1>
        <p class="lede">Rispondi su salute, soldi, lavoro, persone e abitudini. Vedi tre versioni di te tra un anno. Se vuoi, tieni un'abitudine per 90 giorni.</p>
        <div class="row"><button class="cta" id="start">${cta}</button>${db.pro?"":`<button class="btn" data-go="prezzi">Piano 90 · 4,99 €</button>`}</div>
        <dl class="stats"><div><dt>18</dt><dd>domande</dd></div><div><dt>5</dt><dd>aree</dd></div><div><dt>90</dt><dd>giorni</dd></div></dl>
      </div>
      <div class="hero-photo">
        <img src="./brand/hero.jpg" alt="Poltrona di lino di fronte a una finestra, luce del mattino" />
        ${clockFace()}
      </div>
    </section>
    <div class="bleed marquee"><div class="marquee-track">${marquee}${marquee}</div></div>
    <section class="grid three" style="padding-top:64px">
      <article class="photo-card"><img src="./brand/notebook.jpg" alt="Taccuino aperto sulla tavola"/><p class="k" style="margin-top:18px">01</p><h3>18 domande</h3><p>Come stai, davvero, in cinque parti della vita. Niente diagnosi, niente guru.</p></article>
      <article class="photo-card"><img src="./brand/loggia.jpg" alt="Loggia mediterranea a tre archi"/><p class="k" style="margin-top:18px">02</p><h3>Tre futuri</h3><p>Cosa succede se lasci andare, se resti così, o se cambi un po'. Scritto a 1, 5 e 10 anni.</p></article>
      <article class="photo-card"><img src="./brand/lever.jpg" alt="Scarpe da corsa accanto alla porta"/><p class="k" style="margin-top:18px">03</p><h3>Un'abitudine</h3><p>Scegli una cosa da fare ogni giorno. La sera, due righe. Per 90 giorni.</p></article>
    </section>
    <section class="thesis">
      <img src="./brand/looking.jpg" alt="Una persona alla finestra, di spalle"/>
      <div>
        <p class="meta">L'idea</p>
        <blockquote>Il futuro non è magia. È la somma di quello che ripeti.</blockquote>
        <p class="lede">ChronoSelf non indovina niente. Prende come stai oggi e lo porta avanti — a un anno, a cinque, a dieci.</p>
      </div>
    </section>
    <section>
      <p class="meta">Tre strade</p>
      <h2 style="font-size:clamp(28px,4vw,44px);max-width:16ch;margin:12px 0 24px">Stessa vita. Tre direzioni.</h2>
      <div class="grid three" style="padding-top:0">
        <article class="card"><p class="k">01</p><h3>Se lasci andare</h3><p>Il punto debole resta lì. Col tempo pesa di più.</p></article>
        <article class="card"><p class="k">02</p><h3>Se resti così</h3><p>Niente crolla. Niente migliora. Il tempo passa lo stesso.</p></article>
        <article class="card"><p class="k">03</p><h3>Se cambi un po'</h3><p>Due o tre abitudini, tenute ogni giorno. Basta quello.</p></article>
      </div>
    </section>
    <section class="cta-band">
      <div>
        <p class="meta">Inizia</p>
        <h2>Diciotto minuti. Poi vedi dove stai andando.</h2>
        <p>Gratis vedi i prossimi 12 mesi. Il Piano 90 apre 5 e 10 anni, e il giorno per giorno.</p>
        <div class="row"><button class="cta light" id="start2">${cta}</button>${db.pro?"":`<button class="cta ghosted" data-go="prezzi">Vedi i piani</button>`}</div>
      </div>
      <img src="./brand/loggia.jpg" alt="Tre archi, tre ore del giorno"/>
    </section>`;
    const goStart=()=>go(db.pro?"oggi":db.sim?"futuri":"profilo");
    document.getElementById("start").onclick=goStart;
    document.getElementById("start2").onclick=goStart;
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    startClock();
    return;
  }
  if(state.view==="privacy"){ app.innerHTML=`<main class="step"><p class="meta">Privacy</p><h1 class="q" style="font-size:40px">I dati restano tuoi.</h1><p class="lede">Domande, diario e abitudini stanno sul tuo telefono. I pagamenti passano da Stripe. Non è un medico e non è terapia.</p></main>`; return; }
  if(state.view==="prezzi"){
    app.innerHTML=`<main class="step wide"><p class="meta">Piani</p><h1 class="q" style="font-size:40px">Gratis per vedere. Pago per tenere.</h1><p class="lede">La simulazione è gratis. Il Piano 90 è per chi vuole un'abitudine, un diario, e 90 giorni di seguito.</p>
      <section class="grid three"><article class="card"><p class="meta">Gratis</p><p class="price">0 €</p><h3>La simulazione</h3><ul class="ok"><li>18 domande</li><li>Come stai oggi, in 5 aree</li><li>Tre versioni di te, a 1 anno</li></ul><div class="row"><button class="btn" data-go="profilo">Inizia</button></div></article>
      <article class="card featured"><p class="meta">Piano 90</p><p class="price">4,99 € <span>/ mese</span></p><h3>Il giorno per giorno</h3><ul class="ok"><li>Anche 5 e 10 anni</li><li>Un'abitudine da tenere ogni giorno</li><li>Diario la sera</li><li>Calendario di 90 giorni</li></ul><div class="row"><button class="cta light" id="pay">${db.pro?"Già attivo — vai a oggi":"Attiva Piano 90"}</button></div></article>
      <article class="card"><img src="./brand/looking.jpg" alt="Persona alla finestra" style="width:100%;height:140px;object-fit:cover;border-radius:16px;margin:-22px -22px 16px;width:calc(100% + 44px);max-width:none"/><p class="meta">Cosa non è</p><h3>Non è terapia</h3><p>Né un medico, né un consulente. È un posto dove tieni una cosa per 90 giorni.</p></article></section></main>`;
    document.getElementById("pay").onclick=()=> db.pro?go("oggi"):startCheckout();
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="profilo"){
    const p=db.profile;
    app.innerHTML=`<main class="step"><p class="meta">Passo 1 di 2</p><h1 class="q" style="font-size:40px">Prima, chi sei.</h1><p class="lede">Nome ed età servono solo per scrivere i tuoi futuri. Restano sul telefono.</p>
      <label class="field">Nome<input id="nome" value="${esc(p.nome||"")}" /></label>
      <label class="field">Età<input id="eta" type="number" value="${esc(p.eta||"")}" /></label>
      <label class="field">Dove vivi<select id="contesto"><option value="citta">In città</option><option value="paese">In un paese</option><option value="estero">All'estero</option></select></label>
      <div class="row"><button class="cta" id="next">Vai alle domande</button></div></main>`;
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
      <div class="row"><button class="btn" id="back" ${state.i===0?"disabled":""}>Indietro</button><button class="cta" id="next">${state.i<QUESTIONS.length-1?"Avanti":"Vedi i tuoi futuri"}</button></div></main>`;
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
    const cols=["deriva","inerzia","miglioramento"].map(id=>{const x=pack[id]; return `<article class="card"><h3>${KIND_TITLE[id]}</h3><p>${x.narrative}</p><ul class="facts">${x.facts.map(([l,v])=>`<li><span>${l}</span><strong>${v}</strong></li>`).join("")}</ul></article>`;}).join("");
    app.innerHTML=`<main class="step wide"><p class="meta">${esc(who)} · da lavorare: ${AXIS_LABEL[s.weak]}${db.pro?" · Piano 90":""}</p>
      <h1 class="q" style="font-size:40px">Come stai, oggi</h1>
      <p class="lede">Tre versioni di te. Quella che lascia andare, quella che resta così, quella che cambia un po'.</p>
      <div class="grid" style="grid-template-columns:minmax(0,18rem) 1fr;align-items:center">${radar(s.scores)}<div>${axisBars(s.scores)}</div></div>
      <div class="tabs">${[1,5,10].map(y=>`<button class="tab ${y===state.h?"on":""}" data-y="${y}">Tra ${y} ann${y===1?"o":"i"}${(!db.pro&&y>1)?" · chiusi":""}</button>`).join("")}</div>
      ${locked?paywall(`I prossimi ${state.h} anni restano chiusi.`,"Gratis vedi un anno. Con il Piano 90 vedi anche 5 e 10 anni, e tieni un'abitudine ogni giorno.",lever(s.weak)): `<div class="cols">${cols}</div>`}
      <div class="row">${db.pro?`<button class="cta" data-go="oggi">Vai a oggi</button>`:`<button class="cta" data-go="prezzi">Attiva il Piano 90</button>`}<button class="btn" data-go="profilo">Rifai le domande</button></div>
      ${s && db.history.length>1?`<section style="margin-top:48px"><h2>Storico</h2>${db.history.slice(0,6).map(h=>`<div class="hist"><strong>${new Date(h.at).toLocaleDateString("it-IT")}</strong> · ${AXIS_LABEL[h.weak]}${axisBars(h.scores)}</div>`).join("")}</section>`:""}
    </main>`;
    app.querySelectorAll("[data-y]").forEach(b=>b.onclick=()=>{state.h=Number(b.dataset.y);render();});
    const pay=document.getElementById("pay"); if(pay) pay.onclick=startCheckout;
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="oggi"){
    if(!db.sim){go("profilo");return;}
    if(!db.pro){ app.innerHTML=paywall("Un'abitudine. Novanta giorni.","Abitudini, diario e calendario si aprono con il Piano 90.",lever(db.sim.weak)); document.getElementById("pay").onclick=startCheckout; document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go)); return; }
    if(!db.planStart){db.planStart=new Date().toISOString();save(db);}
    if(!db.habits.length) db.habits=seedHabits(db.sim.weak);
    const pl=planItems(db.sim.weak); const day=dayN(); const phase=currentPhase(day); const t=today();
    if(!db.habitLog[t]) db.habitLog[t]={};
    const list=db.habits.map(h=>{
      const on=!!(db.habitLog[t]&&db.habitLog[t][h.id]); const st=streak(db.habitLog,h.id); const w=weekDone(db.habitLog,h.id);
      const dots=Array.from({length:14},(_,i)=>{const dayK=daysBack(13-i); const ok=db.habitLog[dayK]&&db.habitLog[dayK][h.id]; return `<i class="${ok?"on":""}"></i>`;}).join("");
      return `<article class="card"><label class="check"><input type="checkbox" data-h="${h.id}" ${on?"checked":""}/> <strong>${esc(h.name)}</strong> <span class="pill">${st} giorni di fila · ${w}/7</span></label><div class="dots">${dots}</div></article>`;
    }).join("");
    const notes=(db.journal||[]).slice(0,6).map(j=>`<div class="hist"><p class="meta" style="letter-spacing:0">${new Date(j.at).toLocaleDateString("it-IT",{day:"numeric",month:"long"})}</p><p>${esc(j.text)}</p></div>`).join("")||`<p class="lede">Nessuna nota ancora.</p>`;
    const tasks=[["t1","Messa in calendario"],["t2","Fatta almeno 3 volte"],["t3","Tolto uno spreco la sera"],["t4","Detto a qualcuno"]];
    app.innerHTML=`<main class="step wide">
      <div class="flex-head"><div><p class="meta">Oggi · ${AXIS_LABEL[db.sim.weak]}</p><h1 class="q" style="font-size:36px;max-width:22ch">${esc(pl.focus)}</h1><p class="lede">${pl.weeks[phase][0]} — ${pl.weeks[phase][1]}</p></div>${dayRing(day)}</div>
      <h2 style="margin:36px 0 12px">Le tue abitudini</h2>
      <div class="grid">${list}</div>
      <div class="row"><input id="newHabit" maxlength="60" placeholder="Aggiungi un'abitudine" style="flex:1;min-width:180px;background:var(--bg);border:1px solid var(--border);border-radius:14px;padding:12px 14px"/><button class="btn" id="addH">Aggiungi</button></div>
      <div class="grid" style="grid-template-columns:1.2fr .8fr;margin-top:36px">
        <div><h2>Due righe, stasera</h2><label class="field"><textarea id="note" rows="4" placeholder="Cosa hai fatto. Cosa hai saltato."></textarea></label><button class="cta" id="saveN">Salva nota</button>${notes}</div>
        <div><h2>Le 12 settimane</h2>${pl.weeks.map(([t,d],i)=>`<article class="card" style="margin-top:10px;${i===phase?"border-color:var(--border-strong)":""}"><h3>${t}</h3><p>${d}</p></article>`).join("")}${tasks.map(([id,label])=>`<label class="check"><input type="checkbox" data-c="${id}" ${db.checks[id]?"checked":""}/> ${label}</label>`).join("")}<div class="row"><button class="ghost" data-go="futuri">Rivedi i futuri</button></div></div>
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
