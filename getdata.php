<?php 
	include "php/basis.php";
	session_start();
	$datenart=$_GET['dat'];
	$getstatus="";
	$dateipfad=$pfaddata.$_SESSION['userid']."/";
	
	
	function clearfilename($string){
		$string = urldecode($string);
		$string = str_replace(' ', '', $string);
		$string = str_replace('ä', 'ae', $string);
		$string = str_replace('ö', 'oe', $string);
		$string = str_replace('ü', 'ue', $string);
		$string = str_replace('ß', 'ss', $string);
		$string = str_replace('Ä', 'ae', $string);
		$string = str_replace('Ö', 'oe', $string);
		$string = str_replace('Ü', 'ue', $string);
		
		//$string = str_replace("%20", "", $string);
		// %...
		
		$erlaubt = '/[a-z0-9\_\.\-]+/i'; 
		preg_match_all($erlaubt, $string, $treffer);// "split"
		$string = implode('', $treffer[0]); 		// "join"

	 return $string;
	}	
	
	function getPostData($keyname){
		global $pfaddata;
		
		if (!empty($_POST[$keyname]))$re=$_POST[$keyname];//FF
		
		if(empty($re)){//Chrome "request payload"
			
			$request_body = file_get_contents('php://input');		//name=projektname&abdatum=1.11.2016
			if( strpos($request_body,$keyname)>-1 ){
				$p=strpos($request_body,$keyname);					//name=1234&wert=345
				if($p>-1){
					$p=strpos($request_body,"=",$p+1);//...=
					$re=substr($request_body,$p+1);					
					$p=strpos($re,"&");
					if($p>-1){
						$re=substr($re,0,$p);
					}
				}
				/*
				if (!$handleZiel = fopen($pfaddata."tmp.txt", "a")) 
					{}
					else{
						ffwrite($handleZiel,$request_body.chr(10));
						write($handleZiel,	$keyname.chr(10));
						fwrite($handleZiel,	$re.chr(10));
						fwrite($handleZiel,	"--------------------".chr(10));
						fclose($handleZiel);
					}
				*/
			}
		}
		
		return $re;
	}
	
	function convertoJSON($s){
		$s=urldecode($s);
		$s=json_decode($s, true);
		return $s;
	}
	
	function isUser(){
		global $pfaddata;
		return (is_dir($pfaddata.$_SESSION['userid'])===true  && !empty($_SESSION['userid']));
	}
	
	/*log:
	$proid=getPostData("id");
	$jsondata=getPostData("data");
	file_put_contents ( "log.txt" , $datenart.' '.$proid.' '.$jsondata.' '.convertoJSON($jsondata).' '.json_encode(convertoJSON($jsondata)).chr(10) ,FILE_APPEND);
	*/
	
	
	if($datenart==="maindata"){
		$getstatus=$msg_OK;
		if(!isUser()){
			$getstatus=$msg_error_noUserfound;
			}
		//return JSON-Data
		echo "{";
		echo "\"user\":\"".$_SESSION['userid']."\", ";
		echo "\"dat\":\"".$datenart."\", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
	}
	else
	if($datenart==="setoptionen"){
		$getstatus=$msg_OK;
		$name="optionen.txt";
		if(!isUser()){
			$getstatus=$msg_error_noUserfound;
			}
		else{
			$dateipfadname=$dateipfad.$name;
			
			$string=getPostData("data");
			
			$re=file_put_contents ( $dateipfadname , $string );
			if($re===false)
					$getstatus=$msg_error_FileNotwrite;
				else
					$getstatus=$msg_OK;
		}
		echo "{";
		echo "\"user\":\"".$_SESSION['userid']."\", ";
		//echo "\"dat\":\""."--"."\", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
	}
	else
	if($datenart==="getoptionen"){
		$getstatus=$msg_OK;
		$name="optionen.txt";
		$daten="{\"tabaktiv\":0}";
		//return JSON-Data
		if(!isUser()){
			$getstatus=$msg_error_noUserfound;
			}
		else{
			$dateipfadname=$dateipfad.$name;
			if(file_exists($dateipfadname)){
				$daten = file_get_contents($dateipfadname);
				if($daten===false){
					$daten="{\"tabaktiv\":0}";
				}
				$getstatus=$msg_OK;
			}
		};		
		echo "{";
		echo "\"user\":\"".$_SESSION['userid']."\", ";
		echo "\"dat\":".$daten.", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
	}
	else
	if($datenart==="projektdata"){//return JSON-Data
		$getstatus="...";
		$name=getPostData("name");
		//$abdatum=getPostData("abdatum");//optional, TODO
		
		if(!isUser()){
			$getstatus=$msg_error_noUserfound;
			$quelleready=false;
			}
		else{
			$dateipfadname=$dateipfad.$name.".js";
			$quelleready=false;
			if(file_exists($dateipfadname)){
				
				if (!$handleQuelle = fopen($dateipfadname, "r")) 
				{
					$getstatus=$msg_error_FileNotfound;
				}
				else{
					$getstatus=$msg_OK;
					$quelleready=true;
					
					while (($buffer = fgets($handleQuelle, 4096)) !== false) {
						echo $buffer;
					}
					if(!feof($handleQuelle)) {
						//$getstatus="Fehler: unerwarteter fgets() Fehlschlag";
					}	
					fclose($handleQuelle);
				}
			}else{
				$getstatus=$msg_error_FileNotfound;//"404:Datei nicht existent:".$dateipfadname;
			}
		}
		
		if(!$quelleready){
			echo "{";
			echo "\"user\":\"".$_SESSION['userid']."\", ";
			echo "\"name\":\"".$name."\", ";
			echo "\"dateipfadname\":\"".$dateipfadname."\", ";
			echo "\"lastaction\":\"".$datenart."\", ";
			echo "\"status\":\"".$getstatus."\"";
			echo "}";
		}
	}
	else
	if($datenart==="projektstundenlisteupdate"){//update/new Stunden
		$getstatus="...";
		$quelleready=true;
		
		$proid=getPostData("id");
		$jsondata=getPostData("data");
		//$json_b = convertoJSON($jsondata);
		
		
		$dateipfadname=$dateipfad.$proid.".js";
				
		if(!isUser()){//kein User -> Session beendet oder User gelöscht
			$getstatus=$msg_error_noUserfound;
			$quelleready=false;
		}
		else{
			//saveing...
			$quelleready=false;
			$dateibuffer="";
			$handlingstatus="";
			if(file_exists($dateipfadname)){
				//Datei einlesen
				$string = file_get_contents($dateipfadname);
				if($string===false){
					$getstatus=$msg_error_FileNotread;
				}
				else{
					//toJSON
					$json_a = convertoJSON($string);
					$json_b = convertoJSON($jsondata);
					//."stunden"
					$stundenliste=$json_a['stunden'];	//Liste wird kopiert
					$newStundenlist=[];
					
					//Eintragen oder updaten
					$eintragen=true;
					for($i=0;$i<count($stundenliste);$i++){
						$std=$stundenliste[$i];
						if($std['dat']===$json_b['dat']){
							$eintragen=false;
							$handlingstatus="change";
							if (!empty($json_b['deleting'])){
								if($json_b['deleting']===true){
									//Element löschen
									$handlingstatus="deleting";
								}	
							}
							if($handlingstatus=="change"){
								array_push($newStundenlist,$json_b);
							}
						}
						else{
							array_push($newStundenlist,$std);
						}
					}
					if($eintragen){
						array_push($newStundenlist,$json_b);//neuer Eintrag
						$handlingstatus="add";
					}
					$json_a['stunden']=$newStundenlist;	//neue Liste zuweisen
					
					//schreiben
					$string=json_encode($json_a);
					$string=str_replace("},", "},".chr(10), $string);
					//$string=str_replace(',"', ','.chr(10).'"', $string);->fehler! wenn "123,"
					//$getstatus=str_replace('"', '|', $string);
					
					$re=file_put_contents ( $dateipfadname , $string );
					if($re===false)
							$getstatus=$msg_error_FileNotwrite;
						else
							$getstatus=$msg_OK;
				}
			}else{
				$getstatus=$msg_error_FileNotfound;//Datei zwischenzeitlich gelöscht, oder Session beendet
			}
		}
		
		
		//Rückgabe Status der Operation
		echo "{";
		echo "\"user\":\"".$_SESSION['userid']."\", ";
		echo "\"id\":\"".$proid."\", ";
		echo "\"handlingstatus\":\"".$handlingstatus."\", ";
		echo "\"dateipfadname\":\"".$dateipfadname."\", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
		
	}
	else
	if($datenart==="projekttitelupdate"){
		$getstatus="...";
		$quelleready=true;
		
		$proid=getPostData("id");
		$jsondata=getPostData("data");
		
		$dateipfadname=$dateipfad.$proid.".js";
		
		
		if(!isUser()){//kein User -> Session beendet oder User gelöscht
			$getstatus=$msg_error_noUserfound;
			$quelleready=false;
		}
		else{
			$quelleready=false;
			$dateibuffer="";
			$handlingstatus="";
			if(file_exists($dateipfadname)){
				//Datei einlesen
				$string = file_get_contents($dateipfadname);
				if($string===false){
					$getstatus=$msg_error_FileNotread;
				}
				else{
					//toJSON
					$json_a = convertoJSON($string);
					$json_b = convertoJSON($jsondata);
					
					//."titel"
					$json_a["titel"]=$json_b["titel"];	
					
					//schreiben
					$string=json_encode($json_a);
					$string=str_replace("},", "},".chr(10), $string);
					$string=str_replace(',"', ','.chr(10).'"', $string);
					//$getstatus=str_replace('"', '|', $string);
					
					$re=file_put_contents ( $dateipfadname , $string );
					if($re===false)
							$getstatus=$msg_error_FileNotwrite;
						else
							$getstatus=$msg_OK;
				}
			}else{
				$getstatus=$msg_error_FileNotfound;//Datei zwischenzeitlich gelöscht, oder Session beendet
			}
		}
		//Rückgabe Status der Operation
		echo "{";
		echo "\"user\":\"".$_SESSION['userid']."\", ";
		echo "\"id\":\"".$proid."\", ";
		echo "\"handlingstatus\":\"".$handlingstatus."\", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"dateipfadname\":\"".$dateipfadname."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
	}
	else
	if($datenart==="projektinfoupdate"){
		$getstatus="...";
		$quelleready=true;
		
		$proid=getPostData("id");
		$jsondata=getPostData("data");
		
		$dateipfadname=$dateipfad.$proid.".js";
		
		if(!isUser()){//kein User -> Session beendet oder User gelöscht
			$getstatus=$msg_error_noUserfound;
			$quelleready=false;
		}
		else{
			
			$quelleready=false;
			$dateibuffer="";
			$handlingstatus="";
			if(file_exists($dateipfadname)){
				//Datei einlesen
				$string = file_get_contents($dateipfadname);
				if($string===false){
					$getstatus=$msg_error_FileNotread;
				}
				else{
					//toJSON
					$json_a = convertoJSON($string);
					$json_b = convertoJSON($jsondata);
					
					//."titel"
					$json_a["info"]=$json_b;	
					
					//schreiben
					$string=json_encode($json_a);
					$string=str_replace("},", "},".chr(10), $string);
					$string=str_replace(',"', ','.chr(10).'"', $string);
					//$getstatus=str_replace('"', '|', $string);
					
					//$handlingstatus=json_encode($json_b);//debug
					
					$re=file_put_contents ( $dateipfadname , $string );
					if($re===false)
							$getstatus=$msg_error_FileNotwrite;
						else
							$getstatus=$msg_OK;
				}
				
			}else{
				$getstatus=$msg_error_FileNotfound;//Datei zwischenzeitlich gelöscht, oder Session beendet
			}
			
		}
		//Rückgabe Status der Operation
		echo "{";
		echo "\"user\":\"".$_SESSION['userid']."\", ";
		echo "\"id\":\"".$proid."\", ";
		echo "\"handlingstatus\":\"".$handlingstatus."\", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"dateipfadname\":\"".$dateipfadname."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
		
	}
	else
	if($datenart==="newprojekt"){//create new Projektdata	
		$getstatus="...";
		
		$namedata=getPostData("newdata");
		
		if(empty($namedata)){
			$namedata="fehler";
		}
				
		$newProjektname=clearfilename($namedata);		
		if(strlen($newProjektname)<10){
			$newProjektname=$newProjektname."_".md5($newProjektname.time());
		}
		
		$titel=htmlentities(urldecode($namedata));
		
		//gibt es Datei schon?
		$zieldateilinkpfad=$dateipfad.$newProjektname;
		
		$quelleready=false;
		
		$counter=1;
		while(file_exists($zieldateilinkpfad.".js")){
			$zieldateilinkpfad=$zieldateilinkpfad.$counter;
			$counter++;
			if($counter>20)break;
		}
		
		if (!$handleQuelle = fopen($pfadtemplates."proj_template.js", "r")) 
		{
			$getstatus=$msg_error_noProjektTemplate;
		}
		else{
			$quelleready=true;
		}
		
		
		if($quelleready){
			if (!$handleZiel = fopen($zieldateilinkpfad.".js", "w",0777)) 
			{
				$getstatus=$msg_error_createError;
				if(!isUser()){
					$getstatus=$msg_error_noUserfound;
					//header('location: index.php');
				}
			}
			else{
				//dublicate "proj_template.js"				
				$heute=date("Y-m-d");
				
				while (($buffer = fgets($handleQuelle, 4096)) !== false) {
					$buffer =str_replace('$ID', $newProjektname, $buffer);
					$buffer =str_replace('$TITEL', $titel, $buffer);
					$buffer =str_replace('$HEUTE', $heute, $buffer);
					fwrite($handleZiel,$buffer);
				}
				if(!feof($handleQuelle)) {
					//$getstatus="Fehler: unerwarteter fgets() Fehlschlag";
				}
				$getstatus=$msg_OK;
			}
			fclose($handleZiel);
			fclose($handleQuelle);
		}
		echo "{";
		//echo "\"user\":\"".$_SESSION['userid']."\", ";
		//echo "\"daten\":\"".$_POST["newdata"]."\", ";
		echo "\"filename\":\"".$newProjektname."\", ";
		echo "\"titel\":\"".$titel."\", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"info\":\"".date("Y-m-d")."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
	
	}
	else
	if($datenart==="projektliste"){//alle *.js Datei-namen sammeln und zurückgeben
		$getstatus="OK";
		$counter=0;
		
		if(!isUser())$getstatus=$msg_error_noUserfound;
					
		//scann Dateipfad
		$files = scandir($dateipfad);
		echo "{";
		echo "\"dat\":[";
		
		foreach($files as $file)
        {
			if (($file == '.')||($file == '..')||is_dir($dateipfad.'/'.$file))
                {}
				else{
					if(strpos($file,'.js')>0){
						$zdatum= date ("d.m.Y H:i:s", filemtime($dateipfad.'/'.$file));
						
						$teile= explode (".", $file);
						$dateiname=$teile[0];
						
						if($counter>0)echo ", ";
						echo "{";
						echo "\"name\":\"".$dateiname."\" ,";
						echo "\"dat\":\"".$zdatum."\" ";
						echo "}";
						$counter++;
					}
				}
				
		}
		
		echo "], ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"status\":\"".$getstatus."\"";
		echo "}";
	}
	
	if($getstatus===""){
		echo "{";
		echo "\"dat\":\"".$datenart."\", ";
		echo "\"lastaction\":\"".$datenart."\", ";
		echo "\"status\":\"ERROR\"";
		echo "}";
	}
?>
