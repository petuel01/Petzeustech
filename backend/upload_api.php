<?php
require_once 'config.php';

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
    jsonResponse(["error" => "Clearance level insufficient"], 403);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['config_file'])) {
    $plan_id = mysqli_real_escape_string($conn, $_POST['plan_id']);
    $file = $_FILES['config_file'];
    
    // Validate File Extension
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    if ($ext !== 'sip') {
        jsonResponse(["error" => "Invalid protocol extension. Only .sip allowed."], 400);
    }

    $safe_name = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", $file['name']);
    $destination = UPLOAD_DIR . $safe_name;

    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0775, true);
    }

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Log to database
        $sql = "INSERT INTO files (file_name, plan_id) VALUES ('$safe_name', '$plan_id')";
        if (mysqli_query($conn, $sql)) {
            jsonResponse(["success" => true, "message" => "Node $plan_id updated and broadcasted."]);
        }
    }
    
    jsonResponse(["error" => "Terminal failed to write file to disk."], 500);
}
?>