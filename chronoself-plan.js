/* Piano dei 90 giorni: ogni giorno un compito, una sola cosa. */
(function (root) {
  const DOW = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  const SETUP = {
    sonno: "Scegli l'ora: entro le 23:30. Sposta il caricatore in un'altra stanza, adesso. Stasera ci vai, anche se non viene sonno.",
    movimento: "Scegli l'ora della camminata e mettila in agenda. Oggi esci anche solo dieci minuti. Domani sono trenta.",
    energia: "Appena fuori dal letto, dieci minuti all'aperto. Caffè dopo le 15, oggi no.",
    cibo: "Un pasto lo decidi tu. Seduto. Il telefono sta in un'altra stanza per quei minuti.",
    risparmio: "Apri (o scegli) un conto a parte. Primo bonifico, anche 20 euro. Da questo stipendio, automatico.",
    debiti: "Un foglio: quanto devi, a chi, quanto al mese. Guardalo fino in fondo. Basta questo.",
    cuscinetto: "Un conto, o una voce, che non è il quotidiano. Primo bonifico, anche piccolo.",
    spese: "Un foglio o una nota. Ogni uscita, anche il caffè. Quattordici giorni, da adesso.",
    competenza: "Scegli UNA cosa da imparare. Due blocchi da 2 ore in agenda, questa settimana. Telefono fuori.",
    autonomia: "Dai un nome al progetto tuo. Due ore in agenda, questa settimana, fuori dall'orario che subisci.",
    senso: "Dieci righe: cosa, di questo lavoro, ha ancora senso. Se la pagina è vuota, scrivi cosa faresti invece.",
    retepro: "Una lista di 8 persone del mestiere. Stasera un messaggio a una. Una domanda vera, non 'un caffè'.",
    legami: "Tre nomi. Questa settimana, uno lo senti. Mettilo in agenda, come un lavoro.",
    conflitti: "Per te, nomina chi o cosa ti svuota. Stasera quella chat resta chiusa.",
    cura: "Una persona. Una frase vera. Mandala, o dilla. Non un saggio.",
    schermo: "Se ti serve la sveglia, comprala o impostala. Alle 22 il telefono va in un'altra stanza. Prepara la presa, adesso.",
    routine: "Scegli mattina o sera. Tre gesti, sempre quelli. Scrivili. Il primo giro è oggi.",
    promesse: "Una promessa così piccola da sembrare stupida. Scrivila dove la vedi. Tienila entro stasera.",
  };
  const WEEK_NAME = [
    "Si prepara",
    "Stesso orario",
    "Si stringe",
    "Diventa orario",
    "Si tiene",
    "Si tiene",
    "Non si negozia",
    "Si tiene",
    "È tuo",
    "È tuo",
    "Si conta",
    "Si chiude",
  ];
  function phaseOf(day) {
    if (day <= 14) return 0;
    if (day <= 28) return 1;
    if (day <= 56) return 2;
    return 3;
  }
  function weekOf(day) {
    return Math.min(12, Math.max(1, Math.ceil(day / 7)));
  }
  function weekSpan(week) {
    const start = (week - 1) * 7 + 1;
    const end = week === 12 ? 90 : week * 7;
    return [start, Math.min(90, end)];
  }
  function weekdayJob(play, dow) {
    const h = play.habits[0];
    if (dow === 1) return "Riparti. Stesso orario. Non «da mercoledì».";
    if (dow === 2) return "Il giorno che di solito si mangia. Fallo prima, non dopo.";
    if (dow === 3) return "Metà settimana. Non rinegoziare. " + play.action;
    if (dow === 4) return "Ancora tre giorni. Solo questa: " + h + ".";
    if (dow === 5) return "La sera tenta di mangiarselo. Fallo prima che esci, o prima del divano.";
    if (dow === 6) return "Oggi non c'è ufficio che scusa. " + h + ", lo stesso.";
    return "Conta la settimana. Poi due righe. Domani si ricomincia.";
  }
  function namedDay(play, id, day) {
    const h = play.habits[0];
    if (day === 1)
      return {
        tag: "Giorno 1 · si prepara",
        title: "Oggi si prepara.",
        line: SETUP[id] || "Togli l'ostacolo. " + play.action,
        evening: "Hai preparato? Una riga.",
        holdHint: "Tocca quando hai preparato.",
      };
    if (day === 2)
      return {
        tag: "Giorno 2 · il primo vero",
        title: h,
        line: "Ieri hai preparato. Oggi lo fai. Una volta.",
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 3)
      return {
        tag: "Giorno 3",
        title: h,
        line: "Il cervello protesta. È normale. Fai comunque.",
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 7)
      return {
        tag: "Giorno 7 · prima settimana",
        title: h,
        line: "Conta quanti ne hai tenuti. Non giudicare. Poi oggi, di nuovo.",
        evening: "Prima settimana. Cosa l'ha resa facile o difficile?",
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 14)
      return {
        tag: "Giorno 14 · si stringe",
        title: h,
        line: "Chiudi le prime due settimane. Da domani: " + play.weeks[1][1],
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 15)
      return {
        tag: "Giorno 15 · fase nuova",
        title: h,
        line: play.weeks[1][1],
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 21)
      return {
        tag: "Giorno 21 · tre settimane",
        title: h,
        line: "Sta diventando orario, non virtù. Stesso gesto, stessa ora.",
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 28)
      return {
        tag: "Giorno 28 · un mese quasi",
        title: h,
        line: "Un mese di prove. Da domani si tiene, senza alzare l'asticella. " + play.weeks[2][1],
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 30)
      return {
        tag: "Giorno 30 · un mese",
        title: h,
        line: "Guarda i quadrati. Poi oggi, di nuovo. I persi restano persi.",
        evening: "Un mese. Due righe su cosa è diventato più facile.",
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 45)
      return {
        tag: "Giorno 45 · a metà",
        title: h,
        line: "A metà. Non recuperare. Non alzare. Tieni.",
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 60)
      return {
        tag: "Giorno 60 · due mesi",
        title: h,
        line: play.weeks[3][1],
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 75)
      return {
        tag: "Giorno 75 · ultime due settimane",
        title: h,
        line: "Non aggiungere niente. I tre gesti, o la stessa ora. Tieni.",
        evening: play.prompt,
        holdHint: "Tocca quando l'hai fatta.",
      };
    if (day === 90)
      return {
        tag: "Giorno 90 · si chiude",
        title: "Novanta giorni.",
        line: "Rifai le 18 domande. Vedi se " + play.hole + " si è mosso.",
        evening: "Novanta. Due righe su chi sei adesso.",
        holdHint: "Tocca se l'hai tenuta anche oggi.",
      };
    return null;
  }
  function dayCard(play, playId, day, date) {
    const n = Math.min(90, Math.max(1, day));
    const week = weekOf(n);
    const phase = phaseOf(n);
    const dow = date.getDay();
    const hold = play.habits[0];
    const named = namedDay(play, playId, n);
    const eveningSunday = dow === 0 ? "Una riga su cosa l'ha resa facile o difficile. Poi chiudi." : play.prompt;
    if (named) {
      return {
        day: n,
        week,
        phase,
        tag: named.tag,
        title: named.title,
        line: named.line,
        evening: dow === 0 && n !== 1 && n !== 90 ? eveningSunday : named.evening,
        hold,
        holdHint: named.holdHint,
      };
    }
    return {
      day: n,
      week,
      phase,
      tag: "Giorno " + n + " di 90 · " + DOW[dow],
      title: hold,
      line: weekdayJob(play, dow),
      evening: eveningSunday,
      hold,
      holdHint: "Tocca quando l'hai fatta.",
    };
  }
  function weeksOfPlan(play) {
    return WEEK_NAME.map(function (label, i) {
      const week = i + 1;
      const span = weekSpan(week);
      const phase = phaseOf(span[0]);
      const job = week === 1 ? "Prepara l'ambiente. Poi il primo vero giorno. Poi la stessa ora." : play.weeks[phase][1];
      return { week, title: "Settimana " + week + " · " + label, span: "Giorni " + span[0] + "–" + span[1], job };
    });
  }
  root.dayCard = dayCard;
  root.weeksOfPlan = weeksOfPlan;
  root.weekOf = weekOf;
  root.phaseOf = phaseOf;
})(typeof window !== "undefined" ? window : globalThis);
