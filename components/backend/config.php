
<?php
// PETZEUSTECH NETWORKS - SYSTEM CONFIGURATION

session_start();

// DATABASE CONNECTION
// INSERT YOUR DATABASE NAME IN THE '$dbname' VARIABLE BELOW
$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = '';
$dbname = 'petzeustech_db'; // <--- INSERT YOUR DATABASE NAME HERE

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// CYCLE CONFIGURATION
define('CYCLE_DAYS', 4);

// HELPER: Check if 4 days have passed since last upload
function checkCycleStatus($conn) {
    $sql = "SELECT cycle_start FROM files ORDER BY cycle_start DESC LIMIT 1";
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_assoc($result)) {
        $last_upload = strtotime($row['cycle_start']);
        $diff = time() - $last_upload;
        $days = floor($diff / (60 * 60 * 24));
        return $days >= CYCLE_DAYS;
    }
    return true; // No files yet
}

// HELPER: Get current active file
function getActiveFile($conn) {
    $sql = "SELECT * FROM files ORDER BY cycle_start DESC LIMIT 1";
    $result = mysqli_query($conn, $sql);
    return mysqli_fetch_assoc($result);
}
?>
