# ChronoSelf V4

18 domande, tre futuri, un Piano 90. HTML, CSS e JavaScript senza framework, con funzioni Node su Vercel.

- Gratis: quiz e lettere a un anno.
- Piano 90: Oggi / Percorso / Diario e orizzonti a cinque e dieci anni.
- Le risposte vengono conservate localmente; un account Supabase permette salvataggio e recupero cloud. Il logout rimuove i dati personali locali.
- L'accesso al piano dipende esclusivamente dall'entitlement letto dal server. Il payload del salvataggio non concede accesso.

## Configurazione Vercel

Impostare le variabili di `.env.example` tramite Vercel, senza commettere valori segreti:

| Variabile | Uso |
| --- | --- |
| `SITE_URL` | Origine HTTPS del sito, per ritorni checkout e portale |
| `SUPABASE_URL` | Progetto Supabase già esistente |
| `SUPABASE_ANON_KEY` | Chiave pubblica del medesimo progetto, per verifica sessione server |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo server: lettura billing e RPC atomica |
| `STRIPE_SECRET_KEY` | Solo server: API Stripe |
| `STRIPE_WEBHOOK_SECRET` | Solo server: verifica HMAC del webhook |
| `STRIPE_PRICE_ID` | Prezzo ricorrente del Piano 90; consigliato. Se assente: 4,99 EUR/mese |
| `ADMIN_SECRET` | Facoltativa: senza di essa `/api/ops-subs` è disabilitato |

Il client Supabase usa una chiave **anon pubblica**, protetta da RLS; non è una service role key. Il client CDN è fissato alla versione 2.116.0. In Supabase Auth aggiungere l'origine usata alle redirect URL consentite (anche per eventuali preview).

In Stripe attivare il Customer Portal e registrare `/api/stripe-webhook` per:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Il webhook verifica i byte originali, con tolleranza timestamp di cinque minuti. Recupera lo stato corrente dell'abbonamento da Stripe e chiama la RPC già presente `apply_chronoself_billing_event`. L'inserimento dell'evento e l'aggiornamento dell'entitlement avvengono nella stessa transazione; i duplicati non vengono riapplicati. Errori di Stripe/DB restituiscono un errore HTTP per consentire i retry.

Non eseguire migrazioni: tabelle, RLS, trigger sui salvataggi e RPC esistono già. `chronoself.sql` è ora solo una nota descrittiva, senza istruzioni che cambiano policy.

Gli abbonamenti preesistenti senza `metadata.user_id` e senza una corrispondenza per `stripe_subscription_id` richiedono riconciliazione amministrativa: il webhook non assegna acquisti basandosi su email arbitrarie.

## Verifiche locali

Node 22 o superiore:

```sh
npm test
npm run check
```

Il test browser richiede Playwright disponibile nell'ambiente e Chromium (oppure `CHROME_PATH`). Non è una dipendenza di produzione:

```sh
npm run test:browser
```

I test browser avviano un server su localhost, simulano Supabase soltanto nel contesto del test e non scrivono nel database reale. Gli screenshot finiscono in `test-results/`, ignorato da Git.

La configurazione PWA comprende manifest e icona; non viene introdotta una cache offline dei dati personali.

`/api/day7` resta lo stub preesistente: non invia email. Non viene dichiarato un servizio email operativo.

## V4 Product Rebuild

La V4 aggiorna tutte le 18 domande (cinque risposte ciascuna), 54 testi di scenario, lettura delle cinque aree, priorità modificabili, Home, prezzi, account e Piano 90. Il calendario contiene 13 settimane: giorni 1–84 e una settimana finale di sei giorni. Gli scenari non sono previsioni o valutazioni cliniche.

I nomi delle tabelle, gli ID delle risposte, la chiave locale `chronoself.v2` e gli endpoint di billing restano compatibili. Nessuna migrazione. I nuovi risultati hanno `version: 4`; quelli precedenti conservano i dati e mostrano un invito a ripetere il questionario aggiornato. Le risposte della simulazione sono una copia: modificare un questionario non altera il risultato precedente.

Il recupero cloud unisce note, storico e abitudini, conserva le registrazioni mancanti e archivia il contenuto locale divergente in `recoveryCopies`, esportabile con i dati. Per valori conflittuali del registro prevale il cloud; la copia recuperabile conserva la versione locale. Le copie sono dati personali e vengono rimosse dal dispositivo al logout insieme al salvataggio. Non vengono eliminate note o voci dello storico in base al loro numero.

L’account include esportazione JSON, recupero password e protezione del logout se il salvataggio fallisce. Le bozze del diario sopravvivono ai cambi di scheda nella stessa sessione. La navigazione supporta URL con frammento e il pulsante Indietro del browser. Il frontend non concede accesso al Piano 90 senza entitlement verificato.

Verifica visiva ed end-to-end: `npm run test:browser`. Le fixture isolano Supabase e i servizi di pagamento; non eseguono acquisti, invii email o modifiche al database reale. I test includono 320, 390, 768 e 1440 px, password recovery, esportazione, errori cloud, conservazione dei dati divergenti, diario, 18 priorità con risposte basse/intermedie/alte e 13 settimane. La verifica sul dominio pubblico va eseguita dopo ogni rilascio.
