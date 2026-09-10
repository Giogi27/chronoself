/* V4: contenuti espliciti e adattabili. Gli ID storici restano invariati. */
const PLAY = {
  "sonno": {
    "label": "Sonno",
    "hole": "il riposo",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Scegli un orario realistico per iniziare a prepararti al riposo.",
    "habits": [
      "Preparare il riposo a un orario scelto"
    ],
    "prompt": "Quale dettaglio ha aiutato o ostacolato il tuo riposo?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Le serate potrebbero riempirsi di impegni, lasciando sempre meno spazio per prepararti al riposo.",
      "inerzia": "Il riposo potrebbe restare legato agli imprevisti della giornata, con notti più semplici e altre più faticose.",
      "miglioramento": "Un momento riconoscibile per rallentare potrebbe aiutarti a proteggere il tempo dedicato al riposo."
    }
  },
  "movimento": {
    "label": "Movimento",
    "hole": "il movimento",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Dedica dieci minuti a un movimento adatto alle tue possibilità.",
    "habits": [
      "Dieci minuti di movimento adatto a me"
    ],
    "prompt": "Come ti sei sentito prima e dopo il movimento?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Il movimento potrebbe trovare sempre meno posto tra i tuoi impegni quotidiani.",
      "inerzia": "Potresti continuare a muoverti quando si presenta l’occasione, senza un ritmo su cui fare affidamento.",
      "miglioramento": "Un appuntamento breve e adatto alle tue possibilità potrebbe diventare una parte naturale della settimana."
    }
  },
  "energia": {
    "label": "Energia",
    "hole": "la tua energia",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Osserva in quale momento della giornata hai più energia e programma una pausa.",
    "habits": [
      "Fare una pausa consapevole"
    ],
    "prompt": "Quando avevi più energia e cosa stavi facendo?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Potresti accorgerti della stanchezza soltanto quando hai già riempito tutta la giornata.",
      "inerzia": "L’energia potrebbe continuare a variare, mentre gli impegni restano distribuiti nello stesso modo.",
      "miglioramento": "Conoscere meglio i tuoi ritmi potrebbe aiutarti a distribuire gli impegni e a prevedere qualche pausa."
    }
  },
  "cibo": {
    "label": "Pasti",
    "hole": "la regolarità dei pasti",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Prepara in anticipo ciò che serve per un pasto adatto alle tue esigenze.",
    "habits": [
      "Organizzare un pasto della giornata"
    ],
    "prompt": "Che cosa ti ha aiutato a dedicare tempo al pasto?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "I pasti potrebbero finire sempre più spesso tra una cosa e l’altra, senza il tempo che vorresti dedicargli.",
      "inerzia": "Potresti alternare giornate organizzate e giornate in cui decidi tutto all’ultimo momento.",
      "miglioramento": "Preparare un piccolo dettaglio in anticipo potrebbe rendere i pasti più facili da inserire nella giornata."
    }
  },
  "risparmio": {
    "label": "Risparmio",
    "hole": "il risparmio",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Controlla entrate e spese prima di scegliere se e quanto puoi accantonare.",
    "habits": [
      "Rivedere il margine del mio bilancio"
    ],
    "prompt": "C’è un margine sostenibile o serve prima ridurre una difficoltà?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Senza un momento per rivedere il bilancio, potresti accorgerti tardi di un margine che si riduce.",
      "inerzia": "La possibilità di risparmiare potrebbe continuare a dipendere da quello che resta a fine mese.",
      "miglioramento": "Un controllo regolare del bilancio potrebbe aiutarti a distinguere un margine reale da un obiettivo troppo impegnativo."
    }
  },
  "debiti": {
    "label": "Spese fisse",
    "hole": "il peso delle spese fisse",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Elenca importi e scadenze delle spese fisse per avere un quadro chiaro.",
    "habits": [
      "Rivedere spese fisse e scadenze"
    ],
    "prompt": "Quale scadenza richiede attenzione o un confronto con qualcuno?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Le scadenze potrebbero accumularsi nella tua attenzione, rendendo più difficile capire quale affrontare per prima.",
      "inerzia": "Potresti continuare a gestire le spese fisse una alla volta, con lo stesso margine che descrivi oggi.",
      "miglioramento": "Un elenco aggiornato potrebbe rendere più chiaro quando intervenire e quando chiedere un confronto qualificato."
    }
  },
  "cuscinetto": {
    "label": "Riserva",
    "hole": "la riserva per gli imprevisti",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Stima le spese essenziali e le risorse disponibili per un imprevisto.",
    "habits": [
      "Aggiornare il quadro delle risorse disponibili"
    ],
    "prompt": "Quale imprevisto vorresti riuscire a gestire con più tranquillità?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Un imprevisto potrebbe trovarti senza un quadro aggiornato delle risorse a cui puoi accedere.",
      "inerzia": "La gestione degli imprevisti potrebbe restare legata alle risorse attuali e alle decisioni del momento.",
      "miglioramento": "Conoscere spese essenziali e risorse disponibili potrebbe aiutarti a preparare un piano più realistico per gli imprevisti."
    }
  },
  "spese": {
    "label": "Consapevolezza delle spese",
    "hole": "la conoscenza delle tue spese",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Dedica cinque minuti a registrare e raggruppare le spese recenti.",
    "habits": [
      "Annotare le spese della giornata"
    ],
    "prompt": "Quale spesa ti ha sorpreso e perché?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Le piccole uscite potrebbero diventare meno visibili, rendendo il totale del mese più difficile da spiegare.",
      "inerzia": "Potresti continuare a conoscere alcune spese e a ricostruire le altre soltanto a fine mese.",
      "miglioramento": "Una registrazione semplice potrebbe aiutarti a riconoscere le categorie su cui hai davvero margine di scelta."
    }
  },
  "competenza": {
    "label": "Apprendimento",
    "hole": "il tempo per imparare",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Scegli una competenza utile e dedica venti minuti alla sua pratica.",
    "habits": [
      "Venti minuti su una competenza scelta"
    ],
    "prompt": "Che cosa sai fare o capire meglio dopo questa prova?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Imparare potrebbe restare sempre in fondo alla lista, anche quando ne senti il bisogno.",
      "inerzia": "Potresti continuare a raccogliere spunti senza trovare un momento stabile per metterli in pratica.",
      "miglioramento": "Una pratica breve e ripetuta potrebbe lasciarti esempi concreti di ciò che stai imparando."
    }
  },
  "autonomia": {
    "label": "Autonomia",
    "hole": "la tua autonomia",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Individua una decisione piccola su cui hai margine e prova a prenderla.",
    "habits": [
      "Fare un passo in una decisione che posso gestire"
    ],
    "prompt": "Che cosa dipendeva da te e che cosa richiede un accordo?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Potresti lasciare inesplorate anche alcune decisioni sulle quali avresti un piccolo margine.",
      "inerzia": "Potresti continuare a organizzarti entro gli stessi vincoli, senza distinguere quelli modificabili dagli altri.",
      "miglioramento": "Provare una decisione alla volta potrebbe aiutarti a riconoscere il tuo margine e gli accordi di cui hai bisogno."
    }
  },
  "senso": {
    "label": "Direzione",
    "hole": "il significato delle tue attività",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Ritaglia venti minuti per un’attività coerente con qualcosa che per te conta.",
    "habits": [
      "Dedicare tempo a un’attività significativa"
    ],
    "prompt": "Che cosa ha reso significativa questa attività?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Le attività importanti per te potrebbero trovare sempre meno spazio accanto a quelle urgenti.",
      "inerzia": "Potresti continuare ad alternare momenti significativi e attività che senti lontane dalle tue priorità.",
      "miglioramento": "Ritagliare uno spazio per ciò che conta potrebbe rendere più visibile il legame fra le tue giornate e le tue priorità."
    }
  },
  "retepro": {
    "label": "Confronto professionale",
    "hole": "il confronto su lavoro o studio",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Contatta una persona con una domanda concreta su lavoro o studio.",
    "habits": [
      "Cercare un confronto utile su lavoro o studio"
    ],
    "prompt": "Quale domanda o punto di vista ti è stato utile?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Le domande su lavoro o studio potrebbero restare senza confronto più a lungo di quanto vorresti.",
      "inerzia": "Potresti continuare a cercare un parere solo quando una decisione diventa urgente.",
      "miglioramento": "Qualche contatto coltivato nel tempo potrebbe offrirti più occasioni per confrontare idee e difficoltà."
    }
  },
  "legami": {
    "label": "Legami",
    "hole": "il tempo per i tuoi legami",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Proponi a una persona importante un momento per sentirvi o vedervi.",
    "habits": [
      "Dedicare un momento a una persona importante"
    ],
    "prompt": "Ti sei sentito presente durante questo incontro o conversazione?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "I contatti importanti potrebbero essere rimandati più spesso, anche senza volerlo.",
      "inerzia": "Potresti continuare a sentirvi quando gli impegni lo permettono, con lo stesso ritmo di oggi.",
      "miglioramento": "Un momento concordato potrebbe rendere più facile esserci e dare continuità a un legame importante."
    }
  },
  "conflitti": {
    "label": "Confini",
    "hole": "le tensioni nelle relazioni",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Riconosci una situazione faticosa e scegli un confine che puoi esprimere in sicurezza.",
    "habits": [
      "Riconoscere e rispettare un mio limite"
    ],
    "prompt": "Quale limite ti aiuterebbe a proteggere le tue energie?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Le situazioni faticose potrebbero continuare a occupare spazio senza che i tuoi limiti siano espressi.",
      "inerzia": "Potresti ritrovarti nelle stesse tensioni, usando le strategie con cui le gestisci oggi.",
      "miglioramento": "Riconoscere ed esprimere un limite in sicurezza potrebbe aiutarti a capire quali relazioni e supporti ti fanno bene."
    }
  },
  "cura": {
    "label": "Supporto",
    "hole": "il supporto nelle relazioni",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Se ti senti a tuo agio, condividi come stai con una persona affidabile.",
    "habits": [
      "Condividere un pensiero con una persona fidata"
    ],
    "prompt": "Come ti sei sentito nel chiedere o ricevere ascolto?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Potresti tenere per te pensieri che avresti voluto condividere con qualcuno.",
      "inerzia": "Potresti continuare ad aprirti solo in alcune occasioni, con il supporto che senti disponibile oggi.",
      "miglioramento": "Una conversazione sincera, quando te la senti, potrebbe aprire più spazio all’ascolto reciproco."
    }
  },
  "schermo": {
    "label": "Tempo digitale",
    "hole": "l’uso del telefono",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Scegli un momento di dieci minuti senza telefono, compatibile con i tuoi impegni.",
    "habits": [
      "Dieci minuti senza telefono"
    ],
    "prompt": "Che cosa hai fatto o notato in questo tempo libero dallo schermo?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Il telefono potrebbe riempire automaticamente anche le pause che vorresti usare in un altro modo.",
      "inerzia": "Potresti continuare ad alternare momenti scelti e tempo sullo schermo che supera le tue intenzioni.",
      "miglioramento": "Una piccola pausa senza telefono potrebbe aiutarti a distinguere l’uso che scegli da quello automatico."
    }
  },
  "routine": {
    "label": "Routine",
    "hole": "la struttura della giornata",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Scegli due gesti semplici da ripetere al mattino o alla sera.",
    "habits": [
      "Ripetere i due gesti della mia routine"
    ],
    "prompt": "Quale gesto è stato più facile ripetere?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "L’inizio o la fine della giornata potrebbero essere decisi sempre più spesso dagli imprevisti.",
      "inerzia": "Potresti continuare a ripetere alcuni gesti soltanto nelle giornate più semplici.",
      "miglioramento": "Due gesti facili da ripetere potrebbero offrirti un riferimento anche quando la giornata cambia."
    }
  },
  "promesse": {
    "label": "Impegni personali",
    "hole": "gli impegni con te",
    "why": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "action": "Scrivi un piccolo impegno realizzabile entro questa settimana.",
    "habits": [
      "Completare il mio piccolo impegno settimanale"
    ],
    "prompt": "L’impegno era realistico? Che cosa cambieresti la prossima volta?",
    "weeks": [
      [
        "Giorni 1–14",
        "Scegli quando agire e prova una versione semplice."
      ],
      [
        "Giorni 15–28",
        "Osserva gli ostacoli e adatta l’impegno."
      ],
      [
        "Giorni 29–56",
        "Consolida il ritmo che funziona per te."
      ],
      [
        "Giorni 57–90",
        "Rivedi i progressi e scegli come proseguire."
      ]
    ],
    "futures": {
      "deriva": "Gli impegni con te potrebbero restare vaghi o troppo grandi per il tempo disponibile.",
      "inerzia": "Potresti continuare a rispettare alcuni impegni e rimandarne altri, senza capire bene la differenza.",
      "miglioramento": "Un impegno piccolo e verificabile potrebbe aiutarti a scoprire quali condizioni rendono più facile mantenerlo."
    }
  }
};
const ACTIONABLE = ["sonno", "movimento", "energia", "cibo", "risparmio", "debiti", "cuscinetto", "spese", "competenza", "autonomia", "senso", "retepro", "legami", "conflitti", "cura", "schermo", "routine", "promesse"];
function playFor(id){return PLAY[id] || PLAY.sonno;}
const VOICE = {
  "sonno": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Le serate potrebbero riempirsi di impegni, lasciando sempre meno spazio per prepararti al riposo.",
    "inerzia": "Il riposo potrebbe restare legato agli imprevisti della giornata, con notti più semplici e altre più faticose.",
    "miglioramento": "Un momento riconoscibile per rallentare potrebbe aiutarti a proteggere il tempo dedicato al riposo."
  },
  "movimento": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Il movimento potrebbe trovare sempre meno posto tra i tuoi impegni quotidiani.",
    "inerzia": "Potresti continuare a muoverti quando si presenta l’occasione, senza un ritmo su cui fare affidamento.",
    "miglioramento": "Un appuntamento breve e adatto alle tue possibilità potrebbe diventare una parte naturale della settimana."
  },
  "energia": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Potresti accorgerti della stanchezza soltanto quando hai già riempito tutta la giornata.",
    "inerzia": "L’energia potrebbe continuare a variare, mentre gli impegni restano distribuiti nello stesso modo.",
    "miglioramento": "Conoscere meglio i tuoi ritmi potrebbe aiutarti a distribuire gli impegni e a prevedere qualche pausa."
  },
  "cibo": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "I pasti potrebbero finire sempre più spesso tra una cosa e l’altra, senza il tempo che vorresti dedicargli.",
    "inerzia": "Potresti alternare giornate organizzate e giornate in cui decidi tutto all’ultimo momento.",
    "miglioramento": "Preparare un piccolo dettaglio in anticipo potrebbe rendere i pasti più facili da inserire nella giornata."
  },
  "risparmio": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Senza un momento per rivedere il bilancio, potresti accorgerti tardi di un margine che si riduce.",
    "inerzia": "La possibilità di risparmiare potrebbe continuare a dipendere da quello che resta a fine mese.",
    "miglioramento": "Un controllo regolare del bilancio potrebbe aiutarti a distinguere un margine reale da un obiettivo troppo impegnativo."
  },
  "debiti": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Le scadenze potrebbero accumularsi nella tua attenzione, rendendo più difficile capire quale affrontare per prima.",
    "inerzia": "Potresti continuare a gestire le spese fisse una alla volta, con lo stesso margine che descrivi oggi.",
    "miglioramento": "Un elenco aggiornato potrebbe rendere più chiaro quando intervenire e quando chiedere un confronto qualificato."
  },
  "cuscinetto": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Un imprevisto potrebbe trovarti senza un quadro aggiornato delle risorse a cui puoi accedere.",
    "inerzia": "La gestione degli imprevisti potrebbe restare legata alle risorse attuali e alle decisioni del momento.",
    "miglioramento": "Conoscere spese essenziali e risorse disponibili potrebbe aiutarti a preparare un piano più realistico per gli imprevisti."
  },
  "spese": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Le piccole uscite potrebbero diventare meno visibili, rendendo il totale del mese più difficile da spiegare.",
    "inerzia": "Potresti continuare a conoscere alcune spese e a ricostruire le altre soltanto a fine mese.",
    "miglioramento": "Una registrazione semplice potrebbe aiutarti a riconoscere le categorie su cui hai davvero margine di scelta."
  },
  "competenza": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Imparare potrebbe restare sempre in fondo alla lista, anche quando ne senti il bisogno.",
    "inerzia": "Potresti continuare a raccogliere spunti senza trovare un momento stabile per metterli in pratica.",
    "miglioramento": "Una pratica breve e ripetuta potrebbe lasciarti esempi concreti di ciò che stai imparando."
  },
  "autonomia": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Potresti lasciare inesplorate anche alcune decisioni sulle quali avresti un piccolo margine.",
    "inerzia": "Potresti continuare a organizzarti entro gli stessi vincoli, senza distinguere quelli modificabili dagli altri.",
    "miglioramento": "Provare una decisione alla volta potrebbe aiutarti a riconoscere il tuo margine e gli accordi di cui hai bisogno."
  },
  "senso": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Le attività importanti per te potrebbero trovare sempre meno spazio accanto a quelle urgenti.",
    "inerzia": "Potresti continuare ad alternare momenti significativi e attività che senti lontane dalle tue priorità.",
    "miglioramento": "Ritagliare uno spazio per ciò che conta potrebbe rendere più visibile il legame fra le tue giornate e le tue priorità."
  },
  "retepro": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Le domande su lavoro o studio potrebbero restare senza confronto più a lungo di quanto vorresti.",
    "inerzia": "Potresti continuare a cercare un parere solo quando una decisione diventa urgente.",
    "miglioramento": "Qualche contatto coltivato nel tempo potrebbe offrirti più occasioni per confrontare idee e difficoltà."
  },
  "legami": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "I contatti importanti potrebbero essere rimandati più spesso, anche senza volerlo.",
    "inerzia": "Potresti continuare a sentirvi quando gli impegni lo permettono, con lo stesso ritmo di oggi.",
    "miglioramento": "Un momento concordato potrebbe rendere più facile esserci e dare continuità a un legame importante."
  },
  "conflitti": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Le situazioni faticose potrebbero continuare a occupare spazio senza che i tuoi limiti siano espressi.",
    "inerzia": "Potresti ritrovarti nelle stesse tensioni, usando le strategie con cui le gestisci oggi.",
    "miglioramento": "Riconoscere ed esprimere un limite in sicurezza potrebbe aiutarti a capire quali relazioni e supporti ti fanno bene."
  },
  "cura": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Potresti tenere per te pensieri che avresti voluto condividere con qualcuno.",
    "inerzia": "Potresti continuare ad aprirti solo in alcune occasioni, con il supporto che senti disponibile oggi.",
    "miglioramento": "Una conversazione sincera, quando te la senti, potrebbe aprire più spazio all’ascolto reciproco."
  },
  "schermo": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Il telefono potrebbe riempire automaticamente anche le pause che vorresti usare in un altro modo.",
    "inerzia": "Potresti continuare ad alternare momenti scelti e tempo sullo schermo che supera le tue intenzioni.",
    "miglioramento": "Una piccola pausa senza telefono potrebbe aiutarti a distinguere l’uso che scegli da quello automatico."
  },
  "routine": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "L’inizio o la fine della giornata potrebbero essere decisi sempre più spesso dagli imprevisti.",
    "inerzia": "Potresti continuare a ripetere alcuni gesti soltanto nelle giornate più semplici.",
    "miglioramento": "Due gesti facili da ripetere potrebbero offrirti un riferimento anche quando la giornata cambia."
  },
  "promesse": {
    "now": "Questo suggerimento parte dalle tue risposte. Adattalo al tempo, alle risorse e alle possibilità che hai oggi.",
    "deriva": "Gli impegni con te potrebbero restare vaghi o troppo grandi per il tempo disponibile.",
    "inerzia": "Potresti continuare a rispettare alcuni impegni e rimandarne altri, senza capire bene la differenza.",
    "miglioramento": "Un impegno piccolo e verificabile potrebbe aiutarti a scoprire quali condizioni rendono più facile mantenerlo."
  }
};
