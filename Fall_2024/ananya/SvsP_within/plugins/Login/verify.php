<?php
session_start();

$id = $_SESSION['id'];
$condition = $_SESSION['condition'];
$week = $_SESSION['week'];
$grade = $_SESSION['grade'];
$school = $_SESSION['school'];

if (!isset($id)) {
    header('Location: ./index.php');
    exit();
}

$index = substr($condition, strpos($condition, '_') + 1);

// Building the redirect path
$relativePath = null;
if ($grade == '4') {
    $relativePath = 'SchoolResearch/Keywords/index.php';
} else if ($week == '2' || $week = '4') {
    $relativePath = 'MultilistRecall/SchoolExpt/experiment.html';
} else {
    $relativePath = 'SchoolResearch/Keywords5th/index.php';
}

$path = 'http://jarvis.psych.purdue.edu/weblab/' . $relativePath;

$argumentsArray = array(
    'workerId' => $id,
    'condition' => $index,
    'week' => $week
);

$path = $path . '?' . http_build_query($argumentsArray);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
</head>

<body>
<div id="clouds">
    <div style="height: 100px; width: 100%;"></div>
    <div id="main-box">
        <div class="circleBase type3">
            <p style="color: black;">School: <?php echo $school; ?><br>
                Grade: <?php echo $grade; ?><br>
                Week: <?php echo $week; ?><br>
                Condition: <?php echo $condition; ?><br>
        </div>
        <br><br>
        <div id="buttons">
            <input type="button" id="blue-button" style="font-weight: bold; font-size: 22px"
                   onClick="window.location = '<?php echo $path; ?>';"
                   value="Continue">
            <input type="button" id="blue-button" style="font-weight: bold; font-size: 22px"
                   onClick="window.location = './index.php';"
                   value="Go Back">
        </div>
    </div>
    <img id="robot" src="images/Robot.png">
    <div id="robot-submit">Make sure everything is correct before clicking continue!</div>
</div>

</body>
</html>