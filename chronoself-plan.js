/* V4: 12 settimane complete e una settimana finale di 6 giorni. */
(function(root){
const CADENCE_OF = {"sonno": "daily", "movimento": "daily", "energia": "daily", "cibo": "daily", "risparmio": "weekly", "debiti": "weekly", "cuscinetto": "weekly", "spese": "daily", "competenza": "weekly", "autonomia": "weekly", "senso": "weekly", "retepro": "weekly", "legami": "weekly", "conflitti": "daily", "cura": "weekly", "schermo": "daily", "routine": "daily", "promesse": "weekly"};
const stages = [
 ['Scegli il primo passo','Scegli un momento e un luogo realistici. Prova l’azione nella sua versione più semplice.'],
 ['Trova il tuo ritmo','Osserva quando riesci a iniziare più facilmente e usa quel momento come riferimento.'],
 ['Riconosci gli ostacoli','Annota un ostacolo ricorrente e modifica un dettaglio per renderlo meno ingombrante.'],
 ['Fai il primo bilancio','Rileggi le note. Mantieni ciò che funziona e riduci ciò che è troppo impegnativo.'],
 ['Rendi facile iniziare','Prepara in anticipo ciò che ti serve. Semplifica il primo minuto dell’azione.'],
 ['Affronta una settimana diversa','Prepara una versione breve per le giornate piene. Anche adattare il piano è un progresso.'],
 ['Osserva a metà percorso','Confronta l’esperienza di oggi con l’inizio. Che cosa è diventato più semplice?'],
 ['Consolida ciò che funziona','Ripeti la versione che riesci a sostenere. Aumentare l’impegno è facoltativo.'],
 ['Cerca un supporto utile','Se può aiutarti, confrontati con una persona fidata su un ostacolo concreto.'],
 ['Lascia spazio agli imprevisti','Scegli come riprendere dopo una pausa. Non occorre recuperare tutto in una volta.'],
 ['Riconosci i cambiamenti','Scrivi un esempio concreto di ciò che è cambiato e di ciò che resta difficile.'],
 ['Prepara il seguito','Decidi quale abitudine vorresti continuare e quale adattamento le serve.'],
 ['Rileggi e scegli','Negli ultimi sei giorni, rileggi il diario e ripeti le 18 domande per un nuovo punto di partenza.']
];
function weekOf(day){return Math.min(13,Math.max(1,Math.ceil(day/7)));}
function phaseOf(day){return day<=14?0:day<=28?1:day<=56?2:3;}
function weeksOfPlan(play,id){return stages.map(([title,job],i)=>({week:i+1,title:`Settimana ${i+1} · ${title}`,span:`Giorni ${i*7+1}–${Math.min(90,(i+1)*7)}`,job:job+' '+play.action}));}
function dayCard(play,id,day,date){
 day=Math.min(90,Math.max(1,day));const week=weekOf(day),cadence=CADENCE_OF[id]||'daily';
 const weekly=cadence==='weekly';
 return {day,week,phase:phaseOf(day),cadence,pace:weekly?'Un’azione a settimana':'Una piccola azione al giorno',hold:play.habits[0],
 tag:`Giorno ${day} di 90 · ${date.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})}`,
 title:day===90?'Il tuo prossimo punto di partenza':day===1?'Comincia da un passo semplice':play.label+': il passo di oggi',
 line:day===90?'Rileggi quello che hai imparato e ripeti le domande. Le note restano nel tuo diario.':play.action,
 evening:play.prompt,holdHint:weekly?'Segna quando hai completato l’azione di questa settimana.':'Segna quando hai completato l’azione di oggi.'};
}
function scoreLine(cadence,w,st,held,day){return cadence==='weekly'?`${w?'Azione registrata questa settimana':'Azione da completare questa settimana'} · ${held} registrazioni nel percorso`:`${w} giorni registrati questa settimana · ${held} nel percorso${st?' · '+st+' consecutivi':''}`;}
function sundayCount(cadence,w){return {title:cadence==='weekly'?(w?'Hai registrato l’azione settimanale.':'Puoi rivedere l’impegno della settimana.'):`Hai registrato ${w} giorni questa settimana.`,line:'Che cosa ha funzionato? Che cosa vorresti rendere più semplice?'};}
function jobLede(cadence,on,w,missed,line){return on?'Hai registrato l’azione di oggi. Puoi aggiungere una riflessione nel diario.':cadence==='weekly'&&w?'Azione settimanale registrata. Usa il tempo per osservare come sta andando.':line;}
Object.assign(root,{CADENCE_OF,CURRICULUM_IDS:Object.keys(CADENCE_OF),weekOf,phaseOf,weeksOfPlan,dayCard,scoreLine,sundayCount,jobLede,lineForDay:(p,id,d,date)=>dayCard(p,id,d,date).line,weekJob:(p,id,w)=>weeksOfPlan(p,id)[Math.min(12,Math.max(0,w-1))].job});
})(typeof window!=='undefined'?window:globalThis);
