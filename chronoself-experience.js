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
      hero.append(timeline);
    }
    if (state.view === 'simula' && !app.querySelector('.quiz-truth')) {
      app.querySelector('.prog')?.after(element('p', 'quiz-truth', 'Non scegliere la risposta migliore. Scegli quella vera.'));
    }
    const threshold = app.querySelector('.soglia');
    if (threshold && db.sim && !threshold.querySelector('.imprint')) {
      const imprint = element('section', 'imprint');
      imprint.setAttribute('aria-labelledby', 'imprint-title');
      const title = element('h2', '', 'La tua impronta, oggi'); title.id = 'imprint-title'; imprint.append(title);
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
      title?.after(element('p', 'lede future-intro', 'Non sono predizioni. Sono tre traiettorie costruite da ciò che hai detto oggi: lasciare andare, restare uguale, cambiare una cosa.'));
      app.querySelectorAll('.cols .letter').forEach((letter, i) => {
        letter.prepend(element('span', 'letter-number', String(i + 1).padStart(2, '0')));
        letter.tabIndex = 0;
        letter.setAttribute('aria-label', ['Se lasci andare', 'Se resti così', 'Se cambi una cosa'][i]);
      });
      const cols = app.querySelector('.cols');
      if (cols) { cols.setAttribute('aria-label', 'Le tre traiettorie. Scorri per leggerle.'); cols.before(element('p', 'swipe-hint', 'Tre lettere, da attraversare →')); }
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
    scrollState();
  }
  const renderBase = render;
  render = function () { renderBase(); enhance(); };
  const accountBase = CS.renderAccount;
  CS.renderAccount = function () { accountBase(); enhance(); };
  atmosphere(); enhance();
  window.addEventListener('scroll', scrollState, {passive: true});
  document.addEventListener('visibilitychange', () => { if (!document.hidden) atmosphere(); });
  setInterval(atmosphere, 60000);
})();
