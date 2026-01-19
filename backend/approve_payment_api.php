<?php
require_once 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
    die(json_encode(["error" => "Admin clearance required."]));
}

$data = json_decode(file_get_contents("php://input"), true);
$payment_id = (int)$data['payment_id'];
$action = $data['action']; // 'APPROVE' or 'REJECT'

if ($action === 'APPROVE') {
    // Get payment details
    $res = mysqli_query($conn, "SELECT * FROM payments WHERE id = $payment_id");
    $pay = mysqli_fetch_assoc($res);
    
    if ($pay) {
        $user_id = $pay['user_id'];
        $plan_id = $pay['plan_id'];
        
        // Calculate expiry
        $res_plan = mysqli_query($conn, "SELECT days FROM plans WHERE id = '$plan_id'");
        $plan = mysqli_fetch_assoc($res_plan);
        $days = $plan['days'];
        $expiry = date('Y-m-d H:i:s', strtotime("+$days days"));
        
        // 1. Mark Payment Approved
        mysqli_query($conn, "UPDATE payments SET status = 'APPROVED' WHERE id = $payment_id");
        
        // 2. Create/Update Subscription
        mysqli_query($conn, "INSERT INTO subscriptions (user_id, plan_id, expiry_date, status) 
                            VALUES ('$user_id', '$plan_id', '$expiry', 'ACTIVE')
                            ON DUPLICATE KEY UPDATE plan_id='$plan_id', expiry_date='$expiry', status='ACTIVE'");
                            
        echo json_encode(["success" => true, "message" => "Subscription synchronized successfully."]);
    }
} else {
    mysqli_query($conn, "UPDATE payments SET status = 'REJECTED' WHERE id = $payment_id");
    echo json_encode(["success" => true, "message" => "Transaction declined."]);
}
?>