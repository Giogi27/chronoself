document.getElementById('adminForm').onsubmit = async function (event) {
  event.preventDefault();
  const field = document.getElementById('secret');
  const status = document.getElementById('status');
  const box = document.getElementById('subscriptions');
  const secret = field.value; field.value = ''; box.replaceChildren();
  status.textContent = 'Caricamento…';
  try {
    const response = await fetch('/api/ops-subs', {method: 'POST', headers: {Authorization: 'Bearer ' + secret}});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Servizio non disponibile.');
    status.textContent = data.rows.length ? 'Abbonamenti recenti' : 'Nessun abbonamento.';
    data.rows.forEach(row => {
      const card = document.createElement('article'); card.className = 'card';
      const title = document.createElement('h2'); title.textContent = row.email || row.name || row.id;
      const text = document.createElement('p'); text.textContent = row.status + (row.period_end ? ' · ' + new Date(row.period_end * 1000).toLocaleDateString('it-IT') : '');
      card.append(title, text); box.append(card);
    });
  } catch (error) { status.textContent = error.message; }
};
