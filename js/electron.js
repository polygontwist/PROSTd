// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var AppBridge=function(){
	//system (loadDataAPP)<->elektron 
	this.DataIO=function(url, auswertfunc,getorpost,daten){
		console.log("load",globaldata.user,url,getorpost,daten);
		var data={};
		if(url=="getoptionen"){//Optionen laden
			data={
				"dat":{"tabaktiv":0,"showscramblebutt":false},
				"status":"OK"
			}
			auswertfunc(JSON.stringify(data));
		}
		else
		if(url=="projektliste"){//Liste der Projekte als Dateinamen + Dateiänerungsdatum
			data={"user":"lokal",
				"lastaction":"",
				"status":"OK",
				"dat":[]			//"name":"","dat":"" //Dateiname, Dateiänderungsdatum
				//"name":"test","dat":"2017-12-11 11:11:11"		

			}
			auswertfunc(JSON.stringify(data));
		}
		else
		if(url=="setoptionen"){//Optionen speichern
			data={"user":"lokal",
				"lastaction":"",
				"status":"OK"
			}
			auswertfunc(JSON.stringify(data));
		}
		else
		if(url=="maindata"){//alive
			data={"user":"lokal",
			"dat":"maindata",
			"lastaction":"maindata",
			"status":"OK"
			};
			auswertfunc(JSON.stringify(data));
		}
		else
		if(url=="projektdata"){
			var filename=daten.split("=")[1];
			data={"user":"lokal",
			"dat":"",
			"dateiname":filename,
			"lastaction":"maindata",
			"status":"OK"
			};//direkt Dateiinhalt oder dieses mit Status ERROR...
			
			data={
				"id":filename,
				"titel":"Testprojekt",
				"isnew":true,
				"info":{
					"isended":false,
					"auftraggeber":"",
					"projektleiter":"",
					"startdatum":"",
					"enddatum":"",
					"status":"",
					"projektart":[],
					"gruppe":[]
				},
			"stunden":[]
			};
			
			auswertfunc(JSON.stringify(data));
		}
		else
		if(url=="newprojekt"){// POST newdata=test
			var filename=daten.split("=")[1];
			data={"user":"lokal",
			"dat":"",
			"dateiname":filename,
			"lastaction":"maindata",
			"status":"OK"
			};			
			auswertfunc(JSON.stringify(data));
		}
		//"projektstundenlisteupdate"
		//"projekttitelupdate"
		//"projektinfoupdate"
		
		else
			alert("load\n"+globaldata.user+'\n'+url+'\n'+getorpost+'\n'+daten);
	}
}

window.addEventListener('load', function (event) {
		//console.log(">>",globaldata);
	});