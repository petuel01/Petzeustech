<?php
require_once 'config.php';

header('Content-Type: application/json');

// Get JSON payload from Google Auth broadcast (frontend)
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(["error" => "Authorization payload missing."]);
    exit;
}

$email = mysqli_real_escape_string($conn, $data['email']);
$name = mysqli_real_escape_string($conn, $data['name']);

// Verify if user is already in our matrix
$check = "SELECT * FROM users WHERE email = '$email' LIMIT 1";
$res = mysqli_query($conn, $check);

if ($row = mysqli_fetch_assoc($res)) {
    $user = $row;
} else {
    // Auto-archive new Google user into database
    $insert = "INSERT INTO users (name, email, role, status) VALUES ('$name', '$email', 'USER', 'active')";
    if (mysqli_query($conn, $insert)) {
        $id = mysqli_insert_id($conn);
        $user = [
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "role" => "USER",
            "status" => "active"
        ];
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to write user to matrix."]);
        exit;
    }
}

// Map the DB user to the Session
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_role'] = $user['role'];

echo json_encode([
    "success" => true,
    "user" => $user
]);
?>