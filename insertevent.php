<?php
ini_set("session.cookie_httponly", 1);
Session_start();
require 'database.php';
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

if(!isset($_SESSION['username'])){
	header("Location: calendar.html");
	exit;
}
// if(!hash_equals($_SESSION['token'], $_POST['token'])){
// 	die("Request forgery detected");
// }
$username = $_SESSION['username'];
$title = htmlentities($_POST['title']);
$date = htmlentities($_POST['date']);
$time = htmlentities($_POST['time']);
$tag = htmlentities($_POST['tag']);


$stmt = $mysqli->prepare("insert into event(username, date,time,title,tag) values (?,?,?,?,?)");
if(!$stmt){
printf("Query Prep Failed: %s\n", $mysqli->error);
exit;
}
$stmt->bind_param('sssss', $username, $date,$time,$title,$tag);

if( $stmt->execute() ){
	echo json_encode(array(
		"success" => true
	));
	exit;
}else{
	echo json_encode(array(
		"success" => false,
	));
	exit;
}

$stmt->close();


?>
