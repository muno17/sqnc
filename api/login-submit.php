<?php
session_start();

# If username or password missing
if ($_POST['username'] == "" && $_POST['password'] == "") {
    # Reload Log In screen with error message
    $error = "logerror";
    $url = "/sqnc/login.php?logerror=" . urlencode($error);
    header("Location: $url");
    exit;
}

# if logging in as user
$username = $_POST["username"];
$password = $_POST["password"];

###*********### **** connect to db and do this below **** ###*********### 
# Open users.txt and create an array with each line in the file
# being a user
$userDb = file_get_contents(__DIR__ . "/db/users.txt");
$users = explode("\n", $userDb);

$userFlag = 0;
# Loop through the array of users to see if the user exists
foreach($users as $user) {
    # Create an array containing the user's info
    $user_info = explode(",", $user);

    # If the current line's username matches, assign its password to a variable
    if ($user_info[3] == $username) {
        $user_pw = $user_info[4];
        $userFlag = 1;

        # Break once user is found
        break;
    } 
}

if ($userFlag == 0) {
    # User not found, reload Log In screen with error message
    $error = "username";
    $url = "/sqnc/login.php?error=" . urlencode($error);
    header("Location: $url");
    exit;
} else {
    # User found, check password
    if ($user_pw == $password) {
        # Password matches, log user in
        $_SESSION['username'] = $username;
        $_SESSION['logged_in'] = true;

        # Redirect to dashboard
        header("Location: /sqnc/sqnc.php");
    } else {
        # Password doesn't match, reload Log In screen with error message
        $error = "password";
        $url = "/sqnc/login.php?error=" . urlencode($error);
        header("Location: $url");
        exit;
    }
}
?>