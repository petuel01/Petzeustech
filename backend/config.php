<?php
// PETZEUSTECH NETWORKS - CORE SYSTEM CONFIG
// This file is automatically synchronized with the setup-lemp.sh environment.

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Infrastructure
$dbhost = 'localhost';
$dbuser = 'zeus_admin'; // Updated to match script
$dbpass = ''; // User sets this during deployment
$dbname = 'petzeustech_db';

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    header('Content-Type: application/json');
    die(json_encode(["error" => "Network Cluster Offline (DB Connection Failed)"]));
}

// Security Paths - Mapped to /var/www/petzeustech
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