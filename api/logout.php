<?php
// Start the session
session_start();

// Unset all session variables
$_SESSION = array();

// If you want to also delete the session cookie:
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000, // Set expiration in the past
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}
// Finally, destroy the session
session_destroy();

// redirect to main page
header("Location: /sqnc/sqnc.php");
exit;
?>