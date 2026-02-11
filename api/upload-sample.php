<?php
###### upload sample info to db
###### add sample to sample folder

session_start();

$sampleDir = __DIR__ . "/samples/";

# Double check that accepted file type was uploaded
$allowedExt = ['wav', 'mp3'];
$uploadSuccess = false;
$error = '';




# Check if a file was uploaded
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileName = basename($_FILES['file']['name']);
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    # Check file type is valid
    if (!in_array($fileExt, $allowedExt)) {
        $error = "invalid_type";
    } else {
        $targetFilePath = $sampleDir . $fileName;

        # Move uploaded file
        if (move_uploaded_file($fileTmpPath, $targetFilePath)) {
            $uploadSuccess = true;

            # Create a unique id for the sample to reference easily
            $current_id = uniqid("");

            # Clean up the file path to the file to only get the relative URL path
            $site_root_path = __DIR__ . "/";
            $relative_url_path = str_replace($site_root_path, "", $targetFilePath);

            # Get the file size in bytes
            $file_size_bytes = $_FILES['file']['size'];

            if ($file_size_bytes < 1048576) {
                // If less than 1 MB, calculate size in KB
                // Round to nearest KB
                $file_size_display = round($file_size_bytes / 1024, 0);
                $unit = "KB";
            } else {
                // Calculate size in MB
                $file_size_display = round($file_size_bytes / 1048576, 2);
                $unit = "MB";
            }

            # Add info to the sample db, this will be used by the libraries and packs
            $sampleInfo = $_SESSION['username'].",".$_POST["name"].",".$_POST["notes"].","
            .$_POST["visibility"].",".$relative_url_path.",".date("m/d/y").",".
            $file_size_display . " " . $unit . "," . $current_id ."\n";

            file_put_contents(__DIR__ . "/db/samples.txt", $sampleInfo, FILE_APPEND);
        } else {
            $error = "move_failed";
        }
    }
} else {
    $error = "no_file";
}

// Redirect back to update page
if ($uploadSuccess) {
    header("Location: upload.php?success=1");
} else {
    header("Location: upload.php?error=$error");
}
exit;


?>