<?php
require_once 'config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    die("Access Denied: Node not authorized.");
}

$user_id = $_SESSION['user_id'];

/**
 * 1. VERIFY ACTIVE SUBSCRIPTION & TIER
 * We look for the latest active subscription for this specific user.
 */
$sql_sub = "SELECT plan_id FROM subscriptions 
            WHERE user_id = '$user_id' 
            AND status = 'ACTIVE' 
            AND expiry_date > NOW() 
            ORDER BY expiry_date DESC LIMIT 1";

$res_sub = mysqli_query($conn, $sql_sub);
$sub = mysqli_fetch_assoc($res_sub);

if (!$sub) {
    // Audit log: Failed download attempt
    error_log("Unauthorized download attempt by user ID: " . $user_id);
    die("Terminal Access Error: No active subscription found for this node. Access your dashboard to renew.");
}

$plan_id = $sub['plan_id'];

/**
 * 2. RETRIEVE LATEST PAYLOAD FOR THIS EXACT TIER
 */
$sql_file = "SELECT file_name FROM files 
            WHERE plan_id = '$plan_id' 
            ORDER BY upload_date DESC LIMIT 1";

$res_file = mysqli_query($conn, $sql_file);
$file = mysqli_fetch_assoc($res_file);

if (!$file) {
    die("Node Synchronicity Error: No active configuration payload has been broadcasted for the '$plan_id' tier yet.");
}

// Ensure absolute path using the global constant
$file_path = UPLOAD_DIR . $file['file_name'];

/**
 * 3. EXECUTE SECURE TRANSFER
 */
if (file_exists($file_path)) {
    // Clear output buffers to ensure binary integrity
    if (ob_get_level()) ob_end_clean();
    
    header('Content-Description: PetZeusTech Secure Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($file_path) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file_path));
    
    // Update user status metrics
    mysqli_query($conn, "UPDATE users SET has_downloaded = 1 WHERE id = '$user_id'");
    
    readfile($file_path);
    exit;
} else {
    die("Cluster Storage Error: The requested resource is temporarily unavailable on the local node.");
}
?>