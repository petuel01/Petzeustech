
<?php
require_once 'config.php';

// 1. Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    die("Access denied. Please login.");
}

$user_id = $_SESSION['user_id'];

// 2. Check if user has an ACTIVE subscription and get their plan_id
$check_sub = "SELECT * FROM subscriptions WHERE user_id = '$user_id' AND status = 'ACTIVE' AND expiry_date > NOW() LIMIT 1";
$res_sub = mysqli_query($conn, $check_sub);

if (mysqli_num_rows($res_sub) == 0) {
    // Automatically set status to expired if check fails
    mysqli_query($conn, "UPDATE subscriptions SET status = 'EXPIRED' WHERE user_id = '$user_id' AND expiry_date <= NOW()");
    die("Subscription inactive or expired. Please renew.");
}

$sub_data = mysqli_fetch_assoc($res_sub);
$user_plan_id = $sub_data['plan_id'];

// 3. Get the latest file SPECIFIC to the user's plan duration
$sql_file = "SELECT * FROM files WHERE plan_id = '$user_plan_id' ORDER BY cycle_start DESC LIMIT 1";
$res_file = mysqli_query($conn, $sql_file);
$file = mysqli_fetch_assoc($res_file);

if (!$file) {
    // Fallback: Check if there is a general file (where plan_id is NULL)
    $sql_fallback = "SELECT * FROM files WHERE plan_id IS NULL ORDER BY cycle_start DESC LIMIT 1";
    $res_fallback = mysqli_query($conn, $sql_fallback);
    $file = mysqli_fetch_assoc($res_fallback);
}

if (!$file) {
    die("No active configuration files available for your plan tier currently.");
}

$file_path = '../uploads/' . $file['file_name'];

// 4. Secure Download Logic
if (file_exists($file_path)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($file_path) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file_path));
    readfile($file_path);
    exit;
} else {
    die("File not found on server.");
}
?>
