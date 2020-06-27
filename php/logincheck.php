<?php
	if(isset($_POST['username'])){
		//Logintest
		$newuser ="0";
		$basisdateien=[
			 [
				"file" =>"urlaub.js",
				"template"=>'{"id":"urlaub","titel":"Urlaub","info":{"startdatum":"","enddatum":"","tage":26,"gruppe":["theuser"],"auftraggeber":"","farbe":""},"stunden":[]}'
			 ],
			 [
				"file" =>"feiertage.js",
				"template"=>'{"id":"feiertage","titel":"Feiertage","info":{"land":"DE","farbe":""},"stunden":[]}'
			 ]
			];
		
		
		$user = htmlspecialchars($_POST['username']);
		$pass = $_POST['pass'];
		if (!empty($_POST['newuser']))
			$newuser = $_POST['newuser'];
		$isusertrue=true;
		
		
		if($user!=""){
			//check User
			
			//test ob Order(=user) existiert
			$userhome=$pfaddata.$user;
			$isusertrue=is_dir($userhome)===true;
			$mdpass=md5($pass);
			
			//check passwort
			if($isusertrue){
				$passdatei=$userhome."/pass.txt";				
				echo "<!--".$passdatei."-->";
				
				if (!$handle = fopen($passdatei, "r")) 
				{
					$isusertrue=false;
					$loginstatustext="404:no pass";
				}
				else{
					$dat=fgets($handle);
					fclose($handle);
					if($dat!==$mdpass){
						$isusertrue=false;
						$loginstatustext="wrong pass";
						}
				}
			}else{
				//echo "<!-- ".$user." md5:".$mdpass."-->";
				$loginstatustext="no user";
				
				if($newuser==="1"){
					echo "\n<!-- add new user-->\n";
					$loginstatustext="";
					if(mkdir($pfaddata.$user, 0777, true)){//create Directory
						//save md5pass
						if(!$file=fopen($pfaddata.$user."/pass.txt","w",0777)){}
						else{
							fwrite($file,$mdpass);
							fclose($file);
							$isusertrue=true;
						}
						
						//chmod($pfaddata.$user, 0777);
						
						//basisdateien erzeugen
						for($i=0;$i<count($basisdateien);$i++){
							$dateipfad=$pfaddata.$user."/".$basisdateien[$i]["file"];
							$template=$basisdateien[$i]["template"];
							$template=str_replace("theuser", $user, $template);
							
							if(!$file=fopen($dateipfad,"w",0777)){}
							else{
								fwrite($file,$template);
								fclose($file);
							}
						}
						
					}
					
				}
				
			}
					
			//user ok then new session go main.php
			if($isusertrue){
				//session_id("SID".$user.time());
				session_start();
				session_regenerate_id();
							
				$seiteaktiv="main";			
				//in Session speichern
				//session_start();
				$_SESSION['userid'] = $user;
				$_SESSION['sessid'] = "SID".$user.time();
				$_SESSION['seite'] = "main";
				
				//unset($_POST);
				//$_POST = array();			
				header('location: '.$seiteaktiv.'.php');
			}
		}
	}
?>
