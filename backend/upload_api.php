<?php
require_once 'config.php';

// Ensure session is active
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
    jsonResponse(["error" => "Clearance level insufficient"], 403);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['config_file'])) {
    $plan_id = mysqli_real_escape_string($conn, $_POST['plan_id']);
    $file = $_FILES['config_file'];
    
    // Validate File Extension strictly
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if ($ext !== 'sip') {
        jsonResponse(["error" => "Invalid protocol extension. Only .sip payloads are accepted."], 400);
    }

    // Generate sanitized unique name
    $safe_name = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", $file['name']);
    $destination = UPLOAD_DIR . $safe_name;

    // Ensure directory existence
    if (!is_dir(UPLOAD_DIR)) {
        if (!mkdir(UPLOAD_DIR, 0775, true)) {
            jsonResponse(["error" => "Critical Error: Storage node inaccessible."], 500);
        }
    }

    // Move file and log to cluster
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        $sql = "INSERT INTO files (file_name, plan_id) VALUES ('$safe_name', '$plan_id')";
        if (mysqli_query($conn, $sql)) {
            jsonResponse([
                "success" => true, 
                "message" => "Broadcast Success: Node $plan_id updated with new configuration."
            ]);
        } else {
            // Cleanup on DB failure
            unlink($destination);
            jsonResponse(["error" => "Database synchronization failure: " . mysqli_error($conn)], 500);
        }
    } else {
        jsonResponse(["error" => "Hardware I/O Error: Disk write failed. Verify permissions on " . UPLOAD_DIR], 500);
    }
} else {
    jsonResponse(["error" => "Invalid request: Payload or plan identifier missing."], 400);
}
?>