/* The experience layer reads existing answers; it never grants access or changes scores. */
(function () {
  'use strict';
  const app = document.getElementById('app');
  function atmosphere() {
    const h = new Date().getHours();
    document.documentElement.dataset.hour = h < 6 || h >= 21 ? 'notte' : h < 11 ? 'mattina' : h < 17 ? 'giorno' : 'sera';
  }
  function scrollState() { document.getElementById('nav').classList.toggle('is-scrolled', window.scrollY > 16); }
  function element(tag, cls, text) {
    const el = document.createElement(tag); el.className = cls;
    if (text) el.textContent = text;
    return el;
  }
  async function share(button) {
    const data = {title: 'ChronoSelf', text: 'Chi diventi se continui così?', url: location.origin + '/'};
    try {
      if (navigator.share) { await navigator.share(data); return; }
    } catch (error) { if (error.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(data.url); button.textContent = 'Link copiato'; }
    catch {
      const field = element('input', 'share-link'); field.value = data.url; field.readOnly = true;
      field.setAttribute('aria-label', 'Link pubblico di ChronoSelf da copiare');
      button.after(field); field.select();
      button.textContent = 'Copia il link qui sotto';
    }
  }
  function enhance() {
    document.body.dataset.view = state.view;
    const hero = app.querySelector('.hero-copy');
    if (hero && !hero.querySelector('.experience-label')) {
      hero.prepend(element('p', 'meta experience-label', '18 domande / 3 futuri / 90 giorni'));
      const timeline = element('ol', 'time-line'); timeline.setAttribute('aria-label', 'Gli orizzonti di ChronoSelf');
      ['Adesso', '+1 anno', '+5 anni', '+10 anni'].forEach(label => timeline.append(element('li', '', label)));
      hero.append(timeline); hero.append(element('p','trust-line','Quiz e risultati a un anno gratuiti · Nessun account necessario per iniziare'));
    }
    if (state.view === 'simula' && !app.querySelector('.quiz-truth')) {
      app.querySelector('.prog')?.after(element('p', 'quiz-truth', 'Non ci sono risposte giuste o sbagliate. Puoi tornare indietro e modificarle.'));
    }
    const threshold = app.querySelector('.soglia');
    if (threshold && db.sim && !threshold.querySelector('.imprint')) {
      const imprint = element('section', 'imprint');
      imprint.setAttribute('aria-labelledby', 'imprint-title');
      const title = element('h2', '', 'Le tue cinque aree, oggi'); title.id = 'imprint-title'; imprint.append(title);
      const values = scoresFrom(db.sim.answers || db.answers);
      AXES.forEach(axis => {
        const row = element('div', 'imprint-row'); row.append(element('span', '', AXIS_LABEL[axis]));
        const bar = element('div', 'bar ' + tone(values[axis]));
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', AXIS_LABEL[axis] + ': ' + (values[axis] >= 70 ? 'un punto di forza' : values[axis] >= 45 ? 'in equilibrio' : 'da curare'));
        const fill = element('span', ''); fill.style.width = values[axis] + '%'; bar.append(fill); row.append(bar); imprint.append(row);
      });
      threshold.querySelector('#enter').parentElement.before(imprint);
    }
    if (state.view === 'futuri' && !app.querySelector('.future-intro')) {
      const title = app.querySelector('h1');
      title?.after(element('p', 'lede future-intro', 'Sono scenari di riflessione basati sulle tue risposte, non previsioni né una diagnosi.'));
      app.querySelectorAll('.cols .letter').forEach((letter, i) => {
        letter.prepend(element('span', 'letter-number', String(i + 1).padStart(2, '0')));
        letter.tabIndex = 0;
        letter.setAttribute('aria-label', ['Se riduci la cura', 'Se mantieni le abitudini', 'Se introduci un cambiamento'][i]);
      });
      const cols = app.querySelector('.cols');
      if (cols) { cols.setAttribute('aria-label', 'Le tre traiettorie. Scorri per leggerle.'); cols.before(element('p', 'swipe-hint', 'Scorri per leggere tutti e tre gli scenari →')); }
      const row = element('div', 'row share-row');
      const button = element('button', 'btn', 'Condividi ChronoSelf'); button.type = 'button';
      button.onclick = () => share(button); row.append(button); app.querySelector('main')?.append(row);
    }
    const pills = app.querySelector('.oggi-pills');
    if (pills && !app.querySelector('.plan-date')) {
      pills.setAttribute('aria-label', 'Il tuo Piano 90');
      const date = new Date().toLocaleDateString('it-IT', {weekday: 'long', day: 'numeric', month: 'long'});
      pills.after(element('p', 'meta plan-date', 'Giorno ' + dayN() + ' · ' + date));
      pills.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', b.classList.contains('on') ? 'page' : 'false'));
    }

    if(state.view==='simula'){
      const exit=element('button','ghost quiz-exit','Salva e continua più tardi');exit.onclick=()=>go('home');app.querySelector('main').append(exit);
    }
    if(threshold && !threshold.querySelector('.result-method')){
      const box=element('section','result-method');
      box.innerHTML='<h2>Come leggere questo risultato</h2><p>Ogni area riassume le tue risposte su una scala orientativa. La priorità proposta parte dalle risposte più basse; puoi cambiarla. Una risposta intermedia è una risposta valida.</p><p>Questa lettura non misura il tuo valore, non è un test clinico e non stima probabilità future.</p>';
      const d=diagnose(db.sim.answers); const strong=d.strengths.map(x=>playFor(x.id).label);
      if(strong.length)box.append(element('p','', 'Risorse da valorizzare: '+strong.join(', ')+'.'));
      threshold.querySelector('#enter').parentElement.before(box);
    }
    if(state.view==='home'&&!app.querySelector('.faq')){
      const faq=element('section','faq');faq.innerHTML='<h2>Prima di cominciare</h2><details><summary>Che cosa ottengo dalle 18 domande?</summary><p>Una lettura di benessere, finanze, lavoro e studio, relazioni e abitudini. Puoi scegliere una priorità ed esplorare tre scenari a un anno.</p></details><details><summary>Il risultato è una previsione?</summary><p>No. È uno strumento di riflessione basato sulle risposte che dai oggi. Non offre diagnosi, valutazioni cliniche o garanzie sul futuro.</p></details><details><summary>Che cosa comprende il Piano 90?</summary><p>Un percorso di 90 giorni in 13 settimane, azioni adattabili, registrazione delle abitudini, diario e scenari a cinque e dieci anni. L’abbonamento costa 4,99 € al mese e si rinnova fino alla disdetta dal tuo account.</p></details><details><summary>Dove vengono salvate le mie risposte?</summary><p>Su questo browser. Con un account vengono sincronizzate con Supabase. I pagamenti sono gestiti da Stripe. Puoi esportare una copia dei tuoi dati dall’account.</p></details>';app.append(faq);
    }
    app.querySelectorAll('[data-go]').forEach(el=>{if(el.tagName!=='BUTTON'){el.tabIndex=0;el.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go(el.dataset.go);}}}});
    document.querySelectorAll('.nav [data-go],.dock [data-go]').forEach(el=>{if(el.dataset.go===state.view)el.setAttribute('aria-current','page');});
    scrollState();
  }
  let lastView=state.view;
  function routeFocus(){
    if(state.view!==lastView){const heading=app.querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}lastView=state.view;}
  }
  const originalGo=go;
  go=function(view){originalGo(view);const hash='#'+state.view;if(location.hash!==hash)history.pushState({view:state.view},'',hash);routeFocus();};
  window.addEventListener('popstate',()=>{const view=location.hash.slice(1);if(['home','profilo','simula','soglia','futuri','oggi','prezzi','privacy','account'].includes(view)){if(view==='simula')state.i=db.quizI||0;originalGo(view);routeFocus();}else originalGo('home');});
  CS.ready.then(()=>{const view=location.hash.slice(1);if(!CS.recovery && ['home','profilo','futuri','oggi','prezzi','privacy','account'].includes(view))originalGo(view);});
  const renderBase = render;
  render = function () { renderBase(); enhance(); };
  const accountBase = CS.renderAccount;
  CS.renderAccount = function () { accountBase(); enhance(); };
  atmosphere(); enhance();
  window.addEventListener('scroll', scrollState, {passive: true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) atmosphere(); });
  setInterval(atmosphere, 60000);
})();
