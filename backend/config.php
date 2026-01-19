<?php
// PETZEUSTECH NETWORKS - SYSTEM CORE v4.2
// Warning: This file contains sensitive access keys.

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Security Configuration
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Database Infrastructure
$dbhost = 'localhost';
$dbuser = 'zeus_admin';
$dbpass = ''; // User defined in setup-lemp.sh
$dbname = 'petzeustech_db';

// Primary Connection Cluster
$conn = @mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    header('Content-Type: application/json');
    die(json_encode([
        "error" => "Network Cluster Offline",
        "status" => 503,
        "message" => "Database node desynchronized. Please check VPS MariaDB status."
    ]));
}

// System Environment Paths
define('UPLOAD_DIR', '/var/www/petzeustech/uploads/');
define('ADMIN_EMAIL', 'admin@petzeustech.com');
define('SYSTEM_VERSION', '14.2.0');

// Unified API Response Engine
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Identity Verification Helper
function verifyAdmin() {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
        jsonResponse(["error" => "Access Denied: Architect Clearance Required"], 403);
    }
}
?>
