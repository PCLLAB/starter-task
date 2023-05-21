<?php
session_start();

$id = $_POST['id'];
$week = $_POST['week'];
$condition = $_POST['condition'];

if (isset($id) && intval($week) > 0) {

    $error = null;
    //check that it's all digits and it's length is 4
    if (empty($id)) {
        $error = "The subject id should be your username.";
    }

    if (!$error) {
        // Including this path fill out the $db variable
       
        //$db_server_credentials = '/srv/weblab/mysql.php';
        $db = "memorylab";

        if (!empty($db)) {
            include 'mysql.php';

        if (file_exists($path)) {
            include_once $db_server_credentials;
        } else {
            // parameters: ip, user, password, db name
            $db = new mysqli('127.0.0.1', 'root', 'p', 'test');
        }


        // FIXME: prone to sql injection, should change to binding

        $query = 'SELECT * FROM SchoolResearch_conditions WHERE SubjectID = "' . $id . '"';
        $results = $db->query($query);
        $row = mysqli_fetch_array($results);

        if ($row == null) {
            $error = 'Hmm, that ID doesn\'t exist. Please try again.';
        } else {
            $_SESSION['id'] = $id;
            $_SESSION['week'] = $week;
            $_SESSION['text'] = $row["Week" . $_SESSION['week'] . "_Text"];
            $_SESSION['activity'] = 'Start';
            $_SESSION['school'] = $row['School'];
            $_SESSION['teacher'] = $row['Teacher'];
            $_SESSION['grade'] = $row['Grade'];

            if ($condition == "Default") {
                $_SESSION['condition'] = $row["Week" . $_SESSION['week'] . "_Condition"];

            } else {
                $_SESSION['condition'] = $condition;
                $column = "Week" . $_SESSION['week'] . "_Condition";

                // FIXME: sql injection
                $query = 'UPDATE `SchoolResearch_conditions` SET `' . $column . '` = "' . $_SESSION['condition'] . '" WHERE SubjectID = "' . $id . '"';
                $db->query($query);
            }

            header('Location:verify.php');

        }
    }
}
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
    <div id="conditions4" style="float: left; text-align: left; font-weight: bold;">4th Grade:<br>Keywords_1 = Read <br>
        Keywords_2 = Read+ID<br> Keywords_3 = Read-->FITB<br> Keywords_4 = Read+ID-->FITB<br>Default = uses what's in
        the database
    </div>
    <?php if ($error) {
        echo '<div style=" position: absolute; margin: auto; left: 0; right: 0; top:20px; font-size: 18px; color:red; float:left; text-align: center; font-weight: bold;">' . $error . '</div>';
    } ?>
    <div id="conditions5" style="float: right; text-align: left; font-weight: bold;">5th Grade:<br>Keywords_1 =
        Read-->FITB-WB <br> Keywords_2 = Read+ID-->FITB-WB<br> Keywords_3 = Read-->FITB<br> Keywords_4 =
        Read+ID-->FITB<br>Default = uses what's in the database
    </div>
    <br><br><br><br><br><br><br><br><br>
    <div style="height: 50px; width: 100%;"></div>
    <div id="pentagon">
        <form id="initialForm" name="initialForm" method="post" action="">
            <p style="padding-top: 75px;">Please put your subject number<br>and your initials in the box below</p>
            <p>If you do not have a number raise your <br>hand and someone will come help you</p>
            <div id="right-justify">
                Username: <input id="n" type="text" name="id" maxlength="24" value="<?php if (isset($id)) echo $id; ?>"><br>
                <br>
                Condition:
                <select name="condition" value="<?php echo $condition; ?>" style="margin-right: 60px;">
                    <option value="Default">---Default---</option>
                    <option <?php if ($condition == 'Keywords_1') print 'selected '; ?> value="Keywords_1">
                        Keywords_1
                    </option>
                    <option <?php if ($condition == 'Keywords_2') print 'selected '; ?> value="Keywords_2">
                        Keywords_2
                    </option>
                    <option <?php if ($condition == 'Keywords_3') print 'selected '; ?> value="Keywords_3">
                        Keywords_3
                    </option>
                    <option <?php if ($condition == 'Keywords_4') print 'selected '; ?> value="Keywords_4">
                        Keywords_4
                    </option>
                </select>
                <br><br>
                Week:
                <select name="week" value="<?php echo $week; ?>">
                    <option value=>-Select-</option>
                    <option <?php if ($week == '1') print 'selected '; ?> value="1"> Week 1</option>
                    <option <?php if ($week == '2') print 'selected '; ?> value="2"> Week 2</option>
                    <option <?php if ($week == '3') print 'selected '; ?> value="3"> Week 3</option>
                    <option <?php if ($week == '4') print 'selected '; ?> value="4"> Week 4</option>
                </select>
            </div>
        </form>
    </div>
    <img id="robot" src="images/Robot.png">
    <div id="robot-submit">After you've typed in your subject number click me to continue!</div>
    <div id="robot-click"><a onClick="$('#initialForm').submit();" class="fill-div"></a></div>
</div>

</body>
</html>
