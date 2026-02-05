<?php
// start session
session_start();

?>
<!DOCTYPE html>
<html lang="en">
    <!-- Web Programming, sqnc drum machine -->
    <!-- shared page top HTML -->

    <head>
        <title>sqnc</title>
        <meta charset="utf-8" />
        <link href="style/sqnc.css" type="text/css" rel="stylesheet" />
        <script src="http://unpkg.com/tone"></script>
        <script src="js/audio-engine.js"></script>
        <script src="js/ui-controls.js"></script>
        <script src="js/sequencer.js"></script>
    </head>

    <body>
        <header>
            <?php
            # if guest, have logo redirect to public library
            if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true 
                    && $_SESSION['username'] === 'guest') {
                ?>
                    <a href="sqnc.php" id="header-logo">sqnc</a>
                <?php
            } else {
                ?>
                <a href="sqnc.php" id="header-logo">sqnc</a>
                <?php 
            }
            ?>
            <div id="options">
                <?php
                    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true
                    && ($_SESSION['username'] != 'guest')) {
                    ?>
                    <a href="userlib.php">User Library</a>
                    <a href="api/logout.php">Log Out</a>
                    <?php
                    } elseif(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true 
                    && $_SESSION['username'] === 'guest') {
                    ?>
                        <a href="publib.php">Public Library</a>
                        <a href="login.php">Log In</a>
                    <?php
                    }
                    else {
                    ?>
                    <a href="login.php">Log In</a>
                    <?php
                    }
                    ?>
            </div>
        </header>