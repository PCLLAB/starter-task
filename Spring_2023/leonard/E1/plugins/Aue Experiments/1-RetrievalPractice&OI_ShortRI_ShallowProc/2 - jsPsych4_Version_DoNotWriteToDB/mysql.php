<?php
	$db = mysqli_connect("memory.psych.purdue.edu", "learnuser", ".Echo-360!", "memorylab");
	//$db = mysqli_connect("localhost", "root", "password1", "memorylab");
	//$db = mysqli_connect("localhost", "root", "root", "memorylab");
	if (!$db) {
	  die('<p class="error">Connect Error ('.mysqli_connect_errno().') '. mysqli_connect_error()."</p>");
	}
?>
