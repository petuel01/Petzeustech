<?php
require_once 'config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    die("Access Denied: Node not authorized. Please login via petzeustech.duckdns.org");
}

$user_id = (int)$_SESSION['user_id'];

/**
 * 1. VERIFY ACTIVE SUBSCRIPTION & IDENTIFY TIER
 */
$sql_sub = "SELECT plan_id FROM subscriptions 
            WHERE user_id = '$user_id' 
            AND status = 'ACTIVE' 
            AND expiry_date > NOW() 
            ORDER BY expiry_date DESC LIMIT 1";

$res_sub = mysqli_query($conn, $sql_sub);
$sub = mysqli_fetch_assoc($res_sub);

if (!$sub) {
    error_log("Unauthorized download attempt: User $user_id has no active subscription.");
    die("Access Error: No active subscription found. Access your terminal to renew.");
}

$plan_id = mysqli_real_escape_string($conn, $sub['plan_id']);

/**
 * 2. RETRIEVE LATEST PAYLOAD FOR THE EXACT MATCHING TIER
 */
$sql_file = "SELECT file_name FROM files 
            WHERE plan_id = '$plan_id' 
            ORDER BY upload_date DESC LIMIT 1";

$res_file = mysqli_query($conn, $sql_file);
$file = mysqli_fetch_assoc($res_file);

if (!$file) {
    die("Synchronization Error: No active configuration payload has been broadcasted for the '$plan_id' tier yet.");
}

// Build absolute path
$file_path = UPLOAD_DIR . $file['file_name'];

/**
 * 3. EXECUTE SECURE FILE TRANSFER
 */
if (file_exists($file_path)) {
    // Clean output buffers for binary integrity
    if (ob_get_level()) ob_end_clean();
    
    header('Content-Description: PetZeusTech Secure Payload Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($file_path) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file_path));
    
    // Log successful download activity
    mysqli_query($conn, "UPDATE users SET has_downloaded = 1 WHERE id = '$user_id'");
    
    readfile($file_path);
    exit;
} else {
    die("Storage Node Error: The requested resource is temporarily unavailable on this cluster.");
}
?>