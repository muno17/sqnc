<?php
session_start();

# If user is not logged in don't do anything
if (!isset($_SESSION['logged_in'])) {
    header("Location: /sqnc/sqnc.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$json = file_get_contents('php://input'); // access to raw data from the request body
$data = json_decode($json, true);
$name = $data['name'];

# check if sequence already exists
$seq_id = null;
if (isset($data['id'])) {
    $seq_id = $data['id'];
} 

###*********### **** connect to db and update/insert**** ###*********### 
try {
    $host = "localhost";
    $dbn = "sqnc_db";
    $user = "root";
    $pass = "";

    $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

    if ($seq_id) {
        # update an existing sequence
        $updatequery = $db->prepare("UPDATE sequences SET name = ?, content = ?
                                    WHERE id = ? AND user_id = ?");
        $updatequery->execute(array($name, $json, $seq_id, $user_id));
        echo json_encode(["id" => $seq_id]);
    } else {
        # add a new sequence
        # id (auto), user_id, name, content, timestamp (auto)
        $insertquery = $db->prepare("INSERT INTO sequences (user_id, name, content) 
                                    VALUES(?, ?, ?)");
        $insertquery->execute(array($user_id, $name, $json));
        
        # add auto created id to json object
        $id = $db->lastInsertId();
        echo json_encode(["id" => $id]);
    }

} catch(PDOException $ex) {
    # redirect with error
    die("Database error: " . $ex->getMessage());
    header("Location: /sqnc/sqnc.php");
    exit;
}
?>