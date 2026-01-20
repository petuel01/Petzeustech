<?php
/**
 * PETZEUSTECH NETWORKS - SYSTEM CORE v17.0
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

// Use standard mysqli instead of hiding errors with @ to aid debugging
$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    // If connection fails, return a clean JSON error for API calls or a message for direct access
    if (strpos($_SERVER['REQUEST_URI'], '_api.php') !== false || isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        header('Content-Type: application/json');
        die(json_encode([
            "success" => false,
            "error" => "Database node unreachable",
            "details" => "Sync failure with zeus_admin protocol."
        ]));
    } else {
        die("<div style='background:#020617;color:#3b82f6;padding:50px;font-family:sans-serif;text-align:center;'>
                <h1 style='font-weight:900;'>CRITICAL SYNC ERROR</h1>
                <p style='color:#64748b;'>Database node offline. Check debug-fix.sh execution status.</p>
             </div>");
    }
}

// System-Wide Constants
define('SYSTEM_DOMAIN', 'petzeustech.duckdns.org');
// Ensure trailing slash for UPLOAD_DIR
define('UPLOAD_DIR', '/var/www/petzeustech_uploads/');
define('ADMIN_EMAIL', 'admin@petzeustech.com');
define('SYSTEM_VERSION', '17.0.0');

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