<div class="login">
	<div class="blob">
		<div class="logo">PROSTd</div>
		<form method="post" action="index.php">
			<?php echo "<p class='status'>".$loginstatustext."</p>"; ?>
			<p><span>Name:</span> <input name="username" type="text" value=""></p>
			<p><span>Kennwort:</span> <input name="pass" type="password"></p>
			<p><span></span> <button type="submit" class="loginbutt">anmelden</button></p>
			<?php
if($loginstatustext=="no user"){
			
			echo '<input name="newuser" type="hidden" value="1">';
			echo '<p><span></span> <button type="submit" class="reginbutt">registrieren</button ></p>';
}
			?>
		</form>
	</div>
</div>