<?php
	if(isset($_POST['username'])){
		//Logintest
		$user = htmlspecialchars($_POST['username']);
		$pass = $_POST['pass'];
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