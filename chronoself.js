const PICK_SCORE=[10,30,50,70,90];
function Q(id,axis,text,choices,hint){
  return {id,axis,text,hint,choices,min:choices[0],max:choices[4]};
}
const QUESTIONS=[
  Q("sonno","salute","Come finiscono le tue notti?",["Tardi, e mi alzo a pezzi","Dormo poco, spesso spezzato","A settimane sì, a settimane no","Di solito sto sulle sette","Dormo, e la mattina sono a posto"]),
  Q("movimento","salute","Il corpo, in una settimana: quanto lo muovi per davvero?",["Quasi niente. Sto fermo","Un giorno, se va bene","Due o tre, quando capita","Quattro giorni, più o meno","Cinque o più, è un appuntamento"]),
  Q("energia","salute","Quando ti alzi, com'è la giornata che ti aspetta?",["Sono già stanco","Spesso giù, senza un perché","Dipende dal giorno","Più su che giù","Stabile. Ce la faccio"]),
  Q("cibo","salute","I pasti, da te: li fai, o capitano?",["Mangio in piedi, quello che capita","Qualche pasto lo faccio, molti no","Dipende dal giorno","Spesso cucino, non sempre","Mangio da seduto, quasi sempre"]),
  Q("risparmio","soldi","A fine mese, i soldi che restano?",["Non resta niente. A volte sono in rosso","Qualche euro, se avanza","Qualcosa, non ogni mese","Quasi ogni mese metto da parte","Ogni mese, da solo, prima che li veda"],"Basta una stima. Non i decimali."),
  Q("debiti","soldi","Rate, debiti, spese fisse: quanto spazio prendono in testa?",["Mi soffocano","Ci penso anche i giorni in cui non li pago","Ci sono, li pago, e basta","Li vedo. Non mi mangiano le sere","Pochi, o nessuno"]),
  Q("cuscinetto","soldi","Se da lunedì non entra più uno stipendio, tu quanto tieni?",["Pochi giorni","Qualche settimana, poi sono in prestito","Un mese, forse due","Tre-cinque mesi","Sei mesi o più, senza drammi"]),
  Q("spese","soldi","Sai dove sono andati i soldi, questo mese?",["No. Spariscono","A grandi linee, i buchi no","Le cose grosse sì, il resto no","Quasi tutto","Tutto. Lo scrivo"]),
  Q("competenza","lavoro","Quello che sai fare: sta diventando di più, o è fermo?",["Fermo da anni","Qualche pezzo, a caso","Un po', quando capita","Quasi ogni mese imparo qualcosa","Ogni mese, di proposito, su una cosa sola"]),
  Q("autonomia","lavoro","Orari, soldi, direzione: chi decide?",["Altri. Io eseguo","Poco io, molto altri","Qualche pezzo è mio","Abbastanza mio","Molto. Scelgo io"]),
  Q("senso","lavoro","Quando chiudi il lavoro, ti resta qualcosa — o solo stanchezza?",["Solo stanchezza. Non vale","Raro che valga","A tratti ha senso","Spesso sì","Sì. Quasi sempre vale la fatica"]),
  Q("retepro","lavoro","C'è qualcuno con cui puoi parlare di lavoro senza recitare?",["Nessuno","Uno, forse","Due o tre","Diverse persone","Sì. Una rete vera"]),
  Q("legami","relazioni","Questa settimana, chi hai visto per davvero?",["Quasi nessuno","Uno, a volte","Due o tre","Un gruppetto che tengo","Gente che c'è, di rito"]),
  Q("conflitti","relazioni","C'è qualcuno, o una chat, che ti svuota?",["Sì. Occupano tutto","Troppo spazio, ogni settimana","Ci sono, si tengono","Poco. Lo tengo a bada","Quasi niente"]),
  Q("cura","relazioni","C'è almeno una persona che sa come stai, di questi tempi?",["No. Nessuno lo sa","Qualche volta, se chiedo","Sì, a tratti","Sì, di solito","Sì. Qualcuno c'è, stabile"]),
  Q("schermo","abitudini","Il telefono: quante ore se ne va, senza che tu l'abbia deciso?",["Quattro ore o più, sparite","Un bel po'. Le sere soprattutto","A giorni. Quando sono stanco, sì","Poco","Poco, e lo scelgo io"]),
  Q("routine","abitudini","La giornata ha un inizio e una fine, o parte da sola?",["Parte da sola. Sempre","Qualche volta ho un rito","A tratti","Spesso sì","Sì. Gli stessi gesti, quasi sempre"]),
  Q("promesse","abitudini","Le cose che prometti a te: in un mese, quante ne tieni?",["Quasi nessuna","Poche. Il lunedì sì, il venerdì no","A metà","La maggior parte","Quasi tutte. Mi credo"])
];
const AXES=["salute","soldi","lavoro","relazioni","abitudini"];
const AXIS_LABEL={salute:"Salute",soldi:"Soldi",lavoro:"Lavoro",relazioni:"Relazioni",abitudini:"Abitudini"};
const KIND_TITLE={deriva:"Se lasci andare",inerzia:"Se resti così",miglioramento:"Se cambi un po'"};
const KEY="chronoself.v2";
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const esc=s=>{const d=document.createElement("div"); d.textContent=String(s); return d.innerHTML;};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function save(db){localStorage.setItem(KEY,JSON.stringify(db)); if(window.CS&&CS.user&&CS.push) CS.push();}
const qstr=new URLSearchParams(location.search);
const db=Object.assign({profile:{nome:"",eta:"",contesto:"citta"},answers:Object.fromEntries(QUESTIONS.map(q=>[q.id,50])),picked:{},focusOverride:null,sim:null,history:[],checks:{},journal:[],habits:[],habitLog:{},pro:false,planStart:null,quizI:null}, load());
if(qstr.get("paid")==="1"){db.pro=true; db.planStart=db.planStart||new Date().toISOString(); save(db); history.replaceState(null,"",location.pathname);}
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
function readLife(answers,picked,focusId){
  const d=diagnose(answers,picked,focusId); const play=playFor(d.primary.id);
  const said=echoOf(d.primary.id,d.primary.score);
  const voice=VOICE[d.primary.id];
  const also=d.secondary?echoOf(d.secondary.id,d.secondary.score):null;
  const holds=d.strengths[0]?echoOf(d.strengths[0].id,d.strengths[0].score):null;
  const alts=[d.primary,...d.cluster].filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i).slice(0,4).map(s=>{ const p=playFor(s.id); return {id:s.id,label:p.label,hole:p.hole}; });
  return {d,play,reading:{
    title:d.vague?"Hai lasciato troppe cose in mezzo.":said,
    said:d.vague?"Il resoconto non può inventare una vita che non hai raccontato.":(voice?voice.now:play.why),
    why:d.vague?"Tocca le risposte che senti, e rifai.":play.action,
    also:also&&!d.vague?also:null,
    holds:holds&&!d.vague?holds:null,
    action:play.action,vague:d.vague,alts
  }};
}
function lever(axis){return {salute:PLAY.sonno.action,soldi:PLAY.risparmio.action,lavoro:PLAY.competenza.action,relazioni:PLAY.legami.action,abitudini:PLAY.schermo.action}[axis];}
function leverFor(answers){return playFor(diagnose(answers).primary.id).action;}
function opener(){ return ""; }
function hook(kind,y,said){
  const when=y===1?"un anno":y+" anni";
  if(kind==="deriva") return said+". Dopo "+when+", è ancora così.";
  if(kind==="inerzia") return said+". Dopo "+when+", quasi tutto è uguale.";
  return said+". Dopo "+when+", quella cosa l'hai tenuta.";
}
function story(d,p,y,kind,profile){
  const play=playFor(d.primary.id);
  const said=echoOf(d.primary.id,d.primary.score);
  const body=(VOICE[d.primary.id]||play.futures)[kind];
  const extra=d.secondary?` Accanto resta questo: ${echoOf(d.secondary.id,d.secondary.score).charAt(0).toLowerCase()+echoOf(d.secondary.id,d.secondary.score).slice(1)}.`:(d.strengths[0]?` Intanto tieni ancora: ${echoOf(d.strengths[0].id,d.strengths[0].score).charAt(0).toLowerCase()+echoOf(d.strengths[0].id,d.strengths[0].score).slice(1)}.`:"");
  const later=y>=5?(kind==="deriva"?" Il conto, a questa distanza, si vede.":kind==="miglioramento"?" Gli anni tenuti si vedono. Non serve raccontarli.":" Il tempo è passato comunque."):"";
  return (hook(kind,y,said)+" "+body+extra+later).replace(/\s+/g," ").trim();
}
function facts(p,d,kind){
  const play=playFor(d.primary.id);
  const rows=[[play.label, echoOf(d.primary.id,d.primary.score)]];
  if(d.secondary) rows.push([playFor(d.secondary.id).label, echoOf(d.secondary.id,d.secondary.score)]);
  rows.push(["Tra un anno", kind==="deriva"?"resta così, e pesa":kind==="inerzia"?"resta com'è":"si allenta"]);
  return rows.slice(0,3);
}
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
  return {at:new Date().toISOString(),profile,answers,scores:d.scores,weak:d.weak,focus:d.primary.id,secondary:d.secondary?d.secondary.id:null,horizons};
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
  return next.slice(0,6);
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
try{ const ck=sessionStorage.getItem("cs.clock"); if(ck) clockOverride=parseLocal(ck); }catch(e){}
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
    <span class="hold-copy"><strong>${esc(h.name)}</strong><span>${on?(doneLine||"Tenuto, oggi."):big?(hint||"Tocca quando l'hai fatta."):(st?st+" giorni di fila.":"Ancora no.")}</span></span>
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
function unlockPro(){db.pro=true; db.planStart=db.planStart||new Date().toISOString(); if(db.sim) db.habits=mergeHabits(db.habits,db.sim.answers); save(db);}
window.CS=window.CS||{};
window.CS.applyPayload=function(p){
  if(!p||typeof p!=="object") return;
  ["profile","answers","picked","focusOverride","sim","history","checks","journal","habits","habitLog","pro","planStart","quizI"].forEach(function(k){
    if(k in p) db[k]=p[k];
  });
};
window.CS.applyFounder=function(){
  if(!(window.CS.isFounder&&CS.isFounder())) return;
  const was=!!db.pro;
  unlockPro();
  if(!was && typeof render==="function") render();
};
async function startCheckout(){try{const res=await fetch("/api/create-checkout",{method:"POST"}); const data=await res.json(); if(data.url){location.href=data.url;return;} if(data.preview){unlockPro(); go("oggi"); return;} alert(data.error||"Pagamento non disponibile.");}catch(e){alert("Pagamento non disponibile. Riprova.");}}
function splitStory(t){
  const i=String(t).indexOf(". ");
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
  if(mode==="giorno") return {kicker:"Giorno",line:"Se non l'hai fatta, adesso. Prima che la sera la mangi."};
  if(mode==="sera") return {kicker:"Sera",line:"Due righe, ora. Poi chiudi."};
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
  return `<article class="letter"><p class="dateline">${esc(m.dateline)}</p><p class="kind">${KIND_TITLE[kind]}</p>${m.greet?`<p class="greet">${esc(m.greet)}</p>`:""}<p class="future-open">${esc(parts[0])}</p>${parts[1]?`<p>${esc(parts[1])}</p>`:""}<p class="sign">${esc(m.sign)}</p><ul class="facts">${pack.facts.map(([l,v])=>`<li><span>${l}</span><strong>${v}</strong></li>`).join("")}</ul></article>`;
}
function sealedLetter(y){
  const span=y===1?"un anno":y+" anni";
  return `<article class="letter sealed">${MARK}<p class="meta">Tra ${span}</p><h3>Lettera chiusa</h3><p>Scritta da te, tra ${span}. Tre versioni. Si apre con il Piano 90.</p><div class="row"><button class="cta light" id="pay">Apri le lettere</button></div></article>`;
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
      ${r.also?`<p class="lede">Accanto: ${esc(r.also)}.</p>`:""}
      <div class="weights">
        <p class="meta" style="letter-spacing:0.18em;margin-top:22px">Le risposte che pesano</p>
        ${[d.primary,...d.lows].filter((s,i,arr)=>arr.findIndex(x=>x.id===s.id)===i).slice(0,3).map(row=>`<div class="weight"><span>${esc(playFor(row.id).label)}</span><div class="bar ${tone(row.score)}"><span style="width:${row.score}%"></span></div><span class="num" style="width:auto;max-width:40%;text-align:right;font-size:12px">${esc(echoOf(row.id,row.score))}</span></div>`).join("")}
      </div>
    </div>
    <div class="diag-action">
      <p class="meta">Cosa fare</p>
      <h3>${esc(play.action)}</h3>
      <ul class="ok">${play.habits.map(h=>`<li>${esc(h)}</li>`).join("")}</ul>
      <p>Gratis vedi cosa succede tra un anno. Il Piano 90 è per tenere questa cosa, per 90 giorni.</p>
    </div>
  </section>`;
}
function axisBars(scores){return AXES.map(a=>`<div class="axisbar"><span>${AXIS_LABEL[a]}</span><div class="bar ${tone(scores[a])}"><span style="width:${scores[a]}%"></span></div><span class="num">${scores[a]}</span></div>`).join("");}
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
  if(window.__csClock){ cancelAnimationFrame(window.__csClock); window.__csClock=null; }
  if(v==="account" && window.CS && CS.renderAccount){ state.view="account"; chrome(); CS.renderAccount(); return; }
  if(v==="piano"||v==="diario"||v==="habits"){ v=inPlan()?"oggi":"prezzi"; }
  if((v==="futuri"||v==="oggi"||v==="soglia") && !db.sim){ v="profilo"; }
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
  const keepNote=(document.getElementById("note")||{}).value||"";
  document.onkeydown=null;
  chrome();
  if(state.view==="home"){
    const cta=inPlan()?"Vai a oggi":midQuiz()?`Riprendi (${db.quizI+1}/18)`:db.sim?"Apri i tuoi futuri":"Inizia";
    const axes=["Salute","Soldi","Lavoro","Relazioni","Abitudini"];
    const marquee=[...axes,...axes,...axes,...axes].map(a=>`<span>${a}</span>`).join("");
    app.innerHTML=`<section class="hero-split">
      <div class="hero-copy">
        <h1>Chi diventi<br>se continui così?</h1>
        <p class="hero-lede">Diciotto domande su come stai, davvero. Sonno, soldi, lavoro, persone, abitudini.</p>
        <p class="hero-lede">Da lì tre lettere, scritte da chi sarai: se lasci andare, se resti così, se cambi un po'.</p>
        <p class="hero-lede">Se vorrai, un percorso di novanta giorni, guidato: ogni giorno sai cosa fare.</p>
        <div class="row"><button class="cta" id="start">${cta}</button>${inPlan()?"":`<button class="btn" data-go="prezzi">Piano 90 · 4,99 €</button>`}</div>
      </div>
      <div class="hero-photo">
        <img src="./brand/hero.jpg" alt="Poltrona di lino di fronte a una finestra, luce del mattino" />
        ${clockFace()}
      </div>
    </section>
    <div class="bleed marquee"><div class="marquee-track">${marquee}${marquee}</div></div>
    <section class="grid three" style="padding-top:64px">
      <article class="photo-card"><img src="./brand/notebook.jpg" alt="Taccuino aperto sulla tavola"/><p class="k" style="margin-top:18px">01</p><h3>18 domande</h3><p>Come stai, davvero, in cinque parti della vita. Niente diagnosi, niente guru.</p></article>
      <article class="photo-card"><img src="./brand/loggia.jpg" alt="Loggia mediterranea a tre archi"/><p class="k" style="margin-top:18px">02</p><h3>Tre lettere</h3><p>Da te, tra un anno: se lasci andare, se resti così, se cambi un po'.</p></article>
      <article class="photo-card"><img src="./brand/lever.jpg" alt="Scarpe da corsa accanto alla porta"/><p class="k" style="margin-top:18px">03</p><h3>90 giorni</h3><p>Se vuoi, un percorso guidato. Ogni giorno sai cosa fare.</p></article>
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
      <p class="meta">Tre lettere</p>
      <h2 style="font-size:clamp(28px,4vw,44px);max-width:16ch;margin:12px 0 24px">Stessa vita. Tre direzioni.</h2>
      <div class="grid three" style="padding-top:0">
        <article class="card"><p class="k">01</p><h3>Se lasci andare</h3><p>Il punto debole resta lì. Col tempo pesa di più.</p></article>
        <article class="card"><p class="k">02</p><h3>Se resti così</h3><p>Niente crolla. Niente migliora. Il tempo passa lo stesso.</p></article>
        <article class="card"><p class="k">03</p><h3>Se cambi un po'</h3><p>Una cosa tenuta, a lungo. Basta quello.</p></article>
      </div>
    </section>
    <section class="cta-band">
      <div>
        <p class="meta">Inizia</p>
        <h2>Diciotto minuti. Poi vedi dove stai andando.</h2>
        <p>Gratis vedi i prossimi 12 mesi. Il Piano 90 apre 5 e 10 anni, e il giorno per giorno.</p>
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
  if(state.view==="privacy"){ app.innerHTML=`<main class="step"><p class="meta">Privacy</p><h1 class="q" style="font-size:40px">I dati restano tuoi.</h1><p class="lede">Domande, diario e abitudini stanno sul tuo telefono. I pagamenti passano da Stripe. Non è un medico e non è terapia.</p></main>`; return; }
  if(state.view==="prezzi"){
    app.innerHTML=`<main class="step wide"><p class="meta">Piani</p><h1 class="q" style="font-size:40px">Gratis per vedere. Pago per tenere.</h1><p class="lede">La simulazione è gratis. Il Piano 90 è per chi vuole un'abitudine, un diario, e 90 giorni di seguito.</p>
      <section class="grid three"><article class="card"><p class="meta">Gratis</p><p class="price">0 €</p><h3>La simulazione</h3><ul class="ok"><li>18 domande</li><li>Come stai oggi, in 5 aree</li><li>Tre versioni di te, a 1 anno</li></ul><div class="row"><button class="btn" data-go="profilo">Inizia</button></div></article>
      <article class="card featured"><p class="meta">Piano 90</p><p class="price">4,99 € <span>/ mese</span></p><h3>Il giorno per giorno</h3><ul class="ok"><li>Anche 5 e 10 anni</li><li>Una cosa da tenere, per 90 giorni</li><li>Diario la sera</li><li>Calendario di 90 giorni</li></ul><div class="row"><button class="cta light" id="pay">${inPlan()?"Già attivo — vai a oggi":"Attiva Piano 90"}</button></div></article>
      <article class="card"><img src="./brand/looking.jpg" alt="Persona alla finestra" style="width:100%;height:140px;object-fit:cover;border-radius:16px;margin:-22px -22px 16px;width:calc(100% + 44px);max-width:none"/><p class="meta">Cosa non è</p><h3>Non è terapia</h3><p>Né un medico, né un consulente. È un posto dove tieni una cosa per 90 giorni.</p></article></section></main>`;
    document.getElementById("pay").onclick=()=> inPlan()?go("oggi"):startCheckout();
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="profilo"){
    const p=db.profile;
    const resume=midQuiz() && db.quizI>0;
    app.innerHTML=`<main class="step"><p class="meta">Passo 1 di 2</p><h1 class="q" style="font-size:40px">Prima, chi sei.</h1><p class="lede">Nome ed età servono solo per scrivere i tuoi futuri. Restano sul telefono.</p>
      <label class="field">Nome<input id="nome" value="${esc(p.nome||"")}" /></label>
      <label class="field">Età<input id="eta" type="number" value="${esc(p.eta||"")}" /></label>
      <label class="field">Dove vivi<select id="contesto"><option value="citta">In città</option><option value="paese">In un paese</option><option value="estero">All'estero</option></select></label>
      <div class="row"><button class="cta" id="next">${resume?`Riprendi da ${db.quizI+1} di 18`:"Vai alle domande"}</button>${resume?`<button class="btn" id="restart">Ricomincia</button>`:""}</div></main>`;
    document.getElementById("contesto").value=p.contesto||"citta";
    const saveP=()=>{db.profile={nome:document.getElementById("nome").value.trim(),eta:document.getElementById("eta").value,contesto:document.getElementById("contesto").value};};
    document.getElementById("next").onclick=()=>{saveP(); if(!resume) db.quizI=0; state.i=db.quizI||0; save(db); go("simula");};
    const rst=document.getElementById("restart"); if(rst) rst.onclick=()=>{saveP(); db.quizI=0; state.i=0; save(db); go("simula");};
    return;
  }
  if(state.view==="simula"){
    const q=QUESTIONS[state.i]; const pct=Math.round(((state.i+1)/QUESTIONS.length)*100);
    if(!db.picked) db.picked={};
    const chosen=db.picked[q.id];
    const hasPick=typeof chosen==="number";
    app.innerHTML=`<main class="step"><p class="meta">${state.i+1} / ${QUESTIONS.length} · ${AXIS_LABEL[q.axis]}</p><div class="prog"><span style="width:${pct}%"></span></div>
      <h1 class="q" style="font-size:36px;margin-top:28px">${q.text}</h1>
      ${q.hint?`<p class="lede">${q.hint}</p>`:""}
      <div class="choices">${q.choices.map((c,i)=>`<button type="button" class="choice ${chosen===i?"on":""}" data-pick="${i}">${esc(c)}</button>`).join("")}</div>
      <div class="row"><button class="btn" id="back" ${state.i===0?"disabled":""}>Indietro</button><button class="cta" id="next" ${hasPick?"":"disabled"}>${state.i<QUESTIONS.length-1?"Avanti":"Vedi il punto"}</button></div></main>`;
    app.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>{
      const i=Number(b.dataset.pick);
      db.picked[q.id]=i; db.answers[q.id]=PICK_SCORE[i]; save(db); render();
    });
    document.getElementById("back").onclick=()=>{if(state.i>0){state.i--; db.quizI=state.i; save(db); render();}};
    document.getElementById("next").onclick=()=>{
      if(!hasPick) return;
      if(state.i<QUESTIONS.length-1){state.i++; db.quizI=state.i; save(db); render();return;}
      db.focusOverride=null;
      const sim=simulate(db.answers,db.profile,db.picked,null);
      db.sim=sim; db.quizI=null;
      db.history.unshift({at:sim.at,scores:sim.scores,weak:sim.weak,focus:sim.focus});
      db.history=db.history.slice(0,12);
      db.habits=mergeHabits(db.habits,db.answers);
      save(db); go("soglia");
    };
    document.onkeydown=e=>{ if(state.view!=="simula") return; if(e.key==="Enter"){ e.preventDefault(); document.getElementById("next").click(); } };
    return;
  }
  if(state.view==="soglia"){
    if(!db.sim){go("profilo");return;}
    const {d,play,reading:r}=readLife(db.sim.answers||db.answers,db.picked,db.focusOverride||db.sim.focus);
    const who=(db.sim.profile||db.profile).nome||"Tu";
    const when=new Date().toLocaleDateString("it-IT",{month:"long",year:"numeric"});
    const current=db.focusOverride||d.primary.id;
    const alts=r.alts.length>1?`<p class="meta" style="margin-top:28px">Se non è questo</p><div class="row" style="justify-content:center">${r.alts.map(a=>`<button class="btn ${a.id===current?"on-alt":""}" data-focus="${a.id}">${esc(a.label)}</button>`).join("")}</div>`:"";
    app.innerHTML=`<main class="soglia">${MARK}<p class="meta reveal">${esc(who)} · ${when}</p><h1 class="reveal" style="animation-delay:.2s">${esc(r.title)}</h1><p class="said reveal" style="animation-delay:.35s">${esc(r.said)}</p>${r.also?`<p class="lede reveal">Accanto: ${esc(r.also)}.</p>`:""}<p class="lede reveal" style="animation-delay:.5s">${esc(r.action)}</p>${alts}<div class="row reveal" style="animation-delay:.55s;justify-content:center"><button class="cta" id="enter" data-go="futuri">Leggi chi diventi</button></div></main>`;
    app.querySelectorAll("[data-focus]").forEach(b=>b.onclick=()=>{
      db.focusOverride=b.dataset.focus;
      db.sim=simulate(db.sim.answers||db.answers, db.sim.profile||db.profile, db.picked, db.focusOverride);
      db.habits=mergeHabits(db.habits, db.sim.answers);
      save(db); render();
    });
    const openLetters=()=>go("futuri");
    document.getElementById("enter").onclick=openLetters;
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    document.onkeydown=e=>{ if(e.key==="Enter") openLetters(); };
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
    app.innerHTML=`<main class="step wide"><p class="meta">${esc(who)} · da lavorare: ${esc(play.label)}${inPlan()?" · Piano 90":""}</p>
      <h1 class="q" style="font-size:40px">Come stai, oggi</h1>
      <p class="lede">I numeri escono dalle tue 18 risposte. Poi tre lettere, scritte da te futuro.</p>
      <div class="scores-grid">${radar(s.scores,d.weak)}<div>${axisBars(s.scores)}</div></div>
      ${diagnosisCard(s.answers)}
      <p class="meta" style="margin-top:48px">Tre lettere</p>
      <h2 style="font-size:clamp(28px,4vw,40px);max-width:16ch;margin:12px 0 18px">Stessa vita. Tre direzioni.</h2>
      <div class="tabs">${[1,5,10].map(y=>`<button class="tab ${y===state.h?"on":""}" data-y="${y}">Tra ${y} ann${y===1?"o":"i"}${(!inPlan()&&y>1)?" · chiuse":""}</button>`).join("")}</div>
      ${locked?sealedLetter(state.h): `<div class="cols">${cols}</div>`}
      <div class="row">${inPlan()?`<button class="cta" data-go="oggi">Vai a oggi</button>`:`<button class="cta" data-go="prezzi">Attiva il Piano 90</button>`}<button class="btn" data-go="profilo">Rifai le domande</button></div>
      ${db.history.length>1?`<section style="margin-top:48px"><h2>Storico</h2>${db.history.slice(0,6).map(h=>`<div class="hist"><strong>${new Date(h.at).toLocaleDateString("it-IT")}</strong> · ${esc(h.focus?playFor(h.focus).label:AXIS_LABEL[h.weak])}${axisBars(h.scores)}</div>`).join("")}</section>`:""}
    </main>`;
    app.querySelectorAll("[data-y]").forEach(b=>b.onclick=()=>{state.h=Number(b.dataset.y);render();});
    const pay=document.getElementById("pay"); if(pay) pay.onclick=startCheckout;
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    return;
  }
  if(state.view==="oggi"){
    if(!db.sim){go("profilo");return;}
    if(!inPlan()){ app.innerHTML=paywall("Un'abitudine. Novanta giorni.","Hai letto chi diventi. Ora tieni questa cosa, per 90 giorni. Diario e calendario si aprono qui.",leverFor(db.sim.answers)); document.getElementById("pay").onclick=startCheckout; document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go)); return; }
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
        <h2>${evening?"Ora. Poi chiudi.":"A stasera."}</h2>
        <label class="field"><textarea id="note" rows="4" placeholder="${esc(card?card.evening:pl.prompt)}"></textarea></label>
        <button class="cta" id="saveN">Salva nota</button>
        ${notesToday.length?`<p class="lede">Scritto oggi. Va bene così.</p>${notesToday.map(j=>`<div class="hist"><p>${esc(j.text)}</p></div>`).join("")}`:""}
        ${evening?(tomCard?`<p class="dash-later">Domani: ${esc(tomCard.line)}</p>`:`<p class="dash-later">Il percorso è chiuso. Rifai le 18 domande.</p>`):""}
      </section>`;
    let body="";
    if(state.tab==="percorso"){
      body=`<header class="dash-head">
        <div><p class="meta">Percorso · ${esc(pl.label)}${card?" · "+esc(card.pace):""}</p><h1>Giorno ${day} di 90.</h1>
          <p class="lede">${esc(card?card.line+". ":"")}${held} tenuti · ${lost} persi. I persi non si recuperano. Si continua.</p></div>
        ${yearClock(day)}
      </header>
      ${banner90}
      <section class="phase-now"><p class="meta">Oggi · settimana ${card?card.week:Math.ceil(day/7)} di 12</p><h2>${esc(card?card.title:pl.focus)}</h2><p>${esc(card?card.line:pl.weeks[phase][1])}</p></section>
      <p class="meta" style="margin-top:8px">I 90 giorni</p>
      ${cal90(day,pid,playNow,focusId)}
      <ol class="phase-list">${weeks.map((wk,i)=>`<li class="${(card?card.week:phase+1)===wk.week?"now":""}"><strong>${esc(wk.title)}</strong><span>${esc((wk.span?wk.span+". ":"")+wk.job)}</span></li>`).join("")}</ol>
      <div class="row"><button class="cta" data-go="futuri">Rivedi le lettere</button></div>
      ${(window.CS&&CS.isFounder&&CS.isFounder())?`<p class="dash-later">${clockOverride?`<strong>Prova.</strong> Stai vedendo il giorno ${day}, non il calendario vero. ` : ""}<button class="ghost" id="simMidnight">Simula mezzanotte → giorno ${Math.min(90,day+1)}</button>${clockOverride?` <button class="ghost" id="resetClock">Torna a oggi</button>`:""}</p>`:""}
      <details class="dash-more"><summary>Aggiungi un'altra cosa</summary>
        <div class="row" style="margin-top:12px"><input id="newHabit" maxlength="60" placeholder="Solo se serve davvero"/><button class="btn" id="addH">Aggiungi</button></div>
        ${extra.map(h=>holdBtn(h,false)).join("")}
      </details>`;
    } else if(state.tab==="diario"){
      const hist=(db.journal||[]).slice(0,20).map(j=>`<div class="hist"><p class="meta" style="letter-spacing:0">${new Date(j.at).toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}</p><p>${esc(j.text)}</p></div>`).join("")||`<p class="lede">Nessuna nota ancora. Una sera, due righe.</p>`;
      body=`<header class="dash-head"><div><p class="meta">Diario</p><h1>Due righe. Basta così.</h1><p class="lede">${esc(card?card.evening:pl.prompt)}</p></div></header>
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
      ${primary?holdBtn(primary,true,card?card.holdHint:"","Tenuto. "+fromYou.sign):""}
      ${primary?weekStrip(pid):""}
      <p class="dash-stat">${esc(stats)}</p>
      ${extra.length?`<div class="dash-extra"><p class="meta">Anche questo</p>${extra.map(h=>holdBtn(h,false)).join("")}</div>`:""}
      <section class="phase-now"><p class="meta">Settimana ${card?card.week:Math.ceil(day/7)} di 12${card?" · "+esc(card.pace):""}</p><p>${esc(thisWeek?thisWeek.job:(pl.weeks[phase][1]))}</p></section>
      ${evening||notesToday.length?composer:`<p class="dash-later">A stasera le due righe. Ora conta solo la cosa di oggi.</p>`}
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
    if(saveN) saveN.onclick=()=>{ const text=(document.getElementById("note").value||"").trim(); if(!text) return; const prefix=isSunday&&state.tab==="diario"?(cadence==="weekly"?(w?"Settimana: sì. ":"Settimana: no. "):`Settimana: ${w}/7. `):""; db.journal.unshift({at:new Date().toISOString(),text:prefix+text}); db.journal=db.journal.slice(0,60); save(db); render(); };
    const addH=document.getElementById("addH");
    if(addH) addH.onclick=()=>{ const name=(document.getElementById("newHabit").value||"").trim(); if(!name) return; if(db.habits.length>=6) return alert("Massimo 6 cose."); db.habits.push({id:"h"+Date.now(),name}); save(db); render(); };
    const simM=document.getElementById("simMidnight");
    if(simM) simM.onclick=()=>{ setClockKey(addLocalDays(localKey(),1)); lastSeenKey=localKey(); render(); };
    const rst=document.getElementById("resetClock");
    if(rst) rst.onclick=()=>{ setClockKey(null); lastSeenKey=localKey(); render(); };
    document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
    if(keepNote){ const n=document.getElementById("note"); if(n) n.value=keepNote; }
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

