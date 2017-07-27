<?php
	include "basis.php";
	
	session_start();
	session_regenerate_id();
	
	$sessionuser=$_SESSION['userid'];
	
	$cssdatei='../'.$pfaddata.$sessionuser."/style.css";
	if ($handle = fopen($cssdatei, "r")){
		$dat= fread($handle, filesize($cssdatei));
		fclose($handle);
		echo $dat;
		
	}else{
		echo '';
	}	
 ?>