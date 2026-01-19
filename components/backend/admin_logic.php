<?php
require_once 'config.php';

// EMAIL HANDLER HELPER
function sendAdminNotification($subject, $message) {
    $to = "admin@petzeustech.com"; // YOUR EMAIL
    $headers = "From: system-node@petzeustech.com\r\n";
    $headers .= "Reply-To: no-reply@petzeustech.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // On a hosted VPS with Postfix, this will send the email
    return mail($to, $subject, $message, $headers);
}

// MoMo CALLBACK / WEBHOOK HANDLER
if (isset($_POST['momo_webhook_secret']) && $_POST['momo_webhook_secret'] === 'YOUR_SECRET_KEY') {
    // This part is called by MTN MoMo API asynchronously
    $data = json_decode(file_get_contents("php://input"), true);
    
    $external_id = $data['externalId']; // This is the user_id or subscription_id we sent
    $status = $data['status']; // SUCCESSFUL
    
    if ($status === 'SUCCESSFUL') {
        // 1. UPDATE DATABASE
        $sql = "UPDATE subscriptions SET status = 'ACTIVE' WHERE id = '$external_id'";
        mysqli_query($conn, $sql);
        
        // 2. SEND AUTOMATIC EMAIL
        $msg = "ALERT: New Payment Synchronized.\n";
        $msg .= "Node ID: " . $external_id . "\n";
        $msg .= "Status: Synchronized & Verified.\n";
        $msg .= "Time: " . date('Y-m-d H:i:s');
        
        sendAdminNotification("PETZEUSTECH: PAYMENT VERIFIED", $msg);
        
        echo json_encode(["status" => "matrix_updated"]);
    }
}
?>