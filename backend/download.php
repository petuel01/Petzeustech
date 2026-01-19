<?php
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    die("Access Denied.");
}

$user_id = $_SESSION['user_id'];

// Check active subscription
$sql = "SELECT plan_id FROM subscriptions WHERE user_id = '$user_id' AND status = 'ACTIVE' AND expiry_date > NOW() LIMIT 1";
$res = mysqli_query($conn, $sql);
$sub = mysqli_fetch_assoc($res);

if (!$sub) {
    die("No active subscription found for this terminal.");
}

$plan_id = $sub['plan_id'];

// Get latest file for this plan
$sql_file = "SELECT file_name FROM files WHERE plan_id = '$plan_id' ORDER BY upload_date DESC LIMIT 1";
$res_file = mysqli_query($conn, $sql_file);
$file = mysqli_fetch_assoc($res_file);

if (!$file) {
    die("No configuration payload currently assigned to this tier.");
}

$file_path = __DIR__ . '/../uploads/' . $file['file_name'];

if (file_exists($file_path)) {
    // Clear buffer to prevent corruption from PHP warnings or white spaces
    if (ob_get_level()) ob_end_clean();
    
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($file_path) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file_path));
    
    // Update user status
    mysqli_query($conn, "UPDATE users SET has_downloaded = 1 WHERE id = '$user_id'");
    
    readfile($file_path);
    exit;
} else {
    die("Resource temporarily unavailable in the network cluster.");
}
?>