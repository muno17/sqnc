<?php
###### get all of the user's samples from the db
session_start();

# If user is not logged in don't do anything
if (!isset($_SESSION['logged_in'])) {
    header("Location: /sqnc/sqnc.php");
    exit;
}

$user_id = $_SESSION['user_id'];

###*********### **** connect to db and get user's samples**** ###*********### 
try {
    $host = "localhost";
    $dbn = "sqnc_db";
    $user = "root";
    $pass = "";

    $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);


        # get all of the user's sequences in alphabetical order
        $getquery = $db->prepare("SELECT id, name, file_path FROM samples
                                WHERE user_id = ? 
                                ORDER BY name");
        $getquery->execute(array($user_id));

        $samples = $getquery->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode($samples);
} catch(PDOException $ex) {
    # redirect with error
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => $ex->getMessage()]);
    exit;
}
?>