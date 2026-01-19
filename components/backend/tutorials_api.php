
<?php
require_once 'config.php';

header('Content-Type: application/json');

function checkAdmin() {
    if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'ADMIN') {
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized matrix access."]);
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM tutorials ORDER BY step_order ASC";
        $result = mysqli_query($conn, $sql);
        $steps = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $steps[] = $row;
        }
        echo json_encode($steps);
        break;

    case 'POST':
        checkAdmin();
        $data = json_decode(file_get_contents("php://input"), true);
        
        $title = mysqli_real_escape_string($conn, $data['title']);
        $description = mysqli_real_escape_string($conn, $data['description']);
        $media_url = mysqli_real_escape_string($conn, $data['media_url']);
        $media_type = $data['media_type'];
        $order = (int)$data['order'];

        if (isset($data['id'])) {
            $id = (int)$data['id'];
            $sql = "UPDATE tutorials SET title='$title', description='$description', media_url='$media_url', media_type='$media_type', step_order='$order' WHERE id=$id";
        } else {
            $sql = "INSERT INTO tutorials (title, description, media_url, media_type, step_order) VALUES ('$title', '$description', '$media_url', '$media_type', '$order')";
        }

        if (mysqli_query($conn, $sql)) {
            echo json_encode(["success" => true, "message" => "Matrix updated."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => mysqli_error($conn)]);
        }
        break;

    case 'DELETE':
        checkAdmin();
        $id = (int)$_GET['id'];
        $sql = "DELETE FROM tutorials WHERE id=$id";
        if (mysqli_query($conn, $sql)) {
            echo json_encode(["success" => true]);
        }
        break;

    default:
        http_response_code(405);
        break;
}
?>
