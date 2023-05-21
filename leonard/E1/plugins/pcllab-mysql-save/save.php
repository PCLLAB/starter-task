<?php

//  The script you link should contain the following two lines:
//
//  $dbc = mysqli_connect('localhost', 'username', 'password', 'database');
//

// this is where the credentials to our database is
include 'localMysql.php'; // for testing on local machines
//include '/srv/weblab/mysql.php';

// You should provide the name for the table
$tableName = "save_test";

if (!$tableName) {
    die("Table name is missing.");
}

if (!$dbc) {
    die("Database connection is missing.");
}

$data = json_decode($_POST['data'], true);

if (!isset($data) || !$data) {
    die("Data is not in a correct format.");
}

$freq = [];

foreach ($data as &$trial) {
    unset($trial['internal_node_id']);
    unset($trial['time_elapsed']);
    unset($trial['trial_index']);

    if (!isset($freq[$trial['trial_type']])) {
        $freq[$trial['trial_type']] = [1, 1];
    } else {
        $freq[$trial['trial_type']][0] ++;
    }
}

$newData = [];

foreach ($data as $trial) {
    if ($freq[$trial['trial_type']][0] > 1) {
        $tempTrial = [];
        foreach ($trial as $trialKey => $trialValue) {
            if ($trialKey == 'trial_type') {
                continue;
            }
            $tempTrial[$trialKey . $freq[$trial['trial_type']][1]] = $trialValue;
        }
        array_push($newData, $tempTrial);
        $freq[$trial['trial_type']][1]++;
    } else {
        array_push($newData, $trial);
    }
}

$data = $newData;

foreach ($data as &$trial) {
    unset($trial['trial_type']);
}

$ip = $_SERVER['REMOTE_ADDR'];

$keys = "";
$values = "";

$keys .= '`ip`';
$values .= "'$ip'";

foreach ($data as $trial) {
    foreach ($trial as $key => $value) {
        if ($keys != "") {
            $keys .= ',';
            $values .= ',';
        }
        $keys .= '`' . mysqli_real_escape_string($dbc, $key) . '`';
        $values .= '\'' . mysqli_real_escape_string($dbc, $value) . '\'';
    }
}

$query = "INSERT INTO $tableName ($keys) VALUES ($values);";

if (mysqli_query($dbc, $query)) {
    mysqli_close($dbc);
    exit();
} else {
    mysqli_close($dbc);
    exit();
    die("Could not save the data.");
}
