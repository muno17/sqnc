<?php
###### upload sample info to db
###### add sample to sample folder

session_start();

# if user is not logged in don't do anything
if (!isset($_SESSION['logged_in'])) {
    header("Location: /sqnc/sqnc.php");
    exit;
}

$allowedExt = ['wav', 'mp3'];
$sampleDir = __DIR__ . "/samples/";
$user_id = $_SESSION['user_id'];


# check if a file was uploaded
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = basename($_FILES['file']['name']);
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    # check file type is valid
    if (!in_array($fileExt, $allowedExt)) {
        echo json_encode(["error" => "invalid_type"]);
        exit;
    }
    
    # create a unique name to prevent overwriting existing files
    $newFileName = uniqid("sample_", true) . "." . $fileExt;
    $targetFilePath = $sampleDir . $newFileName;

    # move uploaded file
    if (move_uploaded_file($fileTmpPath, $targetFilePath)) {
        $relative_url_path = "samples/" . $newFileName;

        # add sample info to db
        try {
            $host = "localhost";
            $dbn = "sqnc_db";
            $user = "root";
            $pass = "";

            $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
            $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

            # add a new sample entry
            # id (auto), user_id, file_path
            $insertquery = $db->prepare("INSERT INTO samples (user_id, name, file_path) 
                                        VALUES(?, ?)");
            $insertquery->execute(array($user_id, $fileName, $relative_url_path));
            
            echo json_encode([
                "success" => true,
                "id" => $db->lastInsertId(),
                "path" => $relative_url_path,
                "name" => $fileName
            ]);
        } catch(PDOException $ex) {
            echo json_encode(["error" => "db_error"]);
        }
    } else {
        echo json_encode(["error" => "move_failed"]);
    }
} else {
    echo json_encode(["error" => "upload_error"]);
}
?>