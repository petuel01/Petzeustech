<?php
require_once 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['transaction_id']) || !isset($_SESSION['user_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Transaction ID missing."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$plan_id = mysqli_real_escape_string($conn, $data['plan_id']);
$trans_id = mysqli_real_escape_string($conn, $data['transaction_id']);
$amount = (float)$data['amount'];

// Log for Admin to verify
$sql = "INSERT INTO payments (user_id, plan_id, amount, status, transaction_id) 
        VALUES ('$user_id', '$plan_id', '$amount', 'PENDING', '$trans_id')";
mysqli_query($conn, $sql);

// Notify Admin immediately
$subject = "ALERT: Manual Node Sync Request";
$message = "User ID: $user_id\nTransaction ID: $trans_id\nAmount: $amount FRS\n\nPlease check your MoMo App and approve in Command Center.";
mail($admin_email, $subject, $message, "From: alert@petzeustech.com");

echo json_encode(["success" => true, "message" => "Identity sent to Command Center for verification."]);
?>