var spracheaktiv="DE";
var sprachen=[
	{"language":"DE",
	 "description":"deutsch",
	 "words":{//"id":"wort in Sprache"
		 "loading":"lade daten...",
		 "meinTag":"mein Tag",
		 "meinProj":"meine Projekte",
		 "ueberblick":"Überblick",
		 "einstellungen":"Einstellungen",
		 "projekt":"Projekt",
		 "projekte":"Projekte",
		 "datum":"Datum",
		 "Tag":"Tag",
		 "Monat":"Monat",
		 "letzte12mon":"die letzten 12 Monate",
		 "filterby":"zeige",
		 
		 "Januar":"Januar",
		 "Februar":"Februar",
		 "März":"März",
		 "April":"April",
		 "Mai":"Mai",
		 "Juni":"Juni",
		 "Juli":"Juli",
		 "August":"August",
		 "September":"September",
		 "Oktober":"Oktober",
		 "November":"November",
		 "Dezember":"Dezember",
		 "kurzJanuar":"Jan",
		 "kurzFebruar":"Feb",
		 "kurzMärz":"Mär",
		 "kurzApril":"Apr",
		 "kurzMai":"Mai",
		 "kurzJuni":"Jun",
		 "kurzJuli":"Jul",
		 "kurzAugust":"Aug",
		 "kurzSeptember":"Sep",
		 "kurzOktober":"Okt",
		 "kurzNovember":"Nov",
		 "kurzDezember":"Dez",
		 
		 "Mo":"Mo",
		 "Di":"Di",
		 "Mi":"Mi",
		 "Do":"Do",
		 "Fr":"Fr",
		 "Sa":"Sa",
		 "So":"So",
		 "stdtaggesammt":"h/Tag",
		 "Kommentar":"Kommentar",
		 "worktyp":"Typ",
		 "Stunden":"Stunden",
		 "stundengesammt":"Stunden im Monat: ",
		 "stundengesammt2":" von ",
		 "urlaub":"Urlaub",
		 "aenderungsaved":"Änderung gespeichert.",
		 "selectaday":"Wähle einen Tag!",
		 "selectaprojekt":"Welches Projekt soll eingefügt werden?",
		 "listegeladen":"Liste geladen.",
		 "deleteeintrag":"Eintrag löschen?",
		 "projtitel":"Projekttitel",
		 "Infos":"Infos",
		 
		 "datisended":"Ist Projekt beendet?",
		 "datauftraggeber":"Auftraggeber",
		 "datprojektleiter":"Projektleiter",
		 "datstartdatum":"Startdatum",
		 "datenddatum":"Enddatum",
		 "datstatus":"Status",
		 "datprojektart":"Projektart",
		 "datgruppe":"Gruppe",
		 "dattage":"Tage",
		 "datland":"Land",
		 
		 "datdat":"Datum",
		 "datstunden":"Stunden",
		 "dattyp":"Typ",
		 "datkommentar":"Kommentar",
		 "datuser":"Benutzer",
		 
		 "wahleprojekt":"Wähle das zu bearbeitende Projekt aus!",
		 "buttdel":"löschen",
		 "butt_newProj":"neues Projekt",
		 "butt_viewpreMon":"zeige",
		 "butt_viewnexMon":"zeige",
		 
		 "getnewProName":"Wie soll das neue Projekt heißen?",
		 "mesage_inputnamekurz":"Leider zu kurz, gebe bitte mindestens 3 Zeichen ein!",
		 "mesage_inputnamenoinput":"Ohne Name kann ich kein neues Projekt anlegen."
		 
		 
		}
	},
	{"language":"EN",
	 "description":"english",
	 "words":{
		  "loading":"loading..."
	 }
	}
];


var getWort=function(s){
	var i,spra;
	for(i=0;i<sprachen.length;i++){
		spra=sprachen[i];
		if(spra.language==spracheaktiv){
			if(spra.words[s]!=undefined)
				return spra.words[s];		//gefunden Übersetzung zurückgeben
		}
	}	
	return s; //nicht gefunden, Eingabe zurückgeben
};
