<?php
require_once 'config.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
    jsonResponse(["error" => "Unauthorized"], 403);
}

$sql = "SELECT p.*, u.email as userEmail, pl.name as planName 
        FROM payments p 
        JOIN users u ON p.user_id = u.id 
        JOIN plans pl ON p.plan_id = pl.id 
        WHERE p.status = 'PENDING' 
        ORDER BY p.created_at DESC";

$result = mysqli_query($conn, $sql);
$payments = [];

while ($row = mysqli_fetch_assoc($result)) {
    $payments[] = [
        "id" => $row['id'],
        "userEmail" => $row['userEmail'],
        "planName" => $row['planName'],
        "amount" => (float)$row['amount'],
        "transId" => $row['transaction_id'],
        "date" => $row['created_at']
    ];
}

jsonResponse($payments);
?>