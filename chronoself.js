const PICK_SCORE=[10,30,50,70,90];
function Q(id,axis,text,choices,hint){
  return {id,axis,text,hint,choices,min:choices[0],max:choices[4]};
}
const QUESTIONS=[
  Q("sonno","salute","Quanto spesso ti svegli dopo un sonno che senti sufficiente?",["Mai o quasi mai", "Raramente", "Circa metà delle mattine", "La maggior parte delle mattine", "Quasi tutte le mattine"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("movimento","salute","In una settimana abituale, quanti giorni dedichi al movimento?",["Nessun giorno", "Un giorno", "Due o tre giorni", "Quattro giorni", "Cinque o più giorni"],"Considera anche camminate e attività adattate alle tue possibilità."),
  Q("energia","salute","Quanto spesso hai energia sufficiente per le attività quotidiane?",["Mai o quasi mai", "Raramente", "Circa metà dei giorni", "La maggior parte dei giorni", "Quasi ogni giorno"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("cibo","salute","Quanto spesso riesci a fare pasti regolari, adatti alle tue esigenze?",["Mai o quasi mai", "Uno o due giorni a settimana", "Tre o quattro giorni a settimana", "Cinque o sei giorni a settimana", "Ogni giorno o quasi"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("risparmio","soldi","Negli ultimi tre mesi, quanto spesso hai messo da parte del denaro?",["Mai, e ho usato risparmi o credito", "Mai, ma ho coperto le spese", "Solo in un mese", "In due mesi", "Ogni mese"],"È sufficiente una stima. Considera le risorse di cui puoi effettivamente disporre."),
  Q("debiti","soldi","Quanto pesano rate e spese fisse sul tuo bilancio?",["Non riesco a coprirle tutte", "Le copro con grande difficoltà", "Le copro, ma resta poco margine", "Le copro con un margine adeguato", "Le copro senza difficoltà e con ampio margine"],"È sufficiente una stima. Considera le risorse di cui puoi effettivamente disporre."),
  Q("cuscinetto","soldi","Per quanto tempo i tuoi risparmi coprirebbero le spese essenziali?",["Meno di una settimana", "Da una settimana a meno di un mese", "Da uno a meno di tre mesi", "Da tre a meno di sei mesi", "Sei mesi o più"],"È sufficiente una stima. Considera le risorse di cui puoi effettivamente disporre."),
  Q("spese","soldi","Quanto conosci la distribuzione delle tue spese mensili?",["Non so quanto spendo", "Conosco solo alcune spese fisse", "Conosco il totale, ma non le categorie", "Conosco quasi tutte le categorie", "Ho una visione completa e aggiornata"],"È sufficiente una stima. Considera le risorse di cui puoi effettivamente disporre."),
  Q("competenza","lavoro","Quanto spesso dedichi tempo a imparare qualcosa di utile per lavoro o studio?",["Mai o quasi mai", "Meno di una volta al mese", "Una o due volte al mese", "Ogni settimana, senza un programma", "Ogni settimana, con un obiettivo chiaro"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("autonomia","lavoro","Quanto puoi decidere come organizzare il tuo lavoro, studio o attività principale?",["Quasi per niente", "Poco", "In parte", "Molto", "Quasi completamente"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("senso","lavoro","Quanto spesso trovi un significato in quello che fai durante la giornata?",["Mai o quasi mai", "Raramente", "Circa metà delle volte", "Spesso", "Quasi sempre"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("retepro","lavoro","Quanto è facile trovare qualcuno con cui confrontarti su lavoro o studio?",["Non ho nessuno a cui rivolgermi", "È molto difficile", "A volte trovo un confronto utile", "Di solito trovo un confronto utile", "Ho contatti affidabili con cui confrontarmi"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("legami","relazioni","Quanto spesso dedichi tempo di qualità alle persone importanti per te?",["Meno di una volta al mese", "Una o due volte al mese", "Circa una volta a settimana", "Più volte a settimana", "Quasi ogni giorno"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("conflitti","relazioni","Quanto spesso le tensioni nelle relazioni ti lasciano senza energie?",["Quasi ogni giorno", "Più volte a settimana", "Circa una volta a settimana", "Raramente", "Mai o quasi mai"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("cura","relazioni","Quanto senti di poter parlare apertamente di come stai con qualcuno?",["Non sento di poterlo fare", "Solo in rare occasioni", "A volte", "Nella maggior parte dei momenti", "So di poter contare su qualcuno"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("schermo","abitudini","Quanto spesso il telefono occupa più tempo di quanto vorresti?",["Quasi ogni giorno", "Più volte a settimana", "Circa una volta a settimana", "Raramente", "Mai o quasi mai"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("routine","abitudini","Quanto spesso riesci a mantenere una piccola routine al mattino o alla sera?",["Mai o quasi mai", "Uno o due giorni a settimana", "Tre o quattro giorni a settimana", "Cinque o sei giorni a settimana", "Ogni giorno o quasi"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza."),
  Q("promesse","abitudini","Quanti degli impegni realistici presi con te riesci a rispettare?",["Quasi nessuno", "Meno della metà", "Circa la metà", "La maggior parte", "Quasi tutti"],"Pensa alle ultime quattro settimane. Scegli la risposta più vicina alla tua esperienza.")
];
const AXES=["salute","soldi","lavoro","relazioni","abitudini"];
const AXIS_LABEL={salute:"Benessere",soldi:"Finanze",lavoro:"Lavoro e studio",relazioni:"Relazioni",abitudini:"Abitudini"};
const KIND_TITLE={deriva:"Se riduci la cura",inerzia:"Se mantieni le abitudini",miglioramento:"Se introduci un cambiamento"};
const KEY="chronoself.v2";
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const esc=s=>{const d=document.createElement("div"); d.textContent=String(s); return d.innerHTML.replace(/"/g,"&quot;").replace(/'/g,"&#39;");};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function save(db){localStorage.setItem(KEY,JSON.stringify(db)); if(window.CS&&CS.user&&CS.push) CS.push();}
const defaults=()=>({recoveryCopies:[],profile:{nome:"",eta:"",contesto:""},answers:Object.fromEntries(QUESTIONS.map(q=>[q.id,50])),picked:{},focusOverride:null,sim:null,history:[],checks:{},journal:[],habits:[],habitLog:{},pro:false,planStart:null,quizI:null});
const db=Object.assign(defaults(), load());
Object.defineProperty(db, "pro", {enumerable:false, configurable:false, get:()=>!!(window.CS&&CS.hasEntitlement&&CS.hasEntitlement())});
function scoresFrom(a){const acc={}; AXES.forEach(x=>acc[x]={s:0,n:0}); QUESTIONS.forEach(q=>{acc[q.axis].s+=(a[q.id]??50);acc[q.axis].n++;}); const out={}; AXES.forEach(x=>out[x]=Math.round(acc[x].s/acc[x].n)); return out;}
function weakest(base){return [...AXES].sort((a,b)=>base[a]-base[b])[0];}
function pickIndex(score){
  let best=0, dist=Infinity;
  PICK_SCORE.forEach((s,i)=>{ const d=Math.abs(s-score); if(d<dist){ dist=d; best=i; } });
  return best;
}
function echoOf(id,score){
  const q=QUESTIONS.find(x=>x.id===id); if(!q) return "";
  return q.choices[pickIndex(score)];
}
function wasPicked(id,answers,picked){
  if(picked && Object.prototype.hasOwnProperty.call(picked,id)) return true;
  const s=answers[id];
  return typeof s==="number" && s!==50;
}
function diagnose(answers,picked,focusId){
  picked=picked||db.picked; focusId=focusId||db.focusOverride;
  const scores=scoresFrom(answers); const weak=weakest(scores);
  const signals=QUESTIONS.map(q=>({id:q.id,axis:q.axis,score:answers[q.id]??50}));
  const informative=signals.filter(s=>wasPicked(s.id,answers,picked)||s.score<=42||s.score>=62);
  const pool=(informative.length>=4?informative:signals).slice().sort((a,b)=>{
    if(Math.abs(a.score-b.score)>4) return a.score-b.score;
    return ACTIONABLE.indexOf(a.id)-ACTIONABLE.indexOf(b.id);
  });
  let primary=pool[0]||signals[0];
  if(focusId){ const forced=signals.find(s=>s.id===focusId); if(forced) primary=forced; }
  else if(primary.id==="energia"){
    const drivers=["sonno","cibo","schermo","movimento"].map(id=>signals.find(s=>s.id===id)).filter(Boolean).sort((a,b)=>a.score-b.score);
    if(drivers[0]&&drivers[0].score<=65) primary=drivers[0];
  }
  const cluster=pool.filter(s=>s.id!==primary.id&&s.score<=primary.score+12).slice(0,3);
  const secondary=cluster[0]||pool.find(s=>s.id!==primary.id&&s.score<58&&s.id!=="energia")||null;
  const strengths=[...signals].filter(s=>s.score>=70).sort((a,b)=>b.score-a.score).slice(0,3);
  return {primary,secondary,strengths,lows:cluster.slice(0,2),cluster,scores,weak,balanced:primary.score>=62,vague:informative.length<6};
}
function lowerFirst(s){ return s ? s.charAt(0).toLowerCase()+s.slice(1) : s; }
function alsoLine(d){
  if(!d.secondary) return null;
  const hole=playFor(d.secondary.id).hole;
  const echo=echoOf(d.secondary.id,d.secondary.score).replace(/\.$/,"");
  return `Un altro tema da considerare è ${hole}: «${echo}».`;
}
function whenPhrase(y){ return y===1?"Tra un anno":y===5?"Tra cinque anni":"Tra dieci anni"; }
function readLife(answers,picked,focusId){
  const d=diagnose(answers,picked,focusId); const play=playFor(d.primary.id);
  const said=echoOf(d.primary.id,d.primary.score);
  const voice=VOICE[d.primary.id];
  const alts=[d.primary,...d.cluster].filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i).slice(0,4).map(s=>{ const p=playFor(s.id); return {id:s.id,label:p.label,hole:p.hole}; });
  return {d,play,reading:{
    title:d.vague?"Completa il tuo punto di partenza":d.balanced?"Una base da coltivare":"Da qui puoi iniziare",
    said:d.vague?"Servono più risposte per proporre una priorità utile.":`${play.label}: hai risposto «${said}». ${d.balanced?"Le tue risposte descrivono una buona base. Puoi scegliere cosa consolidare.":"È una delle risposte che segnala più margine di attenzione, non un giudizio su di te."}`,
    why:d.vague?"Riprendi le domande e scegli le risposte più vicine alla tua esperienza.":play.action,
    also:d.vague?null:alsoLine(d),
    holds:null,
    action:play.action,vague:d.vague,alts
  }};
}
function lever(axis){return {salute:PLAY.sonno.action,soldi:PLAY.risparmio.action,lavoro:PLAY.competenza.action,relazioni:PLAY.legami.action,abitudini:PLAY.schermo.action}[axis];}
function leverFor(answers){return playFor(diagnose(answers).primary.id).action;}
function opener(){ return ""; }
function story(d,p,y,kind,profile){
  const play=playFor(d.primary.id);
  const openings={deriva:"Se dedichi meno attenzione a quest’area, potresti trovare più difficile ritagliarle spazio.",inerzia:"Se mantieni le abitudini attuali, potresti ritrovare punti di forza e difficoltà simili a quelli che descrivi oggi.",miglioramento:"Se ripeti un cambiamento sostenibile, potresti rendere quest’area più gestibile."};
  const horizons={1:"Un anno offre spazio per fare prove e capire cosa funziona nella tua situazione.",5:"In cinque anni possono cambiare priorità e circostanze: questo scenario va riletto e aggiornato nel tempo.",10:"Dieci anni sono un orizzonte aperto. Le scelte di oggi contano, ma non determinano da sole il tuo futuro."};
  return `${play.futures[kind]} Il punto di partenza che hai scelto è ${play.hole}. ${kind==='miglioramento'?play.action:kind==='inerzia'?'Osserva cosa ti aiuta già e quali ostacoli si ripetono.':'Nota i primi ostacoli e valuta quale supporto potrebbe aiutarti.'} ${d.secondary?'Nelle tue risposte emerge anche un altro tema: '+playFor(d.secondary.id).label.toLowerCase()+'. Affronta una priorità alla volta. ':''}${horizons[y]}`;
}
function facts(){ return []; }
function project(score,y,kind,axis,weak,focusAxis){
  let delta={inerzia:score>=60?0.35:-1.15,miglioramento:2.35,deriva:-2.9}[kind];
  if(axis===weak) delta*=1.2;
  if(axis===focusAxis) delta*=kind==="miglioramento"?1.35:1.15;
  return clamp(score+delta*y*(1+y*0.08));
}
function simulate(answers,profile,picked,focusId){
  const d=diagnose(answers,picked,focusId); const horizons={};
  const focusAxis=(QUESTIONS.find(q=>q.id===d.primary.id)||{axis:d.weak}).axis;
  [1,5,10].forEach(y=>{ horizons[y]={}; ["deriva","inerzia","miglioramento"].forEach(k=>{ const p={}; AXES.forEach(a=>p[a]=project(d.scores[a],y,k,a,d.weak,focusAxis)); horizons[y][k]={title:KIND_TITLE[k],narrative:story(d,p,y,k,profile),facts:facts(p,d,k),scores:p}; }); });
  return {version:4,at:new Date().toISOString(),profile:{...profile},answers:{...answers},scores:d.scores,weak:d.weak,focus:d.primary.id,secondary:d.secondary?d.secondary.id:null,horizons};
}
function planItems(answers){
  const d=diagnose(answers); const play=playFor(d.primary.id);
  return {focus:play.action,why:play.why,prompt:play.prompt,label:play.label,hole:play.hole,weeks:play.weeks,balanced:d.balanced};
}
function mergeHabits(habits,answers){
  const d=diagnose(answers); const wanted=[...playFor(d.primary.id).habits];
  if(d.secondary) wanted.push(playFor(d.secondary.id).habits[0]);
  const have=new Set(habits.map(h=>h.name)); const next=habits.slice();
  [...wanted].reverse().forEach((name,i)=>{ if(!have.has(name)){ next.unshift({id:"h"+Date.now().toString(36)+i,name}); have.add(name);} });
  return next.sort((a,b)=>{const rank=h=>wanted.includes(h.name)?wanted.indexOf(h.name):-1;return (rank(a)<0?999:rank(a))-(rank(b)<0?999:rank(b));});
}
function seedHabits(answers){return mergeHabits([],answers);}
let clockOverride=null;
function nowDate(){ return clockOverride?new Date(clockOverride):new Date(); }
function localKey(d){
  d=d||nowDate();
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), day=String(d.getDate()).padStart(2,"0");
  return y+"-"+m+"-"+day;
}
function parseLocal(key){
  const p=String(key).split("-").map(Number);
  return new Date(p[0], (p[1]||1)-1, p[2]||1, 12, 0, 0, 0);
}
function addLocalDays(key,n){ const d=parseLocal(key); d.setDate(d.getDate()+n); return localKey(d); }
function setClockKey(key){
  clockOverride=key?parseLocal(key):null;
  try{ if(key) sessionStorage.setItem("cs.clock",key); else sessionStorage.removeItem("cs.clock"); }catch(e){}
}

window.__csDayClock=true;
function dayNFromKeys(startKey,todayKey){
  const diff=Math.round((parseLocal(todayKey).getTime()-parseLocal(startKey).getTime())/86400000);
  return Math.min(90, Math.max(1, diff+1));
}
function dayN(){
  if(!db.planStart) return 1;
  return dayNFromKeys(localKey(new Date(db.planStart)), localKey());
}
function currentPhase(day){ if(day<=14) return 0; if(day<=28) return 1; if(day<=56) return 2; return 3; }
function today(){ return localKey(); }
function daysBack(n){ return addLocalDays(localKey(), -n); }
function planDayKey(i){ return addLocalDays(localKey(new Date(db.planStart||Date.now())), i); }
function weekKeys(){
  const now=nowDate();
  const x=new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day=x.getDay(); const diff=day===0?-6:1-day;
  x.setDate(x.getDate()+diff);
  return Array.from({length:7},(_,i)=>{ const d=new Date(x); d.setDate(x.getDate()+i); return localKey(d); });
}
let lastSeenKey=localKey();
function tickDay(){
  const k=localKey();
  if(k===lastSeenKey) return false;
  lastSeenKey=k;
  if(state.view==="oggi") render();
  return true;
}
function armDayTick(){
  if(window.__csDayTick) clearTimeout(window.__csDayTick);
  if(clockOverride) return;
  const now=new Date();
  const next=new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 2);
  window.__csDayTick=setTimeout(()=>{ tickDay(); armDayTick(); }, Math.max(1000, next-now));
}

function tone(n){return n>=70?"good":n>=45?"mid":"low";}
function streak(log,id){let n=0; for(let i=0;i<90;i++){const day=daysBack(i); if(log[day]&&log[day][id]) n++; else if(i===0) continue; else break;} return n;}
function weekDone(log,id){let c=0; for(let i=0;i<7;i++){const day=daysBack(i); if(log[day]&&log[day][id]) c++;} return c;}
const WEEK_LABELS=["Lu","Ma","Me","Gi","Ve","Sa","Do"];
function heldDays(id,day){ let n=0; for(let i=0;i<day;i++){ const k=planDayKey(i); if(db.habitLog[k]&&db.habitLog[k][id]) n++; } return n; }
function journalOn(key){ return (db.journal||[]).filter(j=>localKey(new Date(j.at))===key); }
function holdBtn(h,big,hint,doneLine){
  const t=today(); const on=!!(db.habitLog[t]&&db.habitLog[t][h.id]); const st=streak(db.habitLog,h.id);
  return `<button type="button" class="hold ${big?"hold-lg":""} ${on?"is-on":""}" data-h="${h.id}" aria-pressed="${on}">
    <span class="hold-mark" aria-hidden="true"></span>
    <span class="hold-copy"><strong>${esc(h.name)}</strong><span>${on?(doneLine||"Completato oggi."):big?(hint||"Tocca quando l'hai fatta."):(st?st+" giorni di fila.":"Ancora no.")}</span></span>
  </button>`;
}
function weekStrip(id){
  const keys=weekKeys(); const t=today();
  return `<div class="week-strip">${keys.map((k,i)=>{
    const on=!!(db.habitLog[k]&&db.habitLog[k][id]); const isToday=k===t; const future=k>t;
    return `<div class="week-cell${on?" on":""}${isToday?" today":""}${future?" future":""}"><b>${WEEK_LABELS[i]}</b></div>`;
  }).join("")}</div>`;
}
function cal90(day,id,play,playId){
  return `<div class="cal90">${Array.from({length:90},(_,i)=>{
    const k=planDayKey(i); const on=!!(db.habitLog[k]&&db.habitLog[k][id]);
    const tip=(typeof dayCard==="function"&&play)?dayCard(play,playId,i+1,parseLocal(k)).line:`Giorno ${i+1}`;
    return `<i class="${on?"on":""}${i===day-1?" now":""}${i>=day?" future":""}" title="${esc(tip)}"></i>`;
  }).join("")}</div>`;
}
window.CS=window.CS||{};
window.CS.applyPayload=function(p){
  if(!p||typeof p!=="object") return;
  ["recoveryCopies","profile","answers","picked","focusOverride","sim","history","checks","journal","habits","habitLog","planStart","quizI"].forEach(k=>{ if(k in p) db[k]=p[k]; });
};
window.CS.resetLocal=function(){const fresh=defaults(); Object.keys(fresh).filter(k=>k!=="pro").forEach(k=>db[k]=fresh[k]); state.h=1;state.i=0;state.tab="oggi";};
window.CS.syncEntitlement=function(){
  if(db.pro&&!db.planStart){db.planStart=new Date().toISOString(); if(db.sim) db.habits=mergeHabits(db.habits,db.sim.answers); localStorage.setItem(KEY,JSON.stringify(db));}
};
let checkoutBusy=false;
async function startCheckout(){
  if(!signedIn()){CS.status="Accedi per attivare il Piano 90.";go("account");return;}
  if(checkoutBusy) return;
  checkoutBusy=true;
  try{await CS.billing("/api/create-checkout");}catch(e){alert(e.message||"Pagamento non disponibile. Riprova.");}finally{checkoutBusy=false;}
}
function splitStory(t){
  const i=String(t).indexOf(". ",12);
  if(i<12) return [t,""];
  return [t.slice(0,i+1), t.slice(i+2)];
}
function midQuiz(){ return Number.isInteger(db.quizI) && db.quizI>=0 && db.quizI<QUESTIONS.length; }
function dayMode(){
  const h=nowDate().getHours();
  if(h>=5&&h<11) return "mattina";
  if(h>=11&&h<18) return "giorno";
  if(h>=18&&h<23) return "sera";
  return "notte";
}
function dayModeLine(mode,focusId){
  if(mode==="notte"&&focusId==="sonno") return {kicker:"Notte",line:"È tardi. Telefono in un'altra stanza. Domani conti."};
  if(mode==="mattina") return {kicker:"Mattina",line:"Prima questa cosa. Poi il resto della giornata."};
  if(mode==="giorno") return {kicker:"Giorno",line:"Scegli un momento realistico per il tuo piccolo passo."};
  if(mode==="sera") return {kicker:"Sera",line:"Prenditi un momento per annotare come è andata."};
  return {kicker:"Notte",line:"Domani. Oggi è chiuso."};
}
function letterOf(kind,y,profile){
  const then=new Date(); then.setFullYear(then.getFullYear()+y);
  const when=then.toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"});
  const place={citta:"dalla città",paese:"dal paese",estero:"da fuori"}[profile.contesto]||"";
  const age=parseInt(profile.eta,10); const ageThen=(age>12&&age<90)?age+y:null;
  const who=(profile.nome||"").trim();
  const span=y===1?"un anno":y+" anni";
  const greet=who?who+",":"";
  return {dateline:place?`${when} · ${place}`:when,greet,sign:`— tu${ageThen?`, a ${ageThen} anni`:`, tra ${span}`}`,span};
}
function fromYouLine(answers,profile){
  const id=diagnose(answers).primary.id;
  const voice=VOICE[id]||playFor(id).futures;
  const meta=letterOf("miglioramento",1,profile);
  return {kicker:"Da te, tra un anno",line:voice.miglioramento,sign:meta.sign};
}
function letterCard(kind,pack,y,profile){
  const m=letterOf(kind,y,profile); const parts=splitStory(pack.narrative);
  return `<article class="letter"><p class="dateline">${esc(m.dateline)}</p><p class="kind">${KIND_TITLE[kind]}</p>${m.greet?`<p class="greet">${esc(m.greet)}</p>`:""}<p class="future-open">${esc(parts[0])}</p>${parts[1]?`<p>${esc(parts[1])}</p>`:""}<p class="sign">${esc(m.sign)}</p>${pack.facts.length?`<ul class="facts">${pack.facts.map(([l,v])=>`<li><span>${l}</span><strong>${v}</strong></li>`).join("")}</ul>`:""}</article>`;
}
function sealedLetter(y){
  const span=y===1?"un anno":y+" anni";
  return `<article class="letter sealed">${MARK}<p class="meta">Tra ${span}</p><h3>Lettera chiusa</h3><p>Tre scenari immaginati a partire dalle tue risposte. Questo orizzonte è incluso nel Piano 90.</p><div class="row"><button class="cta light" id="pay">Scopri il Piano 90</button></div></article>`;
}
function polarAt(deg,r,cx,cy){ const a=(deg-90)*Math.PI/180; return [+(cx+Math.cos(a)*r).toFixed(1), +(cy+Math.sin(a)*r).toFixed(1)]; }
function arcPath(cx,cy,r,start,end){
  const [x1,y1]=polarAt(start,r,cx,cy); const [x2,y2]=polarAt(end,r,cx,cy);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${end-start>180?1:0} 1 ${x2} ${y2}`;
}
function lifeClock(scores,weak){
  const CX=140,CY=140,R=108,GAP=8,SWEEP=72-GAP;
  const arcs=AXES.map((a,i)=>{
    const start=-90+i*72+GAP/2; const end=start+SWEEP; const filled=start+SWEEP*(scores[a]/100);
    const cls=a===weak?"low":tone(scores[a]); const [lx,ly]=polarAt(start+SWEEP/2,R+22,CX,CY);
    return `<path class="lc-bg" d="${arcPath(CX,CY,R,start,end)}"/>${scores[a]>4?`<path class="lc-${cls}" d="${arcPath(CX,CY,R,start,Math.max(start+3,filled))}"/>`:""}<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" fill="#6a6358" font-size="11" font-family="Outfit,sans-serif">${AXIS_LABEL[a]}</text>`;
  }).join("");
  return `<svg class="life-clock" viewBox="0 0 280 280" role="img" aria-label="Le cinque aree">${arcs}<text x="${CX}" y="${CY-8}" text-anchor="middle" fill="#1b1914" font-size="16" font-family="Fraunces,Georgia,serif">${AXIS_LABEL[weak]}</text><text x="${CX}" y="${CY+14}" text-anchor="middle" fill="#6a6358" font-size="11" font-family="Outfit,sans-serif">il punto</text></svg>`;
}
function diagnosisCard(answers){
  const {d,play,reading:r}=readLife(answers,db.picked,db.focusOverride);
  return `<section class="diag">
    <div>
      <p class="meta">${esc(play.label)}</p>
      <h2>${esc(r.title)}</h2>
      <p class="lede">${esc(r.said)}</p>
      ${r.also?`<p class="lede">${esc(r.also)}</p>`:""}
      <div class="weights">
        <p class="meta" style="letter-spacing:0.18em;margin-top:22px">Le risposte alla base del suggerimento</p>
        ${[d.primary,...d.lows].filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i).slice(0,3).map(row=>`<div class="weight"><span>${esc(playFor(row.id).label)}</span><div class="bar ${tone(row.score)}"><span style="width:${row.score}%"></span></div><span class="num" style="width:auto;max-width:40%;text-align:right;font-size:12px">${esc(echoOf(row.id,row.score))}</span></div>`).join("")}
      </div>
    </div>
    <div class="diag-action">
      <p class="meta">Cosa fare</p>
      <h3>${esc(play.action)}</h3>
      <ul class="ok">${play.habits.map(h=>`<li>${esc(h)}</li>`).join("")}</ul>
      <p>Gli scenari a un anno sono gratuiti. Il Piano 90 ti accompagna nella pratica, con un diario e azioni da adattare alle tue possibilità.</p>
    </div>
  </section>`;
}
function axisBars(scores){return AXES.map(a=>`<div class="axisbar"><span>${AXIS_LABEL[a]}</span><div class="bar ${tone(scores[a])}"><span style="width:${scores[a]}%"></span></div><span class="num" aria-label="${scores[a]} su 100, indice orientativo">${scores[a]}</span></div>`).join("");}
function radar(scores,weak){ return lifeClock(scores, weak||weakest(scores)); }
function yearClock(day){
  const CX=54,CY=54,R=40;
  const ticks=Array.from({length:90},(_,i)=>{
    const ang=-90+i*4;
    let done=false;
    if(db.planStart){
      const k=planDayKey(i);
      const log=db.habitLog[k];
      done=!!(log&&Object.values(log).some(Boolean));
    }
    const past=i<day;
    const [x1,y1]=polarAt(ang,R-2,CX,CY); const [x2,y2]=polarAt(ang,done?R+6:R+2,CX,CY);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${done?"#2a332e":"#1b1914"}" stroke-width="${done?2:1}" stroke-opacity="${done?1:past?0.28:0.12}" stroke-linecap="round"/>`;
  }).join("");
  return `<div class="dayring yearclock"><svg viewBox="0 0 108 108">${ticks}</svg><div class="n"><div><div class="q" style="font-size:28px">${day}</div><div class="meta">di 90</div></div></div></div>`;
}
function dayRing(day){ return yearClock(day); }
const MARK=`<span class="mark" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14.2" fill="none" stroke="currentColor" stroke-width="1" opacity=".28"/><circle cx="16" cy="16" r="9.6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-dasharray="46 16" transform="rotate(-28 16 16)"/><circle cx="16" cy="16" r="2.1" fill="currentColor"/></svg><span class="mark-sun"></span></span>`;
const state={view:"home",i:0,h:1,tab:"oggi"};
const app=document.getElementById("app");
function signedIn(){ return !!(window.CS&&CS.user); }
function inPlan(){ return signedIn()&&!!db.pro; }
function chrome(){
  const nav=document.getElementById("nav");
  const dock=document.getElementById("dock");
  const logged=signedIn();
  const inside=inPlan();
  const links=inside?[["oggi","Oggi"],["futuri","Futuri"]]:(db.sim?[["futuri","I tuoi futuri"]]:[["profilo","Simula"]]);
  const extra=inside?[]:[["prezzi","Piano 90"]];
  const right=logged
    ?`<button class="ghost" data-go="account">Account</button>`
    :`<button class="ghost" data-go="account">Accedi</button>${db.sim?"":`<button class="cta" data-go="profilo" style="height:36px;padding:0 14px">Inizia</button>`}`;
  nav.innerHTML=`<button class="brand" data-go="home">${MARK} Chrono<em>Self</em></button><div class="navlinks">${[...links,...extra].map(([v,l])=>`<button class="ghost ${state.view===v?"on":""}" data-go="${v}">${l}</button>`).join("")}</div><div>${right}</div>`;
  const dockItems=inside?[["oggi","Oggi"],["futuri","Futuri"],["account","Account"]]:[["home","Home"],[db.sim?"futuri":"profilo",db.sim?"Futuri":"Simula"],["prezzi","Piano 90"]];
  dock.innerHTML=dockItems.map(([v,l])=>`<button class="${state.view===v?"on":""}" data-go="${v}">${l}</button>`).join("");
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
  document.querySelector("footer").style.display=(state.view==="simula"||state.view==="soglia")?"none":"";
  dock.style.display=(state.view==="simula"||state.view==="soglia")?"none":"";
}
function go(v){
  document.onkeydown=null;
  window.scrollTo({top:0,behavior:"instant"});
  if(window.__csClock){ cancelAnimationFrame(window.__csClock); window.__csClock=null; }
  if(v==="account" && window.CS && CS.renderAccount){ state.view="account"; chrome(); CS.renderAccount(); return; }
  if(v==="piano"||v==="diario"||v==="habits"){ v=inPlan()?"oggi":"prezzi"; }
  if((v==="futuri"||v==="oggi"||v==="soglia") && !db.sim){ v="profilo"; }
  state.view=v; render();
}
function paywall(title,lede,leverText){
  return `<main class="step"><p class="meta">Piano 90</p><h1 class="q" style="font-size:40px">${title}</h1><p class="lede">${lede}</p>${leverText?`<p class="lock">${esc(leverText)}</p>`:""}<p class="lede">4,99 € al mese. Novanta giorni guidati, un diario la sera, e le lettere a cinque e dieci anni.</p><div class="row"><button class="cta" id="pay">Attiva Piano 90</button><button class="btn" data-go="prezzi">Vedi i piani</button></div></main>`;
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
  const keepNote=(document.getElementById("note")||{}).value||"";
  document.onkeydown=null;
  chrome();
  if(state.view==="account"){CS.renderAccount();return;}
  if(state.view==="home"){
    const cta=inPlan()?"Vai a oggi":midQuiz()?`Riprendi (${db.quizI+1}/18)`:db.sim?"Apri i tuoi futuri":"Inizia";
    app.innerHTML=`<section class="hero-split">
      <div class="hero-copy">
        <h1>Chi diventi<br>se continui così?</h1>
        <p class="hero-lede">Dedica qualche minuto a capire le tue abitudini. Esplora tre futuri possibili e scegli un piccolo cambiamento da portare nei prossimi 90 giorni.</p>
        <div class="row"><button class="cta" id="start">${cta}</button>${inPlan()?"":`<button class="btn" data-go="prezzi">Piano 90 · 4,99 €</button>`}</div>
      </div>
      <div class="hero-photo">
        <img src="./brand/hero.jpg" alt="Poltrona di lino di fronte a una finestra, luce del mattino" />
        ${clockFace()}
      </div>
    </section>
    <section class="thesis">
      <img src="./brand/looking.jpg" alt="Una persona alla finestra, di spalle"/>
      <div>
        <p class="meta">L'idea</p>
        <blockquote>Il tuo futuro comincia dalle abitudini di oggi.</blockquote>
        <p class="lede">Le tue risposte diventano un quadro delle cinque aree della vita, tre scenari di riflessione e un primo passo concreto.</p>
      </div>
    </section>
    <section>
      <p class="meta">Tre lettere</p>
      <h2 style="font-size:clamp(28px,4vw,44px);max-width:16ch;margin:12px 0 24px">Stessa vita. Tre direzioni.</h2>
      <div class="grid three" style="padding-top:0">
        <article class="card"><p class="k">01</p><h3>Se riduci la cura</h3><p>Osserva cosa potrebbe diventare più difficile se questa area ricevesse meno attenzione.</p></article>
        <article class="card"><p class="k">02</p><h3>Se mantieni le abitudini</h3><p>Riconosci ciò che funziona e gli ostacoli che potrebbero ripetersi.</p></article>
        <article class="card"><p class="k">03</p><h3>Se introduci un cambiamento</h3><p>Immagina il margine che potrebbe aprirsi con un passo piccolo e sostenibile.</p></article>
      </div>
    </section>
    <section class="cta-band">
      <div>
        <p class="meta">Inizia</p>
        <h2>Diciotto domande. Poi vedi dove stai andando.</h2>
        <p>Gratis: le tre lettere a un anno. Il Piano 90 apre cinque e dieci anni, e il giorno per giorno.</p>
        <div class="row"><button class="cta light" id="start2">${cta}</button>${inPlan()?"":`<button class="cta ghosted" data-go="prezzi">Vedi i piani</button>`}</div>
      </div>
      <img src="./brand/loggia.jpg" alt="Tre archi, tre ore del giorno"/>
    </section>`;
    const goStart=()=>{ if(inPlan()) return go("oggi"); if(midQuiz()){ state.i=db.quizI; return go("simula"); } go(db.sim?"futuri":"profilo"); };
    document.getElementById("start").onclick=goStart;
    document.getElementById("start2").onclick=goStart;
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    startClock();
    return;
  }
  if(state.view==="privacy"){ app.innerHTML=`<main class="step"><p class="meta">Privacy e dati</p><h1 class="q">Il tuo spazio personale.</h1><section class="account-panel"><h2>Salvataggio sul dispositivo</h2><p>Risposte, profilo, diario e abitudini vengono salvati in questo browser. Cancellando i dati del browser potresti perdere le informazioni non sincronizzate. La navigazione privata può eliminarle alla chiusura.</p></section><section class="account-panel"><h2>Account e sincronizzazione</h2><p>Con un account, Supabase gestisce autenticazione e salvataggi associati al tuo utente. Quando recuperi i dati cloud, il contenuto salvato sull’account viene caricato sul dispositivo. Prima di sostituirlo puoi esportare una copia dall’account. Il logout rimuove i dati personali da questo browser.</p></section><section class="account-panel"><h2>Pagamenti</h2><p>Stripe gestisce pagamento e abbonamento. ChronoSelf usa lo stato dell’abbonamento per abilitare il Piano 90 e non salva i dati completi della carta. Puoi gestire rinnovo e disdetta dal tuo account.</p></section><section class="account-panel"><h2>Servizi esterni</h2><p>Il sito è ospitato su Vercel. I caratteri sono caricati da Google Fonts e il client di autenticazione da jsDelivr: questi servizi ricevono le informazioni tecniche necessarie alle richieste del browser.</p></section><section class="account-panel"><h2>Uno strumento di riflessione</h2><p>ChronoSelf non sostituisce assistenza sanitaria, psicologica o consulenza finanziaria. Gli scenari sono ipotesi narrative, non previsioni. Adatta ogni proposta alle tue circostanze.</p></section><div class="row"><button class="btn" data-go="account">Vai al tuo account</button></div></main>`;app.querySelector('[data-go]').onclick=()=>go('account');return; }
  if(state.view==="prezzi"){
    app.innerHTML=`<main class="step wide"><p class="meta">Piani</p><h1 class="q" style="font-size:40px">Scegli come proseguire.</h1><p class="lede">Quiz e scenari a un anno sono gratuiti. Il Piano 90 aggiunge il percorso e gli orizzonti a cinque e dieci anni. Abbonamento mensile con rinnovo automatico: puoi disdire dall’account. Il percorso di 90 giorni non interrompe automaticamente l’abbonamento.</p>
      <section class="grid three"><article class="card"><p class="meta">Gratis</p><p class="price">0 €</p><h3>Le lettere</h3><ul class="ok"><li>18 domande</li><li>Tre lettere, a un anno</li></ul><div class="row"><button class="btn" data-go="profilo">Inizia</button></div></article>
      <article class="card featured"><p class="meta">Piano 90</p><p class="price">4,99 € <span>/ mese</span></p><h3>Dalla riflessione alla pratica</h3><ul class="ok"><li>Lettere a cinque e dieci anni</li><li>90 giorni in 13 settimane</li><li>Diario personale e abitudini</li></ul><div class="row"><button class="cta light" id="pay">${inPlan()?"Già attivo — vai a oggi":"Attiva Piano 90"}</button></div></article>
      <article class="card"><img src="./brand/looking.jpg" alt="Persona alla finestra" style="width:100%;height:140px;object-fit:cover;border-radius:16px;margin:-22px -22px 16px;width:calc(100% + 44px);max-width:none"/><p class="meta">Cosa non è</p><h3>Non è terapia</h3><p>Né un medico, né un consulente. Un posto per vedere dove stai andando.</p></article></section></main>`;
    document.getElementById("pay").onclick=()=> inPlan()?go("oggi"):startCheckout();
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="profilo"){
    const p=db.profile;
    const resume=midQuiz() && db.quizI>0;
    app.innerHTML=`<main class="step"><p class="meta">Prima delle domande</p><h1 class="q" style="font-size:40px">Come ti chiami?</h1><p class="lede">Questi dettagli sono facoltativi e personalizzano le lettere. Puoi iniziare anche senza inserirli.</p>
      <label class="field">Nome (facoltativo)<input maxlength="60" autocomplete="given-name" id="nome" value="${esc(p.nome||"")}" /></label>
      <label class="field">Età (facoltativa)<input min="18" max="110" id="eta" type="number" value="${esc(p.eta||"")}" /></label>
      <label class="field">Dove vivi (facoltativo)<select id="contesto"><option value="">Preferisco non indicarlo</option><option value="citta">In città</option><option value="paese">In un paese</option><option value="estero">All'estero</option></select></label>
      <div class="row"><button class="cta" id="next">${resume?`Riprendi da ${db.quizI+1} di 18`:"Vai alle domande"}</button>${resume?`<button class="btn" id="restart">Ricomincia</button>`:""}</div></main>`;
    document.getElementById("contesto").value=p.contesto||"";
    const saveP=()=>{db.profile={nome:document.getElementById("nome").value.trim(),eta:document.getElementById("eta").value,contesto:document.getElementById("contesto").value};};
    document.getElementById("next").onclick=()=>{if(!document.getElementById("eta").reportValidity()) return; saveP(); if(!resume) db.quizI=0; state.i=db.quizI||0; save(db); go("simula");};
    const rst=document.getElementById("restart"); if(rst) rst.onclick=()=>{saveP(); db.quizI=0; state.i=0; save(db); go("simula");};
    return;
  }
  if(state.view==="simula"){
    const q=QUESTIONS[state.i]; const pct=Math.round((state.i/QUESTIONS.length)*100);
    if(!db.picked) db.picked={};
    const chosen=db.picked[q.id];
    const hasPick=typeof chosen==="number";
    app.innerHTML=`<main class="step"><p class="meta">${AXIS_LABEL[q.axis]} · ${state.i+1} di ${QUESTIONS.length}</p><div class="prog" role="progressbar" aria-label="Domande completate" aria-valuemin="0" aria-valuemax="18" aria-valuenow="${state.i}"><span style="width:${pct}%"></span></div>
      <h1 class="q" style="font-size:36px;margin-top:28px">${q.text}</h1>
      ${q.hint?`<p class="lede">${q.hint}</p>`:""}
      <div class="choices">${q.choices.map((c,i)=>`<button type="button" class="choice ${chosen===i?"on":""}" aria-pressed="${chosen===i}" data-pick="${i}">${esc(c)}</button>`).join("")}</div>
      <div class="row"><button class="btn" id="back" ${state.i===0?"disabled":""}>Indietro</button><button class="cta" id="next" ${hasPick?"":"disabled"}>${state.i<QUESTIONS.length-1?"Avanti":"Vedi il resoconto"}</button></div></main>`;
    app.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{
      const i=Number(b.dataset.pick);
      db.picked[q.id]=i; db.answers[q.id]=PICK_SCORE[i]; save(db); render(); document.querySelector(`[data-pick="${i}"]`).focus({preventScroll:true});
    });
    document.getElementById("back").onclick=()=>{if(state.i>0){state.i--; db.quizI=state.i; save(db); render();}};
    document.getElementById("next").onclick=()=>{
      if(!hasPick) return;
      if(state.i<QUESTIONS.length-1){state.i++; db.quizI=state.i; save(db); render(); const heading=app.querySelector("h1");heading.tabIndex=-1;heading.focus({preventScroll:true});window.scrollTo({top:0,behavior:"instant"});return;}
      db.focusOverride=null;
      const sim=simulate(db.answers,db.profile,db.picked,null);
      db.sim=sim; db.quizI=null;
      db.history.unshift({at:sim.at,scores:sim.scores,weak:sim.weak,focus:sim.focus});

      db.habits=mergeHabits(db.habits,db.answers);
      save(db); go("soglia");
    };
    document.onkeydown=e=>{ if(state.view!=="simula") return; if(e.key==="Enter" && e.target===document.body){ e.preventDefault(); document.getElementById("next").click(); } };
    return;
  }
  if(state.view==="soglia"){
    if(!db.sim){go("profilo");return;}
    const {d,play,reading:r}=readLife(db.sim.answers||db.answers,db.picked,db.focusOverride||db.sim.focus);
    const who=(db.sim.profile||db.profile).nome||"Tu";
    const when=new Date().toLocaleDateString("it-IT",{month:"long",year:"numeric"});
    const current=db.focusOverride||d.primary.id;
    const alts=r.alts.length>1?`<p class="meta" style="margin-top:28px">Scegli la priorità che ti rappresenta</p><div class="row" style="justify-content:center">${r.alts.map(a=>`<button class="btn ${a.id===current?"on-alt":""}" data-focus="${a.id}">${esc(a.label)}</button>`).join("")}</div>`:"";
    app.innerHTML=`<main class="soglia">${MARK}<p class="meta reveal">${esc(who)} · ${when}</p><h1 class="reveal" style="animation-delay:.2s">${esc(r.title)}</h1><p class="said reveal" style="animation-delay:.35s">${esc(r.said)}</p>${r.also?`<p class="lede reveal">${esc(r.also)}</p>`:""}${alts}<div class="row reveal" style="animation-delay:.55s;justify-content:center"><button class="cta" id="enter" data-go="futuri">Apri le tre lettere</button></div></main>`;
    app.querySelectorAll("[data-focus]").forEach(b=>b.onclick=()=>{
      db.focusOverride=b.dataset.focus;
      db.sim=simulate(db.sim.answers||db.answers, db.sim.profile||db.profile, db.picked, db.focusOverride);
      db.habits=mergeHabits(db.habits, db.sim.answers);
      save(db); render();
    });
    const openLetters=()=>go("futuri");
    document.getElementById("enter").onclick=openLetters;
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    document.onkeydown=null;
    return;
  }
  if(state.view==="futuri"){
    if(!db.sim){go("profilo");return;}
    const live=simulate(db.sim.answers||db.answers, db.sim.profile||db.profile);
    const s=Object.assign({}, db.sim, live);
    const who=s.profile.nome||"Tu";
    const d=diagnose(s.answers);
    const play=playFor(d.primary.id);
    const locked=!inPlan() && state.h>1;
    const pack=s.horizons[locked?1:state.h];
    const cols=["deriva","inerzia","miglioramento"].map(id=>letterCard(id,pack[id],state.h,s.profile)).join("");
    app.innerHTML=`<main class="step wide"><p class="meta">${esc(who)}${inPlan()?" · Piano 90":""}</p>
      <h1 class="q" style="font-size:40px">I tuoi futuri possibili</h1>${db.sim.version!==4?`<p class="result-method">Questo risultato usa risposte raccolte con una versione precedente. Le abbiamo conservate. Ripeti le domande aggiornate per ottenere una lettura V4 coerente.</p>`:""}
      <p class="lede">${esc(play.label)}. Tre scenari a ${state.h===1?"un anno":state.h+" anni"}, a partire dalle tue risposte.</p>
      <div class="tabs">${[1,5,10].map(y=>`<button class="tab ${y===state.h?"on":""}" data-y="${y}">Tra ${y} ann${y===1?"o":"i"}${(!inPlan()&&y>1)?" · chiuse":""}</button>`).join("")}</div>
      ${locked?sealedLetter(state.h): `<div class="cols">${cols}</div>`}
      <div class="row">${inPlan()?`<button class="cta" data-go="oggi">Vai a oggi</button>`:`<button class="cta" data-go="prezzi">Apri il Piano 90</button>`}<button class="btn" data-go="profilo">Rifai le domande</button></div>
      <details class="dash-more" style="margin-top:48px"><summary>Come leggere il risultato</summary>
        <div class="scores-grid" style="margin-top:20px">${radar(s.scores,d.weak)}<div>${axisBars(s.scores)}</div></div>
        ${diagnosisCard(s.answers)}
      </details>
      ${db.history.length>1?`<section style="margin-top:48px"><h2>Storico</h2>${db.history.slice(0,6).map(h=>`<div class="hist"><strong>${new Date(h.at).toLocaleDateString("it-IT")}</strong> · ${esc(h.focus?playFor(h.focus).label:AXIS_LABEL[h.weak])}${axisBars(h.scores)}</div>`).join("")}</section>`:""}
    </main>`;
    app.querySelectorAll("[data-y]").forEach(b=>b.onclick=()=>{state.h=Number(b.dataset.y);render();});
    const pay=document.getElementById("pay"); if(pay) pay.onclick=()=>go("prezzi");
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="oggi"){
    if(!db.sim){go("profilo");return;}
    if(!inPlan()){ app.innerHTML=paywall("Novanta giorni.","Ogni mattina sai cosa fare. Le lettere a cinque e dieci anni si aprono qui.",leverFor(db.sim.answers)); document.getElementById("pay").onclick=startCheckout; document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go)); return; }
    if(!db.planStart){db.planStart=new Date().toISOString();save(db);}
    const prevNames=db.habits.map(h=>h.name).join("|");
    db.habits=mergeHabits(db.habits, db.sim.answers);
    if(db.habits.map(h=>h.name).join("|")!==prevNames) save(db);
    const pl=planItems(db.sim.answers); const day=dayN(); const phase=currentPhase(day); const t=today();
    const focusId=diagnose(db.sim.answers).primary.id;
    const playNow=playFor(focusId);
    const card=(typeof dayCard==="function")?dayCard(playNow,focusId,day,nowDate()):null;
    const weeks=(typeof weeksOfPlan==="function")?weeksOfPlan(playNow,focusId):pl.weeks.map((w,i)=>({title:w[0],span:"",job:w[1],week:i+1}));
    const cadence=(card&&card.cadence)||(typeof CADENCE_OF!=="undefined"&&CADENCE_OF[focusId])||"daily";
    const mode=dayMode(); const mood=dayModeLine(mode, focusId);
    const isSunday=nowDate().getDay()===0; const done90=day>=90;
    const primary=db.habits[0]; const extra=db.habits.slice(1);
    const pid=primary?primary.id:"";
    const onPrimary=!!(primary&&db.habitLog[t]&&db.habitLog[t][pid]);
    const held=primary?heldDays(pid,day):0;
    const heldPast=primary?heldDays(pid, Math.max(0, day-1)):0;
    const lost=Math.max(0, (day-1)-heldPast);
    const st=primary?streak(db.habitLog,pid):0;
    const w=primary?weekKeys().filter(k=>db.habitLog[k]&&db.habitLog[k][pid]).length:0;
    const yest=daysBack(1);
    const missedYest=day>1 && primary && !(db.habitLog[yest]&&db.habitLog[yest][pid]);
    const notesToday=journalOn(t);
    const evening=mode==="sera"||mode==="notte";
    const thisWeek=weeks[card?card.week-1:0];
    const sun=(typeof sundayCount==="function")?sundayCount(cadence,w):{title:w+" giorni su 7 questa settimana.",line:"Una riga su cosa l'ha resa facile o difficile. Poi chiudi."};
    const stats=(typeof scoreLine==="function")?scoreLine(cadence,w,st,held,day,done90):( (st?st+" di fila · ":"")+w+"/7 questa settimana · "+held+" tenuti su "+day+(done90?"":" · a mezzanotte, giorno "+(day+1)) );
    const fromYou=fromYouLine(db.sim.answers, db.sim.profile||db.profile);
    const tomCard=(!done90 && typeof dayCard==="function")?dayCard(playNow,focusId,Math.min(90,day+1),parseLocal(addLocalDays(t,1))):null;
    const whisper=`<blockquote class="from-you" data-go="futuri" role="link" aria-label="Rileggi le lettere"><p class="meta">${esc(fromYou.kicker)}</p><p class="from-you-line">${esc(fromYou.line)}</p><p class="from-you-sign">${esc(fromYou.sign)}</p></blockquote>`;
    if(!state.tab) state.tab="oggi";
    const pills=[["oggi","Oggi"],["percorso","Percorso"],["diario","Diario"]].map(([id,l])=>`<button type="button" class="${state.tab===id?"on":""}" data-tab="${id}">${l}</button>`).join("");
    const banner90=done90?`<section class="dash-banner dark"><p class="meta">Giorno 90</p><h3>Novanta giorni. Rifai le 18 domande.</h3><p>Vedi se ${esc(pl.hole)} si è mosso. I futuri si riscrivono da dove sei ora.</p><div class="row"><button class="cta light" data-go="profilo">Rifai le domande</button></div></section>`:"";
    const composer=`<section class="dash-note">
        <p class="meta">Due righe</p>
        <h2>${evening?"Com’è andata oggi?":"Uno spazio per riflettere."}</h2>
        <label class="field"><textarea id="note" rows="4" placeholder="${esc(card?card.evening:pl.prompt)}"></textarea></label>
        <button class="cta" id="saveN">Salva nota</button>
        ${notesToday.length?`<p class="lede">Scritto oggi. Va bene così.</p>${notesToday.map(j=>`<div class="hist"><p>${esc(j.text)}</p></div>`).join("")}`:""}
        ${evening?(tomCard?`<p class="dash-later">Domani: ${esc(tomCard.line)}</p>`:`<p class="dash-later">Il percorso è chiuso. Rifai le 18 domande.</p>`):""}
      </section>`;
    let body="";
    if(state.tab==="percorso"){
      body=`<header class="dash-head">
        <div><p class="meta">Percorso · ${esc(pl.label)}${card?" · "+esc(card.pace):""}</p><h1>Giorno ${day} di 90.</h1>
          <p class="lede">${esc(card?card.line+". ":"")}${held} giorni registrati. Puoi riprendere da oggi, anche dopo una pausa.</p></div>
        ${yearClock(day)}
      </header>
      ${banner90}
      <section class="phase-now"><p class="meta">Oggi · settimana ${card?card.week:Math.ceil(day/7)} di 13</p><h2>${esc(card?card.title:pl.focus)}</h2><p>${esc(card?card.line:pl.weeks[phase][1])}</p></section>
      <p class="meta" style="margin-top:8px">I 90 giorni</p>
      ${cal90(day,pid,playNow,focusId)}
      <ol class="phase-list">${weeks.map((wk,i)=>`<li class="${(card?card.week:phase+1)===wk.week?"now":""}"><strong>${esc(wk.title)}</strong><span>${esc((wk.span?wk.span+". ":"")+wk.job)}</span></li>`).join("")}</ol>
      <div class="row"><button class="cta" data-go="futuri">Rivedi le lettere</button></div>
      <details class="dash-more"><summary>Aggiungi un'altra cosa</summary>
        <div class="row" style="margin-top:12px"><input id="newHabit" maxlength="60" placeholder="Solo se serve davvero"/><button class="btn" id="addH">Aggiungi</button></div>
        ${extra.map(h=>holdBtn(h,false)).join("")}
      </details>`;
    } else if(state.tab==="diario"){
      const hist=(db.journal||[]).slice(0,20).map(j=>`<div class="hist"><p class="meta" style="letter-spacing:0">${new Date(j.at).toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</p><p>${esc(j.text)}</p></div>`).join("")||`<p class="lede">Il diario è ancora vuoto. Inizia da ciò che hai notato oggi.</p>`;
      body=`<header class="dash-head"><div><p class="meta">Diario</p><h1>Il tuo diario.</h1><p class="lede">${esc(card?card.evening:pl.prompt)}</p></div></header>
      ${isSunday?`<section class="phase-now"><p class="meta">Domenica</p><h2>${esc(sun.title)}</h2><p>${esc(sun.line)}</p></section>`:""}
      ${composer}
      <div class="dash-hist">${hist}</div>`;
    } else {
      const job=(typeof jobLede==="function")?jobLede(cadence,onPrimary,w,missedYest,card?card.line:mood.line):(onPrimary?"Tenuto.":missedYest?"Ieri no. "+(card?card.line:mood.line):(card?card.line:mood.line));
      body=`<header class="dash-head">
        <div>
          <p class="meta">${esc(card?card.tag:mood.kicker+" · "+nowDate().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"}))}</p>
          <h1>${esc(card?card.title:pl.focus)}</h1>
          <p class="lede">${esc(job)}</p>
        </div>
      </header>
      ${whisper}
      ${banner90}
      ${primary?holdBtn(primary,true,card?card.holdHint:"","Completato. "+fromYou.sign):""}
      ${primary?weekStrip(pid):""}
      <p class="dash-stat">${esc(stats)}</p>
      ${extra.length?`<div class="dash-extra"><p class="meta">Anche questo</p>${extra.map(h=>holdBtn(h,false)).join("")}</div>`:""}
      <section class="phase-now"><p class="meta">Settimana ${card?card.week:Math.ceil(day/7)} di 13${card?" · "+esc(card.pace):""}</p><p>${esc(thisWeek?thisWeek.job:(pl.weeks[phase][1]))}</p></section>
      ${evening||notesToday.length?composer:`<p class="dash-later">Puoi annotare nel diario ciò che noti, in qualsiasi momento della giornata.</p>`}
      ${!evening&&!notesToday.length?`<p class="dash-later"><button class="ghost" data-tab="diario">Apri il diario</button></p>`:""}
      `;
    }
    app.innerHTML=`<main class="dash">
      <nav class="oggi-pills">${pills}</nav>
      ${body}
    </main>`;
    app.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab; render();});
    app.querySelectorAll("[data-h]").forEach(el=>el.onclick=()=>{
      if(clockOverride) return;
      const key=today();
      if(!db.habitLog[key]) db.habitLog[key]={};
      db.habitLog[key][el.dataset.h]=!db.habitLog[key][el.dataset.h];
      save(db); render();
    });
    const saveN=document.getElementById("saveN");
    if(saveN) saveN.onclick=()=>{ const text=(document.getElementById("note").value||"").trim(); if(!text) return; const prefix=isSunday&&state.tab==="diario"?(cadence==="weekly"?(w?"Settimana: sì. ":"Settimana: no. "):`Settimana: ${w}/7. `):""; db.journal.unshift({at:new Date().toISOString(),text:prefix+text}); sessionStorage.removeItem("cs.noteDraft");  save(db); render(); };
    const addH=document.getElementById("addH");
    if(addH) addH.onclick=()=>{ const name=(document.getElementById("newHabit").value||"").trim(); if(!name) return; if(db.habits.length>=6) return alert("Puoi aggiungere fino a 6 abitudini. Le abitudini dei percorsi precedenti restano conservate."); db.habits.push({id:"h"+Date.now(),name}); save(db); render(); };
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    const noteField=document.getElementById("note"); if(noteField){noteField.value=sessionStorage.getItem("cs.noteDraft")||"";noteField.oninput=()=>sessionStorage.setItem("cs.noteDraft",noteField.value);}
    armDayTick();
  }
}
function onWake(){ if(state.view==="oggi") render(); }
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="visible") onWake(); });
window.addEventListener("focus", onWake);
window.addEventListener("pageshow", onWake);
if(!window.__csDayPulse) window.__csDayPulse=setInterval(()=>{ if(!clockOverride) tickDay(); }, 30000);
armDayTick();
render();

