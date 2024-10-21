<?php
	$dbc = mysql_connect("memory.psych.purdue.edu", "learnuser", ".Echo-360!", "memorylab");
	// $dbc = mysql_connect('localhost', 'root', 'root');
	mysql_select_db('memorylab', $dbc);
?>
