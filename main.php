<html lang="de">
<head>
	<title>main</title>
 
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<!--<meta http-equiv="X-UA-Compatible" content="IE=10">-->
	<meta charset="UTF-8" />
 
	<!-- IE9  9 edge
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />-->
 
	<!-- iOS -->
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
 
	<link type="text/css" rel="stylesheet" href="style.css" />  
	<link type="text/css" rel="stylesheet" href="stylewww.css" />  
	<?php 
	session_start();
	include "php/basis.php";
	$seiteaktiv=$_SESSION['seite'];
	$sessionuser=$_SESSION['userid'];
	$sessionID=$_SESSION['sessid'];
	
	if($sessionuser=="") header('location: index.php');//go to login
	
	echo "<!--";
	echo "SESSION:".($sessionuser==0)."\nsuser=".$sessionuser."\nstat=".session_status()."\nsid=".session_id()."\nsid:".$sessionID."\n";
	echo "go:".$pfadphp.$seiteaktiv.".php\n";
	echo "-->";
	?>
	<script>
	//Aktueller User"name" für Stundeneintrag
	var globaldata={
		"user":"<?php echo $_SESSION['userid'];?>"
	}
	</script>
</head>
<body class="main">
<nav>
	 <div class="logo">PROSTd</div>
	 <a href="index.php" class="icon_logout" title="logout"></a>
	 <?php
		echo "<h1>Hallo ".$_SESSION['userid']."</h1>";
	 ?>
	 <div id="tabnav"></div>
</nav>
<?php 
 	include $pfadphp.$seiteaktiv.".php"; 	
?> 
</body>
</html>
