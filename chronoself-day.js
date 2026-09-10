/* Calendario dei 90 giorni: giorno locale, mezzanotte, non 24 ore, non UTC. */
(function(){
  if(window.__csDayClock) return;
  window.__csDayClock=true;
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

  function dayNFromKeys(startKey,todayKey){
    const diff=Math.round((parseLocal(todayKey).getTime()-parseLocal(startKey).getTime())/86400000);
    return Math.min(90, Math.max(1, diff+1));
  }

  dayN=function(){
    if(!db.planStart) return 1;
    return dayNFromKeys(localKey(new Date(db.planStart)), localKey());
  };
  today=function(){ return localKey(); };
  daysBack=function(n){ return addLocalDays(localKey(), -n); };
  planDayKey=function(i){ return addLocalDays(localKey(new Date(db.planStart||Date.now())), i); };
  weekKeys=function(){
    const now=nowDate();
    const x=new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const day=x.getDay(); const diff=day===0?-6:1-day;
    x.setDate(x.getDate()+diff);
    return Array.from({length:7},(_,i)=>{ const d=new Date(x); d.setDate(x.getDate()+i); return localKey(d); });
  };
  heldDays=function(id,day){
    let n=0; for(let i=0;i<day;i++){ const k=planDayKey(i); if(db.habitLog[k]&&db.habitLog[k][id]) n++; }
    return n;
  };
  journalOn=function(key){ return (db.journal||[]).filter(j=>localKey(new Date(j.at))===key); };
  dayMode=function(){
    const h=nowDate().getHours();
    if(h>=5&&h<11) return "mattina";
    if(h>=11&&h<18) return "giorno";
    if(h>=18&&h<23) return "sera";
    return "notte";
  };
  yearClock=function(day){
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
  };

  let lastSeenKey=localKey();
  function tickDay(){
    const k=localKey();
    if(k===lastSeenKey) return false;
    lastSeenKey=k;
    if(state && state.view==="oggi") render();
    return true;
  }
  function armDayTick(){
    if(window.__csDayTick) clearTimeout(window.__csDayTick);
    if(clockOverride) return;
    const now=new Date();
    const next=new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 2);
    window.__csDayTick=setTimeout(function(){ tickDay(); armDayTick(); }, Math.max(1000, next-now));
  }
  function onWake(){ if(state && state.view==="oggi") render(); }
  document.addEventListener("visibilitychange", function(){ if(document.visibilityState==="visible") onWake(); });
  window.addEventListener("focus", onWake);
  window.addEventListener("pageshow", onWake);
  if(!window.__csDayPulse) window.__csDayPulse=setInterval(function(){ if(!clockOverride) tickDay(); }, 30000);
  armDayTick();
  document.addEventListener("click", function(e){
    if(!clockOverride) return;
    if(e.target && e.target.closest && e.target.closest("[data-h]")){ e.preventDefault(); e.stopPropagation(); }
  }, true);

  const _render=render;
  function escT(s){
    const d=document.createElement("div");
    d.textContent=String(s);
    return d.innerHTML;
  }
  function applyDayCard(){
    if(!state || state.view!=="oggi" || !db.sim || typeof dayCard!=="function") return;
    const focusId=diagnose(db.sim.answers).primary.id;
    const play=playFor(focusId);
    const day=dayN();
    const card=dayCard(play, focusId, day, nowDate());
    const tab=state.tab||"oggi";
    const head=document.querySelector(".dash-head");
    if(head && (tab==="oggi")){
      const meta=head.querySelector(".meta");
      const h1=head.querySelector("h1");
      const lede=head.querySelector(".lede");
      if(meta) meta.textContent=card.tag;
      if(h1) h1.textContent=card.title;
      if(lede){
        const t=today();
        const pid=db.habits[0]&&db.habits[0].id;
        const on=!!(pid&&db.habitLog[t]&&db.habitLog[t][pid]);
        const yest=daysBack(1);
        const missed=day>1 && pid && !(db.habitLog[yest]&&db.habitLog[yest][pid]);
        lede.textContent=on?"Tenuto.":(missed?"Ieri no. "+card.line:card.line);
      }
    }
    const note=document.getElementById("note");
    if(note && !note.value) note.placeholder=card.evening;
    const phaseNow=document.querySelector(".phase-now");
    const wks=(typeof weeksOfPlan==="function")?weeksOfPlan(play, focusId):null;
    const wk=wks && wks[card.week-1];
    if(phaseNow && tab==="percorso"){
      phaseNow.innerHTML='<p class="meta">Oggi · settimana '+card.week+' di 12 · '+escT(card.pace||"")+"</p><h2>"+escT(card.title)+"</h2><p>"+escT(card.line)+"</p>";
    }
    if(phaseNow && tab==="oggi"){
      phaseNow.innerHTML='<p class="meta">Settimana '+card.week+' di 12 · '+escT(card.pace||"")+"</p><p>"+escT(wk?wk.job:card.line)+"</p>";
    }
    const list=document.querySelector(".phase-list");
    if(list && wks && tab==="percorso"){
      list.innerHTML=wks.map(function(w){
        return '<li class="'+(w.week===card.week?"now":"")+'"><strong>'+escT(w.title)+"</strong><span>"+escT(w.span+". "+w.job)+"</span></li>";
      }).join("");
    }
  }
  render=function(){
    _render();
    armDayTick();
    applyDayCard();

  };

  if(state && state.view==="oggi") render();
})();
