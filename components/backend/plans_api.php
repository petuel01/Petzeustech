
<?php
require_once 'config.php';

header('Content-Type: application/json');

// Ensure only admins can modify plans
function checkAdmin() {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized access to system architecture."]);
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM plans ORDER BY price ASC";
        $result = mysqli_query($conn, $sql);
        $plans = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $row['is_trial'] = (bool)$row['is_trial'];
            $plans[] = $row;
        }
        echo json_encode($plans);
        break;

    case 'POST':
        checkAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        
        $name = mysqli_real_escape_string($conn, $data['name']);
        $days = (int)$data['days'];
        $price = (float)$data['price'];
        $is_trial = $data['is_trial'] ? 1 : 0;

        if (isset($data['id'])) {
            // Update
            $id = (int)$data['id'];
            $sql = "UPDATE plans SET name='$name', days='$days', price='$price', is_trial='$is_trial' WHERE id=$id";
        } else {
            // Create
            $sql = "INSERT INTO plans (name, days, price, is_trial) VALUES ('$name', '$days', '$price', '$is_trial')";
        }

        if (mysqli_query($conn, $sql)) {
            echo json_encode(["success" => true, "message" => "Plan architecture updated."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => mysqli_error($conn)]);
        }
        break;

    case 'DELETE':
        checkAdmin();
        $id = (int)$_GET['id'];
        
        // Prevent deletion if linked to active subscriptions or files
        $check_sub = "SELECT id FROM subscriptions WHERE plan_id = $id LIMIT 1";
        $res_sub = mysqli_query($conn, $check_sub);
        if (mysqli_num_rows($res_sub) > 0) {
            http_response_code(400);
            echo json_encode(["error" => "Cannot delete tier with active node subscriptions."]);
            exit;
        }

        $sql = "DELETE FROM plans WHERE id=$id";
        if (mysqli_query($conn, $sql)) {
            echo json_encode(["success" => true, "message" => "Tier decommissioned."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => mysqli_error($conn)]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed."]);
        break;
}
?>
