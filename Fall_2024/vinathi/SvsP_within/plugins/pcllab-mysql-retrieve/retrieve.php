<?php

//  The script you link should contain the following two lines:
//
//  $dbc = mysqli_connect('localhost', 'username', 'password', 'database');
//

// this is where the credentials to our database is
include 'localMysql.php'; // for testing on local machines
//include '/srv/weblab/mysql.php';

// You should provide the name for the table
$tableName = "retrieve_test";

if (!$tableName) {
    die("Table name is missing!");
}

if (!$dbc) {
    die("Database connection is missing!");
}

$workerId = mysqli_real_escape_string($dbc, $_POST['workerId']);

$res = mysqli_query($dbc, "SELECT * FROM $tableName WHERE workerId = '$workerId';");
$row = mysqli_fetch_assoc($res);

echo json_encode($row);

mysqli_close($dbc);
