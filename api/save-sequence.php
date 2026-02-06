<?php
session_start();

# If user is not logged in don't do anything
if (!isset($_SESSION['logged_in'])) {
    header("Location: /sqnc/sqnc.php");
    exit;
}


$json = file_get_contents('php://input');
$data = json_decode($json, true);
$name = $data['name'];

###*********### **** connect to db and insert **** ###*********### 
try {
    $host = "localhost";
    $dbn = "sqnc_db";
    $user = "root";
    $pass = "";

    $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

    # id (auto), user_id, name, content, timestamp (auto)
    $insertquery = $db->prepare("INSERT INTO sequences (user_id, name, content) 
                                VALUES(?, ?, ?)");
    $insertquery->execute(array($_SESSION['user_id'], $name, $json));

} catch(PDOException $ex) {
    # redirect with error
    die("Database error: " . $ex->getMessage());
    header("Location: /sqnc/sqnc.php");
    exit;
}
?>