<?php

session_start();

# If user is not logged in don't do anything
if (!isset($_SESSION['logged_in'])) {
    header("Location: /sqnc/sqnc.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$seq_id = $_POST['id'];

###*********### **** connect to db and get requested sequence **** ###*********### 
try {
    $host = "localhost";
    $dbn = "sqnc_db";
    $user = "root";
    $pass = "";

    $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);


        # get all of the user's sequences in alphabetical order
        $getquery = $db->prepare("SELECT content FROM sequences 
                                WHERE user_id = ? AND id = ?
                                LIMIT 1");
        $getquery->execute(array($user_id, $seq_id));

        $sequence = $getquery->fetch(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode($sequence);
} catch(PDOException $ex) {
    # redirect with error
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => $ex->getMessage()]);
    exit;
}
?>