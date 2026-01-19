<?php
// PETZEUSTECH NETWORKS - CORE SYSTEM CONFIG
session_start();

// Database Infrastructure
$dbhost = 'localhost';
$dbuser = 'zeus_admin'; 
$dbpass = ''; // User will set this during setup-lemp.sh
$dbname = 'petzeustech_db';

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    die(json_encode(["error" => "Network Cluster Offline"]));
}

// Security Paths - Absolute path to folder outside web root
define('UPLOAD_DIR', '/var/www/petzeustech/uploads/');
define('ADMIN_EMAIL', 'admin@petzeustech.com');

// Helper: Secure Response
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>