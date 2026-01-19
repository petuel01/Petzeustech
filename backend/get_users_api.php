<?php
require_once 'config.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
    jsonResponse(["error" => "Unauthorized access to network map."], 403);
}

$sql = "SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC";
$result = mysqli_query($conn, $sql);
$users = [];

while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

jsonResponse($users);
?>