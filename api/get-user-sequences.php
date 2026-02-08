<?php

session_start();

# If user is not logged in don't do anything
if (!isset($_SESSION['logged_in'])) {
    header("Location: /sqnc/sqnc.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$json = file_get_contents('php://input');  // access to raw data from the request body
$data = json_decode($json, true);
$name = $data['name'];

###*********### **** connect to db and get user's sequences**** ###*********### 
try {
    $host = "localhost";
    $dbn = "sqnc_db";
    $user = "root";
    $pass = "";

    $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);


        # get all of the user's sequences in alphabetical order
        $getquery = $db->prepare("SELECT id, name FROM sequences 
                                WHERE user_id = ? 
                                ORDER BY name");
        $getquery->execute(array($user_id));

        $sequences = $getquery->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($sequences);
} catch(PDOException $ex) {
    # redirect with error
    die("Database error: " . $ex->getMessage());
    header("Location: /sqnc/sqnc.php");
    exit;
}
?>