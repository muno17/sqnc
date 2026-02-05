<?php
session_start();
$username = $_POST["username"];
# Open users.txt and create an array with each line in the file
# being a user
$userDb = file_get_contents(__DIR__ . "/db/users.txt");
$users = explode("\n", $userDb);

$userFlag = 0;
# Loop through the array of users to see if the username already exists
foreach($users as $user) {
    # Create an array containing the user's info
    $user_info = explode(",", $user);

    # If the current line's username matches, update the flag 
    if ($user_info[3] == $username) {
        $userFlag = 1;

        # Break if username is found
        break;
    } 
}

if ($userFlag == 1) {
    # Username exists, reload Sign Up screen with error message
    $error = "username";
    $url = "/sqnc/signup.php?error=" . urlencode($error);
    header("Location: /sqnc/signup.php?error=$error");
    exit;
}
?>
<!--
<strong>Thank you!</strong>
<p>Welcome to smpld, <?=$_POST["username"]?>!</p>
<p>You are now logged in.</p>
-->
<?php
    # Create a string containing the user's account info using the POST query
    # parameters in the format: firstname, lastname, email, username, password,
    # date signed up
    $userInfo = $_POST["firstname"].",".$_POST["lastname"].",".$_POST["email"].","
    .$_POST["username"].",".$_POST["password"].",".date("m/d/y")."\n";
    
    # Append the user info string to the users.txt db file
    # Each user has their own line in the file
file_put_contents(__DIR__ . "/db/users.txt", $userInfo, FILE_APPEND);

# Password matches, log user in
        $_SESSION['username'] = $username;
        $_SESSION['logged_in'] = true;

        // Redirect to a protected page
        #header("Location: dashboard.php");
        #exit;
        header("Location: /sqnc/sqnc.php");

?>