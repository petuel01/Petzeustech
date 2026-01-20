<?php
/**
 * PETZEUSTECH NETWORKS - SYSTEM CORE v17.1
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

// Enhanced error reporting for debugging Phase
mysqli_report(MYSQLI_REPORT_OFF); 
$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    $error_msg = mysqli_connect_error();
    $error_code = mysqli_connect_errno();
    
    // If connection fails, return detailed error to help the terminal diagnostic
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strpos($_SERVER['REQUEST_URI'], '_api.php') !== false) {
        header('Content-Type: application/json');
        die(json_encode([
            "success" => false,
            "error" => "Database node unreachable",
            "debug" => "[$error_code] $error_msg"
        ]));
    } else {
        die("<div style='background:#020617;color:#3b82f6;padding:50px;font-family:sans-serif;text-align:center;border:2px solid #1e293b;border-radius:20px;margin:50px;'>
                <h1 style='font-weight:900;letter-spacing:-0.05em;'>CRITICAL SYNC ERROR</h1>
                <p style='color:#64748b;font-weight:bold;'>Database node offline: $error_msg</p>
                <div style='margin-top:20px;font-size:10px;color:#334155;text-transform:uppercase;letter-spacing:0.2em;'>Check debug-fix.sh execution status on VPS</div>
             </div>");
    }
}

// System-Wide Constants
define('SYSTEM_DOMAIN', 'petzeustech.duckdns.org');
define('UPLOAD_DIR', '/var/www/petzeustech_uploads/');
define('ADMIN_EMAIL', 'admin@petzeustech.com');
define('SYSTEM_VERSION', '17.1.0');

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