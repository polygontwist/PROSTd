var pro_stunden_app=function(){
	//--var--
	var basis=undefined;
	var tabnav=undefined;
	var statusDlg=undefined;
	var optionsleiste=undefined;
	var scramble=undefined;
	var geladeneprojekte=undefined;

	var loadDataURL="getdata.php";
	
	var tabs=[
		{"id":"tab_editTag" ,"butttitel":"meinTag" ,aktiv:false, d_objekt:undefined}
		,{"id":"tab_editProj","butttitel":"meinProj",aktiv:false, d_objekt:undefined}
		,{"id":"tab_editUeberblick","butttitel":"ueberblick",aktiv:false, d_objekt:undefined}
		//,{"id":"tab_editEinstellungen","butttitel":"einstellungen",aktiv:false, d_objekt:undefined}
	];
	
	//ids siehe Sprache
	var MonatsnameID = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
	var wochentagID=["Mo","Di","Mi","Do","Fr","Sa","So"];
	
	
	var lokalData={//
		//projektlistfilter:undefined,
		tabaktiv:0,
		showscramblebutt:true
	};
	
//TODO:	
//		-Ausertung: Balken aktuelles Jahrgesammtstunden
//				canvas:alle Projekte untereinander?-versch. Farben mit Hint(Projekttiitel)
//		-Monat: scrollTo aktuellen Tag? (filter/tabs 'nach jahr')
//		-Filter Projektlist? ('nach jahr'[ok],'Name','Datum') oder als Icon in Liste
//		-session:"alive"[OK], evtl. mit Projektlistreload ->check letzte Änderung
	
	//--"const"--
	var msg_nouser="404:no user",
		msg_error_FileNotfound="404:notfound",
		msg_error_FileNotwrite="404:notwrite",
		msg_error_FileNotread="404:notread",
		msg_input_noName="noname",
		msg_input_shortName="shortname",
		msg_OK="OK";
	
	//--basic--
	var gE=function(id){if(id=="")return undefined; else return document.getElementById(id);}
	var cE=function(z,e,id,cn){
		var newNode=document.createElement(e);
		if(id!=undefined && id!="")newNode.id=id;
		if(cn!=undefined && cn!="")newNode.className=cn;
		if(z)z.appendChild(newNode);
		return newNode;
	}
	var istClass=function(htmlNode,Classe){
		if(htmlNode!=undefined && htmlNode.className){
			var i,aClass=htmlNode.className.split(' ');
			for(i=0;i<aClass.length;i++){
					if(aClass[i]==Classe)return true;
			}	
		}		
		return false;
	}
	var addClass=function(htmlNode,Classe){	
		var newClass;
		if(htmlNode!=undefined){
			newClass=htmlNode.className;
			if(newClass==undefined || newClass=="")newClass=Classe;
			else
			if(!istClass(htmlNode,Classe))newClass+=' '+Classe;			
			htmlNode.className=newClass;
		}			
	}

	var subClass=function(htmlNode,Classe){
		var aClass,i;
		if(htmlNode!=undefined && htmlNode.className!=undefined){
			aClass=htmlNode.className.split(" ");	
			var newClass="";
			for(i=0;i<aClass.length;i++){
				if(aClass[i]!=Classe){
					if(newClass!="")newClass+=" ";
					newClass+=aClass[i];
					}
			}
			htmlNode.className=newClass;
		}
	}
	var delClass=function(htmlNode){
		if(htmlNode!=undefined) htmlNode.className="";		
	}
	var getClasses=function(htmlNode){return htmlNode.className;}

	var getDataTyp=function(o){//String:'[object Array]' '[object String]'  '[object Number]' '[object Boolean]'
			return Object.prototype.toString.call(o); 
	}
		
	var getMonatstage=function(Monat,Jahr){//Monat 0..11
		var tageimMonat = 31;
		if(Monat != 2) {
			if(Monat == 9 ||
			   Monat == 4 ||
			   Monat == 6 ||
			   Monat == 11) {
				tageimMonat =30;
			} 
			else {
				tageimMonat =31;
			}
		}
		else {
			tageimMonat = (Jahr % 4) == "" && (Jahr % 100) !="" ? 29 : 28;
		}
		//console.log(Monat,Jahr,tageimMonat);
		return tageimMonat;
	}
	
		
	var decodeString=function(s){
		//s=s.split('<').join('%38lt;');
		//s=s.split('>').join('%38gt;');
		if(getDataTyp(s)=='[object String]'){
			s=s.split('&').join('%38');
		}
		return s;
	}
	var encodeString=function(s){
		if(getDataTyp(s)=='[object String]'){
			s=s.split('%38').join('&');
		}
		return s;
	}
	
	var loadData=function(url, auswertfunc,getorpost,daten){
		var loObj=new Object();
		loObj.url=url;    
		try {
			// Mozilla, Opera, Safari sowie Internet Explorer (ab v7)
			loObj.xmlloader = new XMLHttpRequest();
		} 
		catch(e) 
		{
		   try {                        
				 loObj.xmlloader  = new ActiveXObject("Microsoft.XMLHTTP");// MS Internet Explorer (ab v6)
				} 
				catch(e) 
				{
						try {                                
								loObj.xmlloader  = new ActiveXObject("Msxml2.XMLHTTP");// MS Internet Explorer (ab v5)
						} catch(e) {
								loObj.xmlloader  = null;
						}
				}
		}
		
		if(!loObj.xmlloader){
				console.log('XMLHttp nicht möglich.');
			}
			else
			{
			loObj.load=function(url){	
					var loader=loObj.xmlloader;		
					loader.parserfunc=loObj.parseFunc;
					loader.open(getorpost,url,true);
					loader.responseType='text'; //! 
					loader.onreadystatechange = function(){                
						if (loader.readyState == 4) { 
								loader.parserfunc(loader.responseText);
						}
					};
					loader.setRequestHeader('Content-Type', 'text/plain'); //text/xml
					loader.setRequestHeader('Cache-Control', 'no-cache'); 
					if(daten!=undefined){
						loader.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						loader.setRequestHeader("Pragma","no-cache");
						loader.send(daten);
					}
					else{
						loader.send(null);
					}
			}
			loObj.parseFunc = auswertfunc;    
			loObj.load(loadDataURL+"?dat="+url);    
		}
	}
	
	//--allgemeine Func--
	var handleError=function(msg){
		console.log("handleError:",msg);
		switch(msg){
			case msg_input_noName:
					//alert(getWort("mesage_inputname"));
					statusDlg.show("Fehler",getWort("mesage_inputname"));
					break;
			case msg_input_shortName:
					//alert(getWort("mesage_inputnamekurz"));
					statusDlg.show("Fehler",getWort("mesage_inputnamekurz"));
					break;
			
			case msg_error_FileNotfound:
					console.log(msg_error_FileNotfound);
			case msg_nouser: //go to login
					document.location.href="index.php";
					break;
			case msg_error_FileNotwrite: //"404:notwrite";
					//alert(getWort(msg_error_FileNotwrite));
					statusDlg.show("Fehler",getWort(msg_error_FileNotwrite));
					break;
			case msg_error_FileNotread: //"404:notread";
					//alert(getWort(msg_error_FileNotwrite));
					statusDlg.show("Fehler",getWort(msg_error_FileNotread));
					break;
		}		
	}

	
	var o_statusDialog=function(zielnode){
		var dlgbasis=undefined;
		var viewtime=5*1000;//sec
		var timer=undefined;
		var ini=function(){
			dlgbasis=cE(zielnode,"div","statusMSG");
			dlgbasis.addEventListener('click',dlgclose);
			dlgbasis.className="off";
		}
		
		var dlgclose=function(){
			dlgbasis.className="off";
			if(timer!=undefined)clearTimeout(timer);
			timer=undefined;
		}
		
		//---api---
		this.destroy=function(){}
		
		this.show=function(sTitel,sMSG,classe){
			var HTMLNode;
			
			if(dlgbasis==undefined)return;
			if(timer!=undefined)clearTimeout(timer);
			if(sMSG==""){dlgclose();return;}
				
			dlgbasis.innerHTML="";
			dlgbasis.className="";
			if(sTitel!="" && sTitel!=undefined){
				HTMLNode=cE(dlgbasis,"h1");
				HTMLNode.innerHTML=sTitel;
			}
			if(sMSG!=""){
				HTMLNode=cE(dlgbasis,"p");
				HTMLNode.innerHTML=sMSG;
				timer=setTimeout(dlgclose,viewtime);
				if(classe!=undefined)
					dlgbasis.className=classe;
			}else{
				//clear
				dlgbasis.innerHTML="";
			}
		}
		
		ini();
	};
	
	//--API--
	this.ini=function(id){
		var i,e,o;
		basis=gE(id);
		tabnav=gE("tabnav");
		for(i=0;i<tabs.length;i++){
			tabs[i].d_objekt=new createTab(basis,tabnav,tabs[i]);
			tabs[i].d_objekt.ini();
		}
		if(lokalData.showscramblebutt)
			scramble=new scrambleTextNodes(tabnav);	
		optionsleiste=new o_optionsleiste(basis);
		statusDlg=new o_statusDialog(basis);
		geladeneprojekte=new o_ProjektDataIOHandler(basis);

		loadData("getoptionen",parseoptiondata,"GET");
		
		var ses=new sessionaliver();
	}
	
	var parseoptiondata=function(data){
		data=data.split("%7B").join("{");
		data=data.split("%7D").join("}");
		data=data.split("%22").join('"');
		data=JSON.parse(data);
		//check error
		if(data.status!=undefined){
			if(data.status!=msg_OK)
				handleError(data.status);
			else{
				//
				//console.log("<<",data.dat);
				lokalData=data.dat;
				
				if(data.dat.tabaktiv!=undefined && !isNaN(data.dat.tabaktiv) ){
					lokalData.tabaktiv=parseInt(data.dat.tabaktiv);
					setTabaktiv(tabs[lokalData.tabaktiv].id);
				}
				else{
					setTabaktiv(tabs[lokalData.tabaktiv].id);
				}
				
				if(lokalData.showscramblebutt!=undefined)
						scramble.show(lokalData.showscramblebutt);
					else{
						lokalData.showscramblebutt=false;
						scramble.show(false);
						}
			}
		}		
	}

	var sessionaliver=function(){
		var timer;
		var start=function(){
			if(timer!=undefined)clearTimeout(timer);
			timer=setTimeout(timeoutfunc,1000*30);
		};
		var timeoutfunc=function(){
			loadData("maindata",parsedata,"GET");
		};
		var parsedata=function(data){
			if(data==""){
				handleError(msg_nouser);
				return;
			}
			data=JSON.parse(data);
			//check error
			if(data.status!=undefined){
				if(data.status!=msg_OK)
					handleError(data.status);
				else{
					start();
				}
			};		
		};
		start();
	}
	
	
	//--innerfun--
	var getdatumsObj=function(s){//convert "2016-12-23" to Date()
		//tt.mm.yyyy hh:mm:ss || yyyy-mm-tt
		s=s.split(' ');
		var dat,tim;
		var re=new Date();
			re.setMilliseconds(1);
			re.setHours(12);		//default 12, falls Zeitverschiebung...	
			re.setMinutes(0);
			re.setSeconds(0);
			
		if(s.length==2){//tt.mm.yyyy hh:mm:ss 
			dat=s[0].split('.');
			tim=s[1].split(':');
			re.setFullYear(parseInt(dat[2]));
			re.setMonth( parseInt(dat[1])-1);
			re.setDate(parseInt(dat[0]));
			re.setHours(parseInt(tim[0]));		
			re.setMinutes(parseInt(tim[1]));
			re.setSeconds(parseInt(tim[2]));
		}
		else{//yyyy-mm-tt
			dat=s[0].split('-');
			re.setFullYear(parseInt(dat[0]));
			re.setMonth( parseInt(dat[1])-1);
			re.setDate(parseInt(dat[2]));
		}
		return re;
	}
		
	var setTabaktiv=function(id){
		var i,tab;
		for(i=0;i<tabs.length;i++){
			tab=tabs[i];
			tab.d_objekt.aktiv(tab.id==id);
			if(tab.id==id)lokalData.tabaktiv=i;
		}
		var sdata="id="				+globaldata.user
				+"&data="+JSON.stringify(lokalData);
//console.log(sdata,lokalData);
		loadData("setoptionen",parseSEToptiondata,"POST",encodeURI(sdata));//befehl="projektstundenlisteupdate"
	}
	var parseSEToptiondata=function(data){
		data=JSON.parse(data);
		//console.log(data);
		if(data.status!=undefined){
			if(data.status!=msg_OK)
				handleError(data.status);	
		}
	}
	
	//------------------------------------
	var scrambleTextNodes=function(ziel){
		var _this=this;
		var connects=[];
		
		var scrambleziel=ziel;
		var scbasis=undefined;
		var aktiv=false;
		var scrambleDB={};
		
		var create=function(){
			scbasis=cE(scrambleziel,"div",undefined,"scramblebutt");
			var inp=cE(scbasis,"input")
			inp.type="checkbox";
			inp.id='cbb_scramble';
			inp.checked=false;
			addClass(inp,"booleanswitch");
			var label=cE(scbasis,"label");
			label.htmlFor=inp.id;
			inp.addEventListener('change',changeInput);
		}
		this.ini=function(){
			connects=[];
		}
		this.show=function(an){
			if(an){
				
			}else{
				scbasis.style.display="none";
			}
			
		};
		
		var getScrambleString=function(s){
			var i,z,
				arr=s.split(''),
				dbtag=s.split(' ').join('');
			
			//scrambleDB[] -> gescrambledtes Wort hier ablegen, falls es nochmal vorkommt, dieses nehmen
			if(isNaN(s)){	
				if(scrambleDB[dbtag]==undefined){
					for(i=0;i<arr.length;i++){
						z=Math.floor(Math.random()*25);
						if(arr[i]!=" "){
							if(i==0)
								arr[i]=String.fromCharCode(65+z);
								else
								arr[i]=String.fromCharCode(97+z);
						}
					}
					s=arr.join('');
					scrambleDB[dbtag]=s;
				}
				else{
					s=scrambleDB[dbtag];
				}
			}
			//s="fu bar";
			return s;
		}
		
		var changeInput=function(e){
			aktiv=this.checked;
		}
		
		var goscrambeln=function(node){
			var i,cn,
				childnodes=node.childNodes;
			for(i=0;i<childnodes.length;i++){
				cn=childnodes[i];
				if(cn.nodeName=="#text"){
					if(aktiv)cn.nodeValue=getScrambleString(cn.nodeValue);
				}
					
				if(cn.childNodes.length>0)goscrambeln(cn);
			};
			if(node.nodeName=="INPUT"){
				if(node.type=="text"){
					if(aktiv)node.style.color="transparent";//or addclass scramble
				}
			}
		}
		
		this.destroy=function(){}
		this.connect=function(objekt){
			if(objekt!=undefined)
				connects.push(objekt);
			return _this;
		}
		
		this.Message=function(s,data){
			if(s=="scramble"){
				if(data!=undefined)goscrambeln(data);
			}
			else
console.log("MESSAGE",s,data);
		}
		
		var sendMSG=function(s,data){
			var i;
			for(i=0;i<connects.length;i++){
				connects[i].Message(s,data);
			}
		}		
		create();
	}	

	var o_optionsleiste=function(ziel){
		var _this=this;
		var connects=[];
		
		var oziel=ziel;
		var obasis=undefined;
		var oselect=undefined;
		var d=new Date();
		var jahrdata={min:d.getFullYear(),max:d.getFullYear(),jahre:{}};
		
		var create=function(){
			obasis=cE(oziel,"div","optionsleiste");
			obasis.innerHTML="zeige:[alle,2002,....,2016]";
		}
		this.ini=function(){
			var HTMLnode;
			connects=[];
			//inputs=[];
			obasis.innerHTML="";
			
			HTMLnode=cE(obasis,"span");
			HTMLnode.innerHTML=getWort("filterby")+" ";
			
			oselect=cE(obasis,"select");
			//inputs.push(oselect);
		}
		this.destroy=function(){}
		this.connect=function(objekt){
			if(objekt!=undefined)
				connects.push(objekt);
			return _this;
		}
		
		this.Message=function(s,data){
			if(s=="allProjektsloaded"){
				addProjktoption(data.meta);// { min: 2001, max: 2017, jahre: Object }
			}
		}
		var sendMSG=function(s,data){
			/*
				"selectFilterJahr",string|int
			*/
			var i;
			for(i=0;i<connects.length;i++){
				connects[i].Message(s,data);
			}
		}		
		var addProjktoption=function(data){
			var i,t,proj,std,HTMLnode,jahr,anz,d,property;
			jahrdata=data;
			if(oselect!=undefined){
				//min/max-Jahr und Jahre ansich der Stunden herrausholen
				var jahreliste=[];
				for( property in jahrdata.jahre ) {
					jahreliste.push(jahrdata.jahre[property]);
				}
				jahreliste.sort();
				
				oselect.innerHTML="";
				HTMLnode=cE(oselect,"option");
				HTMLnode.value="alle";
				HTMLnode.innerHTML="alle";
				
				anz=0;
				d=new Date();
				
				for(i=0;i<jahreliste.length;i++){
					HTMLnode=cE(oselect,"option");
					HTMLnode.value=jahreliste[i];
					HTMLnode.innerHTML=jahreliste[i];
					anz++;
					if(jahreliste[i]==d.getFullYear())oselect.selectedIndex =anz;
				}
				
				var v=HTMLnode.value;
				if(!isNaN(v)){
					v=d.getFullYear();//aktuelles Jahr
					}
				sendMSG("selectFilterJahr",v);
				
				oselect.addEventListener('change',changeInput);
			}
		}
		var changeInput=function(e){
			//console.log(this.children[this.selectedIndex].value,this);
			var v=(this.children[this.selectedIndex].value);
			if(!isNaN(v))v=parseInt(v);
			sendMSG("selectFilterJahr",v);
		}
		
		create();
	}
	
	var o_ProjektDataIOHandler=function(ziel){ //Handling Projekte laden, speichern
		var _this=this;
		var connects=[];
		var d=new Date();
		var jahrdata={min:d.getFullYear(),max:d.getFullYear(),jahre:{}};
		var projekte=[];
		
		var oziel=ziel;
		var create=function(){//nur einmal
			
		}
		this.ini=function(){//immer wenn Tab gedrückt
			connects=[];
			loadData("projektliste",parsedata,"GET");
		}
		this.destroy=function(){}
		this.connect=function(objekt){
			if(objekt!=undefined)
				connects.push(objekt);
			return _this;
		}
		this.Message=function(s,data){
			if(s=="reloadprojektlist"){
				loadData("projektliste",parsedata,"GET");
			}			
			if(s=="createnewprojekt"){
				loadData("newprojekt",parsenewProjdata,"POST",encodeURI(data));

			}			
			//if(s=="getProjektliste"){return projekte;}
			//if(s=="getProjektdata"){return projekte[].id==data;}
		}
		
		var sendMSG=function(s,data){
			/*
				"allProjektsloaded",projektliste
			*/
			var i;
			for(i=0;i<connects.length;i++){
				connects[i].Message(s,data);
			}
		}
		
		var sortliste=function(a,b){//nach datum, neuste oben
			if(a.dat ==undefined || b.dat==undefined)return 0;		
			var aa=getdatumsObj(a.dat);
			var bb=getdatumsObj(b.dat);
			return ( aa.getTime()<bb.getTime() );			
		}
		
		var parsenewProjdata=function(data){
			data=JSON.parse(data);
			if(data.status=="OK"){
				//reload Projektliste
				loadData("projektliste",parsedata,"GET");
			}
			else
				handleError(data.status);
		}
		
		var parsedata=function(data){
			var i,o,onew;
			data=JSON.parse(data);

			if(data.status!=msg_OK){
				handleError(data.status);
				return;
			}			
			//sort by datum
			data.dat.sort(sortliste);		
			
			projekte=[];
			for(i=0;i<data.dat.length;i++){
				o=data.dat[i];
				o.date=getdatumsObj(o.dat);
				onew={id:o.name,pro:o,data:undefined}
				projekte.push(onew);
			}
			
			projektepointer=-1;
			getProjektdata();
		}
		
		var projektepointer=-1;
		var getProjektdata=function(){
			projektepointer++;
			var o;
			if(projektepointer<projekte.length){
				o=projekte[projektepointer];
				loadData("projektdata",parseProdata,"POST",encodeURI("name="+o.pro.name));
			}
			else{
				//fertig
				getProData();
				sendMSG("allProjektsloaded",{"projekte":projekte,"meta":jahrdata});
			}
		}
		var parseProdata=function(data){
			var i,o;
			data=JSON.parse(data);
			
			//check error
			if(data.status!=undefined){
				if(data.status!=msg_OK){
					handleError(data.status);
					return;
					}
			};
			
			for(i=0;i<projekte.length;i++){//geladene Projektdaten dem Projekt zuordnen
				o=projekte[i];
				if(o.id==data.id)o.data=data;			
			}
			getProjektdata();//next
		}
		
		var getProData=function(){
			//var jahreliste=[];
			var i,t,proj,std,jahr;
			var d=new Date();
			jahrdata={min:d.getFullYear(),max:d.getFullYear(),jahre:{}};
			for(i=0;i<projekte.length;i++){
				proj=projekte[i];
				//console.log(proj);
				for(t=0;t<proj.data.stunden.length;t++){
					std=proj.data.stunden[t];
					jahr=parseInt(std.dat.split("-")[0]);//"2016-12-26"
					jahrdata.min=Math.min(jahrdata.min,jahr); 
					jahrdata.max=Math.max(jahrdata.max,jahr);
					jahrdata.jahre['j'+jahr]=jahr;
					//jahreliste.push(jahr);
				}
			};
			/*jahreliste.sort();
			for(i=0;i<jahreliste.length;i++){
				jahrdata.jahre['j'+jahreliste[i]]=jahreliste[i];
			}	*/		
		};
		
		
		create();
	}
	
	
	//--innerfunObjekts--
	var createTab=function(contentziel,tabbuttziel,data){
		var tab,tr,td;
		
		var odata={
			"ziel":contentziel,
			"tabbuttziel":tabbuttziel,
			"data":data,
			
			"content":undefined,
			"tabbutt":undefined,
			
			"inhalte":[]
		};
		//--API--
		this.ini=function(){
			var htmlnode;
			//create basics
			if(odata.tabbuttziel!=undefined){
				htmlnode=cE(odata.tabbuttziel,"a");
				htmlnode.href="#";
				htmlnode.innerHTML=getWort(odata.data.butttitel);
				htmlnode.onclick=klickTab;
				htmlnode.className="tab";
				odata.tabbutt=htmlnode;
			}
			if(odata.ziel!=undefined){
				odata.content=cE(odata.ziel,"div",undefined,odata.data.id);
				odata.content.innerHTML=getWort('loading');
			}
		}
		this.aktiv=function(b){
			odata.data.aktiv=b;
			if(b){
				subClass(odata.content,"panelinaktiv");
				addClass(odata.tabbutt,"tabaktiv");
				loadInhalt(odata.data.id);
				}else{
				addClass(odata.content,"panelinaktiv");
				subClass(odata.tabbutt,"tabaktiv");
				}
		}
		
		//--actions--
		var klickTab=function(e){
			setTabaktiv(odata.data.id);
			return false;
		}
		
		//--inhalt--
		var loadInhalt=function(id){
			var inhaltsobjekt,i,k;
			for(i=0;i<odata.inhalte.length;i++){
				odata.inhalte[i].destroy();
			}
			odata.inhalte=[];
			if(optionsleiste!=undefined)odata.inhalte.push(optionsleiste);
			if(scramble!=undefined)odata.inhalte.push(scramble);
			if(geladeneprojekte!=undefined)odata.inhalte.push(geladeneprojekte);
						
			odata.content.innerHTML="";
			if(statusDlg!=undefined)statusDlg.show("","");
			
			if(id=="tab_editTag"){
				//div->Monatsliste
				inhaltsobjekt=new Monatsliste(odata.content);
				odata.inhalte.push(inhaltsobjekt);
				//div->Projektliste
				inhaltsobjekt=new Projektliste(odata.content);
				inhaltsobjekt.setfilter(["feiertage"]);
				odata.inhalte.push(inhaltsobjekt);
				inhaltsobjekt.showactions(false);
				document.title=getWort("meinTag");
			}
			if(id=="tab_editProj"){
				//Projekte, neu, edit
				//editorProjekt
				inhaltsobjekt=new editorProjekt(odata.content);
				odata.inhalte.push(inhaltsobjekt);
				//div->Projektliste
				inhaltsobjekt=new Projektliste(odata.content);
				odata.inhalte.push(inhaltsobjekt);
				inhaltsobjekt.showactions(true);
				document.title=getWort("meinProj");
				
			}
			if(id=="tab_editUeberblick"){
				//Statistik
				inhaltsobjekt=new ueberblickProjekt(odata.content);
				inhaltsobjekt.setfilter(["feiertage"]);//,"urlaub"
				odata.inhalte.push(inhaltsobjekt);
				document.title=getWort("ueberblick");
			}
			
			if(id=="tab_editEinstellungen"){
				//Einstellungen
				//user css, hilfstexte an/aus (Anzeigedauer)
//TODO
				
				//...
				document.title=getWort("einstellungen");
			}
			
			
			for(i=0;i<odata.inhalte.length;i++){
				//Inhalt initialisieren
				odata.inhalte[i].ini();				
				//Inhalt miteinander verknüpfen
				for(k=0;k<odata.inhalte.length;k++){
					if(i!=k)
						odata.inhalte[i].connect(odata.inhalte[k].connect());
				}
			}
		}
		
	}
	
	var ueberblickProjekt=function(zielnode){
		//Statistik
		var ziel=zielnode;
		var basis=undefined;
		var _this=this;
		var connects=[];
		var projekte=[];
		var filter=[];
		var projektedata=undefined;
		var lastfilter=undefined;
		var projekteliste2=undefined;
		
		this.ini=function(){			
			basis=cE(ziel,"div",undefined,"projektueberblick");
		}
		this.destroy=function(){}
		this.connect=function(objekt){
			if(objekt!=undefined)
				connects.push(objekt);
			return _this;
		}
		
		this.Message=function(s,data){
			if(s=="allProjektsloaded"){
				projektedata=data.projekte;
				parsedata(data.projekte,lastfilter);
			}
			if(s=="selectFilterJahr"){
				lastfilter=data;
				parsedata(projektedata,data);
			}
		}
		
		var sendMSG=function(s,data){
			var i;
			for(i=0;i<connects.length;i++){
				connects[i].Message(s,data);
			}
		}
		
		var sortstdliste=function(a,b){//nach datum, älteste oben
			if(a.dat ==undefined || b.dat==undefined)return 0;		
			var aa=getdatumsObj(a.dat);//"2016-12-23"
			var bb=getdatumsObj(b.dat);
			return ( aa.getTime()>bb.getTime() );			
		}
		
		var isinfilter=function(data){
			var i,re=false;
			for(i=0;i<filter.length;i++){
				if(data.id==filter[i])re=true;
			}
			return re;
		}
		this.setfilter=function(arr){
			filter=arr;
		}
		
		var parsedata=function(data,jahrfilter){
			var i,t,o,HTMLnode,onew,eintragen,std,a;
			basis.innerHTML="";
			
			if(data==undefined)return;
			//Ergebnis			
			projekte=[];
			for(i=0;i<data.length;i++){
				o=data[i];			
				eintragen=!isinfilter(o);//Filter by Art

				
				if(eintragen && jahrfilter!=undefined && jahrfilter!="alle"){
					eintragen=false;
					//gucken ob Stunden passend zum Filter da sind, dann Eintrag zeigen
					for(t=0;t<o.data.stunden.length;t++){
						std=o.data.stunden[t];						
						a=parseInt(std.dat.split('-')[0]);						
						if(!isNaN(a)){
							if(jahrfilter==a)eintragen=true;
						}
					}
				}

				if(eintragen){
					onew={id:o.id,pro:o.pro,data:o.data,divnode:undefined};
					projekte.push(onew);
					
					HTMLnode=cE(basis,"div");
					HTMLnode.innerHTML=encodeString(o.data.titel);
					sendMSG("scramble",HTMLnode);
					onew.divnode=HTMLnode;
					
					showinfos(onew);
				}		
			}
			projekteliste2=cE(basis,"div");
			showprojekteliste2();
		}
		
		
		
		var showinfos=function(dat){
			var i,HTMLnode,can,cc,datum,datumstd,firstdata,lastdata;
			var Zeitjetzt = new Date();	
			if(lastfilter!=undefined && !isNaN(lastfilter)){
				Zeitjetzt.setFullYear(lastfilter);
			}
			
			var zeigemonate=12,
				zeigetage=0,			
				x=0,
				canheight=50,
				y=canheight-1;
			
			dat.divnode.innerHTML="";
			HTMLnode=cE(dat.divnode,"h1");
			HTMLnode.innerHTML=encodeString(dat.data.titel);
			
			if(dat.data.stunden.length==0)return;//keine Stunden
			
			//sort Stunden by datum
			dat.data.stunden.sort(sortstdliste);
			var maxstunden=8;
			//get maximal Stunden pro Eintrag, für Canvasheigt-Multiplikator
			for(i=0;i<dat.data.stunden.length;i++){
				datumstd=getdatumsObj(dat.data.stunden[i].dat);//convert to date
				if(i==0) 	firstdata=datumstd;
				if(i==dat.data.stunden.length-1)
							lastdata=datumstd;
				if(maxstunden<dat.data.stunden[i].stunden)maxstunden=dat.data.stunden[i].stunden;
			}
			//erster Eintrag ... letzter Eintrag (... heute)
			//var firstdata=dat.data.stunden[0];
			var anz=dat.data.stunden.length;
			if(anz<2)anz=1;
			//var lastdata=dat.data.stunden[anz-1];
			var jetzt=new Date();
			if(lastfilter!=undefined && !isNaN(lastfilter)){
				jetzt.setFullYear(lastfilter);
			}
			
			var a=firstdata.getTime();//ms seit 1970
			var b=lastdata.getTime();//ms seit 1970
			var c=jetzt.getTime();
			var px,lastx,py,stundenanz;
			
			var posfix=0.5;//sonst keine 1px linien ...
			
			var tageAC=Math.floor((c-a)/1000/60/60/24);
			
			//console.log(c>b,tageAC);//ms-sec-min-h-tag
			
			var dathelper=new Date();//getdatumsObj('2016-12-01')
			dathelper.setMilliseconds(1);
			dathelper.setHours(12);		//default 12, falls Zeitverschiebung...	
			dathelper.setMinutes(0);
			dathelper.setSeconds(0);
			dathelper.setDate(1);
			dathelper.setFullYear(Zeitjetzt.getFullYear());
			
			var monatstage=[];
			var tage;
			//Anzahl der Tage im Monat ermitteln für canvas-width
			for(i=0;i<zeigemonate;i++){
				dathelper.setMonth(Zeitjetzt.getMonth()-zeigemonate+i);
				//tage=getMonatstage(Zeitjetzt.getMonth(),Zeitjetzt.getFullYear());
				tage=getMonatstage(dathelper.getMonth(),dathelper.getFullYear());
				monatstage.push(tage);
console.log(">>",dathelper);
				zeigetage+=tage;
			}
console.log(">>",monatstage);
			
			
			
			//....Stunden....|..||
			can=cE(dat.divnode,"canvas");
			can.width=zeigetage;
			can.height=canheight;
			can.title=getWort("letzte12mon");
			cc=can.getContext('2d');
			cc.lineWidth=1;
			px=0;
			
			//Monatstrenner
			var mondat=new Date();
			mondat.setMilliseconds(1);
			mondat.setHours(12);		//default 12, falls Zeitverschiebung...	
			mondat.setMinutes(0);
			mondat.setSeconds(0);
			mondat.setDate(1);			//1. Tag
			if(lastfilter!=undefined && !isNaN(lastfilter)){
				mondat.setFullYear(lastfilter);//gewähltes Jahr, sonst aktuelles Jahr
			}
			mondat.setMonth(mondat.getMonth()-zeigemonate+1);
			cc.strokeStyle="#e0e0e0";
			//anfang senkrechte
			cc.beginPath();
			cc.moveTo(px+posfix,canheight+posfix);
			cc.lineTo(px+posfix,0+posfix);
			cc.stroke();
			for(i=0;i<monatstage.length;i++){
				cc.fillStyle="#c0c0c0";
				cc.font="10px Verdana";//width"+monatstage[i]+"px"
				//cc.textAlign="center";
				cc.fillText(getWort('kurz'+MonatsnameID[mondat.getMonth()]).toUpperCase(),px+2,10);
				mondat.setMonth(mondat.getMonth()+1);
				
				//Trenner
				px+=monatstage[i];
				cc.beginPath();
				cc.moveTo(px+posfix,canheight+posfix);
				cc.lineTo(px+posfix,0+posfix);
				cc.stroke();				
			}
			//ende-senkrechte
			cc.beginPath();
			cc.moveTo(zeigetage-1+posfix,canheight+posfix);
			cc.lineTo(zeigetage-1+posfix,0+posfix);
			cc.stroke();
			
			//Daten ausgeben
			cc.strokeStyle="rgba(127,202,93,0.7)";
			cc.lineWidth=1;
			if(dat.id=="urlaub")cc.strokeStyle="rgba(94,156,201,0.7)";
			cc.beginPath();
			cc.moveTo(x+posfix,y+posfix);
			var datenpunkte=[];
			lastx=0;
			for(i=0;i<dat.data.stunden.length;i++){
				datum=getdatumsObj(dat.data.stunden[i].dat);
				px=zeigetage-Math.floor((c-datum.getTime())/1000/60/60/24)-1;
				if(px<zeigetage){//nur bis heute, keine zukünftigen
					/*if(lastx<px-1 ){
						cc.lineTo(lastx+1+posfix,y+posfix);					
						cc.lineTo(px-1+posfix,y+posfix);					
					}
					*/
					stundenanz=dat.data.stunden[i].stunden;
					if(dat.id=="urlaub")stundenanz=9;
					//if(stundenanz==0)stundenanz=maxstunden*0.25;
					py=Math.floor(y-(canheight/(maxstunden+1)*(stundenanz)));				
					
					cc.lineTo(px+posfix,y+posfix);//ran
					cc.lineTo(px+posfix,py+posfix);//hoch
					datenpunkte.push({"x":px,"y":py});
					cc.lineTo(px+posfix,y+posfix);//runter
					lastx=px;
				}
			}
			if(lastx<zeigetage){
				cc.lineTo(lastx+1+posfix,y+posfix);
				cc.lineTo(zeigetage+posfix,y+posfix);
			}
			cc.stroke();
			
			cc.strokeStyle="#cccccc";//#636363
			cc.beginPath();
			cc.moveTo(0+posfix,y+posfix);
			cc.lineTo(zeigetage+posfix,y+posfix);
			cc.stroke();
			
			cc.strokeStyle="#333333";
			cc.lineWidth=2;
			for(i=0;i<datenpunkte.length;i++){
				px=datenpunkte[i].x;
				py=datenpunkte[i].y;
				cc.beginPath();
				cc.moveTo(px+posfix,y+posfix);
				cc.lineTo(px+posfix,y-2+posfix);
				cc.stroke();
			}
			
			//if(scramble!=undefined)scramble.refresh(dat.divnode);
			sendMSG("scramble",dat.divnode);
		}
	
		var showprojekteliste2=function(){
			if(projekteliste2==undefined)return;
			//Projekt|----gesammtstunden
			var i,t,tabelle,tr,th,td,o,div;
			//projekte.sort(); //ist=by last change Date
			projekteliste2.innerHTML="";

//TODO: 2 Balken vom aktuellen Jahr, wenn gewählt
			
			var maxstd=0,stundenproproj;
			for(i=0;i<projekte.length;i++){
				o=projekte[i].data;
				stundenproproj=0;
				for(t=0;t<o.stunden.length;t++){
					stundenproproj+=o.stunden[t].stunden;
				}
				projekte[i].stundenges=stundenproproj;
				if(maxstd<stundenproproj)maxstd=stundenproproj;
			}
			
			tabelle=cE(projekteliste2,"table");
			for(i=0;i<projekte.length;i++){
				o=projekte[i];
				if(o.id!="urlaub"){
					tr=cE(tabelle,"tr");
					th=cE(tr,"th");
					th.innerHTML=encodeString(o.data.titel);
					//if(scramble!=undefined)scramble.refresh(th);
					sendMSG("scramble",th);
					td=cE(tr,"td");
					div=cE(td,"div",undefined,"balkenstunden");
					div.style.width=(100/maxstd*o.stundenges)+"%";
					if(o.stundenges>0)
						div.innerHTML=o.stundenges+"h";
					
					if(o.data.info.isended!=undefined){
						if(o.data.info.isended===true)addClass(div,"proisended");
					}
					
				}
			}		
			
			
		}
	}
	
	var editorProjekt=function(zielnode){
		var ziel=zielnode;
		var _this=this;
		var connects=[];
		var projektaktiv=undefined;
		var projinputs=[];
		
		this.ini=function(){
			//create
			basis=cE(ziel,"div",undefined,"editorProjekt");
			basis.innerHTML="";
			statusDlg.show("",getWort("wahleprojekt"),"posprojektlist");//selectaprojekt
		}
		this.destroy=function(){
			var i,inp;
			if(projinputs.length>0){//Aufräumen
				for(i=0;i<projinputs.length;i++){
					inp=projinputs[i];
					if(inp.data.o_sibling!=undefined){
						if(inp.data.o_sibling.timer!=undefined)clearTimeout(inp.data.o_sibling.timer);
					}
					inp.removeEventListener('keyup' ,changeActivityInput);
					inp.removeEventListener('change',changeActivityInput);
				}
			}
			
		}
		this.connect=function(objekt){
			if(objekt!=undefined)
				connects.push(objekt);
			return _this;
		}
		
		this.Message=function(s,data){
			//statusDlg.show("","");
			//
			if(s=="selectProjekt"){
				//Daten dieses Projektes anzeigen
				//console.log(">>>",s,data);
				showProjektdata(data.data);
				sendMSG("deselect",undefined);
			}
			
		}
		
		var sendMSG=function(s,data){
			var i;
			for(i=0;i<connects.length;i++){
				connects[i].Message(s,data);
			}
		}
		
		var showProjektdata=function(projekt){
			var tab,tr,th,td,i,inp,label,std,property,h1,htmlNode;
			var tab2,tr2,td2,th2;
			var o_sibling;
			projektaktiv=projekt;
			var datumeditable=false;
			if(projektaktiv.id=="feiertage")datumeditable=true;
			
			if(projinputs.length>0){//Aufräumen
				for(i=0;i<projinputs.length;i++){
					inp=projinputs[i];
					if(inp.data.o_sibling!=undefined){
						if(inp.data.o_sibling.timer!=undefined)clearTimeout(inp.data.o_sibling.timer);
					}
					inp.removeEventListener('keyup' ,changeActivityInput);
					inp.removeEventListener('change',changeActivityInput);
				}
			}
			
			projinputs=[];
			basis.innerHTML="";
			
			tab=cE(basis,"table");
			
			//input titel
			tr=cE(tab,"tr");
			th=cE(tr,"th");
			th.innerHTML=getWort("projtitel");
			td=cE(tr,"td");
			inp=cE(td,"input");
			inp.value=encodeString(projekt.titel);
			inp.data={"property":"titel","typ":"titel","node":projekt ,"nodeid":"titel","projektdata":projekt,
					  "o_sibling":{timer:undefined,elemente:[inp]}};
			projinputs.push(inp);
			
			//infos			
			tr=cE(tab,"tr");
			td=cE(tr,"td");
			h1=cE(td,"h1");
			h1.innerHTML=getWort("Infos");
			td.colSpan=2;
			o_sibling={
					timer:undefined,
					elemente:[]
				}
			for( property in projekt.info ) { 		
				//console.log(property,"=", projekt.info[property]);
				tr=cE(tab,"tr",undefined,"infoth");
				td=cE(tr,"th");
				td.innerHTML=getWort("dat"+property)+':';//getWort("projtitel")
				td=cE(tr,"td");
				inp=cE(td,"input");
				inp.value=encodeString(projekt.info[property]);
				inp.data={"property":property,"typ":"info","node":projekt.info ,"nodeid":property,"projektdata":projekt,"o_sibling":o_sibling};
				projinputs.push(inp);
				
				//console.log(getDataTyp(projekt.info[property]));
				if(getDataTyp(projekt.info[property])=='[object Boolean]'){
					inp.type="checkbox";
					inp.id='cb_'+property;
					inp.checked=projekt.info[property];
					addClass(inp,"booleanswitch");
					label=cE(td,"label");
					label.htmlFor=inp.id;					
				}
				if(getDataTyp(projekt.info[property])=='[object Number]'){
					inp.type="number";
					inp.step=0.01;
					//inp.min=0;
				}
				
				o_sibling.elemente.push(inp);
			}
			
			tab=cE(basis,"table");
			//stunden
			tr=cE(tab,"tr");
			td=cE(tr,"td");
			h1=cE(td,"h1");
			h1.innerHTML=getWort("Stunden");
			td.colSpan=2;
			for(i=0;i<projekt.stunden.length;i++){
				std=projekt.stunden[i];
				
				tr=cE(tab,"tr");
				td=cE(tr,"td");
				td.colSpan=2;
				
				tab2=cE(td,"table",undefined,"stdtab");
				tr2=cE(tab2,"tr");
				for( property in std ) { 
					td2=cE(tr2,"th");
					td2.innerHTML=getWort("dat"+property)+':';
				}
				td2=cE(tr2,"th");
				
				tr2=cE(tab2,"tr");
				o_sibling={
					timer:undefined,
					elemente:[]
				}
				
				for( property in std ) { 
					td2=cE(tr2,"td");
					inp=cE(td2,"input");
					inp.value=encodeString(std[property]);
					inp.data={"property":property,"typ":"stunde","node":std ,"nodeid":property,"projektdata":projekt,"datstunde":std,"o_sibling":o_sibling};
					inp.className="inpdat"+property;
					o_sibling.elemente.push(inp);
					
					if(property=="stunden"){
							inp.type="number";//if(!isNaN(std[property]))
							inp.step=0.01;
							inp.min=0;
						}
					
					if(property=="dat" && !datumeditable) inp.readOnly=true;//außer Feiertage!
					if(property=="user")inp.readOnly=true;
					projinputs.push(inp);
				}
				td2=cE(tr2,"th");
				htmlNode=cE(td2,"a",undefined,"button buttdel");
				htmlNode.innerHTML=getWort("buttdel");
				htmlNode.href="#";
				htmlNode.data={"typ":"stunde","datstunde":std ,"projektdata":projekt,"zeilenode":td};
				htmlNode.onclick=delStunde;				
			};
			
			for(i=0;i<projinputs.length;i++){
				if(projinputs[i].readOnly!=true){
					projinputs[i].addEventListener('keyup' ,changeActivityInput);
					projinputs[i].addEventListener('change',changeActivityInput);
					//console.log(projinputs[i].type);//number,text,checkbox
				}
				//if(scramble!=undefined)scramble.refresh(projinputs[i]);
				sendMSG("scramble",projinputs[i]);
			}
			
			
		}
		
		var changeActivityInput=function(e){//'keyup'/'change'
			var val=this.value;
			if(this.type=="checkbox")val=this.checked;
	
			//test ob sich der Wert geändert hat (sonst wurde er schon gespeichert)
			var istanders=!((this.data.node[this.data.nodeid]+'')==(val+''));
			if(this.type=="checkbox")istanders=true;
			if(e.type=="keyup" && e.keyCode==13)istanders=true;
			if(!istanders)return;
			
			//'[object Array]' '[object String]'  '[object Number]' 
			//neu abspeichern
			var dtyp=getDataTyp(this.data.node[this.data.nodeid]);
			if( dtyp=== '[object Array]'){
				this.data.node[this.data.nodeid]=val.split(',');//in Array wandeln, Trenner ist ein Komma
			}
			else
			if( dtyp=== '[object Number]'){
				if(isNaN(parseFloat(val)))val=0;
				this.data.node[this.data.nodeid]=parseFloat(val); //Number
			}
			else
			if( dtyp=== '[object Boolean]'){					//boolean
				this.data.node[this.data.nodeid]=val;
			}
			else{
				this.data.node[this.data.nodeid]=decodeString(val); //String
			}
			
			if(this.data.o_sibling.timer!=undefined){
				clearTimeout(this.data.o_sibling.timer);
				this.data.o_sibling.timer=undefined;
			}
			addClass(this,"isedit");
			//if(e.type=="change")
		
			if(this.data.typ=="stunde"){//stundeneintrag wurde geändert
				if(e.type=="keyup" && e.keyCode==13){
					sendstundendatatimer(this);				
				}
				else{
					//sonst etwas warten pb noch weitere Eingaben kommen
					//send projektdate/stundendata
					this.data.o_sibling.timer=setTimeout(sendstundendatatimer,2000,this);//2 sec warten, dann senden, es sei vorher kommen neue daten
				}
			}
			if(this.data.typ=="info"){
				//infoblock hat sich geändert
				if(e.type=="keyup" && e.keyCode==13 || this.type=="checkbox"){
					sendinfodatatimer(this);				
				}
				else{
					this.data.o_sibling.timer=setTimeout(sendinfodatatimer,2000,this);//2 sec warten, dann senden, es sei vorher kommen neue daten
				}
			}
			if(this.data.typ=="titel"){
				//neuer Titel
				if(e.type=="keyup" && e.keyCode==13){
					sendtiteldatatimer(this);				
				}
				else{
					this.data.o_sibling.timer=setTimeout(sendtiteldatatimer,2000,this);//2 sec warten, dann senden, es sei vorher kommen neue daten
				}
			}
			
		}
		
		var sendtiteldatatimer=function(input){
			var i,value;
			//editmarker entfernen
			for(i=0;i<input.data.o_sibling.elemente.length;i++){
				subClass(input.data.o_sibling.elemente[i],"isedit");
			}
			//nur den neuen titel senden
			value=input.data.node.titel;
			postNewData("projekttitelupdate",{"projektdata": input.data.projektdata, "daten": {'titel':value} });
		}		
		
		var sendinfodatatimer=function(input){
			var i;
			//editmarker entfernen
			for(i=0;i<input.data.o_sibling.elemente.length;i++){
				subClass(input.data.o_sibling.elemente[i],"isedit");
			}
			
			//console.log("POST info",input.data);
			postNewData("projektinfoupdate",{"projektdata": input.data.projektdata, "daten": input.data.node });//data.node=info.
		}
		
		var sendstundendatatimer=function(input){
			var i;
			//editmarker entfernen
			for(i=0;i<input.data.o_sibling.elemente.length;i++){
				subClass(input.data.o_sibling.elemente[i],"isedit");
			}			
			postNewData("projektstundenlisteupdate",{"projektdata": input.data.projektdata, "daten": input.data.datstunde});
		}
		var delStunde=function(e){//Button:Stundeneintrag löschen
			//console.log("delStunde",this.data);
			var i,std,newList=[];
			if(confirm(getWort("deleteeintrag"))){
				this.data.datstunde.deleting=true;
				
				postNewData("projektstundenlisteupdate",{"projektdata": this.data.projektdata, "daten": this.data.datstunde });
				//Listenelement löschen
				for(i=0;i<this.data.projektdata.stunden.length;i++){
					std=this.data.projektdata.stunden[i];
					if(std.deleting===true){}
						else
							newList.push(std);
				}
				this.data.projektdata.stunden=newList;
				
				//HTMLNode löschen
				var parentnode=this.data.zeilenode;
				parentnode.parentNode.removeChild(parentnode);
			}
			return false;
		}
		
		var postNewData=function(befehl,data){
			//console.log("postNewData:",data);//.typ .data .id
			var sdata="id="					+data.projektdata.id
					+"&data="+JSON.stringify(data.daten);

			loadData(befehl,parseNewdataRE,"POST",encodeURI(sdata));//befehl="projektstundenlisteupdate"
		};		
		
		var parseNewdataRE=function(data){
			data=JSON.parse(data);
			
			//check error
			if(data.status!=undefined){
				if(data.status!=msg_OK)
					handleError(data.status);
				else{
					statusDlg.show("",getWort("aenderungsaved"),"statok");
					if(data.lastaction!=undefined && data.lastaction=="projekttitelupdate")
						sendMSG("reloadprojektlist",undefined);
				}
			}
			//OK
		}
		
	}
	
	var Projektliste=function(zielnode){
		var ziel=zielnode;
		var basis=undefined;
		var selectedProjekt=undefined;
		var optionsplane=undefined;
		var _this=this;
		var connects=[];
		var filter=[];
		
		var options={
			showactions:false
		}
		var projekte=undefined;
		var lastfilter=undefined;
		
		this.ini=function(){
			//create
			basis=cE(ziel,"div",undefined,"projektliste");
			//basis.innerHTML=getWort('loading');
			//loadData("projektliste",parsedata,"GET");
		}
		this.destroy=function(){}
		this.connect=function(objekt){
			if(objekt!=undefined)
				connects.push(objekt);
			return _this;
		}
		
		this.Message=function(s,data){
			if(s=="addTag"){ //Tag & Projekt sind ausgewählt
				//add Tag/Stunden zum Projekt
				if(selectedProjekt!=undefined){//StundenTag dem Projekt hinzufügen
					addTag(data);
				}
			}
			if(s=="selectTag"){//Tag ausgewählt
				if(selectedProjekt!=undefined){//Wenn Projekt ausgewählt
					addTag(data); //StundenTag zum Projekt hinzufügen
				}
			}
			if(s=="deselect"){
				deselect();
			}
			if(s=="allProjektsloaded"){
				parsedata(data.projekte,lastfilter);
			}
			if(s=="selectFilterJahr"){//data=string|int "alle"|2016
				lastfilter=data;
				parsedata(projekte,data);
			}
		}
		var sendMSG=function(s,data){
			var i;
			for(i=0;i<connects.length;i++){
				connects[i].Message(s,data);
			}
		}
		
		this.setfilter=function(arr){
			filter=arr;
		}
		
		this.showactions=function(an){
			options.showactions=an;
			showoptions();
		}
		
		var	showoptions=function(){
			var o;
			if(optionsplane==undefined)return;
			optionsplane.innerHTML="";
			if(options.showactions)o=new ListActions(optionsplane);
		}
		
		var ListActions=function(ziel){
			var basis=cE(ziel,"div",undefined,"listactions");
			
			var ini=function(){
				var HTMLnode;
				HTMLnode=cE(basis,"a",undefined,"button optbutt");
				HTMLnode.href="#";
				HTMLnode.innerHTML=getWort("butt_newProj");
				HTMLnode.addEventListener('click',bklicknewPro);
				
			}
			
			var bklicknewPro=function(e){
				var name = prompt(getWort("getnewProName"), "");
				if(name!=null){
					if(name==""){
						alert(getWort("mesage_inputnamenoinput"));
					}
					else
					if(name.length<3){
						alert(getWort("mesage_inputnamekurz"));
					}
					else{
						console.log("create",name);
						sendMSG("createnewprojekt","newdata="+name);
					}
				}
				return false;
			}
			
			ini();
		}
		
		
		var isinfilter=function(data){
			var i,re=false;
			for(i=0;i<filter.length;i++){
				if(data.name==filter[i])re=true;
			}
			return re;
		}
		
		var addTag=function(data){
			sendMSG("addProjekt",selectedProjekt);
			sendMSG("deselect",undefined);
			deselect();
		}
		
		var parsedata=function(data,jahrfilter){
			var i,t,o,p,a,htmlNode,table,tr,td,th,eintragen,std;
			
			basis.innerHTML="";
			projekte=data;
			if(data==undefined)return;
			
			optionsplane=cE(basis,"div");
			showoptions();
			//Ergebnis
			table=cE(basis,"table");
			tr=cE(table,"tr");
			th=cE(tr,"th");
			th.innerHTML=getWort('projekte');
			th=cE(tr,"th",undefined,"plistdat");
			th.innerHTML=getWort('datum');
			for(i=0;i<data.length;i++){
				o=data[i];
				o.date=getdatumsObj(o.pro.dat);
				eintragen=!isinfilter(o);//Filter by Art				
				if(eintragen && jahrfilter!=undefined && jahrfilter!="alle"){
					eintragen=false;
					//gucken ob Stunden passend zum Filter da sind, dann Eintrag zeigen
					for(t=0;t<o.data.stunden.length;t++){
						std=o.data.stunden[t];
						a=parseInt(std.dat.split('-')[0]);
						if(!isNaN(a)){
							if(jahrfilter==a)eintragen=true;
						}
					}
				}
				
				if(eintragen){
					tr=cE(table,"tr");
					tr.data=o;			//für Filter
					td=cE(tr,"td");				
					a=cE(td,"a");
					a.data=o;
					a.innerHTML=encodeString(o.data.titel);
					a.href="#";
					a.onclick=klickProj;
					//if(scramble!=undefined)scramble.refresh(a);
					sendMSG("scramble",a);
					o.anode=a;
					o.trnode=tr;
					
					td=cE(tr,"td");	
					htmlNode=cE(td,"span");
					htmlNode.innerHTML=encodeString(o.pro.dat.split(' ')[0]);
				}
			}
		}
		
		var deselect=function(){
			subClass(selectedProjekt.trnode,"p_aktiv");
			selectedProjekt=undefined;
		}
		
		var klickProj=function(e){
			var waraktiv=istClass(this.data.trnode,"p_aktiv");
			if(selectedProjekt!=undefined)
				subClass(selectedProjekt.trnode,"p_aktiv");
			if(waraktiv){
				selectedProjekt=undefined;
				statusDlg.show("","");
				return false
				}
			selectedProjekt=this.data;			
			addClass(this.data.trnode,"p_aktiv");
			
			sendMSG("selectProjekt",this.data);
			return false;
		}
	}
	
	var Monatsliste=function(zielnode){
		var ziel=zielnode;
		var basis=undefined;
		var projekte=[];
		var projektepointer=-1;
		var stundenprotag=8;
		
		var _this=this;
		var connects=[];
		var tabellendata=[];
		
		var projektedata=undefined;
		var lastfilter=undefined;
		
		
		this.ini=function(){//create
			tabellendata=[];
			basis=cE(ziel,"div",undefined,"monatsliste");
		}
		this.destroy=function(){
			
		}
		this.connect=function(objekt){
			if(objekt!=undefined)
				connects.push(objekt);
			return _this;
		}
		this.Message=function(s,data){
			//console.log("Monatsliste MSG:",s,data);
			
			if(s=="selectProjekt" && trselect!=undefined){//Projekt ausgewählt nachdem Tag ausgewählt wurde
				//Projekt in Liste eintragen
				sendMSG("addTag",trselect.data);
				statusDlg.show("","");
			}
			if(s=="selectProjekt" && trselect==undefined){
				statusDlg.show("",getWort("selectaday"));
			}
			if(s=="deselect" && trselect!=undefined){ //Daten wurden in Projekt eingetragen, Tagselection aufheben
				deselect();
			}
			if(s=="addProjekt" && trselect!=undefined){
				//Projekt dem Tag hinzufügen
				addnewProjektToMonList(data);
				refreshTab();
			}
			
			if(s=="allProjektsloaded"){//data:Objekt
				projektedata=data.projekte;
				parseListdata(data.projekte,lastfilter);
			}
			if(s=="selectFilterJahr"){//data:string|int
				lastfilter=data;
				parseListdata(projektedata,data);
			}
		}
		
		var addnewProjektToMonList=function(data){//neuer Stundeneintrag in Monatsliste
			var id=trselect.data.jahr+'_';
				if(trselect.data.monat<10)id+="0";
				id+=trselect.data.monat+'_';
				if(trselect.data.tag<10)id+="0";
				id+=trselect.data.tag+'-'+data.name;//
			var thetag=trselect.data.jahr+'-';
				if(trselect.data.monat<10)thetag+="0";
				thetag+=trselect.data.monat+'-';
				if(trselect.data.tag<10)thetag+="0";
				thetag+=trselect.data.tag;
				
			var a,inp,selectlist,slistopt;
			var HTMLnode=gE(id);
			if(HTMLnode==undefined && data.data!=undefined){
				var stagstundeneintrag={
					"dat":thetag,
					"kommentar":"",
					"stunden":0,
					"typ":"R",
					"user":globaldata.user
				};
				
				data.data.stunden.push(stagstundeneintrag);
				
				var newdata={
							"id":id,
							"data":{"projektdata":data.data},
							"titel":data.data.titel,
							"datstd":stagstundeneintrag
							};
				
				if(data.name=="urlaub"){
					stagstundeneintrag.typ="U";
					stagstundeneintrag.kommentar=" von ";					
					}
				if(data.name=="feiertage"){
					stagstundeneintrag.typ="F";
					stagstundeneintrag.kommentar="";					
					}
				
				createProjektItem(trselect.data.node_data,newdata);
				
				postNewStundenData({"typ": "new", 
						"projektdata": data.data, 
						"datstunde": stagstundeneintrag});
				
			}
		}
		
		var createProjektItem=function(ziel,data){//HTMLNode in Liste erzeugen
			var a,inp,HTMLnode;
			if(gE(data.id)!=undefined)return;//ist schon drinn
			
			var isturlaub=data.datstd.typ.indexOf("U")>-1;
			var istfeiertag=data.datstd.typ.indexOf("F")>-1;
						
			if(isturlaub)
				addClass(ziel.parentNode,"urlaub");
				else
			if(istfeiertag)
				addClass(ziel.parentNode,"feiertag");
				else
				addClass(ziel.parentNode,"hatdata");
			
			var o_sibling={
					timer:undefined,
					elemente:[]
				}
			
			HTMLnode=cE(ziel,"div",data.id, "projektitem");
			if(isturlaub)addClass(HTMLnode,"urlaubtext");
			if(istfeiertag)addClass(HTMLnode,"feiertagtext");
			a=cE(HTMLnode,"a");
			a.innerHTML=encodeString(data.titel);//.titel	
			
			a.href="#";
			a.data={"typ":"a","projektdata":data.data.projektdata,"datstunde":data.datstd};
			a.onclick=klickProjektInListe;
			a.addEventListener('click',blockclick);
			
			HTMLnode.data={
				"inputStunden":undefined//zum Stundenzusammenzählen (pro Tag/Monat)
			}
			
			
			inp=cE(HTMLnode,"input",undefined,"inputKommentar");
			inp.title=getWort("Kommentar");
			inp.value=encodeString(data.datstd.kommentar);
			inp.data={"typ":"komm",		"projektdata":data.data.projektdata,"datstunde":data.datstd,"nodeid":"kommentar","o_sibling":o_sibling};
			inp.addEventListener('click',blockclick);
			//inp.addEventListener('change',changeActivityInput);
			inp.addEventListener('keyup',changeActivityInput);
			o_sibling.elemente.push(inp);
			
			inp=cE(HTMLnode,"input",undefined,"inputArt");
			inp.value=encodeString(data.datstd.typ);
			inp.title=getWort("worktyp");
			inp.data={"typ":"art",		"projektdata":data.data.projektdata,"datstunde":data.datstd,"nodeid":"typ","o_sibling":o_sibling};
			inp.addEventListener('click',blockclick);
			//inp.addEventListener('change',changeActivityInput);
			inp.addEventListener('keyup',changeActivityInput);
			o_sibling.elemente.push(inp);
			
			inp=cE(HTMLnode,"input",undefined,"inputStunden");
			inp.value=encodeString(data.datstd.stunden);
			inp.title=getWort("Stunden");
			inp.data={"typ":"stunden",	"projektdata":data.data.projektdata,"datstunde":data.datstd,"nodeid":"stunden","o_sibling":o_sibling};
			inp.addEventListener('click',blockclick);
			inp.type="number";
			inp.step=0.01;
			inp.min=0;
			inp.addEventListener('change',changeActivityInput);
			inp.addEventListener('keyup',changeActivityInput);
			o_sibling.elemente.push(inp);
			HTMLnode.data.inputStunden=inp;//zum Stundenzusammenzählen verknüpfen
			
			//if(scramble!=undefined)scramble.refresh(HTMLnode);
			sendMSG("scramble",HTMLnode);
		}
		
		var sendMSG=function(s,data){
			var i;
			for(i=0;i<connects.length;i++){
				connects[i].Message(s,data);
			}
		}
		
		var montabzeit=undefined;
		var parseListdata=function(data,jahrfilter){
			var i,div,monatdata,a;
			if(data==undefined)return;

			basis.innerHTML="";
			projekte=data;

			projektepointer=-1;
			var Zeitjetzt = new Date();	
			Zeitjetzt.setDate(1);
			if(jahrfilter!=undefined && jahrfilter!="alle"){
				Zeitjetzt.setFullYear(jahrfilter);			//Tabelle in diesem Jahr beginnen
			}
			
			var Monat=Zeitjetzt.getMonth()-1;
			Zeitjetzt.setMonth(Monat);
			
			div=cE(basis,"div");
			a=cE(div,"a",undefined,"button viewothermon");
			a.href="#";
			a.addEventListener('click',buttaddMonatsview);
			a.innerHTML=getWort("butt_viewpreMon")+' '+getWort(MonatsnameID[Zeitjetzt.getMonth()])+' '+Zeitjetzt.getFullYear();
			a.data={"ziel":div,"richtung":-1,"zeit":Zeitjetzt};
			
			
			div=cE(basis,"div");
			Zeitjetzt = new Date();	
			if(jahrfilter!=undefined && jahrfilter!="alle"){
				Zeitjetzt.setFullYear(jahrfilter);			//Tabelle in diesem Jahr beginnen
			}
			
			montabzeit=Zeitjetzt;
			tabellendata.push(createMonattab(div,Zeitjetzt.getMonth()+1,Zeitjetzt.getFullYear(),montabzeit));//Tabelle aufbauen
			
			Zeitjetzt.setDate(1);
			Monat=Zeitjetzt.getMonth()+1;
			Zeitjetzt.setMonth(Monat);
			div=cE(basis,"div");
			a=cE(div,"a",undefined,"button viewothermon");
			a.href="#";
			a.addEventListener('click',buttaddMonatsview);
			a.innerHTML=getWort("butt_viewnexMon")+' '+getWort(MonatsnameID[Zeitjetzt.getMonth()])+' '+Zeitjetzt.getFullYear();
			a.data={"ziel":div,"richtung":1,"zeit":Zeitjetzt};
			
			
			
			projektToTables();
			refreshTab();
		};
		
		var buttaddMonatsview=function(e){
			var ziel=this.data.ziel,
				richtung=this.data.richtung,
				Zeitjetzt=this.data.zeit,
				platzhalter,a,tabdiv,Monat;
			ziel.innerHTML="";
			
			if(richtung==-1)platzhalter=cE(ziel,"div");
			tabdiv=cE(ziel,"div");
			if(richtung==1)platzhalter=cE(ziel,"div");
			
			//create tab to: tabdiv
			tabellendata.push(createMonattab(tabdiv,this.data.zeit.getMonth()+1,this.data.zeit.getFullYear(),montabzeit ) );
			
			Monat=Zeitjetzt.getMonth()+richtung;
			Zeitjetzt.setMonth(Monat);
			
			a=cE(platzhalter,"a",undefined,"button viewothermon");
			a.href="#";
			a.addEventListener('click',buttaddMonatsview);
			if(richtung==1){
				a.innerHTML=getWort("butt_viewnexMon")+' '+getWort(MonatsnameID[Zeitjetzt.getMonth()])+' '+Zeitjetzt.getFullYear();
			}
			else{
				a.innerHTML=getWort("butt_viewpreMon")+' '+getWort(MonatsnameID[Zeitjetzt.getMonth()])+' '+Zeitjetzt.getFullYear();
			}
			
			a.data={"ziel":platzhalter,"richtung":richtung,"zeit":Zeitjetzt};				
				
			
			projektToTables();//Projekteitems eintragen
			refreshTab();
			return false;
		}
		
		var projektToTables=function(){
			var ip,i,o,data,s,HTMLnode,newdata;
			
			for(ip=0;ip<projekte.length;ip++){
				data=projekte[ip].data;
				//Stunden vorhandener Projekte in Tabelle eintragen
				for(i=0;i<data.stunden.length;i++){
					o=data.stunden[i];
					if(o!=null){
						s="trid"+o.dat;
						HTMLnode=gE(s);//tr
						if(HTMLnode!=undefined){
							//add
							newdata={
										"id":o.dat.split('-').join('_')+"-"+data.id,
										"data":{"projektdata":data},
										"titel":data.titel,
										"datstd":o
									};
							createProjektItem(HTMLnode.data.node_data,newdata);
						};
					}
				};
			}
			
		}
		
		var trselect=undefined;
		var createMonattab=function(zielHTML,Monat,Jahr,heute){//Monat 1..12
			var i,t,y,s;
			var tab,tr,th,td,inp,h3,span;
			
			var data={"tabtrtage":[],"node_geammt":undefined,"sollStundenproMon":0};
			
			//var oTag,oProjekt;
			//
			var Zeit = new Date(Jahr,Monat-1,1);
			//var heute = new Date();
			
			//Anzahl der Tage im Monat und mit welchem Wochentag der Monat anfängt
			var Start = Zeit.getDay();//0=Monatg
			if(Start > 0) 
						Start--;
					else 
						Start = 6;
			//Anzahl der Tage im Monat ermitteln
			var tageimMonat =getMonatstage(Monat,Jahr);// =31;
			//Monat--;
			/*if(Monat==4 ||Monat==6 || Monat==9 || Monat==11 ) --tageimMonat;//30
			if(Monat==2){
				 if(Jahr%4==0) tageimMonat-=2;		
				 if(Jahr%100==0) tageimMonat--;		
				 if(Jahr%400==0) tageimMonat++;		
				}*/
			//console.log(tageimMonat);	
			//Ausgabe
				
			h3=cE(zielHTML,"h2");
			h3.innerHTML=getWort(MonatsnameID[Monat-1])+' '+Jahr;
			h3.className="montabeh";
				
			var tabheadtext		=["Tag","Monat","Projekte","stdtaggesammt"];
			
			var spalten=tabheadtext.length;//Tag|Monat
			var sollStundenproMonat=0;
			var sollsundenproTag=8;
			
			tab=cE(zielHTML,"table");
			tab.className="monatstabelle";
			for(i=0;i<tageimMonat+1;i++){
				tr=cE(tab,"tr");
				if(i==0){//Head
					for(t=0;t<spalten;t++){
							th=cE(tr,"th");
							th.innerHTML=getWort(tabheadtext[t]);
							th.className="tabgrau sp"+t;
						}
				}
				else{//Tage/monat/Daten/Stunden pro Tag
					tr.data={
						"node_data":undefined,
						"node_stdTag":undefined,
						"stundenprotag":0,
						"iswochenende":false,
						"tag":i,
						"monat":Monat,
						"jahr":Jahr
						};
					
					s="trid"+Jahr+'-';
					if(Monat<10)s+='0';
					s+=Monat+'-';
					if(i<10)s+='0';
					s+=i;
					tr.id=s;
					
					data.tabtrtage.push(tr);
					if(heute.getDate()==i && heute.getMonth()==Monat-1 && heute.getFullYear()==Jahr){
						addClass(tr,"heute");
						}
					addClass(tr,"tag_"+wochentagID[Start]);
					
					if(Start>4){
							addClass(tr,"wochenende");
							tr.data.iswochenende=true;
							}
						else
							sollStundenproMonat+=sollsundenproTag;
					
					
					for(t=0;t<spalten;t++){
							td=cE(tr,"td");
							
							if(tabheadtext[t]=="Tag"){
								td.innerHTML=i;
								td.className="tabgrau tag";
								}
							else
							if(tabheadtext[t]=="Monat"){
								td.innerHTML=getWort(MonatsnameID[Monat-1]);
								td.className="monat";
								}
							else
							if(tabheadtext[t]=="stdtaggesammt"){
								td.innerHTML="";
								td.className="stdTaggesamt";
								tr.data.node_stdTag=td;
								}
							else{
								//Feld für Projektdaten
								tr.data.node_data=td;
								td.className="tddata";
								td.data={"tr":tr};
								td.onclick=clickMonYearTD;
							}
					}
					
					Start++;
					if(Start>6)Start=0;
				}	
			}
			data.sollStundenproMon=sollStundenproMonat;
			//GesamtStunden/Monat
			tr=cE(tab,"tr");
			td=cE(tr,"td");
			td.className="stdgesamt";
			td.colSpan=spalten;
			data.node_geammt=td;
			
			return data;
		}
		
		var refreshTab=function(){
			//Stunden zählen
			var i,itd,t,tr,td,HTMLnode,std,gesstd,stundensoll;
			
			for(itd=0;itd<tabellendata.length;itd++){
				gesstd=0;
				stundensoll=0;
				for(i=0;i<tabellendata[itd].tabtrtage.length;i++){
					tr=tabellendata[itd].tabtrtage[i];
					if(!istClass(tr,"wochenende") && !istClass(tr,"urlaub") && !istClass(tr,"feiertag"))
							stundensoll+=stundenprotag;
					std=0;
					td=tr.data.node_data;
					for(t=0;t<td.childNodes.length;t++){
						HTMLnode=td.childNodes[t];
						if(istClass(HTMLnode,"projektitem")){
							var stunode=HTMLnode.data.inputStunden;
							if(stunode){
								if(!isNaN(parseFloat(stunode.value)))
									std+=parseFloat(stunode.value);
							}
						}
					}
					if(!isNaN(std))tr.data.node_stdTag.innerHTML=std;
					gesstd+=std;
				}
				
				if(tabellendata[itd].node_geammt!=undefined){
					tabellendata[itd].node_geammt.innerHTML=getWort("stundengesammt")+gesstd+getWort("stundengesammt2")+stundensoll;
				}
			}
		}
		
		var clickMonYearTD=function(){
			if(trselect!=undefined){
				subClass(trselect,"aktiv");
				
				if(trselect.id!=this.data.tr.id){
					addClass(this.data.tr,"aktiv");
					trselect=this.data.tr;					
				}else{
					subClass(this.data.tr,"aktiv");
					trselect=undefined;
					statusDlg.show("","");
				}
				
			}else{
				addClass(this.data.tr,"aktiv");
				trselect=this.data.tr;
			}
			//console.log(trselect);
			if(trselect!=undefined){
				statusDlg.show("",getWort("selectaprojekt"),"posprojektlist");
				sendMSG("selectTag",trselect.data);
				}
		}
		
		var deselect=function(){
			if(trselect!=undefined){
				subClass(trselect,"aktiv");
				trselect=undefined;
				statusDlg.show("","");
			}
		}

		var blockclick=function(e){
			e.stopPropagation();
			return false;}
		var klickProjektInListe=function(e){
			var i;
			//dialog zum löschen?
			if(confirm(getWort("deleteeintrag"))){
				this.data.datstunde.deleting=true;
				
				postNewStundenData({"typ":"del","projektdata": this.data.projektdata, "datstunde": this.data.datstunde });
				
				//Listenelement löschen
				var std,newList=[];
				for(i=0;i<this.data.projektdata.stunden.length;i++){
					std=this.data.projektdata.stunden[i];
					if(std.deleting===true){}
						else
							newList.push(std);
				}
				this.data.projektdata.stunden=newList;
				
				//HTMLNode löschen
				var parentnode=this.parentNode;
				parentnode.parentNode.removeChild(parentnode);
			};
			return false;
		}
		var changeActivityInput=function(e){
			//console.log(e);
			//Edit Stundeneintrag
			var val=this.value;
			
			var istanders=!((this.data.datstunde[this.data.nodeid]+'')==(val+''));
			if(e.type=="keyup" && e.keyCode==13)istanders=true;			
			if(!istanders)return;
			
			//'[object Array]' '[object String]'  '[object Number]' 
			//neu abspeichern, NAch Datentyp wandeln
			var dtyp=getDataTyp(this.data.datstunde[this.data.nodeid]);
			if( dtyp=== '[object Array]'){
				this.data.datstunde[this.data.nodeid]=val.split(',');//in Array wandeln, Trenner ist ein Komma
			}
			else
			if( dtyp=== '[object Number]'){
				if(isNaN(parseFloat(val)))val=0;
				this.data.datstunde[this.data.nodeid]=parseFloat(val); //Number
			}
			/*else
			if( dtyp=== '[object Boolean]'){
				
			}*/
			else{
				this.data.datstunde[this.data.nodeid]=decodeString(val); //String oder was anderes
			}
			
			if(this.data.o_sibling.timer!=undefined)clearTimeout(this.data.o_sibling.timer);
			
			
			addClass(this,"isedit");
			
			if(e.type=="keyup" && e.keyCode==13){//wenn Enter direkt senden (speichern)
				sendstundendatatimer(this);
			}
			else{
				//sonst etwas warten pb noch weitere Eingaben kommen
				//send projektdate/stundendata
				this.data.o_sibling.timer=setTimeout(sendstundendatatimer,2000,this);//2 sec warten, dann senden, es sei vorher kommen neue daten
			}
			refreshTab();
		}
		
		var sendstundendatatimer=function(input){
			var i;
			//editmarker entfernen
			for(i=0;i<input.data.o_sibling.elemente.length;i++){
				subClass(input.data.o_sibling.elemente[i],"isedit");
			}	
			postNewStundenData(input.data);
		}
		
		var postNewStundenData=function(data){
			//console.log("postNewStundenData:",data);//.typ .data .id
			var sdata="id="+data.projektdata.id
					+"&data="+JSON.stringify(data.datstunde);
			//console.log("send:",encodeURI(sdata));
//tatusDlg.show("",encodeURI(sdata),"");
			loadData("projektstundenlisteupdate",parseNewStundendata,"POST",encodeURI(sdata));
		}
		var parseNewStundendata=function(data){
			var i,o,s,HTMLnode,newdata;
			data=JSON.parse(data);
			//console.log("-->",data);
			
			//check error
			if(data.status!=undefined){
				if(data.status!=msg_OK)
					handleError(data.status);
				else{
					statusDlg.show("",getWort("aenderungsaved"),"statok");
				}
			}
			//OK
		}
		
	}


}

//Maincontainer
document.write("<div id='app_psa'></div>");

//Start nach dem Laden
window.addEventListener('load', function (event) {
		var o_sys=new pro_stunden_app();
		o_sys.ini("app_psa");
	});
