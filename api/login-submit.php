<?php
###### log a user in, perform validation

session_start();

# If username or password missing
if (empty($_POST['username']) || empty($_POST['password'])) {
    # Reload Log In screen with error message
    $error = "logerror";
    header("Location: /sqnc/login.php?error=$error");
    exit;
}

# get user login info
$username = $_POST["username"];
$password = $_POST["password"];

###*********### **** connect to db and query **** ###*********### 
try {
    $host = "localhost";
    $dbn = "sqnc_db";
    $user = "root";
    $pass = "";

    $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

    # query for the user
    $selectquery = $db->prepare("SELECT id, username, password FROM users
                                WHERE username = ?");
    $selectquery->execute(array($username));

    $user = $selectquery->fetch();

    # if user exists
    if ($user) {
        // check if password matches
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['logged_in'] = true;
            header("Location: /sqnc/sqnc.php");
            exit;
        } else {
            # password doesn't match
            $error = "password";
            header("Location: /sqnc/login.php?error=$error");
            exit;
        }
    } else {
        # user doesn't exist
        $error = "username";
        header("Location: /sqnc/login.php?error=$error");
        exit;
    }

} catch(PDOException $ex) {
    # redirect with error
    die("Database error: " . $ex->getMessage());
    $error = "username";
    header("Location: /sqnc/login.php?error=$error");
    exit;
}
?>