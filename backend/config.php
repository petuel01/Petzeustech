<?php
/**
 * PETZEUSTECH NETWORKS - SYSTEM CORE v16.0
 * Infrastructure for: petzeustech.duckdns.org
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Global Security Protocols
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');

// Database Architecture (Mandated Credentials)
$dbhost = 'localhost';
$dbuser = 'zeus_admin';
$dbpass = 'Petuel99.5'; 
$dbname = 'petzeustech_db';

$conn = @mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    header('Content-Type: application/json');
    die(json_encode([
        "error" => "Network Node Offline",
        "message" => "Critical Database Sync Failure. Verify Petuel99.5 logic."
    ]));
}

// System-Wide Constants
define('SYSTEM_DOMAIN', 'petzeustech.duckdns.org');
define('UPLOAD_DIR', '/var/www/petzeustech_uploads/');
define('ADMIN_EMAIL', 'admin@petzeustech.com');
define('SYSTEM_VERSION', '16.0.0');

/**
 * Standardized API Response Output
 */
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>