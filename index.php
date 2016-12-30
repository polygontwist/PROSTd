<html lang="de">
<head>
	<title>ProStd</title>
 
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta charset="UTF-8" />
 
	<!-- IE9  9 edge-->
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
 
	<!-- iOS -->
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
 
	<link href="style.css" rel="stylesheet" type="text/css">  
	<?php 
	session_start();
	session_destroy();
	include "php/basis.php";
	
	$seiteaktiv="login";//default 
	
	include "php/logincheck.php";
	
	$sessionuser=$_SESSION['userid'];
	
	echo "<!--";
	echo "SESSION:".($sessionuser==0)." suser=".$sessionuser." stat=".session_status()." sid=".session_id()." sid:".$sessionID."<br>";
	echo "go:".$pfadphp.$seiteaktiv.".php<br>";
	echo "-->";
	?>
</head>
<body>

<!--<nav class="menue">[LOGIN]</nav>-->
<?php 
	include $pfadphp.$seiteaktiv.".php"; 	
?> 

</body>
</html>
