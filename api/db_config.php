<?php

$host = '127.0.0.1'; 
$db   = 'sqnc_db';
$user = 'root';
$pass = ''; // Default XAMPP password is blank
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

try {
     $pdo = new PDO($dsn, $user, $pass);
     // Enable exceptions for easier debugging
     $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
     die("Database connection failed: " . $e->getMessage());
}
?>