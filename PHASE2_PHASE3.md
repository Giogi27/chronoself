# ChronoSelf — Fasi 2 e 3

Implementazione sul branch `codex/chronoself-phase2-phase3`.

## Risultato

Checkout e portale verificano il Bearer token presso Supabase Auth. Le identità inviate dal browser non vengono usate. Le URL di ritorno provengono da SITE_URL. Il webhook verifica HMAC SHA256 e timestamp sul corpo originale, recupera lo stato corrente da Stripe e usa la RPC atomica esistente per eventi ed entitlement. L'endpoint amministrativo è disabilitato senza ADMIN_SECRET.

Nel frontend `db.pro` è una proprietà in sola lettura che deriva dall'entitlement server, esclusa dai salvataggi. Nessuno sblocco da URL, founder o cache. Status ammessi: active/trialing, con periodo futuro oppure scadenza null (coerente con il trigger esistente, per eventuali concessioni amministrative). Gli eventi Stripe attivi senza periodo valido sono invece rifiutati. Il logout rimuove i dati personali locali e invalida le operazioni cloud pendenti.

L'experience layer aggiunge atmosfera per ora locale, timeline, navbar con vetro dopo scroll, quiz tattile, impronta delle cinque aree senza nuovi numeri, lettere numerate e swipe, condivisione del solo link pubblico, navigazione Piano 90 sticky, safe area e reduced motion. Nessun framework o dipendenza backend aggiunto.

## Verifiche completate

- 20 test backend Node: autenticazione, identità verificata, URL di ritorno, prezzo, portale, admin disabilitato, firme mancanti/alterate/scadute, sei tipi di evento, duplicati anche concorrenti, errori RPC, payload fatture recenti e stream Vercel con getter lazy.
- Test browser Playwright/Chrome con servizi isolati: tutte le 18 domande, resoconto, lettere, swipe, login, Piano 90, diario, salvataggio e recupero cloud, errore di recupero senza sovrascrittura cloud, logout, stato active/trialing/scaduto/past_due, ritorno checkout e pulizia URL, Bearer nel portale, share e copia-link.
- Responsive: home e Futuri a 320, 390, 768 e 1440 px; nessun overflow della pagina. Screenshot desktop/mobile ispezionati per home, Futuri, impronta e Piano 90.
- Sintassi di tutti i JavaScript, JSON e riferimenti HTML locali; git diff --check.
- Confronto con HEAD iniziale: 18 domande e logica di simulazione invariate.
- Ricerca repository: nessun residuo dei due marchi precedenti o del vecchio parametro di sblocco; nessuna chiave segreta Stripe trovata. La chiave Supabase nel frontend è anon, non service role.
- Supabase, esclusivamente in lettura: schema e RPC esistenti verificati, RLS di proprietà e trigger controllati; RPC eseguibile da service_role, non da anon/authenticated. Nessuna modifica a schema o dati.

## Configurazione e limiti

Le variabili richieste sono elencate in README.md e .env.example. La loro presenza nel progetto Vercel non è stata verificata. Configurare anche Stripe Customer Portal, i sei eventi webhook e le redirect URL Supabase Auth. Il pagamento reale, la consegna webhook e il login con credenziali reali non sono stati eseguiti: i test di flusso usano fixture isolate, mai dati inseriti nel prodotto.

Gli abbonamenti storici senza user_id nei metadata e senza mapping esistente per subscription_id richiedono riconciliazione amministrativa. Non viene tentata un'associazione per email. Lo stub preesistente api/day7.js rimane invariato e non spedisce email. Non è stata aggiunta una modalità offline con service worker.

La RPC esistente deduplica atomicamente gli eventi; recuperare lo stato corrente Stripe limita gli effetti delle consegne ritardate. La RPC non possiede un ordinamento per versione Stripe: eventi distinti elaborati simultaneamente durante un cambio di stato restano un limite dell'architettura esistente, non modificata in questa attività.

## Inventario completo

### Modificati (12)

- `README.md`
- `admin.html`
- `api/billing-portal.js`
- `api/create-checkout.js`
- `api/ops-subs.js`
- `api/stripe-webhook.js`
- `chronoself-cloud.js`
- `chronoself-day.js`
- `chronoself.js`
- `chronoself.sql`
- `index.html`
- `manifest.json`

### Creati (11)

- `.env.example`
- `.gitignore`
- `PHASE2_PHASE3.md`
- `admin.js`
- `chronoself-experience.css`
- `chronoself-experience.js`
- `lib/billing.js`
- `package.json`
- `tests/billing.test.js`
- `tests/browser.cjs`
- `tests/check.js`

### Eliminati (33)

- `DEPLOY.txt`
- `app.js`
- `bg.jpg.png`
- `chronoself-habits.css`
- `chronoself-habits.js`
- `chronoself-plus.js`
- `dash.css`
- `home.css`
- `i18n-fix.js`
- `i18n-more.js`
- `i18n.js`
- `inbox.js`
- `inbox.sql`
- `legal-note.md`
- `map-hud.css`
- `map-labels.js`
- `map-radar.js`
- `map-skin.js`
- `nofill.js`
- `ops.css`
- `ops.js`
- `prizes.js`
- `pro-perks.js`
- `pro.css`
- `profile.css`
- `race.css`
- `race.js`
- `sala.js`
- `sala.sql`
- `speed.css`
- `stripe-buy.js`
- `style.css`
- `vault.js`
