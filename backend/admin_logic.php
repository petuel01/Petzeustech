
<?php
require_once 'config.php';

// Only Admin access
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
    die("Unauthorized.");
}

// Handle Trial Activation (Automatic for first-time users)
if (isset($_POST['activate_trial'])) {
    $user_id = $_POST['user_id'];
    
    // Check if trial used
    $check_trial = "SELECT is_trial_used FROM users WHERE id = '$user_id'";
    $trial_res = mysqli_query($conn, $check_trial);
    $user_data = mysqli_fetch_assoc($trial_res);
    
    if ($user_data['is_trial_used']) {
        die("Trial already used.");
    }

    $expiry = date('Y-m-d H:i:s', strtotime("+2 days"));
    $plan_sql = "SELECT id FROM plans WHERE is_trial = 1 LIMIT 1";
    $plan_res = mysqli_query($conn, $plan_sql);
    $plan = mysqli_fetch_assoc($plan_res);
    $plan_id = $plan['id'];

    mysqli_query($conn, "INSERT INTO subscriptions (user_id, plan_id, start_date, expiry_date, status) VALUES ('$user_id', '$plan_id', NOW(), '$expiry', 'ACTIVE')");
    mysqli_query($conn, "UPDATE users SET is_trial_used = 1 WHERE id = '$user_id'");
    echo "Trial activated successfully.";
}

// Handle Profile Pic Update
if (isset($_POST['update_profile_pic'])) {
    $user_id = $_POST['user_id'];
    $pic_data = $_POST['profile_pic_base64']; // Expecting base64
    $sql = "UPDATE users SET profile_pic = '$pic_data' WHERE id = '$user_id'";
    mysqli_query($conn, $sql);
    echo "Profile updated.";
}

// Handle Payment Approval
if (isset($_POST['approve_payment'])) {
    $pay_id = $_POST['payment_id'];
    $user_id = $_POST['user_id'];
    $plan_id = $_POST['plan_id'];
    
    $plan_sql = "SELECT days FROM plans WHERE id = '$plan_id'";
    $plan_res = mysqli_query($conn, $plan_sql);
    $plan = mysqli_fetch_assoc($plan_res);
    $days = $plan['days'];

    $expiry = date('Y-m-d H:i:s', strtotime("+$days days"));
    mysqli_query($conn, "UPDATE payments SET status = 'approved' WHERE id = '$pay_id'");
    
    $sub_check = "SELECT id FROM subscriptions WHERE user_id = '$user_id'";
    $exists = mysqli_query($conn, $sub_check);
    
    if (mysqli_num_rows($exists) > 0) {
        mysqli_query($conn, "UPDATE subscriptions SET plan_id = '$plan_id', start_date = NOW(), expiry_date = '$expiry', status = 'ACTIVE' WHERE user_id = '$user_id'");
    } else {
        mysqli_query($conn, "INSERT INTO subscriptions (user_id, plan_id, start_date, expiry_date, status) VALUES ('$user_id', '$plan_id', NOW(), '$expiry', 'ACTIVE')");
    }
    echo "Subscription activated!";
}

// Handle File Upload
// Admin MUST provide 'plan_id' to associate file with a specific tier
if (isset($_POST['upload_file']) && !empty($_FILES['socks_file'])) {
    $target_dir = "../uploads/";
    
    // Ensure plan_id is provided, otherwise fallback to trial or general
    $plan_id = isset($_POST['plan_id']) ? mysqli_real_escape_string($conn, $_POST['plan_id']) : null;
    
    if (!$plan_id) {
        die("Error: You must select a specific plan tier for this file.");
    }

    $file_ext = pathinfo($_FILES["socks_file"]["name"], PATHINFO_EXTENSION);
    if ($file_ext !== 'sip') {
        die("Error: Only .sip configuration files are allowed.");
    }

    // Unique name generation to prevent collisions
    $file_name = time() . "_plan_" . $plan_id . "_" . basename($_FILES["socks_file"]["name"]);
    $target_file = $target_dir . $file_name;
    
    if (move_uploaded_file($_FILES["socks_file"]["tmp_name"], $target_file)) {
        $cycle_end = date('Y-m-d H:i:s', strtotime("+4 days"));
        $sql = "INSERT INTO files (file_name, file_path, plan_id, cycle_end) VALUES ('$file_name', '$target_file', '$plan_id', '$cycle_end')";
        if (mysqli_query($conn, $sql)) {
            echo "Success: File uploaded and assigned to tier $plan_id.";
        } else {
            echo "Error: Database update failed.";
        }
    } else {
        echo "Error: File transmission to server failed.";
    }
}
?>
