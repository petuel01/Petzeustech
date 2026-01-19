<?php
// PETZEUSTECH NETWORKS - SYSTEM CORE v15.5
// Production Host: petzeustech.duckdns.org

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Security Headers for Production Environment
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Database Connection Cluster
$dbhost = 'localhost';
$dbuser = 'zeus_admin';
$dbpass = 'Petuel99.5'; // Mandated Password
$dbname = 'petzeustech_db';

$conn = @mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    header('Content-Type: application/json');
    die(json_encode([
        "error" => "Network Cluster Offline",
        "message" => "Database sync failed. Verify Petuel99.5 credentials."
    ]));
}

// Global System Constants
define('SYSTEM_DOMAIN', 'petzeustech.duckdns.org');
define('UPLOAD_DIR', '/var/www/petzeustech_uploads/');
define('ADMIN_EMAIL', 'admin@petzeustech.com');
define('SYSTEM_VERSION', '15.5.0');

/**
 * Standardized JSON API Response
 */
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>