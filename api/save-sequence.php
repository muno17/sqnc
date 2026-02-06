<?php
session_start();

$json = file_get_contents('php://input');
$data = json_decode($json, true);


?>